import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';



const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Çıkış yapma işlemleri burada yapılacak
        localStorage.removeItem('adminInfo'); // Admin bilgilerini temizle
        localStorage.removeItem('doctorInfo'); // Doktor bilgilerini temizle
        localStorage.removeItem('patientInfo'); // Hasta bilgilerini temizle
        navigate('/login'); // Giriş sayfasına yönlendir
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

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>
            {showDefaultHeader() ? (
                <>
                    <h1>Hastane Yönetim Sistemi</h1>
                    <nav>
                        <ul style={{ display: 'flex', listStyleType: 'none', margin: 0, padding: 0 }}>
                            <li style={{ margin: '0 10px' }}><Link to="/login/doctor">Doktor Girişi</Link></li>
                            <li style={{ margin: '0 10px' }}><Link to="/login/patient">Hasta Girişi</Link></li>
                            <li style={{ margin: '0 10px' }}><Link to="/login/admin">Admin Girişi</Link></li>
                        </ul>
                    </nav>
                </>
            ) : (
                <>
                    <h1>Hastane Yönetim Paneli</h1>
                    <span>{getTitle()}</span>
                    <button onClick={handleLogout}>Çıkış Yap</button>
                </>
            )}
        </header>
    );
};

export default Header;
