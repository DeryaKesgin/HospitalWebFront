import React from 'react';
import './Footer.css'; // Footer stil dosyasını import edin
import { FaHeartbeat, FaHospital, FaStethoscope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <FaHeartbeat className="footer-icon" />
                    <p>Hızlı ve güvenilir hasta hizmetleri.</p>
                </div>
                <div className="footer-section">
                    <FaHospital className="footer-icon" />
                    <p>Modern ve donanımlı hastane altyapısı.</p>
                </div>
                <div className="footer-section">
                    <FaStethoscope className="footer-icon" />
                    <p>Uzman doktorlar ile güvenli sağlık hizmeti.</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Hastane Otomasyon Sistemi. Tüm Hakları Saklıdır.</p>
            </div>
        </footer>
    );
}

export default Footer;
