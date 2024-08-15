import React from 'react';
import { Route, Navigate } from 'react-router-dom';
//test
const ProtectedRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = !!localStorage.getItem('patientId'); // Giriþ yapýldýðýný kontrol edin

    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Navigate to="/login" />
                )
            }
        />
    );
};

export default ProtectedRoute;
