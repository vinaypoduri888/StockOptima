import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import profilePic from './user.png'; // adjust the path if needed

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');

    if (!storedEmail) {
      alert('User not logged in. Redirecting to login...');
      navigate('/login');
      return;
    }

    axios.get(`http://localhost:3001/user/${storedEmail}`)
      .then(response => {
        if (response.data) {
          setUserDetails(response.data);
          setUpdatedDetails(response.data);
        } else {
          alert('User data not found');
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        alert('Error fetching user data');
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleEditChange = (e) => {
    setUpdatedDetails({ ...updatedDetails, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios.put(`http://localhost:3001/user/update/${updatedDetails.email}`, updatedDetails)
      .then(response => {
        setUserDetails(updatedDetails);
        setEditMode(false);
        setMessage('Profile updated successfully ✅✅');
        setTimeout(() => setMessage(''), 4000);
      })
      .catch(error => {
        console.error('Error updating user:', error);
        setMessage('Failed to update profile ❌');
        setTimeout(() => setMessage(''), 4000);
      });
  };

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading...</h2>;

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <center><h2 style={styles.title}>User Profile</h2></center>
        <div style={styles.userProfileCard}>
          <div style={styles.profileHeader}>
            <img src={profilePic} alt="User Profile" style={styles.profilePicture} />
            <h3 style={styles.name}>{updatedDetails.fullName}</h3>
            {message && <h3 style={styles.successMsg}>{message}</h3>}
          </div>

          <div style={styles.detailTable}>
            {editMode ? (
              <>
                <Row label="Username" input={<input type="text" name="username" value={updatedDetails.username} onChange={handleEditChange} style={styles.input} />} />
                <Row label="Email" input={<input type="email" name="email" value={updatedDetails.email} onChange={handleEditChange} style={styles.input} />} />
                <Row label="Phone" input={<input type="text" name="phone" value={updatedDetails.phone} onChange={handleEditChange} style={styles.input} />} />
                <Row label="Date of Birth" input={<input type="date" name="dob" value={updatedDetails.dob} onChange={handleEditChange} style={styles.input} />} />
                <Row label="Gender" input={
                  <select name="gender" value={updatedDetails.gender} onChange={handleEditChange} style={styles.input}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                } />
                <Row label="Nationality" input={<input type="text" name="nationality" value={updatedDetails.nationality} onChange={handleEditChange} style={styles.input} />} />
              </>
            ) : (
              <>
                <Row label="Username" value={userDetails.username} />
                <Row label="Email" value={userDetails.email} />
                <Row label="Phone" value={userDetails.phone} />
                <Row label="Date of Birth" value={userDetails.dob} />
                <Row label="Gender" value={userDetails.gender} />
                <Row label="Nationality" value={userDetails.nationality} />
              </>
            )}

            <div style={styles.buttonContainer}>
              <button
                style={styles.editButton}
                onClick={editMode ? handleSave : () => setEditMode(true)}
              >
                {editMode ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, input }) => (
  <div style={styles.row}>
    <div style={styles.label}>{label}</div>
    <div style={styles.value}>{input ? input : value}</div>
  </div>
);

export default UserProfile;

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f7f9fc',
  },
  mainContent: {
    flexGrow: 1,
    padding: '40px',
    overflowY: 'auto',
  },
  title: {
    color: '#34495E',
    fontSize: '32px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  userProfileCard: {
    backgroundColor: '#ECF0F1',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    width: '60%',
    margin: '0 auto',
    textAlign: 'center',
  },
  profileHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
  },
  profilePicture: {
    borderRadius: '50%',
    width: '140px',
    height: '140px',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  name: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: '5px',
  },
  successMsg: {
    color: '#28a745',
    fontSize: '18px',
    fontWeight: '600',
    marginTop: '10px',
  },
  detailTable: {
    textAlign: 'left',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #ccc',
  },
  label: {
    width: '35%',
    fontWeight: '600',
    color: '#2c3e50',
  },
  value: {
    width: '60%',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '15px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  editButton: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '10px 25px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};
