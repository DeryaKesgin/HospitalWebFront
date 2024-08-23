import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { item, isPatient } = location.state || {};
    const [id, setId] = useState(isPatient ? item.patientId : item.doctorId);
    const [firstName, setFirstName] = useState(item?.firstName || '');
    const [lastName, setLastName] = useState(item?.lastName || '');
    const [email, setEmail] = useState(item?.email || '');
    const [password, setPassword] = useState('');
    const [existingPassword, setExistingPassword] = useState(item?.password || '');
    const [isActive, setIsActive] = useState(item?.activity !== false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!item) {
            navigate('/admin-dashboard');
        }
        console.log("Güncellenen item:", item); // selectedItem bilgilerini konsola yazdır

    }, [item, navigate]);

    useEffect(() => {
        if (!password) {
            setExistingPassword(item?.password || '');
        }
    }, [password, item?.password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const data = {
            firstName,
            lastName,
            email,
            password: password || existingPassword,
            activity: isActive
        };

        try {
            console.clear();
            console.log(data);
            const apiEndpoint = isPatient
                ? `https://localhost:44345/api/Patient/${id}`
                : `https://localhost:44345/api/Doctor/${id}`;

            const response = await axios.put(apiEndpoint, data);
            console.log(response);
            if (response.status === 200 || response.status === 204) {
                toast.success('Bilgiler başarıyla güncellendi!');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000); // 3 saniye sonra AdminDashboard sayfasına yönlendir
            }
        } catch (error) {
            console.error('Bilgi güncelleme hatası:', error);
            toast.error('Bilgi güncellenirken bir hata oluştu.');
        }
    };

    return (
        <div>
            <h2>Bilgileri Güncelle</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID:</label>
                    <input
                        type="text"
                        value={id}
                        readOnly
                    />
                </div>
                <div>
                    <label>Ad:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Soyad:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="text"
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
                        placeholder="Yeni şifre girin (isteğe bağlı)"
                    />
                </div>
                <div>
                    <label>Mevcut Şifre:</label>
                    <input
                        type="text"
                        value={existingPassword}
                        readOnly
                    />
                </div>
                <div>
                    <label>Aktiflik:</label>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                    />
                </div>
                <button type="submit">Güncelle</button>
                <button onClick={() => navigate('/dashboard')}>AdminDashboard'a Dön</button>
            </form>
            
            <ToastContainer />
        </div>
    );
}

export default EditForm;
