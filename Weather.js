
const { useState, useEffect, useContext, createContext, useCallback, useMemo } = React;

// Mock weather data
const WEATHER_DATA = {
  "New York": {
    name: "New York",
    country: "US",
    current: {
      temperature: 22,
      condition: "Sunny",
      humidity: 65,
      windSpeed: 12,
      icon: "sunny"
    },
    forecast: [
      {"day": "Today", "high": 24, "low": 18, "condition": "Sunny", "icon": "sunny"},
      {"day": "Tomorrow", "high": 26, "low": 20, "condition": "Partly Cloudy", "icon": "partly-cloudy"},
      {"day": "Wed", "high": 23, "low": 17, "condition": "Cloudy", "icon": "cloudy"},
      {"day": "Thu", "high": 21, "low": 15, "condition": "Rainy", "icon": "rainy"},
      {"day": "Fri", "high": 25, "low": 19, "condition": "Sunny", "icon": "sunny"}
    ]
  },
  "London": {
    name: "London",
    country: "UK",
    current: {
      temperature: 15,
      condition: "Cloudy",
      humidity: 78,
      windSpeed: 8,
      icon: "cloudy"
    },
    forecast: [
      {"day": "Today", "high": 16, "low": 12, "condition": "Cloudy", "icon": "cloudy"},
      {"day": "Tomorrow", "high": 14, "low": 10, "condition": "Rainy", "icon": "rainy"},
      {"day": "Wed", "high": 17, "low": 13, "condition": "Partly Cloudy", "icon": "partly-cloudy"},
      {"day": "Thu", "high": 18, "low": 14, "condition": "Sunny", "icon": "sunny"},
      {"day": "Fri", "high": 16, "low": 12, "condition": "Cloudy", "icon": "cloudy"}
    ]
  },
  "Tokyo": {
    name: "Tokyo",
    country: "Japan",
    current: {
      temperature: 28,
      condition: "Partly Cloudy",
      humidity: 72,
      windSpeed: 6,
      icon: "partly-cloudy"
    },
    forecast: [
      {"day": "Today", "high": 30, "low": 25, "condition": "Partly Cloudy", "icon": "partly-cloudy"},
      {"day": "Tomorrow", "high": 32, "low": 27, "condition": "Sunny", "icon": "sunny"},
      {"day": "Wed", "high": 29, "low": 24, "condition": "Cloudy", "icon": "cloudy"},
      {"day": "Thu", "high": 31, "low": 26, "condition": "Sunny", "icon": "sunny"},
      {"day": "Fri", "high": 28, "low": 23, "condition": "Rainy", "icon": "rainy"}
    ]
  },
  "Sydney": {
    name: "Sydney",
    country: "Australia",
    current: {
      temperature: 19,
      condition: "Rainy",
      humidity: 85,
      windSpeed: 15,
      icon: "rainy"
    },
    forecast: [
      {"day": "Today", "high": 20, "low": 16, "condition": "Rainy", "icon": "rainy"},
      {"day": "Tomorrow", "high": 22, "low": 18, "condition": "Cloudy", "icon": "cloudy"},
      {"day": "Wed", "high": 25, "low": 21, "condition": "Partly Cloudy", "icon": "partly-cloudy"},
      {"day": "Thu", "high": 27, "low": 23, "condition": "Sunny", "icon": "sunny"},
      {"day": "Fri", "high": 24, "low": 20, "condition": "Partly Cloudy", "icon": "partly-cloudy"}
    ]
  },
  "Paris": {
    name: "Paris",
    country: "France",
    current: {
      temperature: 18,
      condition: "Sunny",
      humidity: 58,
      windSpeed: 10,
      icon: "sunny"
    },
    forecast: [
      {"day": "Today", "high": 20, "low": 15, "condition": "Sunny", "icon": "sunny"},
      {"day": "Tomorrow", "high": 22, "low": 17, "condition": "Partly Cloudy", "icon": "partly-cloudy"},
      {"day": "Wed", "high": 19, "low": 14, "condition": "Cloudy", "icon": "cloudy"},
      {"day": "Thu", "high": 21, "low": 16, "condition": "Sunny", "icon": "sunny"},
      {"day": "Fri", "high": 23, "low": 18, "condition": "Sunny", "icon": "sunny"}
    ]
  }
};

