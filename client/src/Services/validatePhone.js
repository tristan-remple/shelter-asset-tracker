//------ MODULE INFO
// This function takes a string or number input and returns a valid phone number if possible.
// The valid format is 000-000-0000.
// Formats 0000000000 and (000) 000-0000 are converted.
// Other formats return an error.
// Imported by: LocationEdit, LocationCreate

const validatePhone = (number) => {

    // remove whitespace from start and end
    number = number.trim()

    // check if it's already valid
    if (number.match(/[0-9]{3}-[0-9]{3}-[0-9]{4}/)) {
        return { number }
    }

    // check if it's a number in (000) 000-0000 format and convert it
    if (number.match(/\([0-9]{3}\) [0-9]{3}-[0-9]{4}/)) {
        const first = number.split(")")[0].substr(1, 3)
        const rest = number.split(" ")[1].split("-")
        const second = rest[0]
        const third = rest[1]
        return { number: `${first}-${second}-${third}` }
    }

    // check if it's in all-numeric format and convert it
    if (parseInt(number) > 1000000000 && parseInt(number) < 10000000000) {
        number = parseInt(number).toString()
        const first = number.substr(0, 3)
        const second = number.substr(3, 3)
        const third = number.substr(6, 4)
        return { number: `${first}-${second}-${third}` }
    }

    // otherwise, return the number along with an error
    return {
        number,
        error: `${number} is not a valid phone number.`
    }
}

export default validatePhone