import React, { createContext, useContext, useEffect, useState } from "react";

const DeptContext = createContext();

export function useDepts() {
  return useContext(DeptContext);
}

export function DeptProvider({ children }) {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const response = await fetch("http://localhost:5000/meta/depts");
        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }
        const data = await response.json();
        setDepts(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepts();
  }, []);

  return (
    <DeptContext.Provider value={{ depts, loading }}>
      {children}
    </DeptContext.Provider>
  );
}
