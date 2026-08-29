import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [user_id, setUser_id] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async () => {
        if (!user_id) {
            alert("Please enter user_id");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                "/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id }),
                }
            );

            const data = await res.json();

            alert(data.message);

            if (!res.ok) {
                alert(data.message || "Failed to send OTP");
                return;
            }

            navigate("/reset-password", {
                state: { user_id },
                replace: true,
            });

        } catch (err) {
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>

                <input
                    type="text"
                    placeholder="Enter registered user_id"
                    className="w-full border px-3 py-2 rounded mb-4"
                    value={user_id}
                    onChange={(e) => setUser_id(e.target.value)}
                />

                <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Sending OTP..." : "Send OTP"}
                </button>
            </div>
        </div>
    );
};

export default ForgotPassword;
