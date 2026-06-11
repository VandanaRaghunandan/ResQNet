
import React, {
  useEffect,
  useState
} from 'react';

import {
  FaTasks,
  FaBell,
  FaSignOutAlt,
  FaCheckCircle
} from 'react-icons/fa';

import './ResponderDashboard.css';

import axios from 'axios';

function ResponderDashboard() {

  const [activeSection, setActiveSection] =
    useState('incidents');

  const [incidents, setIncidents] =
    useState([]);

  const [alerts, setAlerts] =
    useState([]);
    const [selectedFile, setSelectedFile] =
  useState(null);

const [resolutionNotes, setResolutionNotes] =
  useState('');

  const token =
    localStorage.getItem('token');

  const loggedInResponder =
    localStorage.getItem('username');

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {

    fetchIncidents();
    fetchAlerts();

  }, []);

  const fetchIncidents = async () => {

    try {

      const response = await axios.get(
        'http://localhost:8080/disasters',
        authConfig
      );

      const filteredIncidents =
        response.data.filter(
          (incident) =>
            incident.assignedTo &&
            incident.assignedTo
              .toLowerCase()
              .trim() ===
            loggedInResponder
              ?.toLowerCase()
              .trim() &&
            incident.status !== 'RESOLVED'
        );

      setIncidents(filteredIncidents);

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

  const updateStatus = async (
    id,
    newStatus
  ) => {

    try {

      await axios.put(
        `http://localhost:8080/disasters/${id}/status?newStatus=${newStatus}`,
        {},
        authConfig
      );

      alert('Incident Updated');

      fetchIncidents();

    } catch (error) {

      console.log(error);

      alert('Failed To Update');

    }

  };
 
const resolveIncident = async (
  incidentId
) => {

  if (!selectedFile) {

    alert(
      'Please Select Proof Image'
    );

    return;

  }

  try {

    const formData =
      new FormData();

    formData.append(
      'file',
      selectedFile
    );

    formData.append(
      'notes',
      resolutionNotes
    );

    await axios.put(
      `http://localhost:8080/disasters/${incidentId}/resolve`,
      formData,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
          'Content-Type':
            'multipart/form-data'
        }
      }
    );

    alert(
      'Incident Resolved'
    );

    setSelectedFile(null);

    setResolutionNotes('');

    fetchIncidents();

  } catch (error) {

    console.log(error);

    alert(
      'Resolution Failed'
    );

  }

};



  const logout = () => {

    localStorage.clear();

    window.location.href = '/';

  };

  return (

    <div className="responder-container">

      <div className="sidebar">

        <h2 className="sidebar-logo">
          ResQNet
        </h2>

        <ul className="sidebar-menu">

          <li
            className={
              activeSection === 'incidents'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveSection('incidents')
            }
          >
            <FaTasks />
            Assigned Incidents
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

      <div className="main-content">

        <div className="topbar">

          <h1>
            Responder Dashboard
          </h1>

          <div className="admin-profile">
            🚑 Responder
          </div>

        </div>

        {activeSection === 'incidents' && (

          <div className="section-container">

            <h2>
              🚨 Assigned Incidents
            </h2>

            <div className="incident-list">

              {incidents.length === 0 && (

                <div className="dashboard-card">

                  <h3>
                    No Assigned Incidents
                  </h3>

                  <p>
                    Waiting for admin assignments.
                  </p>

                </div>

              )}

              {incidents.map((incident) => (

                <div
                  key={incident.id}
                  className="dashboard-card"
                >

                  <h3>
                    {incident.type}
                  </h3>

                  <p>
                    {incident.description}
                  </p>

                  <p>
                    📍 {incident.location}
                  </p>

                  <p>
                    ⚠ Severity:
                    {' '}
                    {incident.severity}
                  </p>

                  <p>
                    📌 Status:
                    {' '}
                    {incident.status}
                  </p>

                  <div className="button-group">

                    <button
                      className="resolve-btn"
                      onClick={() =>
                        updateStatus(
                          incident.id,
                          'IN_PROGRESS'
                        )
                      }
                    >
                      In Progress
                    </button>

                
<input
  type="file"
  onChange={(e) =>
    setSelectedFile(
      e.target.files[0]
    )
  }
/>

<textarea
  placeholder="Resolution Notes"
  value={resolutionNotes}
  onChange={(e) =>
    setResolutionNotes(
      e.target.value
    )
  }
/>

<button
  className="resolve-btn"
  onClick={() =>
    resolveIncident(
      incident.id
    )
  }
>
  <FaCheckCircle />
  Resolve
</button>



                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

        {activeSection === 'alerts' && (

          <div className="section-container">

            <h2>
              🚨 Emergency Alerts
            </h2>

            <div className="incident-list">

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

export default ResponderDashboard;

