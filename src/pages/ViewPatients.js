import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewPatients() {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('https://localhost:44345/api/Hasta');
                setPatients(response.data);
            } catch (error) {
                console.error('Hastalar alýnýrken bir hata oluþtu:', error);
            }
        };

        fetchPatients();
    }, []);

    return (
        <div>
            <h2>Kayýtlý Hastalar</h2>
            <ul>
                {patients.map(patient => (
                    <li key={patient.hastaId}>{patient.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default ViewPatients;
