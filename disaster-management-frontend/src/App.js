import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import LandingPage from './pages/LandingPage';

import AdminDashboard from './pages/AdminDashboard';

import CitizenDashboard from './pages/CitizenDashboard';

import ResponderDashboard from './pages/ResponderDashboard';

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/citizen"
          element={<CitizenDashboard />}
        />

        <Route
          path="/responder"
          element={<ResponderDashboard />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;