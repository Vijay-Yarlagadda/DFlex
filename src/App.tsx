import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './lib/store';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { AssessmentWizard } from './pages/AssessmentWizard';
import { AILoadingScreen } from './pages/AILoadingScreen';
import { Dashboard } from './pages/Dashboard';
import { DietPage } from './pages/DietPage';
import { Progress } from './pages/Progress';
import { WaterTracker } from './pages/WaterTracker';
import { Profile } from './pages/Profile';
import { Layout } from './components/Layout';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Protected Route Component
const ProtectedRoute = () => {
  const { token, loading } = useAuthContext();
  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-[#CCFF00]">Loading...</div>;
  }
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* Public Auth Routes */}
            <Route path="/sign-in" element={<Login />} />
            <Route path="/sign-up" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/assessment" element={<AssessmentWizard />} />
              <Route path="/generating" element={<AILoadingScreen />} />
              <Route element={<Layout />}>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/diet" element={<DietPage />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/water" element={<WaterTracker />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="bottom-right" toastOptions={{
            style: { background: '#18181B', color: '#fff', border: '1px solid #27272A' },
            success: { iconTheme: { primary: '#CCFF00', secondary: '#000' } },
            error: { iconTheme: { primary: '#FF3366', secondary: '#fff' } },
          }} />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
