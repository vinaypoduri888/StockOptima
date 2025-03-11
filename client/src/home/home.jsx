import React from 'react';
import { Link } from 'react-router-dom'; 

// Dashboard component
function Homee() {
    // Inline styles
    const styles = {
        dashboardContainer: {
            display: 'flex',
            height: '100vh',
            width: '100vw',
        },
        sidebar: {
            backgroundColor: 'Green', // Dark blue
            color: 'white',
            width: '250px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        logoImg: {
            maxWidth: '100%',
            height: 'auto',
            marginBottom: '30px',
        },
        userProfile: {
            textAlign: 'center',
        },
        profileImg: {
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            marginBottom: '10px',
        },
        userName: {
            marginTop: '0',
            fontSize: '1.2em',
        },
        navLinks: {
            marginTop: '50px',
        },
        navLink: {
            color: 'white',
            textDecoration: 'none',
            display: 'block',
            padding: '10px 0',
            fontSize: '1.1em',
            transition: 'color 0.2s ease-in-out',
        },
        navLinkHover: {
            color: 'green', // Light blue
        },
        mainContent: {
            flexGrow: 1,
            backgroundColor: '#F3F4F6', // Light gray background
            padding: '30px',
        },
        mainContentHeader: {
            marginBottom: '20px',
        },
        visualContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)', // Two columns layout
            gap: '20px',
        },
        visualBox: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        visualImg: {
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: '8px',
        },
    };

    return (
        <div style={styles.dashboardContainer}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                                  
                {/* Navigation Links */}
                <nav style={styles.navLinks}>
                   <Link to="/profile" style={styles.navLink}>
                        <h3>User profile</h3>
                    </Link>
                    <Link to="/forecast" style={styles.navLink}>
                       <h3>Forecast</h3> 
                    </Link>
                    <Link to="/logout" style={styles.navLink}>
                        <h3>Logout</h3>
                    </Link>
                </nav>
            </div>

            {/* Main Content Area */}
            <div style={styles.mainContent}>
                <h2 style={styles.mainContentHeader}>Dashboard</h2>

                {/* Placeholder divs for visuals */}
                <div style={styles.visualContainer}>
                    <div style={styles.visualBox}>
                        <img src="pic1.png" alt="Visual 1" style={styles.visualImg} />
                    </div>
                    <div style={styles.visualBox}>
                        <img src="pic2.png" alt="Visual 2" style={styles.visualImg} />
                    </div>
                    <div style={styles.visualBox}>
                        <img src="pic3.png" alt="Visual 3" style={styles.visualImg} />
                    </div>
                    <div style={styles.visualBox}>
                        <img src="pic4.png" alt="Visual 4" style={styles.visualImg} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homee;
