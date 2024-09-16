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

    requestResetPassword(id) {
        return {
            userId: id,
            success: true
        }
    }

    getResetRequest(hash) {
        return {
            userId: 3,
            success: true
        }
    }

    resetPassword(request) {
        request.success = true
        return request
    }
}

export default new authService