import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';
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

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/assessment" element={<AssessmentWizard />} />
            <Route path="/generating" element={<AILoadingScreen />} />
            
            <Route path="/sign-in/*" element={
              <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
                <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
              </div>
            } />
            <Route path="/sign-up/*" element={
              <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
                <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/assessment" />
              </div>
            } />
            
            <Route element={
              <>
                <SignedIn>
                  <Layout />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            }>
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
    </ClerkProvider>
  );
}

export default App;
