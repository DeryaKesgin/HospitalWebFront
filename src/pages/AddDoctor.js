import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';


function AddDoctor() {
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
            const response = await axios.post('https://localhost:44345/api/Doctor', {
                firstName,
                lastName,
                email,
                password
            });
            if (response.status === 201 || response.status === 200) {
                setMessage('Doktor başarıyla eklendi.'); // Başarı mesajını ayarla
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            console.error('Doktor eklenirken bir hata oluştu:', error);
            setMessage('Bir hata oluştu. Lütfen tekrar deneyin.'); // Hata mesajını ayarla
        }
        console.log('Message:', message); // Mesajın değerini kontrol et
    };

    return (
        <div>
            <h2>Yeni Doktor Ekle</h2>
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
            <div>
                {message && <p className={message.includes('hata') ? 'error' : ''}>{message}</p>}
            </div>
        </div>
    );
}

export default AddDoctor;
