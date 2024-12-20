// external dependencies
import { useState, useContext, useEffect } from "react"

// internal dependencies
import capitalize from "../Services/capitalize"
import { statusContext } from "../Services/Context"
import apiService from "../Services/apiService"

// components
import Button from "../Components/Button"
import Statusbar from "../Components/Statusbar"
import RegularField from "../Components/RegularField"

//------ MODULE INFO
// Displays a modal that allows the user to select a new icon for a category.
// This is the only way for the user to interact with icons directly.
// It allows uploading and deleting icons as well.
// Imported by: CategoryEdit, CategoryCreate

const IconSelector = ({ changes, setChanges, toggle }) => {

    // get context
    const { setStatus } = useContext(statusContext)
    const [ forceValidation, setForceValidation ] = useState(0)

    // fetch icons from the api
    // the newIcons state causes the call to be made again when new icons are uploaded.
    // the actual value of newIcons doesn't matter, just whether it has changed.
    const [ iconList, setIconList ] = useState([])
    const [ newIcons, setNewIcons ] = useState("")
    useEffect(() => {
        (async() => {
            await apiService.listIcons((data) => {
                if (data.error) {
                    setErr(data.error)
                } else {
                    setIconList(data)
                }
            })
        })()
    }, [ newIcons ])

    // when an icon is selected, set it to the category and close the selector modal
    const pickIcon = (event) => {
        if (!changes.index) {
            const target = parseInt(event.target.id)
            const selectedIcon = iconList.filter(icon => icon.id === target)[0]
            const newChanges = {...changes}
            newChanges.icon = selectedIcon
            setChanges(newChanges)
            toggle()
        }
    }

    // keyboard handler
    // selects the icon on enter or space
    // skips to the buttons below the icon list on arrowdown
    const keyboardHandler = (event) => {
        if (event.code === "Enter" || event.code === "Space") {
            pickIcon()
        } else if (event.code === "ArrowDown") {
            document.getElementById("upload-icon-btn").focus()
        }
    }

    // state that toggles the upload form to be hidden or displayed
    const [ uploadForm, setUploadForm ] = useState(false)
    const toggleUpload = () => {
        const newForm = uploadForm ? false : true
        setUploadForm(newForm)
    }

    // render the icons
    const displayIcons = iconList.map(icon => {
        return <img
            className="icon-pick" 
            key={ icon.id }
            id={ icon.id } 
            alt={ icon.alt }
            title={ capitalize(icon.name) }
            src={ `/img/${ icon.src }` } 
            onClick={ pickIcon }
            onKeyUp={ keyboardHandler }
            tabIndex={ uploadForm ? -1 : 0 }
        />
    })

    // when the upload form is opened, focus on it
    useEffect(() => {
        if (uploadForm) {
            document.getElementById("uploader").focus()
        }
    }, [ uploadForm ])

    // file and icon preview state
    const [ file, setFile ] = useState(null)
    const [ preview, setPreview ] = useState(null)

    // change the preview when the file is updated
    useEffect(() => {
        if (!file) {
            setPreview(null)
            return
        }

        console.log(file)
        const filepath = URL.createObjectURL(file)
        setPreview(filepath)

        // don't keep the temporary filepath longer than necessary
        return () => URL.revokeObjectURL(filepath)
    }, [ file ])

    // handles icon upload
    const handleUpload = () => {

        if (!file) {
            setStatus({
                message: "You have not selected a file for upload.",
                error: true
            })
            return
        }

        // label validation
        if (uploaderChanges.name.length > 255) {
            setStatus({
                message: "This icon label is too long.",
                error: true
            })
            return
        } else if (uploaderChanges.name === "") {
            setStatus({
                message: "An icon label sets the hover and alt text for that icon, and helps people understand what it is. Please set one before uploading.",
                error: true
            })
            return
        } else if (iconList.map(icon => icon.name).includes(uploaderChanges.name)) {
            setStatus({
                message: "An icon with that name already exists. If you're sure you want to upload this icon, give it a different name.",
                error: true
            })
            return
        }

        // get the file extension and date
        const ext = file.type.split("/")[1]
        const date = new Date().getTime()

        // validate the file itself
        if (ext !== "jpg" && ext !== "jpeg" && ext !== "png") {
            setStatus({
                message: "Icons must be in JPG or PNG format.",
                error: true
            })
            return
        }
        if (file.size > 1000000) {
            setStatus({
                message: "Icons must be smaller than 1 MB.",
                error: true
            })
            return
        }

        // create the icon object
        const iconSubmission = {
            name: uploaderChanges.name.toLowerCase(),
            file,
            date,
            ext
        }
        
        // send the icon object to the api
        apiService.uploadIcon(iconSubmission, (res) => {
            if (res.error) {
                setStatus({
                    message: "We were not able to upload your icon.",
                    error: true
                })
            } else {
                setStatus({
                    message: `The icon ${ res.name } has been created.`,
                    error: false
                })
                setNewIcons(res.name)
                setUploadForm(false)
            }
        })
    }

    // the unsaved changes window doesn't appear here, but our form handling still expects the state
    // likewise, a changes object is expected rather than a string
    const [ unsaved, setUnsaved ] = useState(false)
    const [ uploaderChanges, setUploaderChanges ] = useState({
        name: "",
        errorFields: []
    })

    // toggles mass delete mode
    const [ deleteMode, setDeleteMode ] = useState(false)
    const toggleDeleteMode = () => {
        const newDeleteMode = deleteMode ? false : true
        setDeleteMode(newDeleteMode)
    }

    // list of icons to delete, id only
    const [ iconsToDelete, setIconsToDelete ] = useState([])

    // toggles an icon to be deleted or kept
    const toggleIconForDelete = (event) => {
        const id = parseInt(event.target.id)
        const newIconsToDelete = [...iconsToDelete]
        if (event.target.getAttribute("data-checked") === "true") {
            const index = newIconsToDelete.findIndex(iconId => iconId === id)
            newIconsToDelete.splice(index, 1)
        } else {
            newIconsToDelete.push(id)
        }
        setIconsToDelete(newIconsToDelete)
    }

    const keyboardDeleteHandler = (event) => {
        if (event.code === "Enter" || event.code === "Space") {
            toggleIconForDelete()
        }
    }

    // render icons in delete mode
    const displayDeletableIcons = iconList.map(icon => {
        return <img
            className={ "icon-pick " + (iconsToDelete.filter(id => id === icon.id).length > 0 ? "being-deleted" : "can-delete") }
            key={ icon.id }
            id={ icon.id } 
            alt={ icon.alt }
            title={ capitalize(icon.name) }
            src={ `/img/${ icon.src }` } 
            tabIndex={ uploadForm ? -1 : 0 }
            onClick={ toggleIconForDelete }
            onKeyUp={ keyboardDeleteHandler }
            data-checked={ (iconsToDelete.filter(id => id === icon.id).length > 0).toString() }
        />
    })

    // sends the icons to delete as an array of id numbers to the api
    const confirmDelete = () => {
        const count = iconsToDelete.length
        if (count > 1) {
            setStatus({
                message: "You have not selected any icons to delete.",
                error: true
            })
            return
        }
        apiService.deleteIcons(iconsToDelete, data => {
            if (data.error) {
                setStatus({
                    message: "We weren't able to delete the icons you selected.",
                    error: true
                })
            } else {
                const successCount = data.deletedIcons
                const word = count > 1 ? "icons" : "icon"
                const verb = count > 1 ? "have" : "has"
                setNewIcons(successCount.toString())
                if (successCount === count) {
                    setStatus({
                        message: `${ count } ${ word } ${ verb } been deleted.`,
                        error: false
                    })
                } else {
                    let newStatus = `${ successCount } out of the ${ count } ${ word } you were trying to delete ${ verb } been successfully deleted.`
                    if (data.failed.some(failure => failure.error.includes("Dependency"))) {
                        newStatus += ` One or more of the icons is currently being used for a category, and therefore cannot be deleted.`
                    }
                    setStatus({
                        message: newStatus,
                        error: true
                    })
                }
                setIconsToDelete([])
                setDeleteMode(false)
            }
        })
    }

    // keep keyboard navigation inside the modal
    const trap = (event) => {
        if (event.code === "Tab" && event.shiftKey === true) {
            event.preventDefault()
        }
    }

    const formControls = { 
        changes: uploaderChanges,
        setChanges: setUploaderChanges,
        unsaved,
        setUnsaved, 
        force: forceValidation
    }

    return (
        <div id="icon-selector-box">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Icon Selector</h2>
                </div>
                <div className="col keyboard-helper" tabIndex={ 0 } onKeyDown={ trap } >
                    Keyboard naviagtion is trapped on this modal until it closes.
                </div>
            </div>
            <Statusbar />
            <div className="icon-selector">
                { deleteMode ? displayDeletableIcons : displayIcons }
            </div>
            <div className="row col-content">
                <div className="col d-flex justify-content-center">
                    <Button text="Upload New Icon" linkTo={ toggleUpload } type="nav" id="upload-icon-btn" />
                </div>
                <div className="col d-flex justify-content-center">
                    <Button text={ deleteMode ? "Cancel Delete" : "Delete Icons" } linkTo={ toggleDeleteMode } type="nav" />
                </div>
                { deleteMode && (<div className="col d-flex justify-content-center">
                    <Button text={ `Delete ${ iconsToDelete.length } icon(s)` } linkTo={ confirmDelete } type="danger" />
                </div> )}
                <div className="col d-flex justify-content-center">
                    <Button text="Close Selector" linkTo={ toggle } type="nav" />
                </div>
            </div>
            { uploadForm && (
            <div id="icon-uploader" className="row row-info">
                <div className="col col-info">
                    <div className="col-head">
                        File *
                    </div>
                    <div className="col-content">
                        <input type="file" id="uploader" accept="image/png,image/jpg,image/jpeg" onChange={ (e) => setFile(e.target.files[0]) } />
                    </div>
                </div>
                <div className="col col-info">
                    <div className="col-head">
                        Icon Preview
                    </div>
                    <div className="col-content">
                        { preview ? <img className="icon-pick" src={ preview } style={{ maxWidth: 100 + "px", maxHeight: 100 + "px" }} /> :
                        "Awaiting file..." }
                    </div>
                </div>
                <div className="col col-info">
                    <div className="col-head">
                        Label *
                    </div>
                    <div className="col-content">
                        <RegularField 
                            type="text"
                            name="name"
                            formControls={ formControls }
                            required={ true }
                        />
                    </div>
                </div>
                <div className="row col-content btn-row">
                    <div className="col d-flex justify-content-center">
                        <Button text="Upload Icon" linkTo={ handleUpload } type="action" />
                    </div>
                    <div className="col d-flex justify-content-center">
                        <Button text="Close Uploader" linkTo={ toggleUpload } type="nav" />
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}

export default IconSelector