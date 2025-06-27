import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PlatformCard from '../components/ui/PlatformCard';
import StatsCard from '../components/ui/StatsCard';

export default function CheckYourScore() {
    const [form, setForm] = useState({
        name: '',
        rollno: '',
        leetcode: '',
        gfg: '',
        codechef: '',
        hankerrank: '',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        // Prepare payload for backend scraping endpoint
        const payload = {
            profiles: [{
                leetcode_id: form.leetcode,
                codechef_id: form.codechef,
                geekforgeeks_id: form.gfg,
                hackerrank_id: form.hankerrank,
                leetcode_status: form.leetcode ? "accepted" : "none",
                codechef_status: form.codechef ? "accepted" : "none",
                geekforgeeks_status: form.gfg ? "accepted" : "none",
                hackerrank_status: form.hankerrank ? "accepted" : "none",
            }]
        };

        try {
            // Call your backend endpoint that triggers scraping
            const response = await fetch('/api/check-score', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch coding profiles");

            // Optionally, you can display the result or just print to console
            setResult(data);
            console.log("Scraped Data:", data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: 'Name', key: 'name' },
        { label: 'Roll No', key: 'rollno' },
        { label: 'LeetCode', key: 'leetcode' },
        { label: 'GeeksforGeeks', key: 'gfg' },
        { label: 'CodeChef', key: 'codechef' },
        { label: 'HackerRank', key: 'hankerrank' }
    ];

    return (
        <>
            <Navbar />
            <div className="bg-white max-w-5xl mx-auto shadow-md p-10 mb-10 rounded-xl">
                <h1 className="text-center text-4xl underline font-bold text-blue-600 mb-8">Check Your Score</h1>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {fields.map(({ label, key }) => (
                            <div className="flex flex-col gap-2" key={key}>
                                <label htmlFor={key}>{label}:</label>
                                <input
                                    type="text"
                                    name={key}
                                    id={key}
                                    value={form[key]}
                                    onChange={handleChange}
                                    placeholder={`Enter your ${label}${label === "Name" || label === "Roll No" ? "" : " ID"}`}
                                    className="p-3 rounded-md border border-gray-300 focus:ring-1 focus:outline-0 focus:ring-blue-600 w-full"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white border border-blue-600 text-blue-600 font-medium py-3 rounded-md hover:bg-blue-600 hover:text-white transition duration-300"
                        >
                            {loading ? "Checking..." : "Check Score"}
                        </button>
                    </div>
                </form>
                {error && <div className="text-red-600 mt-4">{error}</div>}
                {result && (

                    <div className="mt-8 p-4 bg-blue-50 rounded grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.data?.leetcode && (
                            <PlatformCard
                                name="LeetCode"
                                color="hover:text-yellow-600 hover:shadow-yellow-600"
                                icon="/LeetCode_logo.png"
                                total={
                                    (result.data.leetcode.Problems.Easy || 0) +
                                    (result.data.leetcode.Problems.Medium || 0) +
                                    (result.data.leetcode.Problems.Hard || 0)
                                }
                                breakdown={{
                                    Easy: result.data.leetcode.Problems.Easy,
                                    Medium: result.data.leetcode.Problems.Medium,
                                    Hard: result.data.leetcode.Problems.Hard,
                                    Contests: result.data.leetcode.Contests_Attended,
                                    Badges: result.data.leetcode.Badges,
                                }}
                            />
                        )}
                        {result.data?.hackerrank && (
                            <PlatformCard
                                name="HackerRank"
                                color="hover:text-green-600 hover:shadow-green-600"
                                icon="/HackerRank_logo.png"
                                total={result.data.hackerrank.Total_stars}
                                breakdown={{

                                }}
                                subtitle='Badges Gained'
                            />
                        )}
                        {result.data?.codechef && (
                            <PlatformCard
                                name="CodeChef"
                                color=" hover:text-orange-900 hover:shadow-orange-900"
                                icon="/codechef_logo.png"
                                total={result.data.codechef.Contests_Attended}
                                subtitle="Contests Participated"
                                breakdown={{
                                    "Problems Solved":
                                        result.data.codechef.Problems.problems,
                                    Star: result.data.codechef.Problems.stars,
                                    Badges: result.data.codechef.Problems.badges,
                                }} />
                        )
                        }
                        {result.data?.geekforgeeks && (
                            <PlatformCard
                                name="GeeksforGeeks"
                                color="hover:text-green-800 hover:shadow-green-800"
                                icon="/GeeksForGeeks_logo.png"
                                total={
                                    (Number(result.data.geekforgeeks.School) || 0) +
                                    (Number(result.data.geekforgeeks.Basic) || 0) +
                                    (Number(result.data.geekforgeeks.Easy) || 0) +
                                    (Number(result.data.geekforgeeks.Medium) || 0) +
                                    (Number(result.data.geekforgeeks.Hard) || 0)
                                }
                                breakdown={{
                                    School: result.data.geekforgeeks?.School ?? 0,
                                    Basic: result.data.geekforgeeks?.Basic ?? 0,
                                    Easy: result.data.geekforgeeks?.Easy ?? 0,
                                    Medium: result.data.geekforgeeks?.Medium ?? 0,
                                    Hard: result.data.geekforgeeks?.Hard ?? 0,
                                }}
                            />
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}