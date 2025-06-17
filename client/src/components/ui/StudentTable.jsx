import { TbUserShare } from "react-icons/tb";

const StudentTable = ({
  students = [],
  showBranch = true,
  showYear = true,
  showSection = true, // 👈 new prop
  onProfileClick = () => {},
}) => {
  console.log(students);
  return (
    <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow text-sm">
      <thead className="bg-gray-100 text-center">
        <tr>
          <th className="py-3 px-4">S. No</th>
          {/* 👈 dynamic column name */}
          <th className="py-3 px-4 text-left">Student</th>
          <th className="py-3 px-4">Roll Number</th>
          {showBranch && <th className="py-3 px-4">Branch</th>}
          {showYear && <th className="py-3 px-4">Year</th>}
          {showSection && <th className="py-3 px-4">Section</th>}
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students?.length > 0 ? (
          students.map((student, i) => (
            <tr
              key={student.student_id}
              className="hover:bg-gray-50 text-center"
            >
              <td className="py-3 px-4">{i + 1}</td>
              <td className="py-3 px-4 text-left flex items-center gap-2">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 hidden md:flex items-center text-sm justify-center font-bold">
                  {student.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                {student.name}
              </td>
              <td className="py-3 px-4">{student.student_id}</td>
              {showBranch && (
                <td className="py-3 px-4 ">{student.dept_name}</td>
              )}
              {showYear && <td className="py-3 px-4">{student.year}</td>}
              {showSection && <td className="py-3 px-4">{student.section}</td>}
              <td className="py-3 px-4">
                <div
                  onClick={() => onProfileClick(student)}
                  className="text-gray-700 px-2 py-1 justify-center rounded hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <TbUserShare />
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="py-3 px-4 text-center">
              No students found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
export default StudentTable;
