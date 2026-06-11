
import React, {
  useEffect,
  useState
} from 'react';

import { motion } from 'framer-motion';

import {
  FaUser,
  FaUserShield,
  FaAmbulance,
  FaChartLine,
  FaBell
} from 'react-icons/fa';

import './LandingPage.css';

import axios from 'axios';

import { jwtDecode } from 'jwt-decode';

function LandingPage() {

  /* STATES */

  const [stats, setStats] =
    useState({});

  const [showLogin, setShowLogin] =
    useState(false);

  const [showSignup, setShowSignup] =
    useState(false);

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [name, setName] =
    useState('');

  const [signupEmail, setSignupEmail] =
    useState('');

  const [
    signupPassword,
    setSignupPassword
  ] = useState('');

  const [signupRole, setSignupRole] =
    useState('CITIZEN');

  const [location, setLocation] =
    useState('');

  /* FETCH STATS */

  useEffect(() => {

    fetchStats();

    const interval = setInterval(() => {

      fetchStats();

    }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  const fetchStats = async () => {

    try {

      const response = await axios.get(
        'http://localhost:8080/disasters/stats'
      );

      setStats(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  /* LOGIN */

  const handleLogin = async () => {

    try {

      const response = await axios.post(
        'http://localhost:8080/login',
        {
          email,
          password
        }
      );

      const token =
        response.data.token ||
        response.data;

      const decoded =
        jwtDecode(token);

      console.log(
        'Decoded JWT:',
        decoded
      );

      const userRole =
        decoded.role;

      /* STORE DATA */

      localStorage.setItem(
        'token',
        token
      );

      localStorage.setItem(
        'role',
        userRole
      );

      localStorage.setItem(
        'username',
        decoded.sub
      );

      alert('Login Successful');

      /* ROLE ROUTING */

      if (userRole === 'ADMIN') {

        window.location.href =
          '/admin';

      } else if (
        userRole === 'RESPONDER'
      ) {

        window.location.href =
          '/responder';

      } else {

        window.location.href =
          '/citizen';

      }

    } catch (error) {

      console.log(error);

      alert('Invalid Credentials');

    }

  };

  /* SIGNUP */

  const handleSignup = async () => {

    try {

      await axios.post(
        'http://localhost:8080/add-user',
        {
          name,
          email: signupEmail,
          password: signupPassword,
          role: signupRole,
          location
        }
      );

      alert(
        'Account Created Successfully'
      );

      setShowSignup(false);

      setName('');
      setSignupEmail('');
      setSignupPassword('');
      setLocation('');

    } catch (error) {

      console.log(error);

      alert('Signup Failed');

    }

  };

  return (

    <div className="landing-container">

      {/* BACKGROUND */}

      <div className="bg-circle circle1"></div>
      <div className="bg-circle circle2"></div>
      <div className="bg-circle circle3"></div>

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="nav-logo">
          ResQNet
        </div>

        <ul className="nav-links">

          <li>Home</li>
          <li>About</li>
          <li>Statistics</li>
          <li>Alerts</li>
          <li>Contact</li>

        </ul>

        <button
          className="nav-login-btn"
          onClick={() =>
            setShowLogin(true)
          }
        >
          Login
        </button>

      </nav>

      {/* HERO */}

      <section className="hero-section">

        <motion.h1
          className="hero-title"
          initial={{
            opacity: 0,
            y: -40
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 1
          }}
        >
          ResQNet
        </motion.h1>

        <motion.p
          className="hero-tagline"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: 0.5
          }}
        >
          “Connecting communities during
          critical moments.”
        </motion.p>

        <motion.p
          className="hero-description"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: 1
          }}
        >
          A centralized disaster
          coordination platform designed
          for real-time reporting,
          emergency response tracking,
          and seamless communication.
        </motion.p>

        <div className="hero-buttons">

          <button className="explore-btn">
            Explore Platform
          </button>

          <button
            className="signup-btn"
            onClick={() =>
              setShowSignup(true)
            }
          >
            Create Account
          </button>

        </div>

      </section>

      {/* STATS */}

      <section className="stats-section">

        <div className="stat-card">

          <FaChartLine className="stat-icon" />

          <h2>
            {stats.total || 0}
          </h2>

          <p>Total Reports</p>

        </div>

        <div className="stat-card">

          <FaAmbulance className="stat-icon" />

          <h2>
            {stats.inProgress || 0}
          </h2>

          <p>Active Emergencies</p>

        </div>

        <div className="stat-card">

          <FaBell className="stat-icon" />

          <h2>
            {stats.resolved || 0}
          </h2>

          <p>Resolved Cases</p>

        </div>

      </section>

      {/* ROLES */}

      <section className="roles-section">

        <h2 className="section-title">
          Platform Roles
        </h2>

        <div className="role-cards">

          <motion.div
            whileHover={{
              scale: 1.05
            }}
            className="role-card"
          >

            <FaUser className="role-icon" />

            <h3>Citizen</h3>

            <p>
              Report disasters and receive
              alerts instantly.
            </p>

          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05
            }}
            className="role-card"
          >

            <FaAmbulance className="role-icon" />

            <h3>Responder</h3>

            <p>
              Coordinate rescue operations
              and update status.
            </p>

          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05
            }}
            className="role-card"
          >

            <FaUserShield className="role-icon" />

            <h3>Administrator</h3>

            <p>
              Monitor disasters and manage
              workflows.
            </p>

          </motion.div>

        </div>

      </section>

      {/* LOGIN MODAL */}

      {showLogin && (

        <div className="modal-overlay">

          <motion.div
            className="auth-modal"
            initial={{
              opacity: 0,
              scale: 0.8
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
          >

            <button
              className="close-btn"
              onClick={() =>
                setShowLogin(false)
              }
            >
              ✕
            </button>

            <h2>
              Welcome Back
            </h2>

            <p className="auth-subtext">
              Login to continue to ResQNet
            </p>

            <input
              type="email"
              placeholder="Enter Email"
              className="auth-input"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Enter Password"
              className="auth-input"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              className="auth-submit-btn"
              onClick={handleLogin}
            >
              Login
            </button>

          </motion.div>

        </div>

      )}

      {/* SIGNUP MODAL */}

      {showSignup && (

        <div className="modal-overlay">

          <motion.div
            className="auth-modal"
            initial={{
              opacity: 0,
              scale: 0.8
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
          >

            <button
              className="close-btn"
              onClick={() =>
                setShowSignup(false)
              }
            >
              ✕
            </button>

            <h2>
              Create Account
            </h2>

            <input
              type="text"
              placeholder="Name"
              className="auth-input"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={signupEmail}
              onChange={(e) =>
                setSignupEmail(
                  e.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={signupPassword}
              onChange={(e) =>
                setSignupPassword(
                  e.target.value
                )
              }
            />

            <select
              className="auth-input"
              value={signupRole}
              onChange={(e) =>
                setSignupRole(
                  e.target.value
                )
              }
            >

              <option value="CITIZEN">
                Citizen
              </option>

              <option value="RESPONDER">
                Responder
              </option>

            </select>

            <input
              type="text"
              placeholder="Location"
              className="auth-input"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
            />

            <button
              className="auth-submit-btn"
              onClick={handleSignup}
            >
              Create Account
            </button>

          </motion.div>

        </div>

      )}

    </div>

  );
}

export default LandingPage;

