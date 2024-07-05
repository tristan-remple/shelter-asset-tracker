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

    // Called by: UnitEdit
    postUserAuths = async(user, callback) => {
        const id = user.id
        await axios.post(`${ import.meta.env.VITE_API_URL }/users/authorize/${ id }`, user, {
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
    csvReport = async(title, id, callback) => {
        let url = `${ import.meta.env.VITE_API_URL }/csv/${ title }`
        if (id) { url += "/" + id }
        await axios.get(url, {
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
        await axios.get(`${ import.meta.env.VITE_API_URL }/items/deleted`, {
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
        await axios.get(`${ import.meta.env.VITE_API_URL }/items/${ itemId }/restore`, {
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

    // Called by: UnitRecovery
    deletedUnits = async(callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/units/deleted`, {
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

    // Called by: UnitRecovery
    restoreUnit = async(unitId, callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/units/${ unitId }/restore`, {
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

    // Called by: LocationRecovery
    deletedLocations = async(callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/facilities/deleted`, {
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

    // Called by: LocationRecovery
    restoreLocation = async(locationId, callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/facilities/${ locationId }/restore`, {
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

    // Called by: CategoryRecovery
    deletedCategories = async(callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/templates/deleted`, {
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

    // Called by: CategoryRecovery
    restoreCategory = async(categoryId, callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/templates/${ categoryId }/restore`, {
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

    // Called by: UserRecovery
    deletedUsers = async(callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/users/deleted`, {
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

    // Called by: UserRecovery
    restoreUser = async(userId, callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/users/${ userId }/restore`, {
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

    // Called by: IconSelector
    listIcons = async(callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/icons`, {
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

    // Called by: IconSelector
    uploadIcon = async(icon, callback) => {

        const formData = new FormData()
        formData.append('file', icon.file)
        // formData.append('name', icon.name)
        // formData.append('alt', icon.alt)
        console.log(formData)

        await axios.post(`${ import.meta.env.VITE_API_URL }/icons`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
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

    // Called by: Settings
    uploadLogo = async(logoSrc, callback) => {
        await axios.post(`${ import.meta.env.VITE_API_URL }/logo`, logoSrc, {
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

    // Called by: Settings, UnitCreate, UnitEdit
    getSettings = async(callback) => {
        await axios.get(`${ import.meta.env.VITE_API_URL }/settings`, {
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

    // Called by: Settings
    postSettings = async(settings, callback) => {
        await axios.post(`${ import.meta.env.VITE_API_URL }/settings`, settings, {
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

    // Called by: IconSelector
    deleteIcons = async(iconList, callback) => {
        await axios.post(`${ import.meta.env.VITE_API_URL }/icons/delete`, iconList, {
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
}

export default new apiService