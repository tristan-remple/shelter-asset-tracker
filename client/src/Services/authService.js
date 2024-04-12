import axios from 'axios'

//------ MODULE INFO
// This module handles API interactions related to users.
// Imported by: App, Header

class authService {

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
            console.log(err)
            callback({ error: err.response.data })
        })
    }

    // Check whether the current user is logged in.
    // Called by: LogIn
    checkUser() {
        return true
    }

    // Check whether the currently logged in user is an admin.
    // Called by: App
    checkAdmin() {
        return true
    }

    // Get information about the user who is currently signed in.
    // Called by: Header, LocationDetails, ChangePanel
    userInfo() {

        const sampleData = {
            userId: 1,
            userName: "Sally Henson",
            location: {
                locationId: 1,
                locationName: "The Hub"
            }
        }
        return sampleData
    }

    // If the user is not currently or correctly signed in, return an object with falsy values.
    badUserInfo() {
        return {
            userId: null,
            userName: "",
            location: {
                locationId: 0,
                locationName: ""
            },
            error: "<Whatever API error the user generated.>"
        }
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
            callback(res)
        })
        .catch(err => {
            callback({ error: err })
        })

        // await fetch(`${ import.meta.env.VITE_API_URL }/login`, {
        //     method: "POST",
        //     "headers": {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(user)
        // })
        // .then(res => {
        //     callback(res)
        // })
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
            callback(res)
        })
        .catch(err => {
            callback({ error: err })
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
        console.log(request)
        request.success = true
        return request
    }
}

export default new authService