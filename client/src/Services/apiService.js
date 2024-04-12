import { formattedDate } from './dateHelper'

//------ MODULE INFO
// This module interacts directly with the API to get data for the pages.
// It is assumed that lists will not contain deleted items.
// If an individual queried item has been deleted, it should be returned anyway.
// Imported by: all Item, Unit, and Location pages

class apiService {

    // Called by: ItemDetails, ItemEdit
    singleItem = async(id, callback) => {
        await fetch(`${ import.meta.env.VITE_API_URL }/items/${ id }`)
            .then(res => res.json())
            .then(data => {
                callback(data)
            })
    }

    // Called by: ItemEdit
    postItemEdit = async(item, callback) => {
        const id = item.id
        await fetch(`${ import.meta.env.VITE_API_URL }/items/${ id }`, {
            method: "PUT",
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        })
        .then(res => res.json())
        .then(data => {
            callback(data)
        })
    }

    // Called by: ItemEdit
    deleteItem = async(item, callback) => {
        const id = item.id
        await fetch(`${ import.meta.env.VITE_API_URL }/items/${id}`, {
                method: "DELETE",
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(item)
            })
            .then(res => res.json())
            .then(data => {
                callback(data)
            })
    }

    // Called by: ItemCreate
    postNewItem = async(item, callback) => {
        await fetch(`${ import.meta.env.VITE_API_URL }/items`, {
            method: "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        })
        .then(res => res.json())
        .then(data => {
            callback(data)
        })
    }

    // Called by: ItemEdit, ItemCreate
    listCategories = async(callback) => {
        await fetch(`${ import.meta.env.VITE_API_URL }/templates`)
            .then(res => res.json())
            .then(data => {
                callback(data)
            })
    }

    // Called by: UnitDetails, ItemCreate, UnitEdit
    singleUnit = async(id, callback) => {
        await fetch(`${ import.meta.env.VITE_API_URL }/units/${ id }`)
            .then(res => res.json())
            .then(data => {
                callback(data)
            })
    }

    // Called by: UnitEdit
    postUnitEdit= async(unit, callback) => {
        const id = unit.id
        await fetch(`${ import.meta.env.VITE_API_URL }/units/${ id }`, {
            method: "PUT",
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(unit)
        })
        .then(res => res.json())
        .then(data => {
            callback(data)
        })
    }

    // Called by: UnitCreate
    postNewUnit = async(unit, callback) => {
        await fetch(`${ import.meta.env.VITE_API_URL }/units`, {
            method: "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(unit)
        })
        .then(res => res.json())
        .then(data => {
            callback(data)
        })
    }

    // Called by: UnitDelete
    deleteUnit = async(unit, callback) => {
        const id = unit.id
        unit.facilityId = unit.facility.id
        console.log(unit)
        await fetch(`${ import.meta.env.VITE_API_URL }/units/${id}`, {
                method: "DELETE",
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(unit)
            })
            .then(res => res.json())
            .then(data => {
                callback(data)
            })
    }

    // Called by: LocationDetails, LocationEdit, LocationDelete
    singleLocation= async(id, callback) => {
        await fetch(`${ import.meta.env.VITE_API_URL }/facilities/${ id }`)
            .then(res => res.json())
            .then(data => {
                let unitTypes
                if (data.units) {
                    unitTypes = [...new Set(data.units.map(unit => unit.type))]
                } else {
                    unitTypes = []
                }
                data.types = unitTypes
                callback(data)
            })
    }

    // Called by: LocationEdit
    postLocationEdit= async(location, callback) => {
        const id = location.facilityId
        await fetch(`${ import.meta.env.VITE_API_URL }/facilities/${ id }`, {
            method: "PUT",
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(location)
        })
        .then(res => res.json())
        .then(data => {
            callback(data)
        })
    }

    // Called by: LocationList
    listLocations = async(callback) => {
        await fetch(`${ import.meta.env.VITE_API_URL }/facilities`)
            .then(res => res.json())
            .then(data => {
                callback(data)
            })
    }

    // Called by: LocationCreate
    postLocation = async(location, callback) => {
        await fetch(`${ import.meta.env.VITE_API_URL }/facilities`, {
                method: "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(location)
            })
            .then(res => res.json())
            .then(data => {
                callback(data)
            })
    }

    // Called by: LocationDelete
    deleteLocation = async(location, callback) => {

        const id = location.facilityId
        await fetch(`${ import.meta.env.VITE_API_URL }/facilities/${id}`, {
                method: "DELETE",
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(location)
            })
            .then(res => res.json())
            .then(data => {
                callback(data)
            })

    }

    singleCategory = async(id, callback) => {
        await fetch(`${ import.meta.env.VITE_API_URL }/templates/${ id }`)
            .then(res => res.json())
            .then(data => {
                callback(data)
            })
    }

    postCategoryEdit = async(category, callback) => {
        const id = category.id
        await fetch(`${ import.meta.env.VITE_API_URL }/templates/${ id }`, {
            method: "PUT",
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(category)
        })
        .then(res => res.json())
        .then(data => {
            callback(data)
        })
    }

    postNewCategory = async(category, callback) => {
        await fetch(`${ import.meta.env.VITE_API_URL }/templates`, {
            method: "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(category)
        })
        .then(res => res.json())
        .then(data => {
            callback(data)
        })
    }

    // Called by: CategoryDelete
    deleteCategory = async(category, callback) => {
        const id = category.id
        await fetch(`${ import.meta.env.VITE_API_URL }/templates/${id}`, {
                method: "DELETE",
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(category)
            })
            .then(res => res.json())
            .then(data => {
                callback(data)
            })
    }

    listUsers = async(callback) => {
        await fetch(`${ import.meta.env.VITE_API_URL }/users`)
            .then(res => res.json())
            .then(data => {
                callback(data)
            })
    }

    singleUser = async(id, callback) => {
        await fetch(`${ import.meta.env.VITE_API_URL }/users/${ id }`)
            .then(res => res.json())
            .then(data => {
                callback(data)
            })
    }

    postNewUser = async(user, callback) => {
        await fetch(`${ import.meta.env.VITE_API_URL }/users`, {
            method: "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(data => {
            callback(data)
        })
    }

    // Called by: UnitEdit
    postUserEdit= async(user, callback) => {
        const id = user.id
        await fetch(`${ import.meta.env.VITE_API_URL }/users/${ id }`, {
            method: "PUT",
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(data => {
            callback(data)
        })
    }

    // Called by: UserDelete
    deleteUser = async(user, callback) => {
        const id = user.id
        await fetch(`${ import.meta.env.VITE_API_URL }/users/${id}`, {
                method: "DELETE",
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            .then(res => res.json())
            .then(data => {
                callback(data)
            })
    }
}

export default new apiService