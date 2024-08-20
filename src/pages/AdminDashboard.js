import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
    const location = useLocation();
    const navigate = useNavigate();

    const getStoredData = (key, defaultValue) => {
        const item = localStorage.getItem(key);
        if (item) {
            try {
                return JSON.parse(item);
            } catch (e) {
                console.error(`JSON için hata ${key}:`, e);
                return defaultValue;
            }
        }
        return defaultValue;
    };

    const [adminInfo, setAdminInfo] = useState(location.state?.adminInfo || getStoredData('adminInfo', null));
    const [selectedOperation, setSelectedOperation] = useState('patient');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [noDataMessage, setNoDataMessage] = useState('');

    useEffect(() => {
        if (!adminInfo) {
            navigate('/login/admin');
        } else {
            localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
        }
    }, [adminInfo, navigate]);

    const handleOperationChange = (operation) => {
        setSelectedOperation(operation);
        setFirstName('');
        setLastName('');
        setSearchResults([]);
        setSelectedItem(null);
        setErrorMessage('');
        setNoDataMessage('');
    };

    const handleSearch = async () => {
        setErrorMessage('');
        setNoDataMessage('');
        const apiEndpoint = selectedOperation === 'patient'
            ? 'https://localhost:44345/api/Hasta/WithFilter'
            : 'https://localhost:44345/api/Doctor/WithFilter';

        try {
            const response = await axios.get(apiEndpoint, {
                params: {
                    firstname: firstName || undefined,
                    lastname: lastName || undefined
                }
            });

            if (response.data.length === 0) {
                setNoDataMessage('Veri bulunamadı.');
            } else {
                const activeItems = response.data.filter(item => item.activity === true).sort((a, b) => a.id - b.id);
                const inactiveItems = response.data.filter(item => item.activity === false).sort((a, b) => a.id - b.id);
                const sortedResults = [...activeItems, ...inactiveItems];
                setSearchResults(sortedResults);
            }
        } catch (error) {
            console.error('Veri çekme hatası:', error);
            setErrorMessage('Veri çekme hatası. Lütfen tekrar deneyin.');
        }
    };

    const handleAddNew = () => {
        const addNewPath = selectedOperation === 'patient' ? '/add-patient' : '/add-doctor';
        navigate(addNewPath);
    };

    const handleUpdate = () => {
        if (selectedItem) {
            navigate('/edit-form', {
                state: {
                    item: selectedItem,
                    isPatient: selectedOperation === 'patient'
                }
            });
        }
    };

    const handleDelete = async () => {
        if (selectedItem) {
            const apiEndpoint = selectedOperation === 'patient'
                ? `https://localhost:44345/api/Hasta/${selectedItem.hastaId}`
                : `https://localhost:44345/api/Doctor/${selectedItem.doktorId}`;

            try {
                await axios.delete(apiEndpoint);
                setSearchResults(searchResults.filter(item => item !== selectedItem));
                setSelectedItem(null);
                alert('Kayıt başarıyla silindi.');
            } catch (error) {
                console.error('Silme hatası:', error);
                setErrorMessage('Silme hatası. Lütfen tekrar deneyin.');
            }
        }
    };

    const handleSelectItem = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className="admin-dashboard">
            <h1 className="welcome-message">Hoşgeldiniz, {adminInfo?.firstName} {adminInfo?.lastName}!</h1>
            <div className="operation-selector">
                <button
                    className={selectedOperation === 'patient' ? 'active-operation' : ''}
                    onClick={() => handleOperationChange('patient')}
                >
                    Hasta İşlemleri
                </button>
                <button
                    className={selectedOperation === 'doctor' ? 'active-operation' : ''}
                    onClick={() => handleOperationChange('doctor')}
                >
                    Doktor İşlemleri
                </button>
            </div>
            <div className="search-section">
                <input
                    type="text"
                    placeholder="İsim"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Soyisim"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <button onClick={handleSearch}>Ara</button>
            </div>
            {noDataMessage && <div className="no-data-message">{noDataMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="search-results">
                {searchResults.map((item, index) => (
                    <div
                        key={index}
                        className={`search-result-item ${item.activity ? 'active' : 'inactive'} ${selectedItem === item ? 'selected' : ''}`}
                        onClick={() => handleSelectItem(item)}
                    >
                        {selectedOperation === 'patient' ? `${item.firstName} ${item.lastName}` : `${item.firstName} ${item.lastName}`}
                    </div>
                ))}
            </div>
            {selectedItem && (
                <div className="selected-item-details">
                    <h2>Seçilen {selectedOperation === 'patient' ? 'Hasta' : 'Doktor'} Bilgileri</h2>
                    <p><strong>İsim:</strong> {selectedItem.firstName}</p>
                    <p><strong>Soyisim:</strong> {selectedItem.lastName}</p>
                    {selectedOperation === 'patient' && (
                        <>
                            <p><strong>Email:</strong> {selectedItem.email}</p>
                            <p><strong>Aktiflik Durumu:</strong> {selectedItem.activity ? 'Aktif' : 'Pasif'}</p>
                        </>
                    )}
                    {selectedOperation === 'doctor' && (
                        <>
                            <p><strong>Email:</strong> {selectedItem.email}</p>
                            <p><strong>Aktiflik Durumu:</strong> {selectedItem.activity ? 'Aktif' : 'Pasif'}</p>
                        </>
                    )}
                </div>
            )}
            <div className="action-buttons">
                <button onClick={handleAddNew}>Yeni Ekle</button>
                <button onClick={handleUpdate}>Bilgileri Güncelle</button>
                <button onClick={handleDelete}>Kayıt Sil</button>
            </div>
        </div>
    );
}

export default AdminDashboard;
