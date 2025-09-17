import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './Components/LoginPage/LoginPage';
import SignupPage from './Components/SignupPage/SignupPage';
import SettingsPage from './Components/SettingsPage/SettingsPage.jsx';
import LoginLinkPage from './Components/LoginPage/LoginLinkPage.jsx';
import AccountPage from './Components/SettingsPage/AccountPage.jsx';
import PatientsPage from './Components/Dashboard/PatientsPage.jsx';
import AppointmentsPage from './Components/Dashboard/AppointmentsPage.jsx';
import OverviewPage from './Components/Dashboard/OverviewPage.jsx';
import HomePage from './Components/HomePage/HomePage.jsx';
import PatientDashboardSideBar from './Components/PatientDashboard/PatientDashboardSideBar.jsx';
import PatientOverview from './Components/PatientDashboard/PatientOverview.jsx';
import PatientAppointments from './Components/PatientDashboard/PatientAppointments.jsx';
import PatientHealth from './Components/PatientDashboard/PatientHealth.jsx';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const showPatientSidebar = location.pathname.startsWith('/patient');

  return (
    <>
      {showPatientSidebar && <PatientDashboardSideBar isOpen={isOpen} setIsOpen={setIsOpen} />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/magicLink" element={<LoginLinkPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/doc-patients" element={<PatientsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/patient-overview" element={<PatientOverview isOpen={isOpen} />} />
        <Route path="/patient-appointments" element={<PatientAppointments isOpen={isOpen} />} />
        <Route path="/patient-health" element={<PatientHealth isOpen={isOpen} />} />
      </Routes>
    </>
  );
};

export default App;
