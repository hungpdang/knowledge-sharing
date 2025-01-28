import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './pages/LoginScreen';
import SignupScreen from './pages/SignupScreen';
import NewsManagement from './pages/NewsManagement';
import Dashboard from './pages/Dashboard';
import Navigation from './Navigation';
import Profile from './pages/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status when component mounts
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navigation />}
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginScreen setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? <SignupScreen /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/news"
            element={
              isAuthenticated ? <NewsManagement /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
