import { useState, useEffect } from 'react'

import validateEmail from '../Services/validateEmail'

//------ MODULE INFO
// This module renders a simple input field and its associated errors.
// It takes a lot of props:
// * type: html type of input (text, number, password, email)
// * name: html name of field AND the field's key in changes
// * checks: array of functions that return either an error message or null (see sampleCheck)
// * step: html step, indicating the decimal place for number input
// * required: if flagged true, the field will error if it is changed to empty
// * changes/setChanges: the state of the parent form
// * unsaved/setUnsaved: whether the parent form has been altered since initial rendering
// * force: a counter that forces the field to check its validation on change

// const sampleCheck = (input) => {
//     if (input !== validEmail) {
//         return "Invalid email address."
//     } else {
//         return null
//     }
// }

const checkPositive = (num) => { return parseFloat(num) > 0 ? null : "Input must be a positive number." }

const RegularField = ({ type, name, formControls, checks = [], step = "0", required = false, tabIndex = 0 }) => {

    const { changes, setChanges, unsaved, setUnsaved, force } = formControls

    // string displayed to the user on error
    const [ fieldError, setFieldError ] = useState(null)

    // check if the input is valid
    // triggered when focus leaves the field, and then on every subsequent change
    const checkField = (input) => {

        // array of error messages
        const errors = []

        // length checks
        if (input.length > 255) {
            errors.push("Input is too long.")
        } else if (required && (input.length === 0 || input == 0)) {
            errors.push("Input cannot be empty.")
        } else if (type === "email") {
            const emailError = validateEmail(input)
            if (emailError) { errors.push(emailError) }
        } else if (type === "number") {
            const numberError = checkPositive(input)
            if (numberError) { errors.push(numberError) }
        }

        // check custom errors passed into this component
        checks.forEach(check => {
            const result = check(input)
            if (result) {
                errors.push(result)
            }
        })

        // see if this field is listed as an errored field
        const newChanges = {...changes}
        const errorIndex = newChanges.errorFields.indexOf(name)

        // update the fieldError and the parent's errored field list
        if (errors.length > 0) {
            if (errors.length < 3)  { setFieldError(errors.join(" ")) }
            else { setFieldError(errors.join("\n")) }
            if (errorIndex === -1) {
                newChanges.errorFields.push(name)
            }
        } else {
            setFieldError(null)
            if (errorIndex !== -1) {
                newChanges.errorFields.splice(errorIndex, 1)
            }
        }
    }

    // if the field's value changes due to anything other than direct user input, validate it
    // example: initial value changes programmatically when item category is changed by the user
    // this also triggers when the force counter increases
    // example: the user doesn't change anything and presses the save button
    useEffect(() => {
        if (unsaved || force > 0) {
            checkField(changes[name])
        }
    }, [ changes[name], force ])

    // handle the input change using parent form's state
    const handleTextChange = (event) => {
        const newChanges = {...changes}
        newChanges[name] = type === "number" ? parseFloat(event.target.value) : event.target.value
        setChanges(newChanges)
    }

    return (
        <>
            <input 
                type={ type } 
                name={ name } 
                value={ changes[name] } 
                step={ step }
                onChange={ (event) => handleTextChange(event) } 
                onBlur={ () => { checkField(changes[name]); setUnsaved(true) } }
                className={ fieldError && "error" }
                tabIndex={ tabIndex }
            />
            { fieldError && <div className="row row-info error error-message"><p className="my-2">{ fieldError }</p></div> }
        </>

    )
}

export default RegularField