import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import UserAdmin from "./pages/UserAdmin";
import TripAdmin from "./pages/TripAdmin";
import UserSingle from "./pages/UserSingle";

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
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin/users" element={<UserAdmin />} />
              <Route path="/admin/trips" element={<TripAdmin />} />
              <Route path="/admin/user" element={<UserSingle />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;