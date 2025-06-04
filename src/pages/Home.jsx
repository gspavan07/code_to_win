import React, { useEffect, useState } from "react";
import Login from "./Login";
import { div } from "framer-motion/client";
import Navbar from "../components/Navbar";
import RankingTable from "../components/Ranking";

// Dummy data for top performers
const dummyPerformers = [
    { name: "Alice", score: 98 },
    { name: "Bob", score: 95 },
    { name: "Charlie", score: 93 },
    { name: "David", score: 91 },
    { name: "Eve", score: 90 },
    { name: "Frank", score: 89 },
    { name: "Grace", score: 88 },
    { name: "Heidi", score: 87 },
    { name: "Ivan", score: 86 },
    { name: "Judy", score: 85 },
];

// Simple Login Form Component


const Home = () => {
    const [performers, setPerformers] = useState([]);

    useEffect(() => {
        // Replace with API call if needed
        setPerformers(dummyPerformers);
    }, []);

    return (
        <div>
            <Navbar/>
        <div className="grid grid-cols-5 place-items-center items-center bg-gray-100">
            {/* Left 2/3: Top Performers */}
            <div className="col-span-3 justify-center p-6 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-6">Top 10 Performers</h1>
                <RankingTable/>
            </div>
            {/* Right 1/3: Login Form */}
<div className="col-span-2">                <Login />
                </div>
                
        </div></div>
    );
};

export default Home;