import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login'; // Login sayfasýný içe aktar
import DoctorLogin from './pages/DoctorLogin';
import PatientLogin from './pages/PatientLogin';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ViewPatients from './pages/ViewPatients';
import ViewDoctors from './pages/ViewDoctors';
import AddPatient from './pages/AddPatient';
import AddDoctor from './pages/AddDoctor';
import NewExaminationForm from './pages/NewExaminationForm';
import EditForm from './pages/EditForm';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Login />} /> {/* Ýlk olarak Login sayfasýný göster */}
                <Route path="/login/doctor" element={<DoctorLogin />} />
                <Route path="/login/patient" element={<PatientLogin />} />
                <Route path="/login/admin" element={<AdminLogin />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/patients" element={<PatientDashboard />} />
                <Route path="/appointments" element={<DoctorDashboard />} />
                <Route path="/view-patients" element={<ViewPatients />} />
                <Route path="/view-doctors" element={<ViewDoctors />} />
                <Route path="/add-patient" element={<AddPatient />} />
                <Route path="/add-doctor" element={<AddDoctor />} />
                <Route path="/add-examination" element={<NewExaminationForm />} />
                <Route path="/edit-form" element={<EditForm />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
