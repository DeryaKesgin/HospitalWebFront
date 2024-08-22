import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { FaHospital } from 'react-icons/fa'; // React Icons paketinden hastane ikonu

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Çıkış yapma işlemleri burada yapılacak
        localStorage.removeItem('adminInfo'); // Admin bilgilerini temizle
        localStorage.removeItem('doctorInfo'); // Doktor bilgilerini temizle
        localStorage.removeItem('patientInfo'); // Hasta bilgilerini temizle
        navigate('/'); // Giriş sayfasına yönlendir
    };

    const getTitle = () => {
        if (location.pathname.startsWith('/dashboard')) {
            return 'Admin Paneli'; // AdminDashboard için
        }
        if (location.pathname.startsWith('/add-doctor') || location.pathname.startsWith('/add-patient')) {
            return 'Admin Paneli'; // AddDoctor ve AddPatient için
        }
        if (location.pathname.startsWith('/patients')) {
            return 'Hasta Paneli'; // PatientDashboard için
        }
        if (location.pathname.startsWith('/appointments') || location.pathname.startsWith('/add-examination')) {
            return 'Doktor Paneli'; // DoctorDashboard ve NewExaminationForm için
        }
        return ''; // Diğer sayfalar için başlık boş
    };

    const showDefaultHeader = () => {
        return !(
            location.pathname.startsWith('/dashboard') ||
            location.pathname.startsWith('/add-doctor') ||
            location.pathname.startsWith('/add-patient') ||
            location.pathname.startsWith('/patients') ||
            location.pathname.startsWith('/appointments') ||
            location.pathname.startsWith('/add-examination')
        );
    };

    const isLoginPage = () => {
        return location.pathname === '/';
    };

    return (
        <header style={{
            alignContent: 'center',
        }}>
            {isLoginPage() ? (
                <h1 style={{ textAlign: 'center', marginLeft:'30%' }}>
                    <FaHospital size={40} color="#fff" className="hospital-icon" />
                    Hastane Yönetim Sistemi</h1>
            ) : showDefaultHeader() ? (
                <> <h1 >
                            <FaHospital size={30} color="#fff" className="hospital-icon" />
                            Hastane Yönetim Sistemi</h1>
                    <nav>
                        <ul >
                            <li style={{ margin: '0 10px' }}>
                                <Link to="/login/doctor" style={{ color: '#ffffff', textDecoration: 'none' }}>Doktor Girişi</Link>
                            </li>
                            <li style={{ margin: '0 10px' }}>
                                <Link to="/login/patient" style={{ color: '#ffffff', textDecoration: 'none' }}>Hasta Girişi</Link>
                            </li>
                            <li style={{ margin: '0 10px' }}>
                                <Link to="/login/admin" style={{ color: '#ffffff', textDecoration: 'none' }}>Admin Girişi</Link>
                            </li>
                        </ul>
                    </nav>
                </>
            ) : (
                <>
                            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>
                                <FaHospital size={30} color="#fff" className="hospital-icon" />
                                Hastane Yönetim Paneli</h1>
                    <span style={{ fontSize: '1.2rem' }}>{getTitle()}</span>
                    <button onClick={handleLogout} style={{
                       
                    }}>Çıkış Yap</button>
                </>
            )}
        </header>
    );
};

export default Header;
