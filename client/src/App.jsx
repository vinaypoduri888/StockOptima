// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import pages
import Signup from './signup';
import Login from './Login';
import Home from './Home';
import Dashboard from './Dashboard';
import UserProfile from './UserProfile';
import Forecast from './Forecast';
import AboutUs from './AboutUs';
import Homee from './home/Home';

// Import layout (with Sidebar)
import Layout from './Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes with Sidebar */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/home/home" element={<Homee />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
