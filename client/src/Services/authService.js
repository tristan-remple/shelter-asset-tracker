// external dependencies
import axios from 'axios'

// internal dependencies
import { errorCodes } from './errorCodes'

//------ MODULE INFO
// This module handles API interactions related to users.
// Imported by: App, Header

class authService {

    // legacy?
    registerNewUser = async(user, callback) => {
        await axios.post(`${ import.meta.env.VITE_API_URL }/register`, user, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            callback(res.data)
        })
        .catch(err => {
            callback({ error: err.response.data })
        })
    }

    // Called by: LogIn
    login = async(user, callback) => {
        await axios.post(`${ import.meta.env.VITE_API_URL }/login`, user, {
            withCredentials: true,
            headers: {
                "content-type": "application/json"
            }
        })
        .then(res => {
            callback(res.data.userInfo)
        })
        .catch(err => {
            if (err.code === "ERR_NETWORK") {
                callback({ error: errorCodes[500] })
            } else if (err.message === "no password") {
                callback({ error: "password" })
            } else {
                callback({ error: errorCodes[err?.response?.status] })
            }
        })
    }

    // Called by: LogOut
    logout = async(callback) => {
        await axios.post(`${ import.meta.env.VITE_API_URL }/logout`, {im: "leaving"}, {
            withCredentials: true,
            headers: {
                "content-type": "application/json"
            }
        })
        .then(res => {
            callback(res.data)
        })
        .catch(err => {
            if (err.code === "ERR_NETWORK") {
                callback({ error: errorCodes[500] })
            } else {
                callback({ error: errorCodes[err.response.status] })
            }
        })
    }

    // Called by: UserDetails
    requestResetPassword = async(id, callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/users/reset/${ id }`, {
            withCredentials: true,
            headers: {
                "content-type": "application/json"
            }
        })
        .then(res => {
            callback(res.data)
        })
        .catch(err => {
            if (err.code === "ERR_NETWORK") {
                callback({ error: errorCodes[500] })
            } else {
                callback({ error: errorCodes[err?.response?.status] })
            }
        })
    }

    // Called by: ResetPassword
    resetPassword = async(request, callback) => {
        const { hash } = request
        await axios.post(`${ import.meta.env.VITE_API_URL }/users/reset/${ hash }`, request, {
            withCredentials: true,
            headers: {
                "content-type": "application/json"
            }
        })
        .then(res => {
            callback(res.data)
        })
        .catch(err => {
            if (err.code === "ERR_NETWORK") {
                callback({ error: errorCodes[500] })
            } else {
                callback({ error: errorCodes[err?.response?.status] })
            }
        })
    }

    requestPasswordEmail = async(email, callback) => {
        await axios.post(`${ import.meta.env.VITE_API_URL }/users/reset/resend`, email, {
            withCredentials: true
        })
        .then(res => {
            callback(res.data)
        })
        .catch(err => {
            if (err.code === "ERR_NETWORK") {
                callback({ error: errorCodes[500] })
            } else {
                callback({ error: errorCodes[err?.response?.status] })
            }
        })
    }

    cancelResetPassword = async(id, callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/users/reset/${ id }/cancel`, {
            withCredentials: true,
            headers: {
                "content-type": "application/json"
            }
        })
        .then(res => {
            callback(res.data)
        })
        .catch(err => {
            if (err.code === "ERR_NETWORK") {
                callback({ error: errorCodes[500] })
            } else {
                callback({ error: errorCodes[err?.response?.status] })
            }
        })
    }
}

export default new authService