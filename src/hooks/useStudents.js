import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchStudents = async ({ queryKey }) => {
  const [_key, { dept, year, section }] = queryKey;
  const params = new URLSearchParams();
  if (dept) params.append("dept", dept);
  if (year) params.append("year", year);
  if (section) params.append("section", section);

  const { data } = await axios.get(
    `http://localhost:5000/faculty/students?${params.toString()}`
  );
  return data;
};

export const useStudents = ({ dept, year, section }) => {
  return useQuery({
    queryKey: ["students", { dept, year, section }],
    queryFn: fetchStudents,
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });
};
