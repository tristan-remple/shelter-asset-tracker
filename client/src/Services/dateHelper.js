//------ MODULE INFO
// A couple date handling functions.

const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

// This function takes a date in any JS-readable format and returns a date that is easy for humans to read.
// Imported by: UnitDetails, LocationDetails, UnitDetails
export function friendlyDate(dateString) {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month}, ${year}`
}

// This function takes today's date and formats it.
// Imported by: ItemCreate, LocationCreate, UnitCreate
export function formattedDate() {
    const today = new Date()
    const stringToday = today.toLocaleDateString()
    const stringNow = today.toTimeString().split(" ")[0]
    return `${stringToday} ${stringNow}`
}