import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WhyChoose from "./components/WhyChoose";
import About from "./components/About";
import Footer from "./components/Footer";
import Professions from "./components/Professions";
import NurseApplyModal from "./components/NurseApplyModal";
import DoctorApplyModal from "./components/DoctorApplyModal";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NurseAppointment from "./pages/NurseAppointment";
import DoctorAppointment from "./pages/DoctorAppointment";
import "./App.css";
import DoctorsList from "./pages/DoctorsList";
import NursesList from "./pages/NursesList";
import HospitalsList from "./pages/HospitalsList";
function App() {
  const [isNurseApplyModalOpen, setIsNurseApplyModalOpen] = useState(false);
  const [isDoctorApplyModalOpen, setIsDoctorApplyModalOpen] = useState(false);

  const handleApplyNurseClick = () => setIsNurseApplyModalOpen(true);
  const handleApplyDoctorClick = () => setIsDoctorApplyModalOpen(true);

  return (
    <BrowserRouter>
      <div className="App">
        <AppContent
          onApplyNurseClick={handleApplyNurseClick}
          onApplyDoctorClick={handleApplyDoctorClick}
        />

        {/* Modals */}
        <NurseApplyModal
          isOpen={isNurseApplyModalOpen}
          onClose={() => setIsNurseApplyModalOpen(false)}
        />

        <DoctorApplyModal
          isOpen={isDoctorApplyModalOpen}
          onClose={() => setIsDoctorApplyModalOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

function AppContent({ onApplyNurseClick, onApplyDoctorClick }) {
  const navigate = useNavigate();

  const handleAppointmentClick = () => {
    navigate("/appointment");
  };

  const handleNurseAppointmentClick = () => {
    navigate("/nurse-appointment");
  };

  return (
    <>
      <Header
        onAppointmentClick={handleAppointmentClick}
        onNurseAppointmentClick={handleNurseAppointmentClick}
        onApplyNurseClick={onApplyNurseClick}
        onApplyDoctorClick={onApplyDoctorClick}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero
                onAppointmentClick={handleAppointmentClick}
                onNurseAppointmentClick={handleNurseAppointmentClick}
              />

              <DoctorsList />
              <NursesList />
              <HospitalsList />
              <WhyChoose />
              <About />
              <Professions />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/appointment" element={<DoctorAppointment />} />
        <Route path="/nurse-appointment" element={<NurseAppointment />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
