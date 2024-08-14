import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewDoctors() {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('https://localhost:44345/api/Doktor');
                setDoctors(response.data);
            } catch (error) {
                console.error('Doktorlar al�n�rken bir hata olu�tu:', error);
            }
        };

        fetchDoctors();
    }, []);

    return (
        <div>
            <h2>Kay�tl� Doktorlar</h2>
            <ul>
                {doctors.map(doctor => (
                    <li key={doctor.doktorId}>{doctor.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default ViewDoctors;
