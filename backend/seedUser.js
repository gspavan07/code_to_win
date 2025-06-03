// seedUser.js
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

(async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pavan123",
    database: "code_to_win",
  });

  const users = [
    {
      email: "karthik.raju@student.edu.in",
      role: "student",
    },
    {
      email: "harsha.vardhan@student.edu.in",
      role: "student",
    },
    {
      email: "neha.sharma@student.edu.in",
      role: "student",
    },
    {
      email: "ritika.jain@student.edu.in",
      role: "student",
    },
    {
      email: "sneha.agarwal@student.edu.in",
      role: "student",
    },
    {
      email: "amit.verma@student.edu.in",
      role: "student",
    },
  ];

  for (const user of users) {
    const hashed = await bcrypt.hash("pass123", 10);
    await connection.execute(
      "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
      [user.email, hashed, user.role]
    );
  }

  console.log("Users seeded");
  await connection.end();
})();
