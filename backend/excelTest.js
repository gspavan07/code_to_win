// testExcelWrite.js

const appendToExcel = require("./appendToExcel");

async function test() {
  const testStudent = {
  stdId: "22A91A61A5",
  name: "lokesh",
  email: "lokesh@example.com",
  gender: "Male",
  degree: "B.Tech",
  dept: "AIML",
  year: "4",
  section: "6",
  leetcode: "sunil",
  codechef: "sunilchef",
  hackerrank: "sunilhack",
  geeksforgeeks: "sunilgfg"
};

  try {
    console.log("📄 Writing test student to Excel...");
    await appendToExcel(testStudent);
    console.log("✅ Success! Check your Excel file.");
  } catch (err) {
    console.error("❌ Error writing to Excel:", err.message);
  }
}

test();
