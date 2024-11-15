import { useContext } from "react"
import { statusContext } from "../Services/Context"

//------ MODULE INFO
// This module is displayed to inform the user of the results of their actions.
// The context imported is set in App.jsx
// Imported by: Almost everything

const Statusbar = () => {

    // get the current status; return empty if status is blank
    const { status } = useContext(statusContext)
    if (status.message === "") { return }

    // set the error class if needed
    let className = "row row-info"
    if (status.error) { className += " error" }

    return (
        <div className={ className }><p className='my-2'>{ status.message }</p></div>
    )
}

export default Statusbar