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

    const { setStatus } = useContext(statusContext)

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
        }
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
        />
    })

    const [ uploadForm, setUploadForm ] = useState(false)
    const toggleUpload = () => {
        const newForm = uploadForm ? false : true
        setUploadForm(newForm)
    }

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
            }
            const filepath = URL.createObjectURL(file)
            const iconSubmission = {
                name: uploaderChanges.name.toLowerCase(),
                alt: uploaderChanges.name.toLowerCase() + " icon",
                src: filepath,
                file: file
            }
            apiService.uploadIcon(iconSubmission, (res) => {
                if (res.error) {
                    setStatus("We were not able to upload your icon.")
                } else {
                    setStatus(`The icon ${ res.name } has been created.`)
                    setNewIcons(res.name)
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
            className={ "icon-pick " + (iconsToDelete.filter(id => id === icon.id).length > 0 ? "btn-danger" : "btn-secondary") }
            key={ icon.id }
            id={ icon.id } 
            alt={ icon.alt }
            title={ capitalize(icon.name) }
            src={ `/img/${ icon.src }` } 
            onClick={ toggleIconForDelete }
            onKeyUp={ keyboardDeleteHandler }
            data-checked={ (iconsToDelete.filter(id => id === icon.id).length > 0).toString() }
        />
    })

    const confirmDelete = () => {
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

    return (
        <div id="icon-selector-box">
            <div className="icon-selector">
                { deleteMode ? displayDeletableIcons : displayIcons }
            </div>
            <Button text="Upload New Icon" linkTo={ toggleUpload } type="nav" />
            <Button text={ deleteMode ? "Cancel Delete" : "Delete Icons" } linkTo={ toggleDeleteMode } type="nav" />
            { deleteMode && <Button text={ `Delete ${ iconsToDelete.length } icons` } linkTo={ confirmDelete } type="danger" /> }
            { uploadForm && (
            <div className="row row-info">
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
                <div className="col col-info">
                    <div className="col-content">
                        <Button text="Upload Icon" linkTo={ handleUpload } type="action" />
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}

export default IconSelector