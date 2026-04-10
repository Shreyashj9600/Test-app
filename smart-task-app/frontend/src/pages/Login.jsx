import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const { setToken } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async () => {
        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            setLoading(true);

            const res = await API.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);

            navigate("/dashboard");
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* CSS INSIDE SAME FILE */}
            <style>{`
                .login-container {
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #f3f4f6;
                }

                .login-card {
                    background: white;
                    padding: 30px;
                    width: 350px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                .login-title {
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 24px;
                    font-weight: bold;
                }

                .login-input {
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 15px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    font-size: 14px;
                }

                .login-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                }

                .login-button {
                    width: 100%;
                    padding: 12px;
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .login-button:hover {
                    background-color: #2563eb;
                }

                .login-text {
                    text-align: center;
                    margin-top: 15px;
                    font-size: 14px;
                }

                .login-link {
                    margin-left: 5px;
                    color: #3b82f6;
                    text-decoration: none;
                    font-weight: bold;
                }

                .login-link:hover {
                    text-decoration: underline;
                }
            `}</style>

            <div className="login-container">
                <div className="login-card">
                    <h2 className="login-title">Login</h2>

                    <input
                        className="login-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="login-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button onClick={login} className="login-button">
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="login-text">
                        Don't have an account?
                        <Link to="/signup" className="login-link">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}