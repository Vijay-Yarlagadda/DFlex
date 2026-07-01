import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './lib/store';
import { Landing } from './pages/Landing';
import { AssessmentWizard } from './pages/AssessmentWizard';
import { AILoadingScreen } from './pages/AILoadingScreen';
import { Dashboard } from './pages/Dashboard';
import { DietPage } from './pages/DietPage';
import { Progress } from './pages/Progress';
import { WaterTracker } from './pages/WaterTracker';
import { Profile } from './pages/Profile';
import { Layout } from './components/Layout';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/assessment" element={<AssessmentWizard />} />
          <Route path="/generating" element={<AILoadingScreen />} />
          
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/diet" element={<DietPage />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/water" element={<WaterTracker />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
