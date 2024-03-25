//------ MODULE INFO
// A couple date handling functions.

const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

// This function takes a date in any JS-readable format and returns a date that is easy for humans to read.
// Imported by: UnitDetails, LocationDetails, UnitDetails, Comment
export function friendlyDate(dateString) {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month}, ${year}`
}

// This function takes a date in any JS-readable format and returns a date that is formatted the way administrative staff are used to.
export function adminDate(dateString) {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
}

// This function takes today's date and formats it.
// Imported by: ItemCreate, LocationCreate, UnitCreate, apiService
export function formattedDate() {
    const date = new Date()
    const stringDate = date.toLocaleDateString()
    const stringTime = date.toTimeString().split(" ")[0]
    return `${stringDate} ${stringTime}`
}

// This function takes a date in any JS-readable format and formats it.
// export function formattedDate(dateString) {
//     const date = new Date(dateString)
//     const stringDate = date.toLocaleDateString()
//     const stringTime = date.toTimeString().split(" ")[0]
//     return `${stringDate} ${stringTime}`
// }