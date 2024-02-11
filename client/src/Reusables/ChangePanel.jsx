import { useContext } from "react"

// internal dependencies
import { statusContext } from "../Services/Context"

// components
import Button from "./Button"

//------ MODULE INFO
// This module displays a warning when the user has made changes in a form and has not saved.
// It takes in a save function parameter, which needs to be defined in the parent as an API call.
// The save function should also dismiss this component.
// It also takes in linkOut as the link the user clicked on to prompt this warning.
//-! Depending on how linkReturn handles form data, this component may need to be adjusted.
//-? Should this be a modal?
// Imported by: 

const ChangePanel = ({ save, linkOut }) => {

    // allow this component to change the global status message
    const { setStatus } = useContext(statusContext)

    // if the user saves stay on this page and change the status
    const clickSave = () => {
        save()
        setStatus("You have saved your changes.")
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <img src="/img/warning.png" alt="Warning triangle icon" />
                </div>
                <div className="col">
                    <h3>Do you want to save your changes?</h3>
                    <div className="row">
                        <div className="col">
                            <Button text="Save" linkTo={ clickSave } type="action" />
                        </div>
                        <div className="col">
                            <Button text="Don't Save" linkTo={ linkOut } type="danger" />
                        </div>
                        <div className="col">
                            <Button text="Cancel" linkTo={ null } type="nav" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePanel