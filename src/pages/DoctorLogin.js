import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DoctorLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email && password) {
            try {
                const response = await axios.post(
                    `https://localhost:44345/api/Doctor/login`,
                    {
                        email: email,
                        password: password
                    },
                    {
                        headers: {
                            "Cache-Control": "no-cache",
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (response.data.success) {
                    localStorage.setItem('doctorId', response.data.doctorId);
                    navigate('/appointments', {
                        state: {
                            doctorId: response.data.doktorInfo.doktorId,
                            doctorFirstName: response.data.doktorInfo.firstName,
                            doctorLastName: response.data.doktorInfo.lastName
                        }
                    });
                } else {
                    setErrorMessage('Kullanıcı adı veya şifre yanlış.');
                }
            } catch (error) {
                console.error('Giriş yaparken bir hata oluştu:', error);
                setErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } else {
            setErrorMessage('Lütfen kullanıcı adı ve şifre girin.');
        }
    };

    return (
        <div className="main-content">
            <form onSubmit={handleSubmit}>
                <h2>Doktor Girişi</h2>
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
                <button type="submit">Giriş Yap</button>
                {errorMessage && <p>{errorMessage}</p>}
            </form>
        </div>
    );
}

export default DoctorLogin;
