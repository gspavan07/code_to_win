const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection
const { logger } = require("../utils"); // <-- Add logger
const updateAllRankings = require("../updateRankings");

// Calculate score expression for ranking
async function getScoreExpression() {
  const [gradingData] = await db.query("SELECT * FROM grading_system");
  // Example: (p.badges_hr * 5) + (p.basic_gfg * 1) + ...
  return gradingData
    .map((row) => `(p.${row.metric} * ${row.points})`)
    .join(" + ");
}

// GET /ranking/overall
router.get("/overall", async (req, res) => {
  logger.info("Fetching overall ranking");
  try {
    const scoreExpr = await getScoreExpression();
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 500, 1000)); // Reduced default to 500, max 1000
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const offset = (page - 1) * limit;
    
    // Get total count for pagination
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM student_profiles`
    );
    const totalStudents = countResult[0].total;
    const totalPages = Math.ceil(totalStudents / limit);
    
    // First query: Get student rankings with score calculation
    const [rows] = await db.query(
      `SELECT 
  sp.student_id, 
  sp.name,
  sp.dept_code,
  sp.year,
  sp.section,
  sp.overall_rank,
  d.dept_name, 
  ${scoreExpr.replace(/p\.(\w+)/g, (match, metric) => {
    if (metric.includes("_lc"))
      return `CASE WHEN COALESCE(cp.leetcode_status, '') = 'accepted' THEN p.${metric} ELSE 0 END`;
    if (metric.includes("_cc"))
      return `CASE WHEN COALESCE(cp.codechef_status, '') = 'accepted' THEN p.${metric} ELSE 0 END`;
    if (metric.includes("_gfg"))
      return `CASE WHEN COALESCE(cp.geeksforgeeks_status, '') = 'accepted' THEN p.${metric} ELSE 0 END`;
    if (metric.includes("_hr"))
      return `CASE WHEN COALESCE(cp.hackerrank_status, '') = 'accepted' THEN p.${metric} ELSE 0 END`;
    return match;
  })} AS score
FROM student_profiles sp
JOIN student_performance p ON sp.student_id = p.student_id
LEFT JOIN student_coding_profiles cp ON sp.student_id = cp.student_id
JOIN dept d ON sp.dept_code = d.dept_code
ORDER BY score DESC, sp.student_id ASC
LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    // Add rank field
    rows.forEach((student, i) => {
      student.rank = offset + i + 1;
    });
    
    // Get all student IDs for batch fetching
    const studentIds = rows.map(student => student.student_id);
    
    if (studentIds.length === 0) {
      return res.json({
        students: [],
        pagination: {
          page,
          limit,
          totalStudents,
          totalPages
        }
      });
    }
    
    // Batch update ranks in database (only if needed)
    const updateBatch = rows.map(student => [
      student.score,
      student.rank,
      student.student_id
    ]);
    
    // Use a transaction for batch updates
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // Batch update in chunks of 100
      const chunkSize = 100;
      for (let i = 0; i < updateBatch.length; i += chunkSize) {
        const chunk = updateBatch.slice(i, i + chunkSize);
        await connection.query(
          "INSERT INTO student_profiles (score, overall_rank, student_id) VALUES ? " +
          "ON DUPLICATE KEY UPDATE score=VALUES(score), overall_rank=VALUES(overall_rank)",
          [chunk.map(row => [row[0], row[1], row[2]])]
        );
      }
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      logger.error(`Error updating ranks: ${error.message}`);
    } finally {
      connection.release();
    }
    
    // Batch fetch performance data
    const [performances] = await db.query(
      `SELECT p.*, 
              cp.leetcode_status, cp.codechef_status, 
              cp.geeksforgeeks_status, cp.hackerrank_status 
       FROM student_performance p
       LEFT JOIN student_coding_profiles cp ON p.student_id = cp.student_id
       WHERE p.student_id IN (?)`,
      [studentIds]
    );
    
    // Create a map for quick lookup
    const performanceMap = {};
    performances.forEach(perf => {
      performanceMap[perf.student_id] = perf;
    });
    
    // Attach performance data to each student
    rows.forEach(student => {
      const p = performanceMap[student.student_id];
      
      if (p) {
        const isLeetcodeAccepted = p.leetcode_status === "accepted";
        const isCodechefAccepted = p.codechef_status === "accepted";
        const isGfgAccepted = p.geeksforgeeks_status === "accepted";
        const isHackerrankAccepted = p.hackerrank_status === "accepted";

        const totalSolved =
          (isLeetcodeAccepted ? p.easy_lc + p.medium_lc + p.hard_lc : 0) +
          (isGfgAccepted
            ? p.school_gfg +
              p.basic_gfg +
              p.easy_gfg +
              p.medium_gfg +
              p.hard_gfg
            : 0) +
          (isCodechefAccepted ? p.problems_cc : 0);

        student.performance = {
          combined: {
            totalSolved: totalSolved,
            totalContests:
              (isCodechefAccepted ? p.contests_cc : 0) +
              (isGfgAccepted ? p.contests_gfg : 0),
            stars_cc: isCodechefAccepted ? p.stars_cc : 0,
            badges_hr: isHackerrankAccepted ? p.badges_hr : 0,
            last_updated: p.last_updated,
          },
          platformWise: {
            leetcode: {
              easy: isLeetcodeAccepted ? p.easy_lc : 0,
              medium: isLeetcodeAccepted ? p.medium_lc : 0,
              hard: isLeetcodeAccepted ? p.hard_lc : 0,
              contests: isLeetcodeAccepted ? p.contests_lc : 0,
              badges: isLeetcodeAccepted ? p.badges_lc : 0,
            },
            gfg: {
              school: isGfgAccepted ? p.school_gfg : 0,
              basic: isGfgAccepted ? p.basic_gfg : 0,
              easy: isGfgAccepted ? p.easy_gfg : 0,
              medium: isGfgAccepted ? p.medium_gfg : 0,
              hard: isGfgAccepted ? p.hard_gfg : 0,
              contests: isGfgAccepted ? p.contests_gfg : 0,
            },
            codechef: {
              problems: isCodechefAccepted ? p.problems_cc : 0,
              contests: isCodechefAccepted ? p.contests_cc : 0,
              stars: isCodechefAccepted ? p.stars_cc : 0,
              badges: isCodechefAccepted ? p.badges_cc : 0,
            },
            hackerrank: {
              badges: isHackerrankAccepted ? p.stars_hr : 0,
            },
          }
        };
      }
    });

    logger.info(`Fetched overall ranking, page=${page}, count=${rows.length}`);
    res.json({
      students: rows,
      pagination: {
        page,
        limit,
        totalStudents,
        totalPages
      }
    });
  } catch (err) {
    logger.error(`Error fetching overall ranking: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /ranking/filter?department=CSE&section=A&year=3
router.get("/filter", async (req, res) => {
  const { dept, section, year } = req.query;
  logger.info(
    `Fetching filtered ranking: dept=${dept}, section=${section}, year=${year}`
  );
  try {
    const scoreExpr = await getScoreExpression();
    let where = "WHERE 1=1";
    const params = [];
    if (dept) {
      where += " AND sp.dept_code = ?";
      params.push(dept);
    }
    if (section) {
      where += " AND sp.section = ?";
      params.push(section);
    }
    if (year) {
      where += " AND sp.year = ?";
      params.push(year);
    }
    if (req.query.search) {
      where += " AND (sp.name LIKE ? OR sp.student_id LIKE ?)";
      params.push(`%${req.query.search}%`, `%${req.query.search}%`);
    }
    
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 100, 1000)); // max 1000
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const offset = (page - 1) * limit;
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM student_profiles sp
      ${where}
    `;
    const [countResult] = await db.query(countQuery, params);
    const totalStudents = countResult[0].total;
    const totalPages = Math.ceil(totalStudents / limit);
    
    // Main query with pagination
    const [rows] = await db.query(
      `SELECT 
  sp.student_id, 
  sp.name,
  sp.dept_code,
  sp.year,
  sp.section,
  sp.overall_rank,
  d.dept_name, 
  ${scoreExpr.replace(/p\.(\w+)/g, (match, metric) => {
    if (metric.includes("_lc"))
      return `CASE WHEN COALESCE(cp.leetcode_status, '') = 'accepted' THEN p.${metric} ELSE 0 END`;
    if (metric.includes("_cc"))
      return `CASE WHEN COALESCE(cp.codechef_status, '') = 'accepted' THEN p.${metric} ELSE 0 END`;
    if (metric.includes("_gfg"))
      return `CASE WHEN COALESCE(cp.geeksforgeeks_status, '') = 'accepted' THEN p.${metric} ELSE 0 END`;
    if (metric.includes("_hr"))
      return `CASE WHEN COALESCE(cp.hackerrank_status, '') = 'accepted' THEN p.${metric} ELSE 0 END`;
    return match;
  })} AS score
FROM student_profiles sp
JOIN student_performance p ON sp.student_id = p.student_id
LEFT JOIN student_coding_profiles cp ON sp.student_id = cp.student_id
JOIN dept d ON sp.dept_code = d.dept_code
${where}
ORDER BY score DESC, sp.student_id ASC
LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Add rank field
    rows.forEach((student, i) => {
      student.rank = offset + i + 1;
    });
    
    if (rows.length === 0) {
      return res.json({
        students: [],
        pagination: {
          page,
          limit,
          totalStudents,
          totalPages
        }
      });
    }
    
    // Get all student IDs for batch fetching
    const studentIds = rows.map(student => student.student_id);
    
    // Batch fetch performance data
    const [performances] = await db.query(
      `SELECT p.*, 
              cp.leetcode_status, cp.codechef_status, 
              cp.geeksforgeeks_status, cp.hackerrank_status 
       FROM student_performance p
       LEFT JOIN student_coding_profiles cp ON p.student_id = cp.student_id
       WHERE p.student_id IN (?)`,
      [studentIds]
    );
    
    // Create a map for quick lookup
    const performanceMap = {};
    performances.forEach(perf => {
      performanceMap[perf.student_id] = perf;
    });
    
    // Attach performance data to each student
    rows.forEach(student => {
      const p = performanceMap[student.student_id];
      
      if (p) {
        const isLeetcodeAccepted = p.leetcode_status === "accepted";
        const isCodechefAccepted = p.codechef_status === "accepted";
        const isGfgAccepted = p.geeksforgeeks_status === "accepted";
        const isHackerrankAccepted = p.hackerrank_status === "accepted";

        const totalSolved =
          (isLeetcodeAccepted ? p.easy_lc + p.medium_lc + p.hard_lc : 0) +
          (isGfgAccepted
            ? p.school_gfg +
              p.basic_gfg +
              p.easy_gfg +
              p.medium_gfg +
              p.hard_gfg
            : 0) +
          (isCodechefAccepted ? p.problems_cc : 0);

        student.performance = {
          combined: {
            totalSolved: totalSolved,
            totalContests:
              (isCodechefAccepted ? p.contests_cc : 0) +
              (isGfgAccepted ? p.contests_gfg : 0),
            stars_cc: isCodechefAccepted ? p.stars_cc : 0,
            badges_hr: isHackerrankAccepted ? p.badges_hr : 0,
            last_updated: p.last_updated,
          },
          platformWise: {
            leetcode: {
              easy: isLeetcodeAccepted ? p.easy_lc : 0,
              medium: isLeetcodeAccepted ? p.medium_lc : 0,
              hard: isLeetcodeAccepted ? p.hard_lc : 0,
              contests: isLeetcodeAccepted ? p.contests_lc : 0,
              badges: isLeetcodeAccepted ? p.badges_lc : 0,
            },
            gfg: {
              school: isGfgAccepted ? p.school_gfg : 0,
              basic: isGfgAccepted ? p.basic_gfg : 0,
              easy: isGfgAccepted ? p.easy_gfg : 0,
              medium: isGfgAccepted ? p.medium_gfg : 0,
              hard: isGfgAccepted ? p.hard_gfg : 0,
              contests: isGfgAccepted ? p.contests_gfg : 0,
            },
            codechef: {
              problems: isCodechefAccepted ? p.problems_cc : 0,
              contests: isCodechefAccepted ? p.contests_cc : 0,
              stars: isCodechefAccepted ? p.stars_cc : 0,
              badges: isCodechefAccepted ? p.badges_cc : 0,
            },
            hackerrank: {
              badges: isHackerrankAccepted ? p.stars_hr : 0,
            },
          }
        };
      }
    });
    
    logger.info(`Fetched filtered ranking, page=${page}, count=${rows.length}`);
    res.json({
      students: rows,
      pagination: {
        page,
        limit,
        totalStudents,
        totalPages
      }
    });
  } catch (err) {
    logger.error(`Error fetching filtered ranking: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /ranking/update-all - Trigger a full ranking update
router.post("/update-all", async (req, res) => {
  logger.info("Manual ranking update triggered");
  try {
    // Start the update process without waiting for it to complete
    updateAllRankings()
      .then(result => {
        logger.info(`Ranking update completed: ${result.studentsUpdated} students updated`);
      })
      .catch(err => {
        logger.error(`Ranking update failed: ${err.message}`);
      });
    
    // Immediately respond to the client
    res.json({ message: "Ranking update started in the background" });
  } catch (err) {
    logger.error(`Error starting ranking update: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
