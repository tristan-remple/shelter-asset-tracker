// all returns have an optional error field
// edit, create, and delete actions have a success boolean

// returned on sign in, used to display the header and correct location
const userInfo = {
    userId: 1,
    username: "shenson",
    name: "Sally Henson",
    location: {
        locationId: 2,
        name: "The Hub"
    }
}

// returned by auth-related checks
// return both fields as null when no one is signed in
// return error field as well if there's an actual error
const checkUser = {
    userId: 1,
    userType: "admin"
}

// returned to display profile
const viewProfile = {
    userId: 1,
    username: "shenson",
    name: "Sally Henson",
    type: "admin",
    created: "2024-02-22 13:55:00",
    location: {
        locationId: 2,
        name: "The Hub"
    }
}

// sent by user changing their own username or name
// return viewProfile again with the updated info
const updateProfile = {
    userId: 1,
    username: "sivany",
    name: "Sally Ivany"
}

// returned when the admin views users
const adminViewUsers = [
    {
        userId: 1,
        username: "shenson",
        name: "Sally Henson",
        type: "general",
        created: "2023-03-25 02:46:00",
        deleted: "2024-02-22 13:55:00",
        location: {
            locationId: 2,
            name: "The Hub"
        }
    },
    {
        userId: 1,
        username: "shenson",
        name: "Sally Henson",
        type: "admin",
        created: "2024-02-22 13:55:00",
        deleted: null,
        location: {
            locationId: 2,
            name: "The Hub"
        }
    }
]

// sent by admin creating a new user
// return viewProfile again with the new info
const addUser = {
    username: "shenson",
    name: "Sally Henson",
    type: "admin",
    locationId: 2
}

// sent by admin deleting user
// return should be the same if successful
// on failure, deleted: null
const deleteUser = {
    userId: 1,
    name: "Sally Henson",
    deleted: "2024-02-22 13:55:00"
}

// returned when a user views the list of locations
const viewLocations = [
    {
        locationId: 2,
        name: "The Hub",
        address: "75 Main St., Dartmouth",
        units: 35
    },
    {
        locationId: 2,
        name: "The Hub",
        address: "75 Main St., Dartmouth",
        units: 35
    }
]

// sent by admin when new location is created
// returns the same info with a locationId as well
const addLocation = {
    name: "The Hub",
    address: "75 Main St., Dartmouth",
    managerId: 3,
    contact: "123-333-3345",
    type: "shelter"
}

// sent by admin to update location
// return value should be the updated info
const editLocation = {
    locationId: 2,
    name: "The Hub",
    address: "75 Main St., Dartmouth",
    managerId: 3,
    contact: "123-333-3345",
    type: "shelter"
}

