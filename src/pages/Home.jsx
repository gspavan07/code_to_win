import React from "react";
import Navbar from "../components/Navbar";
import RankingTable from "../components/Ranking";
import Login from "../pages/Login";
function Home() {
  return (
    <div>
      <Navbar />
      <h1 className="md:text-7xl text-4xl text-[#f86217] font-bold text-center mt-10">
        ADITYA <span className="text-[#394a84] ">UNVERSITY</span>
      </h1>
      <div className="grid md:grid-cols-5">
        <div className="md:col-span-2 md:order-2 order-1">
          <Login />
        </div>
        <div className="md:col-span-3 md:order-1 order-2 mt-10">
          <div className="flex justify-center items-center py-10">
            <RankingTable filter={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
