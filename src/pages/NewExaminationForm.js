import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';


function NewExaminationForm() {
    const location = useLocation();
    const patientId = location.state?.patientId;
    const doctorId = location.state?.doctorId;
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');
    const [message, setMessage] = useState(''); // Mesaj durumu
    const [error, setError] = useState(''); // Hata durumu

    const handleBackToDashboard = () => {
        navigate('/appointments');
    };

    useEffect(() => {
        if (!doctorId) {
            navigate('/login/doctor');
        }
    }, [doctorId, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const data = {
            hastaId: patientId,
            doktorId: doctorId,  // Doktor ID'si buraya dahil ediliyor
            complaint: complaint,
            diagnosis: diagnosis,
            prescription: prescription
        };

        console.log('Gönderilen veri:', data);

        try {
            const response = await axios.post('https://localhost:44345/api/Examination/addExamination', data);
            if (response.status === 200 || response.status === 201) {
                setMessage('Muayene kaydı başarıyla eklendi!');
                setComplaint('');
                setDiagnosis('');
                setPrescription('');
            }
        } catch (error) {
            console.error('Muayene kaydı ekleme hatası:', error);
            setError('Muayene kaydı eklenirken bir hata oluştu.');
        }
    };

    return (
        <div>
            <h2>Yeni Muayene Ekle</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Hasta ID:</label>
                    <input type="text" value={patientId} readOnly />
                </div>
                <div>
                    <label>Doktor ID:</label>
                    <input type="text" value={doctorId} readOnly />
                </div>
                <div>
                    <label>Şikayet:</label>
                    <input type="text" value={complaint} onChange={(e) => setComplaint(e.target.value)} />
                </div>
                <div>
                    <label>Tanı:</label>
                    <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                </div>
                <div>
                    <label>Reçete:</label>
                    <input type="text" value={prescription} onChange={(e) => setPrescription(e.target.value)} />
                </div>
                <button type="submit">Kaydet</button> <br />
                <div>
                    <br />
                    <button onClick={handleBackToDashboard}>Doktor Dashboard'a Geri Dön</button>
                </div>
            </form>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </div>
    );
}

export default NewExaminationForm;
