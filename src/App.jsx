import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import TaskDetail from './pages/TaskDetail';
import UserProfile from './pages/UserProfile';
import Navbar from './components/ui/Navbar';
import Rating from './pages/Rating';
import AdminPanel from './pages/AdminPanel';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/profile" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/task/:id" 
            element={
              <PrivateRoute>
                <TaskDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/user/:username" 
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            } 
          />
          <Route
            path="/rating"
            element={
              <Rating />
            }
          />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
