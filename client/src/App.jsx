import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Screens/LogIn";
import Register from "./Screens/Register";
import Dashboard from "./Screens/Dashboard";
import MyFleet from "./Screens/MyFleet";
import VehicleDetails from "./Screens/VehicleDetails";
import Profile from "./Screens/Profile";
import Service from "./Screens/Service";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fleet"
        element={
          <ProtectedRoute>
            <MyFleet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicle-details"
        element={
          <ProtectedRoute>
            <VehicleDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicle-details/:id"
        element={
          <ProtectedRoute>
            <VehicleDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service"
        element={
          <ProtectedRoute>
            <Service />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
