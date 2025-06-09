import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const DeptContext = createContext();

export function useDepts() {
  return useContext(DeptContext);
}

export function DeptProvider({ children }) {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/meta/depts")
      .then((res) => setDepts(res.data))
      .catch(() => setDepts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DeptContext.Provider value={{ depts, loading }}>
      {children}
    </DeptContext.Provider>
  );
}
