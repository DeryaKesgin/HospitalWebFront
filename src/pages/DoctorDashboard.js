import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './DoctorDashboard.css';



function DoctorDashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    // Doktor bilgilerini location'dan veya localStorage'dan oku
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

    const doctorFirstName = location.state?.doctorFirstName || getStoredData('doctorFirstName', 'Adı Yok');
    const doctorLastName = location.state?.doctorLastName || getStoredData('doctorLastName', 'Soyadı Yok');
    const doctorId = location.state?.doctorId || getStoredData('doctorId', null);

    // Eğer doktor ID'si location'dan geldiyse, localStorage'a kaydet
    useEffect(() => {
        if (location.state?.doctorId) {
            localStorage.setItem('doctorId', JSON.stringify(location.state.doctorId));
            localStorage.setItem('doctorFirstName', JSON.stringify(location.state.doctorFirstName));
            localStorage.setItem('doctorLastName', JSON.stringify(location.state.doctorLastName));
        }

        // Eğer localStorage'da doktor ID'si yoksa, giriş sayfasına yönlendir
        if (!doctorId) {
            navigate('/login/doctor');
        }
    }, [doctorId, location.state, navigate]);

    // State tanımlamaları
    const [searchTerm, setSearchTerm] = useState('');
    const [diagnosisTerm, setDiagnosisTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [diagnosisResults, setDiagnosisResults] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [examinationHistory, setExaminationHistory] = useState([]);
    const [noDataMessage, setNoDataMessage] = useState('');
    const [noDataTaniMessage, setNoDataTaniMessage] = useState('');

    // Hasta arama işlemi
    const handleSearch = async () => {
        setNoDataMessage('');
        try {
            const response = await axios.get(`https://localhost:44345/api/Patient/WithFilterForDoctor?firstname=${searchTerm}&lastname=${searchTerm}`);

            if (response.data.length === 0) {
                setNoDataMessage('Veri bulunamadı.');
                setPatients([]);
            } else {
                setPatients(response.data);
            }
        } catch (error) {
            console.error('Hasta arama hatası:', error);
            setNoDataMessage('Bir hata oluştu.');
        }
    };

    // Tanı arama işlemi
    const handleDiagnosisSearch = async () => {
        setNoDataTaniMessage('');
        try {
            const response = await axios.get(`https://localhost:44345/api/Examination/WithFilter?diagnosis=${diagnosisTerm}`);
            if (response.data.length === 0) {
                setNoDataTaniMessage('Veri bulunamadı.');
                setDiagnosisResults([]);
            } else {
                setDiagnosisResults(response.data);
            }
        } catch (error) {
            console.error('Tanı arama hatası:', error);
            setNoDataTaniMessage('Bir hata oluştu.');
        }
    };

    // Hasta seçme işlemi
    const handleSelectPatient = async (patient) => {
        setSelectedPatient(patient);
        try {
            const response = await axios.get(`https://localhost:44345/api/Examination/History/${patient.patientId}`);
            setExaminationHistory(response.data);
        } catch (error) {
            console.error('Muayene geçmişi alma hatası:', error);
            setNoDataMessage('Bir hata oluştu.');
        }
    };

    // Yeni muayene ekleme işlemi
    const handleAddExamination = () => {
        if (selectedPatient) {
            navigate('/add-examination', {
                state: {
                    patientId: selectedPatient.patientId,
                    doctorId: doctorId,  // Doktor ID'sini burada geçiriyoruz
                    doctorFirstName: doctorFirstName,
                    doctorLastName: doctorLastName
                }
            });
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Doktor Kontrol Paneli</h1>
            <p>Hoş geldiniz, Dr. {doctorFirstName} {doctorLastName}</p>

            <div className="search-section">
                <div className="search-by-name">
                    <input
                        type="text"
                        placeholder="Hasta arayın"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch}>Ara</button>
                    {patients.length > 0 ? (
                        <ul>
                            {patients.map((patient) => (
                                <li key={patient.patientId} onClick={() => handleSelectPatient(patient)}>
                                    {patient.firstName || 'Adı Yok'} {patient.lastName || 'Soyadı Yok'}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        noDataMessage && <p>{noDataMessage}</p>
                    )}
                </div>

                <div className="search-by-diagnosis">
                    <input
                        type="text"
                        placeholder="Kayıtlı tanı arayın"
                        value={diagnosisTerm}
                        onChange={(e) => setDiagnosisTerm(e.target.value)}
                    />
                    <button onClick={handleDiagnosisSearch}>Ara</button>
                    {diagnosisResults.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Hasta Adı</th>
                                    <th>Hasta Soyadı</th>
                                    <th>Şikayet</th>
                                    <th>Tanı</th>
                                    <th>Reçete</th>
                                    <th>Doktor Adı</th>
                                    <th>Doktor Soyadı</th>
                                    <th>Tarih</th>
                                </tr>
                            </thead>
                            <tbody>
                                {diagnosisResults.map((result) => (
                                    <tr key={result.id}>
                                        <td>{result.patientFirstName}</td>
                                        <td>{result.patientLastName}</td>
                                        <td>{result.complaint}</td>
                                        <td>{result.diagnosis}</td>
                                        <td>{result.prescription}</td>
                                        <td>{result.doctorFirstName}</td>
                                        <td>{result.doctorLastName}</td>
                                        <td>{new Date(result.dateCreated).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        noDataTaniMessage && <p>{noDataTaniMessage}</p>
                    )}
                </div>
            </div>

            {selectedPatient && (
                <div className="examination-history">
                    <h2>{selectedPatient.firstName} {selectedPatient.lastName} için Muayene Geçmişi</h2>
                    {examinationHistory.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Hasta ID</th>
                                    <th>Şikayet</th>
                                    <th>Tanı</th>
                                    <th>Reçete</th>
                                    <th>Doktor</th>
                                    <th>Tarih</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examinationHistory.map((exam) => (
                                    <tr key={exam.id}>
                                        <td>{exam.patientId}</td>
                                        <td>{exam.complaint}</td>
                                        <td>{exam.diagnosis}</td>
                                        <td>{exam.prescription}</td>
                                        <td>{exam.doctorFirstName} {exam.doctorLastName}</td>
                                        <td>{new Date(exam.dateCreated).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Muayene geçmişi bulunamadı</p>
                    )}
                    <button onClick={handleAddExamination}>Yeni Muayene Ekle</button>
                </div>
            )}
        </div>
    );
}

export default DoctorDashboard;
