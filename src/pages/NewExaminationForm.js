import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewExaminationForm() {
    const location = useLocation();
    const patientId = location.state?.patientId;
    const doctorId = location.state?.doctorId;
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');

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

        const data = {
            patientId: patientId,
            doctorId: doctorId,
            complaint: complaint,
            diagnosis: diagnosis,
            prescription: prescription
        };

        console.log('Gönderilen veri:', data);

        try {
            const response = await axios.post('https://localhost:44345/api/Examination/AddExamination', data);
            if (response.status === 200 || response.status === 201) {
                toast.success('Muayene kaydı başarıyla eklendi!');
                setComplaint('');
                setDiagnosis('');
                setPrescription('');
            }
        } catch (error) {
            console.error('Muayene kaydı ekleme hatası:', error);
            toast.error('Muayene kaydı eklenirken bir hata oluştu.');
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
                    <button type="button" onClick={handleBackToDashboard}>Doktor Dashboard'a Geri Dön</button>
                </div>
            </form>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default NewExaminationForm;
