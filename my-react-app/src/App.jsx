import './index.css';
import React, { useState } from 'react';
import Frontend from './FrontendTestSubmission/Frontend';
import Login from './FrontendTestSubmission/Login';
import Register from './FrontendTestSubmission/Register';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  if (!user) {
    return (
      <div className="app-container">
        {showRegister ? (
          <>
            <Register onRegister={setUser} />
            <button className="btn-toggle" onClick={() => setShowRegister(false)}>
              Back to Login
            </button>
          </>
        ) : (
          <>
            <Login onLogin={setUser} />
            <button className="btn-toggle" onClick={() => setShowRegister(true)}>
              Register
            </button>
          </>
        )}
      </div>
    );
  }

  return <Frontend />;
}

export default App;
