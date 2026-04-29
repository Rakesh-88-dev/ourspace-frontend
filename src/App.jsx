import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Timeline from "./pages/Timeline";
import Profile from "./pages/Profile"
import Chat from "./pages/Chat";
import SpecialDatesPage from "./pages/SpecialDatesPage";
import Welcome from "./pages/Welcome";
import Wishlist from "./pages/Wishlist";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/chat" element={<Chat />} />
        <Route path="/special-dates" element={<SpecialDatesPage />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </BrowserRouter>

    
  );
}