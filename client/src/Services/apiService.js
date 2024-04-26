// external dependencies
import axios from 'axios'

// internal dependencies
import { errorCodes } from './errorCodes'

//------ MODULE INFO
// This module interacts directly with the API to get data for the pages.
// It is assumed that lists will not contain deleted items.
// If an individual queried item has been deleted, it should be returned anyway.
// Imported by: all Item, Unit, and Location pages

class apiService {

    // Called by: ItemDetails, ItemEdit
    singleItem = async(id, callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/items/${ id }`, {
            withCredentials: true
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

    // Called by: ItemEdit
    postItemEdit = async(item, callback) => {
        const id = item.id
        await axios.put(`${ import.meta.env.VITE_API_URL }/items/${ id }`, item, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
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

    // Called by: ItemEdit
    deleteItem = async(item, callback) => {
        const id = item.id
        await axios.delete(`${ import.meta.env.VITE_API_URL }/items/${id}`, {
            withCredentials: true
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

    // Called by: ItemCreate
    postNewItem = async(item, callback) => {
        await axios.post(`${ import.meta.env.VITE_API_URL }/items`, item, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
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

    // Called by: ItemEdit, ItemCreate
    listCategories = async(callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/templates`, {
            withCredentials: true
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

    // Called by: UnitDetails, ItemCreate, UnitEdit
    singleUnit = async(id, callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/units/${ id }`, {
            withCredentials: true
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

    // Called by: UnitEdit
    postUnitEdit= async(unit, callback) => {
        const id = unit.id
        await axios.put(`${ import.meta.env.VITE_API_URL }/units/${ id }`, unit, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
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

    // Called by: UnitCreate
    postNewUnit = async(unit, callback) => {
        await axios.post(`${ import.meta.env.VITE_API_URL }/units`, unit, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
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

    // Called by: UnitDelete
    deleteUnit = async(unit, callback) => {
        const id = unit.id
        unit.facilityId = unit.facility.id
        await axios.delete(`${ import.meta.env.VITE_API_URL }/units/${id}`, {
            withCredentials: true
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

    // Called by: LocationDetails, LocationEdit, LocationDelete
    singleLocation= async(id, callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/facilities/${ id }`, {
            withCredentials: true
        })
        .then(res => {
            const data = res.data
            let unitTypes
            if (data.units) {
                unitTypes = [...new Set(data.units.map(unit => unit.type))]
            } else {
                unitTypes = []
            }
            data.types = unitTypes
            callback(data)
        })
        .catch(err => {
            if (err.code === "ERR_NETWORK") {
                callback({ error: errorCodes[500] })
            } else {
                callback({ error: errorCodes[err.response.status] })
            }
        })
    }

    // Called by: LocationEdit
    postLocationEdit= async(location, callback) => {
        const id = location.facilityId
        await axios.put(`${ import.meta.env.VITE_API_URL }/facilities/${ id }`, location, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
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

    // Called by: LocationList
    listLocations = async(callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/facilities`, {
            withCredentials: true
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

    // Called by: LocationCreate
    postLocation = async(location, callback) => {
        await axios.post(`${ import.meta.env.VITE_API_URL }/facilities`, location, {
            withCredentials: true
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

    // Called by: LocationDelete
    deleteLocation = async(location, callback) => {
        const id = location.facilityId
        await axios.delete(`${ import.meta.env.VITE_API_URL }/facilities/${id}`, location, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
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

    singleCategory = async(id, callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/templates/${ id }`, {
            withCredentials: true
        })
        .then(res => {
            console.log(res.data)
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

    postCategoryEdit = async(category, callback) => {
        const id = category.id
        await axios.put(`${ import.meta.env.VITE_API_URL }/templates/${ id }`, category, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
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

    postNewCategory = async(category, callback) => {
        await axios.post(`${ import.meta.env.VITE_API_URL }/templates`, category, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
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

    // Called by: CategoryDelete
    deleteCategory = async(category, callback) => {
        const id = category.id
        await axios.delete(`${ import.meta.env.VITE_API_URL }/templates/${id}`, {
            withCredentials: true
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

    listUsers = async(callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/users`, {
            withCredentials: true
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

    singleUser = async(id, callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/users/${ id }`, {
            withCredentials: true
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

    postNewUser = async(user, callback) => {
        await axios.post(`${ import.meta.env.VITE_API_URL }/users`, user, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
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

    // Called by: UnitEdit
    postUserEdit= async(user, callback) => {
        const id = user.id
        await axios.put(`${ import.meta.env.VITE_API_URL }/users/${ id }`, user, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
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

    // Called by: UserDelete
    deleteUser = async(user, callback) => {
        const id = user.id
        await axios.delete(`${ import.meta.env.VITE_API_URL }/users/${id}`, {
            withCredentials: true
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

    // Called by: Dashboard
    globalReport = async(callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/reports`, {
            withCredentials: true
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

    // Called by: Dashboard
    csvReport = async(title, callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/reports/${ title }`, {
            withCredentials: true
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

    // Called by: ItemRecovery
    deletedItems = async(callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/items`, {
            withCredentials: true
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

    // Called by: ItemRecovery
    restoreItem = async(itemId, callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/items/${ itemId }`, {
            withCredentials: true
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
}

export default new apiService