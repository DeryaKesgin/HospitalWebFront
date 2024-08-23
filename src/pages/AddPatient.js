import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';


//denemememmeme
function AddPatient() {
    const location = useLocation();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // Mesaj durumu
    const navigate = useNavigate();
    const [adminInfo, setAdminInfo] = useState(location.state?.adminInfo || JSON.parse(localStorage.getItem('adminInfo')));

    useEffect(() => {
        if (!adminInfo) {
            navigate('/login/admin'); // Admin girişi yapılmamışsa login sayfasına yönlendir
        }
    }, [adminInfo, navigate]);


    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:44345/api/Patient', {
                firstName,
                lastName,
                email,
                password
            });
            if (response.status === 201 || response.status===200) {
                setMessage('Hasta başarıyla eklendi.'); // Başarı mesajını ayarla
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            console.error('Hasta eklenirken bir hata oluştu:', error);
            setMessage('Bir hata oluştu. Lütfen tekrar deneyin.'); // Hata mesajını ayarla
        }
    };

    return (
        <div>
            <h2>Yeni Hasta Ekle</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>İsim:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Soyisim:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Şifre:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Ekle</button>
                <div>
                    <br />
                    <button onClick={handleBackToDashboard}>Admin Dashboard'a Geri Dön</button>
                </div>
            </form>
            {message && <p>{message}</p>} {/* Mesajı ekranda göster */}
        </div>
    );
}

export default AddPatient;
