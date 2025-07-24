/**
 * Script to update all student rankings in the database
 * This can be run as a scheduled task or manually
 */

const db = require('./config/db');
const { logger } = require('./utils');

async function getScoreExpression() {
  const [gradingData] = await db.query("SELECT * FROM grading_system");
  return gradingData
    .map((row) => `(p.${row.metric} * ${row.points})`)
    .join(" + ");
}

async function updateAllRankings() {
  logger.info('Starting full ranking update');
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Get the score expression
    const scoreExpr = await getScoreExpression();
    
    // Calculate scores for all students
    const [students] = await connection.query(
      `SELECT 
        sp.student_id, 
        ${scoreExpr.replace(/p\\.(\\w+)/g, (match, metric) => {
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
      ORDER BY score DESC, sp.student_id ASC`
    );
    
    logger.info(`Calculated scores for ${students.length} students`);
    
    // Prepare batch update data
    const updateData = students.map((student, index) => [
      student.score,
      index + 1, // rank
      student.student_id
    ]);
    
    // Update in batches of 100
    const batchSize = 100;
    for (let i = 0; i < updateData.length; i += batchSize) {
      const batch = updateData.slice(i, i + batchSize);
      await connection.query(
        "INSERT INTO student_profiles (score, overall_rank, student_id) VALUES ? " +
        "ON DUPLICATE KEY UPDATE score=VALUES(score), overall_rank=VALUES(overall_rank)",
        [batch.map(row => [row[0], row[1], row[2]])]
      );
      logger.info(`Updated ranks ${i+1} to ${Math.min(i+batchSize, updateData.length)}`);
    }
    
    await connection.commit();
    logger.info('Ranking update completed successfully');
    return { success: true, studentsUpdated: students.length };
    
  } catch (error) {
    await connection.rollback();
    logger.error(`Error updating rankings: ${error.message}`);
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
}

// Run if called directly
if (require.main === module) {
  updateAllRankings()
    .then(result => {
      console.log('Ranking update result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Failed to update rankings:', err);
      process.exit(1);
    });
}

module.exports = updateAllRankings;