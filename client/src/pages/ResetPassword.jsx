import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const user_id = state?.user_id;

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    if (!user_id) {
        navigate("/login");
        return null;
    }

    const submit = async () => {
        if (!otp || !newPassword) {
            alert("All fields required");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                "/api/auth/reset-password-otp",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id, otp, newPassword }),
                }
            );

            const data = await res.json();
            alert(data.message);

            if (res.ok) navigate("/");
        } catch {
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

                <input
                    placeholder="Enter OTP"
                    className="w-full border px-3 py-2 rounded mb-3"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="New password"
                    className="w-full border px-3 py-2 rounded mb-4"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;
