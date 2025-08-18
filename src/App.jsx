import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyTrips from "./pages/MyTrips";
import MyRequests from "./pages/MyRequests";
import TripDetails from "./pages/TripDetails";
import CreateTrip from "./pages/CreateTrip";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: "flex" }}>
          <Sidebar />
          <div style={{ padding: "2rem", flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-trips" element={<MyTrips />} />
              <Route path="/my-requests" element={<MyRequests />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/trip/:id" element={<TripDetails />} />
              <Route path="/create-trip" element={<CreateTrip />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;