// Context for global state
const WeatherContext = createContext();

// Custom hook for localStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key]);

  return [storedValue, setValue];
};

// Custom hook for theme management
const useTheme = () => {
  const [theme, setTheme] = useLocalStorage('weather-theme', 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  return { theme, toggleTheme };
};

// Custom hook for weather data
const useWeatherData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = WEATHER_DATA[cityName];
      if (!data) {
        throw new Error(`Weather data not found for ${cityName}`);
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchWeatherData, loading, error };
};

// Custom hook for geolocation
const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Mock: Return New York for demo purposes
        setLocation({ city: 'New York', coordinates: position.coords });
        setLoading(false);
      },
      (error) => {
        setError('Unable to retrieve location');
        setLoading(false);
      }
    );
  }, []);

  return { location, loading, error, getCurrentLocation };
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

// Error Message Component
const ErrorMessage = ({ message }) => (
  <div className="error-message">
    {message}
  </div>
);

// Weather Icon Component
const WeatherIcon = ({ icon, size = 'normal' }) => {
  const iconClass = `weather-icon weather-icon-${icon}`;
  return <div className={iconClass} style={{ fontSize: size === 'large' ? '3rem' : '1.5rem' }}></div>;
};

// Theme Toggle Component
const ThemeToggle = ({ theme, onToggle }) => (
  <button className="theme-toggle" onClick={onToggle}>
    {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark' : 'Light'}
  </button>
);

// Unit Toggle Component
const UnitToggle = ({ unit, onToggle }) => (
  <div className="unit-toggle">
    <button 
      className={`unit-button ${unit === 'celsius' ? 'active' : ''}`}
      onClick={() => onToggle('celsius')}
    >
      °C
    </button>
    <button 
      className={`unit-button ${unit === 'fahrenheit' ? 'active' : ''}`}
      onClick={() => onToggle('fahrenheit')}
    >
      °F
    </button>
  </div>
);

// Weather Search Component
const WeatherSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const cities = Object.keys(WEATHER_DATA);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 0) {
      const filteredCities = cities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredCities);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city) => {
    setQuery(city);
    setShowSuggestions(false);
    onSearch(city);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for a city..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setShowSuggestions(true)}
        />
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map(city => (
            <div
              key={city}
              className="search-suggestion"
              onClick={() => handleSuggestionClick(city)}
            >
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Current Weather Component
const CurrentWeather = ({ data, unit }) => {
  const convertTemp = (temp) => {
    return unit === 'fahrenheit' ? Math.round(temp * 9/5 + 32) : temp;
  };

  if (!data) return null;

  return (
    <div className="current-weather">
      <div className="weather-location">
        <h2 className="location-name">{data.name}, {data.country}</h2>
      </div>
      <WeatherIcon icon={data.current.icon} size="large" />
      <div className="weather-temp">
        {convertTemp(data.current.temperature)}°{unit === 'celsius' ? 'C' : 'F'}
      </div>
      <div className="weather-condition">{data.current.condition}</div>
      <div className="weather-details">
        <div className="weather-detail">
          <div className="weather-detail-label">Humidity</div>
          <div className="weather-detail-value">{data.current.humidity}%</div>
        </div>
        <div className="weather-detail">
          <div className="weather-detail-label">Wind Speed</div>
          <div className="weather-detail-value">{data.current.windSpeed} km/h</div>
        </div>
      </div>
    </div>
  );
};

// Weather Forecast Component
const WeatherForecast = ({ data, unit }) => {
  const convertTemp = (temp) => {
    return unit === 'fahrenheit' ? Math.round(temp * 9/5 + 32) : temp;
  };

  if (!data || !data.forecast) return null;

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">5-Day Forecast</h3>
      <div className="forecast-list">
        {data.forecast.map((day, index) => (
          <div key={index} className="forecast-item">
            <div className="forecast-day">{day.day}</div>
            <div className="forecast-weather">
              <WeatherIcon icon={day.icon} />
              <div className="forecast-condition">{day.condition}</div>
            </div>
            <div className="forecast-temps">
              <span className="forecast-temp-high">
                {convertTemp(day.high)}°
              </span>
              <span className="forecast-temp-low">
                {convertTemp(day.low)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Favorite Cities Component
const FavoriteCities = ({ favorites, onRemove, onSelect, unit }) => {
  const convertTemp = (temp) => {
    return unit === 'fahrenheit' ? Math.round(temp * 9/5 + 32) : temp;
  };

  if (favorites.length === 0) return null;

  return (
    <div className="favorites-section">
      <h3 className="favorites-title">Favorite Cities</h3>
      <div className="favorites-grid">
        {favorites.map(city => (
          <div
            key={city.name}
            className="favorite-card"
            onClick={() => onSelect(city.name)}
          >
            <button
              className="favorite-remove"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(city.name);
              }}
            >
              ×
            </button>
            <div className="favorite-location">{city.name}</div>
            <div className="favorite-temp">
              {convertTemp(city.current.temperature)}°{unit === 'celsius' ? 'C' : 'F'}
            </div>
            <div className="favorite-condition">{city.current.condition}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [favorites, setFavorites] = useLocalStorage('weather-favorites', []);
  const [unit, setUnit] = useLocalStorage('weather-unit', 'celsius');
  const { theme, toggleTheme } = useTheme();
  const { fetchWeatherData, loading, error } = useWeatherData();
  const { location, getCurrentLocation } = useGeolocation();

  // Initialize with New York on load
  useEffect(() => {
    fetchWeatherData('New York').then(data => {
      if (data) setCurrentWeather(data);
    });
  }, [fetchWeatherData]);

  // Auto-detect location on mount
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Set weather based on detected location
  useEffect(() => {
    if (location) {
      fetchWeatherData(location.city).then(data => {
        if (data) setCurrentWeather(data);
      });
    }
  }, [location, fetchWeatherData]);

  const handleSearch = async (cityName) => {
    const data = await fetchWeatherData(cityName);
    if (data) {
      setCurrentWeather(data);
    }
  };

  const handleAddToFavorites = () => {
    if (currentWeather && !favorites.find(fav => fav.name === currentWeather.name)) {
      setFavorites([...favorites, currentWeather]);
    }
  };

  const handleRemoveFromFavorites = (cityName) => {
    setFavorites(favorites.filter(fav => fav.name !== cityName));
  };

  const handleSelectFavorite = (cityName) => {
    const favoriteCity = favorites.find(fav => fav.name === cityName);
    if (favoriteCity) {
      setCurrentWeather(favoriteCity);
    }
  };

  const isFavorite = currentWeather && favorites.find(fav => fav.name === currentWeather.name);

  return (
    <div className="weather-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Weather Dashboard</h1>
        <div className="dashboard-controls">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <UnitToggle unit={unit} onToggle={setUnit} />
          {currentWeather && !isFavorite && (
            <button className="btn btn--primary btn--sm" onClick={handleAddToFavorites}>
              Add to Favorites
            </button>
          )}
        </div>
      </div>

      <WeatherSearch onSearch={handleSearch} />

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="weather-main">
          <CurrentWeather data={currentWeather} unit={unit} />
          <WeatherForecast data={currentWeather} unit={unit} />
        </div>
      )}

      <FavoriteCities
        favorites={favorites}
        onRemove={handleRemoveFromFavorites}
        onSelect={handleSelectFavorite}
        unit={unit}
      />
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));