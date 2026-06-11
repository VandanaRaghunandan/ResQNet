import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import {
  FaChartBar,
  FaExclamationTriangle,
  FaUsers,
  FaBell,
  FaMapMarkedAlt,
  FaSignOutAlt
} from 'react-icons/fa';

import './AdminDashboard.css';
import {
  connectWebSocket,
  disconnectWebSocket
} from '../services/WebSocketService';
import axios from 'axios';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});


function AdminDashboard() {

  const [stats, setStats] = useState({});
  const [disasters, setDisasters] = useState([]);
  const [responders, setResponders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertTitle, setAlertTitle] =
  useState('');

const [alertMessage, setAlertMessage] =
  useState('');

const [alertLocation, setAlertLocation] =
  useState('');
const [resolvedDisasters,
  setResolvedDisasters] =
  useState([]);
const [alertSeverity, setAlertSeverity] =
  useState('MEDIUM');
const statusData = [

  {
    name: 'Reported',
    value: stats.reported || 0
  },

  {
    name: 'Assigned',
    value: stats.assigned || 0
  },

  {
    name: 'In Progress',
    value: stats.inProgress || 0
  },

  {
    name: 'Resolved',
    value: stats.resolved || 0
  }

];

const severityData = [

  {
    severity: 'LOW',
    count:
      disasters.filter(
        d => d.severity === 'LOW'
      ).length
  },

  {
    severity: 'MEDIUM',
    count:
      disasters.filter(
        d => d.severity === 'MEDIUM'
      ).length
  },

  {
    severity: 'HIGH',
    count:
      disasters.filter(
        d => d.severity === 'HIGH'
      ).length
  }

];

const COLORS = [

  '#3b82f6',
  '#eab308',
  '#f97316',
  '#22c55e'

];
  const disasterLocations = {

  Chennai: [13.0827, 80.2707],

  Mumbai: [19.0760, 72.8777],

  Delhi: [28.7041, 77.1025],

  Bangalore: [12.9716, 77.5946],

  Hyderabad: [17.3850, 78.4867]

};

  const [activeSection, setActiveSection] =
    useState('dashboard');

  const token = localStorage.getItem('token');

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

 useEffect(() => {

  fetchStats();
  fetchDisasters();
  fetchResponders();
  fetchAlerts();

  connectWebSocket(
    (newDisaster) => {

      console.log(
        'New Disaster:',
        newDisaster
      );

      setDisasters(
        (prev) => [
          ...prev,
          newDisaster
        ]
      );

      fetchStats();

    }
  );

  return () => {

    disconnectWebSocket();

  };

}, []);

  const fetchStats = async () => {

    try {

      const response = await axios.get(
        'http://localhost:8080/disasters/stats',
        authConfig
      );

      setStats(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const fetchDisasters = async () => {

    try {

      const response = await axios.get(
        'http://localhost:8080/disasters',
        authConfig
      );

      setDisasters(response.data);

    } catch (error) {

      console.log(error);

    }

  };


  const fetchResponders = async () => {

    try {

      const response = await axios.get(
        'http://localhost:8080/users',
        authConfig
      );

      const responderUsers =
        response.data.filter(
          (user) => user.role === 'RESPONDER'
        );

      setResponders(responderUsers);

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
  const fetchResolvedDisasters = async () => {

  try {

    const response = await axios.get(
      'http://localhost:8080/disasters/resolved',
      authConfig
    );

    console.log(
      'Resolved Disasters:',
      response.data
    );

    setResolvedDisasters(
      response.data
    );

  } catch (error) {

    console.log(error);

  }

};

const createAlert = async () => {

  try {

    await axios.post(
      'http://localhost:8080/alerts',
      {
        title: alertTitle,
        message: alertMessage,
        location: alertLocation,
        severity: alertSeverity
      },
      authConfig
    );

    alert('Alert Sent Successfully');

    setAlertTitle('');
    setAlertMessage('');
    setAlertLocation('');
    setAlertSeverity('MEDIUM');

    fetchAlerts();

  } catch (error) {

    console.log(error);

    alert('Failed To Create Alert');

  }

};



  const assignResponder = async (
    disasterId,
    responderEmail
  ) => {

    try {

      await axios.put(
        `http://localhost:8080/disasters/${disasterId}/assign`,
        {
          assignedResponder:
            responderEmail
        },
        authConfig
      );

      alert('Responder Assigned');

      fetchDisasters();

    } catch (error) {

      console.log(error);

      alert('Assignment Failed');

    }

  };

  const logout = () => {

    localStorage.clear();

    window.location.href = '/';

  };

  return (

    <div className="admin-container">

      {/* SIDEBAR */}

      <div className="sidebar">

        <h2 className="sidebar-logo">
          ResQNet
        </h2>

        <ul className="sidebar-menu">

          <li
            className={
              activeSection === 'dashboard'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveSection('dashboard')
            }
          >
            <FaChartBar />
            Dashboard
          </li>

          <li
            className={
              activeSection === 'disasters'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveSection('disasters')
            }
          >
            <FaExclamationTriangle />
            Disasters
          </li>

          <li
            className={
              activeSection === 'responders'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveSection('responders')
            }
          >
            <FaUsers />
            Responders
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
          <li
  className={
    activeSection === 'completed'
      ? 'active'
      : ''
  }
  onClick={() =>
    setActiveSection(
      'completed'
    )
  }
>
  ✅ Completed
</li>

          <li
            className={
              activeSection === 'map'
                ? 'active'
                : ''
            }
            onClick={() =>
              setActiveSection('map')
            }
          >
            <FaMapMarkedAlt />
            Map
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
            Admin Dashboard
          </h1>

          <div className="admin-profile">
            👑 Administrator
          </div>

        </div>

        {/* DASHBOARD */}

        {activeSection === 'dashboard' && (

          <>

            <div className="stats-grid">

              <div className="dashboard-card">

                <h2>{stats.total || 0}</h2>

                <p>Total Disasters</p>

              </div>

              <div className="dashboard-card">

                <h2>{stats.inProgress || 0}</h2>

                <p>Active Emergencies</p>

              </div>

              <div className="dashboard-card">

                <h2>{stats.resolved || 0}</h2>

                <p>Resolved Cases</p>

              </div>

              <div className="dashboard-card">

                <h2>{responders.length}</h2>

                <p>Responders Active</p>

              </div>

            </div>

            <div className="map-section">
<div className="analytics-container">

  <div className="chart-card">

    <h3>
      Status Distribution
    </h3>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <PieChart>

        <Pie
          data={statusData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >

          {statusData.map(
            (entry, index) => (

              <Cell
                key={index}
                fill={
                  COLORS[index]
                }
              />

            )
          )}

        </Pie>

        <Tooltip />

        <Legend />

      </PieChart>

    </ResponsiveContainer>

  </div>

  <div className="chart-card">

    <h3>
      Severity Analysis
    </h3>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <BarChart
        data={severityData}
      >

        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="severity"
        />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="count"
          fill="#38bdf8"
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

</div>
              <h2>
                🌍 Operations Overview
              </h2>

              <div className="map-placeholder">

                Interactive Disaster
                Monitoring Ready 🔥

              </div>

            </div>

          </>

        )}

        {/* DISASTERS */}

        {activeSection === 'disasters' && (

          <div className="section-container">

            <h2>
              🚨 Reported Disasters
            </h2>

            <div className="disaster-list">

              {disasters.map((disaster) => (

                <div
                  key={disaster.id}
                  className="dashboard-card"
                >

                  <h3>
                    {disaster.type}
                  </h3>

                  <p>
                    {disaster.description}
                  </p>

                  <p>
                    📍 {disaster.location}
                  </p>

                  <p>
                    ⚠ Severity:
                    {' '}
                    {disaster.severity}
                  </p>

                  <p>
                    📌 Status:
                    {' '}
                    {disaster.status}
                  </p>

                 <p>
  🚑 Assigned:
  {' '}
  {disaster.assignedTo || 'None'}
</p>

                  <select
                    className="assign-select"
                    onChange={(e) =>
                      assignResponder(
                        disaster.id,
                        e.target.value
                      )
                    }
                  >

                    <option>
                      Assign Responder
                    </option>

                    {responders.map((responder) => (

                      <option
                        key={responder.id}
                        value={responder.email}
                      >
                        {responder.email}
                      </option>

                    ))}

                  </select>

                </div>

              ))}

            </div>

          </div>

        )}

        {/* RESPONDERS */}

        {activeSection === 'responders' && (

          <div className="section-container">

            <h2>
              🚑 Responder Management
            </h2>

            <div className="disaster-list">

              {responders.map((responder) => (

                <div
                  key={responder.id}
                  className="dashboard-card"
                >

                  <h3>
                    {responder.name}
                  </h3>

                  <p>
                    📧 {responder.email}
                  </p>

                  <p>
                    📍 {responder.location}
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

<div className="dashboard-card">

  <h3>
    Create Alert
  </h3>

  <input
    className="assign-select"
    placeholder="Alert Title"
    value={alertTitle}
    onChange={(e) =>
      setAlertTitle(
        e.target.value
      )
    }
  />

  <textarea
    className="assign-select"
    placeholder="Alert Message"
    value={alertMessage}
    onChange={(e) =>
      setAlertMessage(
        e.target.value
      )
    }
    rows="4"
  />

  <input
    className="assign-select"
    placeholder="Location"
    value={alertLocation}
    onChange={(e) =>
      setAlertLocation(
        e.target.value
      )
    }
  />

  <select
    className="assign-select"
    value={alertSeverity}
    onChange={(e) =>
      setAlertSeverity(
        e.target.value
      )
    }
  >

    <option value="LOW">
      LOW
    </option>

    <option value="MEDIUM">
      MEDIUM
    </option>

    <option value="HIGH">
      HIGH
    </option>

  </select>

  <button
    className="resolve-btn"
    onClick={createAlert}
  >
    Send Alert
  </button>

</div>

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

<p>
  ⚠ {alert.severity}
</p>

</div>

))}

</div>

</div>

)}


{activeSection === 'completed' && (

<div className="section-container">

<h2>
  ✅ Completed Incidents
</h2>

<div className="disaster-list">

{resolvedDisasters.map(
(disaster) => {

console.log(disaster);
return(
<div
key={disaster.id}
className="dashboard-card"
>

<h3>
  {disaster.type}
</h3>

<p>
  {disaster.description}
</p>

<p>
  📍 {disaster.location}
</p>

<p>
  📝
  {
    disaster.resolutionNotes
  }
</p>

<p>
  🕒
  {
    
  disaster.resolvedAt
    ? new Date(
        disaster.resolvedAt
      ).toLocaleString()
    : 'Not Available'

  }
</p>

<p>
  📌
  {
    disaster.status
  }
</p>

{disaster.proofImage && (

<img
src={
`http://localhost:8080/uploads/${disaster.proofImage}`
}
alt="Proof"
style={{
width:'100%',
marginTop:'10px',
borderRadius:'12px'
}}
/>

)}

</div>
);
})}

</div>

</div>

)}


        {/* MAP */}

       {activeSection === 'map' && (

<div className="map-section">

<h2>
  🗺️ Live Disaster Map
</h2>

<MapContainer
  center={[20.5937, 78.9629]}
  zoom={5}
  style={{
    height: '600px',
    width: '100%',
    borderRadius: '20px'
  }}
>

  <TileLayer
    attribution='&copy; OpenStreetMap'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  {disasters.map((disaster) => {

    const coords =
      disasterLocations[
        disaster.location
      ];

    if (!coords) return null;

    return (

      <Marker
        key={disaster.id}
        position={coords}
      >

        <Popup>

          <h3>
            {disaster.type}
          </h3>

          <p>
            {disaster.description}
          </p>

          <p>
            Severity:
            {' '}
            {disaster.severity}
          </p>

          <p>
            Status:
            {' '}
            {disaster.status}
          </p>

        </Popup>

      </Marker>

    );

  })}

</MapContainer>

</div>

)}

      </div>

    </div>

  );
}

export default AdminDashboard;

