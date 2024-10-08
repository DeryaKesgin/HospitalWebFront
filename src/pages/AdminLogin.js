﻿import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email && password) {
            try {
                const response = await axios.post(
                    'https://localhost:44345/api/Admin/Login',
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

                console.log('API Yanıtı:', response.data); // API yanıtını kontrol edin

                if (response.data.token) {
                    const adminInfo = response.data.adminInfo;
                    console.log('Admin Bilgileri:', adminInfo); // adminInfo'nun içeriğini kontrol edin
                    localStorage.setItem('adminId', adminInfo ? adminInfo.AdminId : ''); // adminInfo'nun varlığını kontrol edin
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('adminInfo', JSON.stringify(adminInfo));

                    navigate('/dashboard', { state: { adminInfo } });
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
            <h2>Admin Girişi</h2>
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
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Giriş Yap</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default AdminLogin;
