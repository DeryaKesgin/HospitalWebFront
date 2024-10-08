﻿import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axios';  // axios.js dosyasını import edin

function PatientLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    // E-posta doğrulama fonksiyonu
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidEmail(email)) {
            setErrorMessage('Lütfen mail adresinizi geçerli formatta girin.');
            return;
        }
        if (email && password) {
            try {
                const response = await axios.post(
                    `https://localhost:44345/api/Patient/Login`,
                    { email, password },
                    {
                        headers: {
                            "Cache-Control": "no-cache",
                            "Content-Type": "application/json"
                        }
                    }
                );

                console.log('API Yanıtı:', response.data);

                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('patientId', response.data.patientInfo.patientId);

                    navigate('/patients', {
                        state: {
                            patientId: response.data.patientInfo.patientId,
                            firstName: response.data.patientInfo.firstName,
                            lastName: response.data.patientInfo.lastName
                        }
                    });
                } else {
                    setErrorMessage('Kullanıcı adı veya şifre yanlış.');
                }
            } catch (error) {
                console.error('Giriş yaparken bir hata oluştu:', error.response ? error.response.data : error.message);
                setErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } else {
            setErrorMessage('Lütfen kullanıcı adı ve şifre girin.');
        }
    };

    return (
        <div>
            <h2>Hasta Girişi</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        placeholder="example@mail.com"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Şifre:</label>
                    <input
                        type="password"
                        value={password}
                        placeholder="********"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Giriş Yap</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default PatientLogin;
