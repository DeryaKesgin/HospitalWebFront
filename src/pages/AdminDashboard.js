import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
    const location = useLocation();
    const navigate = useNavigate();

    // Yerel depolama'dan veri almak için yardımcı fonksiyon
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
    const [selectedOperation, setSelectedOperation] = useState('patient'); // Varsayılan olarak hasta işlemi seçili
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [noDataMessage, setNoDataMessage] = useState('');

    // Admin giriş kontrolü
    useEffect(() => {
        if (!adminInfo) {
            navigate('/login/admin'); // Admin bilgisi yoksa giriş sayfasına yönlendir
        } else {
            localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
        }
    }, [adminInfo, navigate]);

    // İşlem seçimi değiştirildiğinde tetiklenen fonksiyon
    const handleOperationChange = (operation) => {
        setSelectedOperation(operation);
        setFirstName('');
        setLastName('');
        setSearchResults([]);
        setSelectedItem(null);
        setErrorMessage('');
        setNoDataMessage('');
    };

    // Arama işlemini gerçekleştiren fonksiyon
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
                setSearchResults(response.data);
            }
        } catch (error) {
            console.error('Veri çekme hatası:', error);
            setErrorMessage('Veri çekme hatası. Lütfen tekrar deneyin.');
        }
    };

    // Yeni kayıt ekleme işlemi
    const handleAddNew = () => {
        const addNewPath = selectedOperation === 'patient' ? '/add-patient' : '/add-doctor';
        navigate(addNewPath);
    };

    // Seçilen kaydı güncelleme işlemi
    const handleUpdate = () => {
        if (selectedItem) {
            console.log("Güncellenen item:", selectedItem); // selectedItem bilgilerini konsola yazdır

            navigate('/edit-form', {
                state: {
                    item: selectedItem,
                    isPatient: selectedOperation === 'patient'
                }

            });
        }
    };

    // Seçilen kaydı silme işlemi
    const handleDelete = async () => {
        if (selectedItem) {
            const apiEndpoint = selectedOperation === 'patient'
                ? `https://localhost:44345/api/Hasta/${selectedItem.hastaId}`
                : `https://localhost:44345/api/Doctor/${selectedItem.doctorId}`;

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

    // Seçilen kaydı görüntüleme işlemi
    const handleSelectItem = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Paneli</h1>
            <div className="operation-selector">
                <button onClick={() => handleOperationChange('patient')}>Hasta İşlemleri</button>
                <button onClick={() => handleOperationChange('doctor')}>Doktor İşlemleri</button>
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
                        className={`search-result-item ${selectedItem === item ? 'selected' : ''}`}
                        onClick={() => handleSelectItem(item)}
                    >
                        {item.firstName} {item.lastName}
                    </div>
                ))}
            </div>
            {selectedItem && (
                <div className="selected-item-details">
                    <h3>Seçilen Kaydın Detayları</h3>
                    {selectedOperation === 'patient' ? (
                        <div>
                            <p><strong>Hasta ID:</strong> {selectedItem.hastaId}</p>
                            <p><strong>İsim:</strong> {selectedItem.firstName}</p>
                            <p><strong>Soyisim:</strong> {selectedItem.lastName}</p>
                            <p><strong>Email:</strong> {selectedItem.email}</p>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Doktor ID:</strong> {selectedItem.doctorId}</p>
                            <p><strong>İsim:</strong> {selectedItem.firstName}</p>
                            <p><strong>Soyisim:</strong> {selectedItem.lastName}</p>
                            <p><strong>Uzmanlık:</strong> {selectedItem.specialty}</p>
                        </div>
                    )}
                    <button onClick={handleUpdate}>Bilgileri Düzenle</button>
                    <button onClick={handleDelete}>Kaydı Sil</button>
                </div>
            )}
            <div className="action-buttons">
                <button onClick={handleAddNew}>Yeni Kayıt Ekle</button>
            </div>
        </div>
    );
}

export default AdminDashboard;
