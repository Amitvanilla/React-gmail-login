import React, { useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import axios from 'axios'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openaiData, setOpenaiData] = useState()

  const fetchDataFromOpenAi = async(email)=>{
    try {
      const res = await axios.post(`${process.env.REACT_APP_DEV_API_URL}/generate/`, {
        prompt: email,
      });
      setOpenaiData(res.data.response); 
    } catch (err) {
      alert("Failed to generate description: " + err.message);
    }
  }

  const handleLoginSuccess = (credentialResponse) => {
    let decodedUser = jwtDecode(credentialResponse.credential);

    const user = {
      name: decodedUser.name,
      email: decodedUser.email,
      picture: decodedUser.picture,
    };
    
    if(user){
      fetchDataFromOpenAi(user.email)
    }


    setUserData(user);
    setLoggedIn(true);
  };

  const handleLoginFailure = () => {
    alert('Login failed. Please try again.');
  };

  const handleLogout = () => {
    googleLogout();
    setUserData({});
    setLoggedIn(false);
  };

  return (
      <div className="app-container">
        {loggedIn ? (
            <div className="dashboard">
              <h2>Welcome, {userData.name}</h2>
              <p>Email: {userData.email}</p>
              <img src={userData.picture} alt="Profile" style={{ borderRadius: '50%', width: '100px' }} />
              <p>Details: {openaiData}</p>
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
