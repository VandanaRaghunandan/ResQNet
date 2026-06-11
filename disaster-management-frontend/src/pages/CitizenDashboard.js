
import React, { useEffect, useState } from 'react';

import {
  FaHome,
  FaExclamationTriangle,
  FaBell,
  FaSignOutAlt
} from 'react-icons/fa';

import './CitizenDashboard.css';

import axios from 'axios';

function CitizenDashboard() {

  const [activeSection, setActiveSection] =
    useState('report');

  const [myReports, setMyReports] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [type, setType] =
  useState('');
  const [description, setDescription] =
    useState('');

  const [location, setLocation] =
    useState('');

  const [severity, setSeverity] =
    useState('LOW');

  const token = localStorage.getItem('token');

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {

    fetchReports();
    fetchAlerts();

  }, []);

  const fetchReports = async () => {

    try {

      const response = await axios.get(
        'http://localhost:8080/disasters',
        authConfig
      );

      setMyReports(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const fetchAlerts = async () => {

    try {

      const response = await axios.get(
        'http://localhost:8080/alerts',
        authConfig
      );

      setAlerts(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const handleReport = async () => {

    try {

      await axios.post(
  'http://localhost:8080/disasters',
  {
  
  type,
  description,
  location,
  severity

  },
  authConfig
);

      alert('Disaster Reported Successfully');

      setType('');
      setDescription('');
      setLocation('');
      setSeverity('LOW');

      fetchReports();

    } catch (error) {

      console.log(error);

      alert('Failed To Report Disaster');

    }

  };

  const logout = () => {

    localStorage.clear();

    window.location.href = '/';

  };

  return (

    <div className="citizen-container">

      {/* SIDEBAR */}

      <div className="sidebar">

        <h2 className="sidebar-logo">
          ResQNet
        </h2>

        <ul className="sidebar-menu">

          <li
            className={
              activeSection === 'report'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveSection('report')
            }
          >
            <FaExclamationTriangle />
            Report Disaster
          </li>

          <li
            className={
              activeSection === 'reports'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveSection('reports')
            }
          >
            <FaHome />
            My Reports
          </li>

          <li
            className={
              activeSection === 'alerts'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveSection('alerts')
            }
          >
            <FaBell />
            Alerts
          </li>

          <li onClick={logout}>
            <FaSignOutAlt />
            Logout
          </li>

        </ul>

      </div>

      {/* MAIN */}

      <div className="main-content">

        <div className="topbar">

          <h1>
            Citizen Dashboard
          </h1>

          <div className="admin-profile">
            👤 Citizen
          </div>

        </div>

        {/* REPORT SECTION */}

        {activeSection === 'report' && (

          <div className="section-container">

            <h2>
              🚨 Report Disaster
            </h2>

            <div className="form-container">

              <input
                type="text"
                placeholder="Disaster Title"
                className="auth-input"
               value={type}
onChange={(e) =>
  setType(e.target.value)

                }
              />

              <textarea
                placeholder="Description"
                className="auth-input textarea"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Location"
                className="auth-input"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
              />

              <select
                className="auth-input"
                value={severity}
                onChange={(e) =>
                  setSeverity(e.target.value)
                }
              >

                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

              </select>

              <button
                className="submit-btn"
                onClick={handleReport}
              >
                Submit Report
              </button>

            </div>

          </div>

        )}

        {/* MY REPORTS */}

        {activeSection === 'reports' && (

          <div className="section-container">

            <h2>
              📋 My Reports
            </h2>

            <div className="disaster-list">

              {myReports.map((report) => (

                <div
                  key={report.id}
                  className="dashboard-card"
                >

                <h3>
  {report.type}
</h3>

                  <p>
                    {report.description}
                  </p>

                  <p>
                    📍 {report.location}
                  </p>

                  <p>
                    ⚠ Severity:
                    {' '}
                    {report.severity}
                  </p>

                  <p>
                    📌 Status:
                    {' '}
                    {report.status}
                  </p>

                </div>

              ))}

            </div>

          </div>

        )}

        {/* ALERTS */}

        {activeSection === 'alerts' && (

          <div className="section-container">

            <h2>
              🚨 Emergency Alerts
            </h2>

            <div className="disaster-list">

              {alerts.map((alert) => (

                <div
                  key={alert.id}
                  className="dashboard-card"
                >

                  <h3>
                    {alert.title}
                  </h3>

                  <p>
                    {alert.message}
                  </p>

                  <p>
                    📍 {alert.location}
                  </p>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default CitizenDashboard;

