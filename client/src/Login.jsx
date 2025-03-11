import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const bgImageStyle = {
        backgroundImage: `url('https://naymatcollateral.com/wp-content/uploads/2020/11/banner1-6.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw'
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            alert("Please enter email and password!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/login', { email, password });

            console.log("Login Response:", response.data);

            if (response.data.message === "Success") {
                localStorage.setItem('userEmail', email); // ✅ Store user email
                navigate('/home'); // ✅ Redirect to User Profile
            } else {
                alert(response.data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Error logging in. Please try again.");
        }
    };

    return (
        <div style={bgImageStyle} className="d-flex justify-content-center align-items-center vh-100">
            <div className="bg-white p-4 rounded w-25">
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            className="form-control rounded-0"
                            autoComplete="off"
                            name="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            className="form-control rounded-0"
                            name="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Login
                    </button>
                </form>
                <div className="text-center mt-3">
                    <p style={{ color: 'purple' }}>Don't have an account? Please sign up</p>
                    <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none" style={{ color: 'red' }}>
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
