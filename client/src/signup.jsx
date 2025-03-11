import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const bgImageStyle = {
        backgroundImage: `url('https://naymatcollateral.com/wp-content/uploads/2020/11/banner1-6.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw'
    };

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [nationality, setNationality] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Ensure all fields are filled before sending request
        if (!username || !email || !phone || !dob || !gender || !nationality || !password) {
            alert("All fields are required!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/register', { 
                username, email, phone, dob, gender, nationality, password 
            });

            console.log("Signup Success:", response);
            alert("Signup successful✅");
            navigate('/login');

        } catch (error) {
            console.error("Signup Error:", error.response?.data?.message || error.message);
            
            // ✅ Show backend error message if available
            alert(error.response?.data?.message || "Signup failed. Please try again.");
        }
    };

    return (
        <div style={bgImageStyle} className="d-flex justify-content-center align-items-center vh-100">
            <div className="bg-white p-4 rounded w-25">
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label><strong>Username</strong></label>
                        <input type="text" className="form-control" placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="form-group mb-3">
                        <label><strong>Email</strong></label>
                        <input type="email" className="form-control" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group mb-3">
                        <label><strong>Phone</strong></label>
                        <input type="text" className="form-control" placeholder="Enter Phone Number" onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="form-group mb-3">
                        <label><strong>Date of Birth</strong></label>
                        <input type="date" className="form-control" onChange={(e) => setDob(e.target.value)} required />
                    </div>
                    <div className="form-group mb-3">
                        <label><strong>Gender</strong></label>
                        <select className="form-control" onChange={(e) => setGender(e.target.value)} required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group mb-3">
                        <label><strong>Nationality</strong></label>
                        <input type="text" className="form-control" placeholder="Enter Nationality" onChange={(e) => setNationality(e.target.value)} required />
                    </div>
                    <div className="form-group mb-3">
                        <label><strong>Password</strong></label>
                        <input type="password" className="form-control" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-success w-100">Register</button>
                </form>
                <div className="text-center mt-3">
                    <p>Already have an account?</p>
                    <Link to="/login" className="btn btn-primary w-100">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
