import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import CardPage from './pages/CardPage';
import OnboardingPage from './pages/OnboardingPage';
import Navbar from './components/Navbar'; 
import Home from './pages/Home';
import My from './pages/My';
import React, { useState } from 'react';

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname === '/home' || location.pathname === '/my';
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  return (
 
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
    
      <div style={{ 
        flex: 1, 
        width: 440, 
        display: 'flex', 
        justifyContent: 'center'
      }}>
        <Routes>
          <Route path="/" element={<CardPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/home" element={<Home setBottomSheetOpen={setIsBottomSheetOpen} />} />
          <Route path="/my" element={<My />} />
        </Routes>
      </div>
      
    
      {showNavbar && !isBottomSheetOpen && (
        <Navbar />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
