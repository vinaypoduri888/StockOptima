import React from 'react';

const AboutUs = () => {
  return (      
     <div style={styles.mainContent}>
        <center>
          <img src ="https://www.swarnandhra.ac.in/img/logo/swarnandhra-logo.png" alt='logo' style={styles.headerImage} />
           <h1 style={styles.department}>DEPARTMENT OF ARTIFICIAL INTELLIGENCE & MACHINE LEARNING</h1>
          <h2 style={styles.projectName}>Project StockOptimus</h2>
           <h3 style={styles.mentor}>UNDER THE ESTEEMED MENTORSHIP OF</h3>
          
          <h3 style={styles.mentor}>Dr. Bomma Rama Krishna Sir(HoD of AI&ML)</h3>
          
          
        </center>

        <section style={styles.teamDescription}>
          <h2>Our Team</h2>
          <table style={styles.table}>
            <thead>
              <tr>
              <th style={styles.th}>Register No</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Gender</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Mobile No</th>
                <th style={styles.th}>Stream</th>
                <th style={styles.th}>Academic Year</th>


              </tr>
            </thead>
            <tbody>
            <tr>
                <td style={styles.td}>21A21A6162</td>
                <td style={styles.td}>Vasa Purna Praneeth</td>
                <td style={styles.td}>M</td>
                <td style={styles.td}>praneethbalu178@gmail.com</td>
                <td style={styles.td}>8328571819</td>
                <td style={styles.td}>AI & ML</td>
                <td style={styles.td}>IV</td>
              </tr>
        
              <tr>
              <td style={styles.td}>21A21A6103</td>
                <td style={styles.td}>Kanna Neeraja</td>
                <td style={styles.td}>F</td>
                <td style={styles.td}>neerajasesa86@gmail.com</td>
                <td style={styles.td}>8106990656</td>
                <td style={styles.td}>AI & ML</td>
                <td style={styles.td}>IV</td>
              </tr>
              <tr>
                <td style={styles.td}>21A21A6131</td>
                <td style={styles.td}>Kucharlapati Amruthavalli</td>
                <td style={styles.td}>F</td>
                <td style={styles.td}>kamruthavalli44@gmail.com</td>
                <td style={styles.td}>8639198694</td>
                <td style={styles.td}>AI & ML</td>
                <td style={styles.td}>IV</td>
              </tr>
              <tr>
              <td style={styles.td}>21A21A6146</td>
                <td style={styles.td}>Poduri Vinay</td>
                <td style={styles.td}>M</td>
                <td style={styles.td}>vinaypoduri888@gmail.com</td>
                <td style={styles.td}>8466837448</td>
                <td style={styles.td}>AI & ML</td>
                <td style={styles.td}>IV</td>
              </tr>
              <tr>
                <td style={styles.td}>21A21A6127</td>
                <td style={styles.td}>Kavuru Bharathi</td>
                <td style={styles.td}>F</td>
                <td style={styles.td}>bharathikavuru4572@gmail.com</td>
                <td style={styles.td}>7337258914</td>
                <td style={styles.td}>AI & ML</td>
                <td style={styles.td}>IV</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    );
};

export default AboutUs;

const styles = {
  mainContent: {
    flexGrow: 1,
    padding: '20px',
    textAlign: 'center',
  },
  headerImage: {
    width: '60%',
    maxHeight: '150px',
    objectFit: 'cover',
  },
  department: {
    marginTop: '10px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  projectName: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#007bff',
  },
  mentor: {
    fontSize: '20px',
    color: '#555',
  },
  teamDescription: {
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: '#f9f9f9',
  },
  th: {
    borderBottom: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#f4f4f4',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
};