import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PatientDashboard.css'; // CSS dosyasını import edin



function PatientDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const patientId = location.state?.patientId;
    const firstName = location.state?.firstName;
    const lastName = location.state?.lastName;
    const [examinations, setExaminations] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {

        if (!patientId) {
            navigate('/login/patient');
            return;
        }

        console.log('Hasta Bilgileri:', { patientId, firstName, lastName });

        if (patientId) {
            const fetchExaminations = async () => {
                try {
                    const response = await axios.get(`https://localhost:44345/api/Examination/History/${patientId}`);
                    setExaminations(response.data);
                } catch (error) {
                    console.error('Muayeneleri alırken bir hata oluştu:', error);
                    setErrorMessage('Muayeneleri getirirken bir hata oluştu.');
                }
            };

            fetchExaminations();
        }
    }, [patientId, firstName, lastName]);


    return (
        <div>
            <h2>Hoş Geldiniz Sayın {firstName} {lastName}</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <div>
                <h3>Tanılar ve Reçeteler</h3>
                {examinations.length > 0 ? (
                    <ul>
                        {examinations.map((exam) => (
                            <li key={exam.id}>
                                <strong>Tanı:</strong> {exam.diagnosis} <br />
                                <strong>Şikayet:</strong> {exam.complaint} <br />
                                <strong>Reçete:</strong> {exam.prescription} <br />
                                <strong>Doktor:</strong> {exam.doctorFirstName} {exam.doctorLastName} <br />
                                <strong>Muayene Tarihi:</strong> {new Date(exam.dateCreated).toLocaleDateString()} <br />

                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Henüz bir muayene kaydı bulunmamaktadır.</p>
                )}
            </div>
        </div>
    );
}

export default PatientDashboard;
