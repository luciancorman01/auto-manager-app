import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import Dashboard from "./Screens/Dashboard";
import MyFleet from "./Screens/MyFleet";
import VehicleDetails from "./Screens/VehicleDetails";
import Profile from "./Screens/Profile";
import Service from "./Screens/Service";
import Select from "react-select";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/fleet" element={<MyFleet />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/vehicle-details" element={<VehicleDetails />} />
      <Route path="/service" element={<Service />} />
    </Routes>

  );
}

export default App;