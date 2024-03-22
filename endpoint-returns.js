// all returns have an optional error field
// edit, create, and delete actions have a success boolean
// where multiple columns have the same heading, the object should have the table and then the column, camel cased
// ex: userType, unitType, locationType

// returned on sign in, used to display the header and correct location
const userInfo = {
    userId: 1,
    username: "shenson",
    firstName: "Sally",
    lastName: "Henson",
    location: {
        locationId: 2,
        locationName: "The Hub"
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
    firstName: "Sally",
    lastName: "Henson",
    userType: "admin",
    created: "2024-02-22 13:55:00",
    location: {
        locationId: 2,
        locationName: "The Hub"
    }
}

// sent by user changing their own username or name
// return viewProfile again with the updated info
const updateProfile = {
    userId: 1,
    username: "sivany",
    firstName: "Sally",
    lastName: "Ivany"
}

// returned when the admin views users
const adminViewUsers = [
    {
        userId: 1,
        username: "shenson",
        firstName: "Sally",
        lastName: "Henson",
        userType: "admin",
        created: "2024-02-22 13:55:00",
        deleted: null,
        location: {
            locationId: 2,
            locationName: "The Hub"
        }
    },
    {
        userId: 1,
        username: "shenson",
        firstName: "Sally",
        lastName: "Henson",
        userType: "admin",
        created: "2024-02-22 13:55:00",
        deleted: null,
        location: {
            locationId: 2,
            locationName: "The Hub"
        }
    }
]

// sent by admin creating a new user
// return viewProfile again with the new info
const addUser = {
    username: "shenson",
    firstName: "Sally",
    userType: "admin",
    locationId: 2
}

// sent to api by admin deleting user
const deleteUser = {
    userId: 1,
    firstName: "Sally"
}

// on failure, deleted: null
const deleteUserResponse = {
    userId: 1,
    firstName: "Sally",
    deleted: "2024-02-22 13:55:00",
    success: true
}

// returned when a user views the list of locations
// units: number of units related
const viewLocations = [
    {
        locationId: 2,
        locationName: "The Hub",
        address: "75 Main St., Dartmouth",
        units: 35
    },
    {
        locationId: 2,
        locationName: "The Hub",
        address: "75 Main St., Dartmouth",
        units: 35
    }
]

// sent by admin when new location is created
// returns the same info with a locationId as well
const addLocation = {
    locationName: "The Hub",
    address: "75 Main St., Dartmouth",
    managerId: 3,
    contact: "123-333-3345",
    locationType: "shelter"
}

// used to load the location edit page
const editLocation = {
    locationId: 2,
    locationName: "The Hub",
    locationType: "shelter",
    added: {
        userId: 2,
        firstName: "Sally",
        lastName: "Ivany",
        addedDate: "2022-02-22 13:55:00"
    },
    deleteDate: null,
    comment: "It's got some number of units."
}

// sent by admin to update location
// return value should be the updated info
const editLocationPost = {
    locationId: 2,
    locationName: "The Hub",
    address: "75 Main St., Dartmouth",
    managerId: 3,
    contact: "123-333-3345",
    locationType: "shelter"
}

// sent by admin deleting location
const deleteLocation = {
    locationId: 1,
    locationName: "The Hub"
}

// returned by delete location
// on failure, deleted: null, error: "err text"
const deleteLocationResponse = {
    locationId: 1,
    locationName: "The Hub",
    deleted: "2024-02-22 13:55:00",
    success: true
}

// returned for the list of units in one location
// input param is location id
// number of items to be inspected or discarded
const singleLocation = {
    location: {
        locationId: 2,
        locationName: "The Hub",
        locationType: "shelter",
        added: {
            userId: 2,
            firstName: "Sally",
            lastName: "Ivany",
            addedDate: "2022-02-22 13:55:00"
        },
        deleteDate: null,
        comment: "It's got some number of units."
    },
    units: [
        {
            unitId: 2,
            unitName: "204",
            unitType: "snug",
            toInspectItems: 3,
            toDiscardItems: 0
        },
        {
            unitId: 3,
            unitName: "205",
            unitType: "snug",
            toInspectItems: 0,
            toDiscardItems: 0
        },
        {
            unitId: 4,
            unitName: "206",
            unitType: "snug",
            toInspectItems: 1,
            toDiscardItems: 1
        }
    ]
}

// sent to the api when a unit is created
const addUnit = {
    locationId: 2,
    unitName: "3040-B",
    unitType: "apartment"
}

// returned from the api when a unit is successfully created
const addedUnit = {
    location: {
        locationId: 2,
        locationName: "Barry House"
    },
    unitId: 13,
    unitName: "3040-B",
    unitType: "apartment",
    success: true
}

// sent to delete unit
const deleteUnit = {
    unitId: 13,
    locationId: 2,
    unitName: "3040-B"
}

// returned by delete unit
const deleteUnitResponse = {
    unitId: 13,
    locationId: 2,
    unitName: "3040-B",
    deleted: "2024-02-22 13:55:00",
    success: true
}

// used for item creation within a unit
const singleUnit = {
    unitId: 13,
    unitName: "3040-B",
    locationId: 2,
    locationName: "Barry House"
}

// list unit items
// this is for the list view, therefore not all item info needs to be returned
const itemList = {
    unit: {
        unitId: 13,
        unitName: "3040-B",
        locationId: 2,
        locationName: "Barry House",
        unitType: "apartment",
        added: {
            userId: 2,
            firstName: "Sally",
            lastName: "Ivany",
            addedDate: "2022-02-22 13:55:00"
        },
        inspected: {
            userId: 4,
            firstName: "Jimmy",
            lastName: "Jones",
            inspectedDate: "2024-02-22 13:55:00"
        },
        deleteDate: null,
        comment: "It's got at least one room."
    },
    items: [
        {
            itemId: 359,
            itemLabel: "BH-359",
            categoryId: 14,
            categoryName: "couch",
            toAssess: true,
            toDiscard: false
        },
        {
            itemId: 365,
            itemLabel: "BH-365",
            categoryId: 3,
            categoryName: "mattress",
            toAssess: false,
            toDiscard: true
        },
        {
            itemId: 397,
            itemLabel: "BH-397",
            categoryId: 23,
            categoryName: "end table",
            toAssess: false,
            toDiscard: false
        }
    ]
}

// returned for the item details page, will need to query multiple tables
const singleItem = {
    unit: {
        unitId: 13,
        unitName: "3040-B",
        locationId: 2,
        locationName: "Barry House"
    },
    itemId: 397,
    itemLabel: "BH-397",
    category: {
        categoryId: 23,
        categoryName: "end table",
        categoryIcon: "icons8-console-table-100"
    },
    toAssess: false,
    toDiscard: false,
    vendor: "Ikea",
    donated: false,
    initialValue: 439.99,
    currentValue: 285.00,
    added: {
        userId: 2,
        firstName: "Sally",
        lastName: "Ivany",
        addedDate: "2022-02-22 13:55:00"
    },
    inpsected: {
        userId: 4,
        firstName: "Jimmy",
        lastName: "Jones",
        inspectedDate: "2024-02-22 13:55:00"
    },
    discardDate: null,
    comment: "Legs are uneven, one side is scraped."
}

// data sent to the api when an item is updated
// only these fields will be sent
// should return the updated object as listed above
// with an additional field "success: true"
const updateItem = {
    itemId: 397,
    itemLabel: "BH-397",
    toAssess: true,
    toDiscard: false,
    currentValue: 285.00,
    inpsected: {
        userId: 2,
        firstName: "Sally",
        lastName: "Ivany",
        inspectedDate: "2024-02-24 13:55:00"
    },
    discardDate: null,
    comment: "Legs are uneven, one side is scraped. Seems to be scratching the floor, may need sticky feet."
}

// data sent to the api when an item is added
// the added user should ALSO be filled in as the most recent inspecting user
// api should return the full item details as shown above, plus success
const addItem = {
    unitId: 13,
    itemLabel: "BH-1005",
    locationId: 2,
    categoryId: 23,
    vendor: "Ikea",
    donated: false,
    initialValue: 439.99,
    added: {
        userId: 2,
        firstName: "Sally",
        lastName: "Ivany",
        addedDate: "2023-02-22 16:55:00"
    },
    comment: "Looks good :)"
}

// sent to delete unit
const deleteItem = {
    unitId: 13,
    locationId: 2,
    itemId: 497
}

// returned by delete unit
const deleteItemResponse = {
    unitId: 13,
    locationId: 2,
    itemId: 497,
    deleted: "2024-02-22 13:55:00",
    success: true
}

// reporting example
const report = {
    numLocations: 9,
    numUnits: 386,
    numItems: 12974,
    valueItems: 1508765.49,
    itemsToInspect: 139,
    itemsToDiscard: 12,
    valueReplaceToInspect: 39000.00,
    valueReplaceToDiscard: 12975.99,
    numNewItems: 38,
    valueNewItems: 3800.00
}

// admin view list of categories
const categoryList = [
    {
        categoryId: 1,
        categoryName: "dining table",
        defaultValue: 900,
        icon: "table-100",
        singleUse: false
    },
    {
        categoryId: 2,
        categoryName: "end table",
        defaultValue: 300,
        icon: "smtable-100",
        singleUse: false
    }
]

// single category
// lists number of items in category that have not been deleted
const singleCategory = {
    categoryId: 2,
    categoryName: "end table",
    defaultValue: 300,
    defaultUsefulLife: 20,
    icon: "smtable-100",
    singleUse: false,
    items: 20,
    created: "2024-02-22 13:55:00",
    updated: "2024-02-22 13:55:00"
}

// sent to api to create a category
// api returns the above + success
const addCategory = {
    categoryName: "space heater",
    defaultValue: 500,
    defaultUsefulLife: 12,
    icon: "default-100",
    singleUse: false
}

// sent to api to edit a category
// return above + success
const editCategory = {
    categoryId: 2,
    categoryName: "bedside table",
    defaultValue: 280,
    defaultUsefulLife: 20,
    iton: "smtable-100",
    singleUse: false
}

// request and response for delete category
const deleteCategory = {
    categoryId: 2,
    categoryName: "bedside table"
}

const deleteCategoryResponse = {
    categoryId: 2,
    categoryName: "bedside table",
    deleted: "2024-02-22 13:55:00",
    success: true
}