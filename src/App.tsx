/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitGrievance from './pages/SubmitGrievance';
import { AnalyticsPage, HelpCenterPage, SettingsPage } from './pages/MockPages';
import { PongLoader } from './components/ui/PongLoader';

function DashboardIndex() {
  const { user, loading } = useAuth();
  if (loading) return <PongLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/dashboard/${user.role}`} replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardIndex />} />
              <Route path="student" element={<StudentDashboard />} />
              <Route path="student/submit" element={<SubmitGrievance />} />
              <Route path="staff" element={<StaffDashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="help" element={<HelpCenterPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
