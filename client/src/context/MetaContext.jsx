import React, { createContext, useContext, useEffect, useState } from "react";

const MetaContext = createContext();

export function useMeta() {
  return useContext(MetaContext);
}

// Keep backward compatibility
export function useDepts() {
  const { depts, loading } = useMeta();
  return { depts, loading };
}

export function MetaProvider({ children }) {
  const [depts, setDepts] = useState([]);
  const [years, setYears] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeta = async () => {
    try {
      const [deptsRes, yearsRes, sectionsRes] = await Promise.all([
        fetch("/api/meta/depts"),
        fetch("/api/meta/years"),
        fetch("/api/meta/sections"),
      ]);

      const [deptsData, yearsData, sectionsData] = await Promise.all([
        deptsRes.json(),
        yearsRes.json(),
        sectionsRes.json(),
      ]);

      setDepts(Array.isArray(deptsData) ? deptsData : []);
      setYears(Array.isArray(yearsData) ? yearsData : []);
      setSections(Array.isArray(sectionsData) ? sectionsData : []);
    } catch (error) {
      console.error("Error fetching meta data:", error);
      setDepts([]);
      setYears([]);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  return (
    <MetaContext.Provider
      value={{ depts, years, sections, loading, refreshMeta: fetchMeta }}
    >
      {children}
    </MetaContext.Provider>
  );
}

// Keep backward compatibility
export const DeptProvider = MetaProvider;
