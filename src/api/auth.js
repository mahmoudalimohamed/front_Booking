// src/api/auth.js
import axios from 'axios';

export const loginApi = async (email, password) => {
    return axios.post('http://127.0.0.1:8000/api/login/', { email, password });
};


export const logoutApi = async (refreshToken, accessToken) => {
    return axios.post(
        'http://127.0.0.1:8000/api/logout/',
        { refresh: refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );
};


export const refreshAccessTokenApi = async (refreshToken) => {
    return axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
};


export const registerApi = async (data) => {
    return axios.post('http://127.0.0.1:8000/api/register/', data);
};


export const forgotPasswordApi = async (email) => {
    return axios.post('http://127.0.0.1:8000/api/password_reset/', { email });
};


export const resetPasswordApi = async (token, uid, password) => {
    return axios.post('http://127.0.0.1:8000/api/password_reset/confirm/', { token, uid, password });
};