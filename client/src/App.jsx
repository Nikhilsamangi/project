
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout'; // Import the Layout component
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import DataEntry from './pages/DataEntry';
import ExportImport from './pages/ExportImport';
import UsersList from './pages/UsersList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/data-entry"
              element={
                <ProtectedRoute>
                  <DataEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/export-import"
              element={
                <ProtectedRoute>
                  <ExportImport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                <UsersList/>
                </ProtectedRoute>
              }
            />
            
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
