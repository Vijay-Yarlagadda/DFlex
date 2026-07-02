import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { AppProvider } from './lib/store';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { WaveBackground } from './components/layout/WaveBackground';
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
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#CCFF00',
          colorBackground: '#09090B',
          colorInputBackground: '#18181B',
          colorInputText: '#FAFAFA',
          colorText: '#FAFAFA',
          colorTextOnPrimaryBackground: '#000000',
          borderRadius: '0.25rem',
          fontFamily: '"Inter", system-ui, sans-serif'
        },
        elements: {
          card: "border border-zinc-800 shadow-2xl bg-zinc-950",
          formButtonPrimary: "font-black tracking-widest uppercase hover:opacity-90 transition-opacity",
          socialButtonsBlockButton: "border-zinc-800 hover:bg-zinc-900 transition-colors",
          headerTitle: "font-black tracking-tighter uppercase text-2xl",
          headerSubtitle: "text-zinc-400 font-medium"
        }
      }}
    >
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/assessment" element={<AssessmentWizard />} />
            <Route path="/generating" element={<AILoadingScreen />} />
            
            <Route path="/sign-in/*" element={
              <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden">
                <WaveBackground />
                <div className="relative z-10 w-full max-w-md p-4">
                  <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
                </div>
              </div>
            } />
            <Route path="/sign-up/*" element={
              <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden">
                <WaveBackground />
                <div className="relative z-10 w-full max-w-md p-4">
                  <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/onboarding" />
                </div>
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
              <Route path="/onboarding" element={<Onboarding />} />
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
