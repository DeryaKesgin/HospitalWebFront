import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css'; // CSS dosyasını import edin




function AdminDashboard() {
    const location = useLocation();
    const navigate = useNavigate();

    // JSON.parse hatalarını ele almak için yardımcı bir fonksiyon
    const getStoredData = (key, defaultValue) => {
        const item = localStorage.getItem(key);
        if (item) {
            try {
                return JSON.parse(item);
            } catch (e) {
                console.error(`Error parsing JSON for ${key}:`, e);
                return defaultValue;
            }
        }
        return defaultValue;
    };

    // Admin bilgilerini location'dan veya localStorage'dan al
    const [adminInfo, setAdminInfo] = useState(location.state?.adminInfo || getStoredData('adminInfo', null));
    const [selectedOperation, setSelectedOperation] = useState('patient');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [noDataMessage, setNoDataMessage] = useState('');

    useEffect(() => {
        if (!adminInfo) {
            navigate('/login/admin'); // Admin girişi yapılmamışsa login sayfasına yönlendir
        } else {
            // Admin bilgilerini localStorage'a kaydet
            localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
        }
    }, [adminInfo, navigate]);

    const handleOperationChange = (operation) => {
        setSelectedOperation(operation);
        setFirstName('');
        setLastName('');
        setSearchResults([]);
        setErrorMessage('');
        setNoDataMessage('');
    };

    const handleSearch = async () => {
        setErrorMessage('');
        setNoDataMessage('');
        const apiEndpoint = selectedOperation === 'patient' ? 'https://localhost:44345/api/Hasta/WithFilter' : 'https://localhost:44345/api/Doctor/WithFilter';

        try {
            setSearchResults([]);

            const response = await axios.get(apiEndpoint, {
                params: {
                    firstname: firstName || undefined,
                    lastname: lastName || undefined
                }
            });

            console.log('API Response:', response.data); // API'den dönen veriyi kontrol etmek için konsola yazdırın
            if (response.data.length === 0) {
                setNoDataMessage('Veri bulunamadı.');
            } else {
                setSearchResults(response.data);
            }
        } catch (error) {
            console.error('Veri çekme hatası:', error);
            setErrorMessage('Veri çekme hatası. Lütfen tekrar deneyin.');
        }
    };

    const handleAddNew = () => {
        const addNewPath = selectedOperation === 'patient' ? '/add-patient' : '/add-doctor';
        window.location.href = addNewPath;
    };

    return (
        <div className="main-content">
            {adminInfo && <h1>Hoşgeldiniz, {adminInfo.firstName}!</h1>}
            <div className="operation-selector">
                <button onClick={() => handleOperationChange('patient')}>Hasta İşlemleri</button>
                <button onClick={() => handleOperationChange('doctor')}>Doktor İşlemleri</button>
            </div>
            <h2>{selectedOperation === 'patient' ? 'Hasta İşlemleri' : 'Doktor İşlemleri'}</h2>
            <div>
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
                <button onClick={handleSearch}>Ara</button>
                <button onClick={handleAddNew}>Yeni {selectedOperation === 'patient' ? 'Hasta' : 'Doktor'} Ekle</button>
            </div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {noDataMessage && <p style={{ color: 'red' }}>{noDataMessage}</p>}
            {searchResults.length > 0 && (
                <div className="search-results">
                    <h3>Arama Sonuçları:</h3>
                    <ul>
                        {searchResults.map((result) => (
                            <li key={result.id}>
                                {selectedOperation === 'patient' ? (
                                    <div>
                                        <p><strong>Ad:</strong> {result.firstName}</p>
                                        <p><strong>Soyad:</strong> {result.lastName}</p>
                                        <p><strong>Email:</strong> {result.email}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p><strong>Ad:</strong> {result.firstName}</p>
                                        <p><strong>Soyad:</strong> {result.lastName}</p>
                                        <p><strong>Email:</strong> {result.email}</p>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
