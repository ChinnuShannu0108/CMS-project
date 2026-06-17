import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
  path="/create-post"
  element={
    <PrivateRoute>
      <CreatePost />
    </PrivateRoute>
  }
/>
<Route
  path="/edit-post/:id"
  element={
    <PrivateRoute>
      <EditPost />
    </PrivateRoute>
  }
/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;