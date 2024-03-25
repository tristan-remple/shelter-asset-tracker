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
    // Called by: Header, LocationDetails
    userInfo() {

        const sampleData = {
            userId: 1,
            userName: "Sally Henson",
            location: {
                locationId: 5,
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
}

export default new authService