import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import Dashboard from "./Screens/Dashboard";
import MyFleet from "./Screens/MyFleet";
import VehicleDetails from "./Screens/VehicleDetails";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/fleet" element={<MyFleet />} />
      <Route path="/vehicle-details" element={<VehicleDetails />} />
    </Routes>
  );
}

export default App;