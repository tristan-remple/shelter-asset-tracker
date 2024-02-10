//------ MODULE INFO
// This module handles API interactions related to users.
// Imported by: App.jsx

class authService {

    // Check whether the current user is logged in
    checkUser() {
        return true
    }

    // Check whether the currently logged in user is an admin
    // Used by: App.jsx
    checkAdmin() {
        return true
    }

    userInfo(userId) {
        const sampleData = {
            userId,
            username: "shenson",
            name: "Sally Henson",
            location: {
                locationId: 2,
                name: "The Hub"
            }
        }
        return sampleData
    }
}

export default new authService