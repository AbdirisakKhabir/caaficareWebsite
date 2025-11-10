import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyChoose from './components/WhyChoose';
import About from './components/About';
import Footer from './components/Footer';
import AppointmentModal from './components/AppointmentModal';
import NurseAppointmentModal from './components/NurseAppointmentModal';
import NurseApplyModal from './components/NurseApplyModal';
import './App.css';
import Appointment from './pages/Appointment';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isNurseAppointmentModalOpen, setIsNurseAppointmentModalOpen] = useState(false);
  const [isNurseApplyModalOpen, setIsNurseApplyModalOpen] = useState(false);

  const handleAppointmentClick = () => {
    setIsAppointmentModalOpen(true);
  };

  const handleNurseAppointmentClick = () => {
    setIsNurseAppointmentModalOpen(true);
  };

  const handleApplyClick = () => {
    setIsNurseApplyModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAppointmentModalOpen(false);
  };

  const handleCloseNurseModal = () => {
    setIsNurseAppointmentModalOpen(false);
  };

  const handleCloseApplyModal = () => {
    setIsNurseApplyModalOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Header 
          onAppointmentClick={handleAppointmentClick} 
          onNurseAppointmentClick={handleNurseAppointmentClick}
          onApplyClick={handleApplyClick}
        />
        <Routes>
          <Route 
            path="/" 
            element={(
              <>
                <Hero />
                <WhyChoose />
                <About />
              </>
            )}
          />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer />
        <AppointmentModal 
          isOpen={isAppointmentModalOpen} 
          onClose={handleCloseModal} 
        />
        <NurseAppointmentModal 
          isOpen={isNurseAppointmentModalOpen} 
          onClose={handleCloseNurseModal} 
        />
        <NurseApplyModal 
          isOpen={isNurseApplyModalOpen} 
          onClose={handleCloseApplyModal} 
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
