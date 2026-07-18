/* ==========================================================================
   NATIONAL GRIEVANCE REDRESSAL INFRASTRUCTURE - UNIFIED CENTRAL STATE DESK
   ========================================================================== */

import React, { createContext, useState, useEffect } from 'react';

// Create Central Registry Bridge Core Layer Context Engine
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // 🔹 Core System Session Authentication Memory Matrices
    const [token, setToken] = useState(localStorage.getItem('userToken') || null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')) || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userToken'));

    // 🔹 Global Interface Active Alert System Engine
    const [globalAlert, setGlobalAlert] = useState({ show: false, type: '', text: '' });

    // Synchronize authentication mutations smoothly right across localStorage cache layers
    useEffect(() => {
        if (token && user) {
            localStorage.setItem('userToken', token);
            localStorage.setItem('userData', JSON.stringify(user));
            setIsAuthenticated(true);
        } else {
            localStorage.clear();
            setIsAuthenticated(false);
        }
    }, [token, user]);

    /**
     * Trigger global notifications across anywhere inside application framework
     * @param {String} type - Notification standard theme (success, danger, info, warning)
     * @param {String} messageText - Informational trace alert descriptions text lines string
     */
    const triggerSystemAlert = (type, messageText) => {
        setGlobalAlert({ show: true, type, text: messageText });
        // Auto-release screen notification wrapper layout bounds to avoid workspace visual clutter
        setTimeout(() => {
            setGlobalAlert({ show: false, type: '', text: '' });
        }, 5000);
    };

    /**
     * Terminate secure cryptographic credentials enclave session properties
     */
    const executeSystemLogout = () => {
        setToken(null);
        setUser(null);
        triggerSystemAlert('info', 'Secure operational infrastructure terminal session terminated safely.');
    };

    return (
        <AppContext.Provider value={{
            token,
            setToken,
            user,
            setUser,
            isAuthenticated,
            globalAlert,
            triggerSystemAlert,
            executeSystemLogout
        }}>
            {children}
        </AppContext.Provider>
    );
};
