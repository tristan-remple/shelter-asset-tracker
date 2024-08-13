import { useState, useContext, useEffect } from "react"
import Button from "../Reusables/Button"
import capitalize from "../Services/capitalize"
import handleChanges from "../Services/handleChanges"
import { statusContext } from "../Services/Context"
import apiService from "../Services/apiService"

//------ MODULE INFO
// ** Available for SCSS **
// Displays a modal that allows the user to select a new icon for a category
// Imported by: CategoryEdit

const IconSelector = ({ changes, setChanges, toggle }) => {

    const { status, setStatus } = useContext(statusContext)

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

    const pickIcon = (event) => {
        const target = parseInt(event.target.id)
        const selectedIcon = iconList.filter(icon => icon.id === target)[0]
        const newChanges = {...changes}
        newChanges.icon = selectedIcon
        setChanges(newChanges)
        toggle()
    }

    const keyboardHandler = (event) => {
        if (event.code === "Enter" || event.code === "Space") {
            pickIcon()
        } else if (event.code === "ArrowDown") {
            document.getElementById("upload-icon-btn").focus()
        }
    }

    const [ uploadForm, setUploadForm ] = useState(false)
    const toggleUpload = () => {
        const newForm = uploadForm ? false : true
        setUploadForm(newForm)
    }

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

    useEffect(() => {
        if (uploadForm) {
            document.getElementById("uploader").focus()
        }
    }, [ uploadForm ])

    const [ file, setFile ] = useState(null)
    const [ preview, setPreview ] = useState(null)

    useEffect(() => {
        if (!file) {
            setPreview(null)
            return
        }
        const filepath = URL.createObjectURL(file)
        setPreview(filepath)
        return () => URL.revokeObjectURL(filepath)
    }, [ file ])

    const handleUpload = () => {
        if (file) {
            if (uploaderChanges.name === "") {
                setStatus("An icon label sets the hover and alt text for that icon, and helps people understand what it is. Please set one before uploading.")
                return
            } else if (iconList.map(icon => icon.name).includes(uploaderChanges.name)) {
                setStatus("An icon with that name already exists. If you're sure you want to upload this icon, give it a different name.")
                return
            }

            const ext = file.type.split("/")[1]
            const date = new Date().getTime()

            const iconSubmission = {
                name: uploaderChanges.name.toLowerCase(),
                file,
                date,
                ext
            }
            
            apiService.uploadIcon(iconSubmission, (res) => {
                if (res.error) {
                    setStatus("We were not able to upload your icon.")
                } else {
                    setStatus(`The icon ${ res.name } has been created.`)
                    setNewIcons(res.name)
                    setUploadForm(false)
                }
            })
        }
    }

    const [ unsaved, setUnsaved ] = useState(false)
    const [ uploaderChanges, setUploaderChanges ] = useState({
        name: ""
    })

    const [ deleteMode, setDeleteMode ] = useState(false)
    const toggleDeleteMode = () => {
        const newDeleteMode = deleteMode ? false : true
        setDeleteMode(newDeleteMode)
    }

    const [ iconsToDelete, setIconsToDelete ] = useState([])
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

    const confirmDelete = () => {
        console.log(iconsToDelete)
        const count = iconsToDelete.length
        apiService.deleteIcons(iconsToDelete, data => {
            if (data.error) {
                setStatus("We weren't able to delete the icons you selected.")
            } else {
                setStatus(`You have deleted ${ count } icons.`)
                setIconsToDelete([])
                setDeleteMode(false)
            }
        })
    }

    const trap = (event) => {
        console.log(event)
        if (event.code === "Tab" && event.shiftKey === true) {
            event.preventDefault()
        }
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
            { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
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
                    <Button text={ `Delete ${ iconsToDelete.length } icons` } linkTo={ confirmDelete } type="danger" />
                </div> )}
                <div className="col d-flex justify-content-center">
                    <Button text="Close Selector" linkTo={ toggle } type="nav" />
                </div>
            </div>
            { uploadForm && (
            <div id="icon-uploader" className="row row-info">
                <div className="col col-info">
                    <div className="col-head">
                        File
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
                        Label
                    </div>
                    <div className="col-content">
                        <input className='my-2'
                            type="text" 
                            name="name" 
                            value={ uploaderChanges.name } 
                            onChange={ (event) => handleChanges.handleTextChange(event, uploaderChanges, setUploaderChanges, setUnsaved) } 
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