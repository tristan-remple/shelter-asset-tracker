// components
import Button from "./Button"

//------ MODULE INFO
// This module displays a warning when the user has made changes in a form and has not saved.
// It takes in a save function parameter, which needs to be defined in the parent as an API call.
// The save function should also dismiss this component or redirect to another page.
// It also takes in linkOut as the link the user clicked on to prompt this warning.
//-! Depending on how linkReturn handles form data, this component may need to be adjusted.
//-? Should this be a modal?
// Imported by: ItemEdit, ItemCreate, LocationCreate, LocationEdit, LocationDelete, UnitDelete

const ChangePanel = ({ save, linkOut, locationId }) => {

    // if the user saves stay on this page and change the status
    const clickSave = () => {
        save()
    }

    return (
        <div className="row row-info">
            <div className="col-3 d-flex justify-content-center align-items-center">
                <img src="/img/warningTriangle.jpg" alt="Warning triangle icon" className="triangle"/>
            </div>
            <div className="col">
                <h3>Do you want to save your changes?</h3>
                <div className="row change-btnrow">
                    <div className="col">
                        <Button text="Save" linkTo={ clickSave } type="action" />
                    </div>
                    <div className="col">
                        <Button text="Don't Save" linkTo={ linkOut } type="danger" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePanel