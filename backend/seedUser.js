// seedUser.js
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

(async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pavan123",
    database: "code_to_win", // Ensure this matches your .env DB_NAME
  });

  const users = [
    // // Students
    // { user_id: "22A91A601", email: "pavan.kumar@aec.edu.in", role: "student" },
    // { user_id: "22A91A602", email: "charan.teja@aec.edu.in", role: "student" },
    // {
    //   user_id: "22A91A603",
    //   email: "sandeep.reddy@aec.edu.in",
    //   role: "student",
    // },
    // { user_id: "22A91A604", email: "neha.sharma@aec.edu.in", role: "student" },
    // { user_id: "22A91A605", email: "ritika.jain@aec.edu.in", role: "student" },

    // // Faculty
    // { user_id: "F001", email: "meena.sharma@aec.edu.in", role: "faculty" },
    // { user_id: "F002", email: "rajesh.patel@aec.edu.in", role: "faculty" },

    // // HODs
    // { user_id: "H001", email: "ramesh.kumar@aec.edu.in", role: "hod" },
    // { user_id: "H002", email: "mukta.rao@aec.edu.in", role: "hod" },

    // Admin
    {
      user_id: "AD001",
      email: "gollapalli.shanmukpavan@gmail.com",
      role: "admin",
    },
  ];

  for (const user of users) {
    const hashed = await bcrypt.hash("admin@aditya", 10);
    await connection.execute(
      "INSERT INTO users (user_id, email, password, role) VALUES (?, ?, ?, ?)",
      [user.user_id, user.email, hashed, user.role]
    );
  }

  console.log("Users seeded");
  await connection.end();
})();
