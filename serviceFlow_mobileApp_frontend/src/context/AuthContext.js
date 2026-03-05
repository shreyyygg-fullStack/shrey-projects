import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginPublic } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await AsyncStorage.getItem('userToken');
            if (storedToken) {
                setToken(storedToken);
            }
            setLoading(false);
        };
        loadToken();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await loginPublic(email, password);
            if (res.token) {
                setToken(res.token);
                await AsyncStorage.setItem('userToken', res.token);
            }
            return res;
        } catch (e) {
            throw e;
        }
    };

    const logout = async () => {
        setToken(null);
        await AsyncStorage.removeItem('userToken');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
