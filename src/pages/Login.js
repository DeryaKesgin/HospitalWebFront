import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaUser, FaUserShield } from 'react-icons/fa'; // İkonlar için react-icons kütüphanesini ekleyin
import './Login.css'; // Stillerin uygulanacağı CSS dosyası

function Login() {
    return (
        <div className="login-page">
           
            <div className="login-container">
                <div className="login-buttons">
                    <Link to="/login/doctor" className="login-button">
                        <FaUserMd className="login-icon" />
                        Doktor Girişi
                    </Link>
                    <Link to="/login/patient" className="login-button">
                        <FaUser className="login-icon" />
                        Hasta Girişi
                    </Link>
                    <Link to="/login/admin" className="login-button">
                        <FaUserShield className="login-icon" />
                        Admin Girişi
                    </Link>
                </div>
            </div>
            
        </div>
    );
}

export default Login;
