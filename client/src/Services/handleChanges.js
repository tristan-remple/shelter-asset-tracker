//------ MODULE INFO
// This module handles changes to simple form elements.
// Imported by: ItemCreate, ItemEdit, LocationEdit

class handleChanges {

    // handles text and number changes
    handleTextChange = (event, changes, setChanges, setUnsaved) => {
        const fieldName = event.target.name
        const newChanges = {...changes}
        newChanges[fieldName] = event.target.type === "number" ? parseFloat(event.target.value) : event.target.value
        setChanges(newChanges)
        setUnsaved(true)
    }

    // handles changes to addedDate
    handleDateChange = (event, changes, setChanges, setUnsaved) => {
        const fieldName = event.target.name
        const newChanges = {...changes}
        const newDate = event.target.value
        newChanges[fieldName] = newDate
        setChanges(newChanges)
        setUnsaved(true)
    }

    // handles changes to checkboxes
    handleCheckChange = (event, changes, setChanges, setUnsaved) => {
        const fieldName = event.target.name
        const newChanges = {...changes}
        newChanges[fieldName] = newChanges[fieldName] ? false : true
        setChanges(newChanges)
        setUnsaved(true)
    }

}

export default new handleChanges