//------ MODULE INFO
// This module handles API interactions related to users.
// Imported by: App, Header

class authService {

    // Check whether the current user is logged in.
    checkUser() {
        return true
    }

    // Check whether the currently logged in user is an admin.
    // Called by: App
    checkAdmin() {
        return true
    }

    // Get information about the user who is currently signed in.
    // Called by: Header
    userInfo() {
        const sampleData = {
            userId: 1,
            username: "shenson",
            name: "Sally Henson",
            location: {
                locationId: 5,
                name: "The Hub"
            }
        }
        return sampleData
    }
}

export default new authService