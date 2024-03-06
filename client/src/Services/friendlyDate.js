//------ MODULE INFO
// This helper function takes a date in any JS-readable format and returns a date that is easy for humans to read.
// Imported by: UnitDetails

const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

export default function friendlyDate(dateString) {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month}, ${year}`
}