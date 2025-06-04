const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const cron = require("node-cron");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/student", require("./routes/studentRoutes"));
app.use("/faculty", require("./routes/facultyRoutes"));
app.use("/ranking", require("./routes/rankingRoutes"));
// async function recomputeRanks() {
//   // Step 1: Fetch all grading weights
//   const [gradingData] = await db.query("SELECT * FROM grading_rules");

//   // Convert to key-value map for easy use
//   const weights = {};
//   gradingData.forEach((row) => {
//     weights[row.metric] = row.points_per_unit;
//   });
//   // Step 2: Fetch student profile and performance data
//   const [students] = await db.query(`
//     SELECT sp.student_id, sp.dept, sp.year, sp.section, p.*
//     FROM student_profiles sp
//     JOIN student_performance p ON sp.student_id = p.student_id
//   `);

//   // Step 3: Calculate dynamic score for each student
//   const studentScores = students.map((s) => {
//     let score = 0;
//     for (const [metric, weight] of Object.entries(weights)) {
//       score += (s[metric] || 0) * weight;
//     }
//     return {
//       ...s,
//       score,
//     };
//   });

//   // Step 4: Sort all students by score (high to low)
//   studentScores.sort((a, b) => b.score - a.score);

//   // Step 5: Assign ranks
//   for (let i = 0; i < studentScores.length; i++) {
//     const s = studentScores[i];
//     const overall_rank = i + 1;

//     const deptList = studentScores.filter((stu) => stu.dept === s.dept);
//     const yearList = studentScores.filter((stu) => stu.year === s.year);
//     const secList = studentScores.filter((stu) => stu.section === s.section);

//     const department_rank =
//       deptList.findIndex((x) => x.student_id === s.student_id) + 1;
//     const year_rank =
//       yearList.findIndex((x) => x.student_id === s.student_id) + 1;
//     const section_rank =
//       secList.findIndex((x) => x.student_id === s.student_id) + 1;

//     await db.query(
//       `
//       REPLACE INTO student_ranks (
//         student_id, score, overall_rank, department_rank, year_rank, section_rank
//       ) VALUES (?, ?, ?, ?, ?, ?)
//     `,
//       [
//         s.student_id,
//         s.score,
//         overall_rank,
//         department_rank,
//         year_rank,
//         section_rank,
//       ]
//     );
//   }

//   console.log("✅ Rank computation completed.");
// }

// cron.schedule("0 0 * * *", () => {
//   console.log("Recomputing ranks - midnight daily");
//   recomputeRanks();
// });
// recomputeRanks();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
