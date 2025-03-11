import React, { useEffect, useState } from 'react';
import axios from 'axios';
import visual1 from './assets/Visual_1.jpg';
import visual2 from './assets/Visual_2.jpg';
import visual3 from './assets/visual3.png';
import visual4 from './assets/visual4.png';
import banner from './assets/banner.png';

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [showForecast, setShowForecast] = useState(false);

  const fetchWeather = async (lat, lon) => {
    try {
      const API_KEY = '08a4b3d896ed4756efaf724d8c34945b';
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
          <div style={styles.container}>
        
        <div style={styles.mainContent}>
          {weather && (
            <div style={styles.weatherSection}>
              <h2>{weather.name} Weather</h2>
              <p>{weather.main.temp}°C, {weather.weather[0].description}</p>
              <button onClick={() => setShowForecast(!showForecast)} style={styles.toggleButton}>
                {showForecast ? 'Hide Forecast' : 'Show Forecast'}
              </button>
              {showForecast && forecast && (
                <div style={styles.forecastGrid}>
                  {forecast.list.slice(0, 7).map((item, index) => (
                    <div key={index} style={styles.forecastItem}>
                      <h6>{new Date(item.dt_txt).toLocaleDateString('en-GB')}</h6>
                      <p>{item.main.temp}°C</p>
                      <i>{item.weather[0].description}</i>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
    
          <header style={styles.header}>
            <h1>Discover the Commodities Prices Forecast</h1>
            <p>Weekly report on commodities price trends and forecasts.</p>
          </header>
    
          <h2 style={styles.mainContentHeader}>Dashboard</h2>
    
          <div style={styles.visualContainer}>
            <div style={styles.visualBox}>
              <img src={visual1} alt="Visual 1" style={styles.visualImg} />
            </div>
            <div style={styles.visualBox}>
              <img src={visual2} alt="Visual 2" style={styles.visualImg} />
            </div>
            <div style={styles.visualBox}>
              <img src={visual3} alt="Visual 3" style={styles.visualImg} />
            </div>
            <div style={styles.visualBox}>
              <img src={visual4} alt="Visual 4" style={styles.visualImg} />
            </div>
          </div>
        </div>
      </div>
    );
   
};

export default Dashboard;

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f4f4f4',
  },
  
    mainContent: {
    flexGrow: 1,
    padding: '30px',
    overflowY: 'auto',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  weatherSection: {
    backgroundColor: '#e0e0e0',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  toggleButton: {
    padding: '12px 25px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '15px',
    transition: 'background-color 0.3s',
  },
  toggleButtonHover: {
    backgroundColor: '#0056b3',
  },
  forecastGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px',
    marginTop: '20px',
  },
  forecastItem: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  header: {
    backgroundImage: `url(${banner})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '60px 20px',
    borderRadius: '8px',
    color: 'black',
    textAlign: 'center',
    marginBottom: '30px',
  },
  mainContentHeader: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  visualContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '20px',
  },
  visualBox: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '25px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  visualImg: {
    width: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
  },
};
