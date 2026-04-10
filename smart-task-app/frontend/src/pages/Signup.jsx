import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const signup = async () => {
        if (!name || !email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            await API.post("/auth/signup", {
                name,
                email,
                password,
            });

            alert("Signup successful");

            // 👉 redirect to login
            navigate("/");

        } catch (err) {
            alert(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* CSS INSIDE SAME FILE */}
            <style>{`
                .signup-container {
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #f3f4f6;
                }

                .signup-card {
                    background: white;
                    padding: 30px;
                    width: 350px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                .signup-title {
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 24px;
                    font-weight: bold;
                }

                .signup-input {
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 15px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    font-size: 14px;
                }

                .signup-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                }

                .signup-button {
                    width: 100%;
                    padding: 12px;
                    background-color: #10b981;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .signup-button:hover {
                    background-color: #059669;
                }

                .signup-text {
                    text-align: center;
                    margin-top: 15px;
                    font-size: 14px;
                }

                .signup-link {
                    margin-left: 5px;
                    color: #3b82f6;
                    text-decoration: none;
                    font-weight: bold;
                }

                .signup-link:hover {
                    text-decoration: underline;
                }
            `}</style>

            <div className="signup-container">
                <div className="signup-card">
                    <h2 className="signup-title">Signup</h2>

                    <input
                        className="signup-input"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        className="signup-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="signup-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button onClick={signup} className="signup-button">
                        {loading ? "Signing up..." : "Signup"}
                    </button>

                    <p className="signup-text">
                        Already have an account?
                        <Link to="/" className="signup-link">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}