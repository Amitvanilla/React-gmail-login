import React, { useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLoginSuccess = (credentialResponse) => {
    let decodedUser = jwtDecode(credentialResponse.credential);

    const user = {
      name: decodedUser.name,
      email: decodedUser.email,
      picture: decodedUser.picture,
    };

    setUserData(user);
    setLoggedIn(true);
  };

  const handleLoginFailure = () => {
    alert('Login failed. Please try again.');
  };

  const handleLogout = () => {
    googleLogout();
    setLoggedIn(false);
    setUserData(null);
  };

  return (
      <div className="app-container">
        {loggedIn ? (
            <div className="dashboard">
              <h2>Welcome, {userData.name}</h2>
              <p>Email: {userData.email}</p>
              <img src={userData.picture} alt="Profile" style={{ borderRadius: '50%', width: '100px' }} />
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        ) : (
            <div className="login-container">
              <h2>Login with Google</h2>
              <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginFailure}
                  prompt="select_account"
                  className="google-login-button"
              />
            </div>
        )}
      </div>
  );
}

export default App;
