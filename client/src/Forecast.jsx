import React, { useEffect, useState } from 'react';
import axios from 'axios';
import banner from './assets/banner.png';


const Forecast = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  
  const [state, setState] = useState('');
  const [commodity, setCommodity] = useState('');
  const [duration, setDuration] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [predictedPrices, setPredictedPrices] = useState([]);

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
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        fetchWeather(position.coords.latitude, position.coords.longitude);
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/predict', {
        state,
        commodity,
        days: duration,
      });
      console.log('Prediction response:', response.data);
      setPredictedPrices(response.data.predicted_prices);
      setRecommendation(response.data.recommendation); // Store the recommendation
    } catch (error) {
      console.error('Error fetching prediction data:', error);
    }
  };
  

  const getFutureDate = (daysFromNow) => {
    const date = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    date.setDate(date.getDate() + daysFromNow);
    return date.toLocaleDateString('en-GB', options);
  };

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
    {(() => {
      const uniqueDates = new Set();
      const today = new Date();
      const targetDateCount = 7; // Total days to display
      return forecast.list.reduce((acc, item) => {
        const date = new Date(item.dt_txt);
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        // Check if the date is today or in the future and if it's not already added
        if (date >= today && !uniqueDates.has(formattedDate) && acc.length < targetDateCount) {
          uniqueDates.add(formattedDate);
          acc.push(
            <div key={formattedDate} style={styles.forecastItem}>
              <h6><i>{formattedDate}</i></h6>
              <p>{item.main.temp}°C</p>
              <i>{item.weather[0].description}</i>
            </div>
          );
        }

        // Stop collecting after 7 unique days
        return acc.length < targetDateCount ? acc : acc.slice(0, targetDateCount);
      }, []);
    })()}
  </div>
)}

          </div>
        )}

        <header style={styles.header}>
          <center>
            <h1>Discover the Commodities Prices Forecast</h1>
            <p>Weekly report on commodities price trends and forecasts.</p>
          </center>
        </header>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="state">State:</label>
            <select id="state" value={state} onChange={(e) => setState(e.target.value)} style={styles.input}>
  <option value="">Select State</option>
  <option value="Andaman and Nicobar">Andaman and Nicobar</option>
  <option value="Andhra Pradesh">Andhra Pradesh</option>
  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
  <option value="Assam">Assam</option>
  <option value="Bihar">Bihar</option>
  <option value="Chandigarh">Chandigarh</option>
  <option value="Chhattisgarh">Chhattisgarh</option>
  <option value="Delhi">Delhi</option>
  <option value="DNH and DD">DNH and DD</option>
  <option value="Goa">Goa</option>
  <option value="Gujarat">Gujarat</option>
  <option value="Haryana">Haryana</option>
  <option value="Himachal Pradesh">Himachal Pradesh</option>
  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
  <option value="Jharkhand">Jharkhand</option>
  <option value="Karnataka">Karnataka</option>
  <option value="Kerala">Kerala</option>
  <option value="Madhya Pradesh">Madhya Pradesh</option>
  <option value="Maharashtra">Maharashtra</option>
  <option value="Manipur">Manipur</option>
  <option value="Meghalaya">Meghalaya</option>
  <option value="Mizoram">Mizoram</option>
  <option value="Nagaland">Nagaland</option>
  <option value="Odisha">Odisha</option>
  <option value="Puducherry">Puducherry</option>
  <option value="Punjab">Punjab</option>
  <option value="Rajasthan">Rajasthan</option>
  <option value="Sikkim">Sikkim</option>
  <option value="Tamil Nadu">Tamil Nadu</option>
  <option value="Telangana">Telangana</option>
  <option value="Tripura">Tripura</option>
  <option value="Uttar Pradesh">Uttar Pradesh</option>
  <option value="Uttarakhand">Uttarakhand</option>
  <option value="West Bengal">West Bengal</option>
</select>

          </div>

          <div style={styles.formGroup}>
            <label htmlFor="commodity">Commodity:</label>
            <select id="commodity" value={commodity} onChange={(e) => setCommodity(e.target.value)} style={styles.input}>
  <option value="">Select Commodity</option>
  <option value="Rice">Rice</option>
  <option value="Wheat">Wheat</option>
  <option value="Atta (Wheat)">Atta (Wheat)</option>
  <option value="Gram Dal">Gram Dal</option>
  <option value="Tur/Arhar Dal">Tur/Arhar Dal</option>
  <option value="Urad Dal">Urad Dal</option>
  <option value="Moong Dal">Moong Dal</option>
  <option value="Masoor Dal">Masoor Dal</option>
  <option value="Sugar">Sugar</option>
  <option value="Milk @">Milk @</option>
  <option value="Groundnut Oil (Packed)">Groundnut Oil (Packed)</option>
  <option value="Mustard Oil (Packed)">Mustard Oil (Packed)</option>
  <option value="Vanaspati (Packed)">Vanaspati (Packed)</option>
  <option value="Soya Oil (Packed)">Soya Oil (Packed)</option>
  <option value="Sunflower Oil (Packed)">Sunflower Oil (Packed)</option>
  <option value="Palm Oil (Packed)">Palm Oil (Packed)</option>
  <option value="Gur">Gur</option>
  <option value="Tea Loose">Tea Loose</option>
  <option value="Salt Pack (Iodised)">Salt Pack (Iodised)</option>
  <option value="Potato">Potato</option>
  <option value="Onion">Onion</option>
  <option value="Tomato">Tomato</option>
 
</select>

          </div>

          <div style={styles.formGroup}>
            <label htmlFor="duration">Forecast Duration (Days):</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              max="30"
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>Predict</button>
        </form>

        {predictedPrices.length > 0 && (
          <div style={styles.results}>
            <h2>Forecast Results</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Price</th>
                </tr>
              </thead>
              <tbody>
                {predictedPrices.map((price, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{getFutureDate(index)}</td>
                    <td style={styles.td}>
                      {typeof price === 'number' ? price.toFixed(2) : 'Invalid price'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recommendation && (
  <div style={styles.recommendation}>
    <h3>Recommendation</h3>
    <p>{recommendation}</p>
  </div>
)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecast;
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f4f4f4',
    padding: '20px',
    gap: '20px',
  },
  mainContent: {
    flexGrow: 1,
    padding: '30px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    marginLeft: '100px'
  },
  weatherSection: {
    backgroundColor: '#e0e0e0',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
    alignSelf: 'flex-start',
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
  form: {
    marginBottom: '20px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    padding: '10px',
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  results: {
    marginTop: '20px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    borderBottom: '2px solidrgb(13, 13, 14)',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f0f0f0',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  mainContentHeader: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  visualContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
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
  recommendation: {
    backgroundColor: '#e0f7fa',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
};
