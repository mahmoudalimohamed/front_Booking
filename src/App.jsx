import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import NavBar from './component/subComponent/NavBar';
import Footer from './component/subComponent/footer';
import Register from './component/Register';
import Login from './component/Login';
import Logout from './component/Logout';
import Home from './component/Home';
import Privacy from './component/Privacy';
import Contact from './component/Contact';
import About from './component/About';
import Destinations from './component/Destinations';
import TripSearch from './component/TripSearch';
import TripBooking from './component/TripBooking';
import BookingSuccess from './component/BookingSuccess';
import ProtectedRoute from './component/ProtectedRoute';
import Profile from './component/Profile';

import ForgotPassword from './component/ForgotPassword';
import ResetPassword from './component/ResetPassword';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <NavBar />
          <Routes>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/Destinations" element={<Destinations />} />
            <Route path="/trips/search" element={<TripSearch />} />
            <Route
              path="/trips/:tripId/book"
              element={<ProtectedRoute><TripBooking /></ProtectedRoute>}
            />
            <Route
              path="/booking-success"
              element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;