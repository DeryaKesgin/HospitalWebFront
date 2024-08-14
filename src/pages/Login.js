import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState(''); // 'doctor', 'patient', 'admin'
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username && password) {
            // Kullanıcı türüne göre yönlendirme yapın
            if (userType === 'doctor') {
                navigate('/appointments');
            } else if (userType === 'patient') {
                navigate('/patients');
            } else if (userType === 'admin') {
                navigate('/dashboard');
            }
        } else {
            alert('Lütfen kullanıcı adı ve şifre girin.');
        }
    };

    return (
        <div>
            <h2>Giriş Yap</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Kullanıcı Adı:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                <div>
                    <label>Kullanıcı Tipi:</label>
                    <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                    >
                        <option value="">Seçiniz</option>
                        <option value="doctor">Doktor</option>
                        <option value="patient">Hasta</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Giriş Yap</button>
            </form>
        </div>
    );
}

export default Login;
