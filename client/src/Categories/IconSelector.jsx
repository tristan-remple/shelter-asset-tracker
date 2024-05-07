import { useState, useContext } from "react"
import Button from "../Reusables/Button"
import capitalize from "../Services/capitalize"
import handleChanges from "../Services/handleChanges"
import { statusContext } from "../Services/Context"
import apiService from "../Services/apiService"

//------ MODULE INFO
// ** Available for SCSS **
// Displays a modal that allows the user to select a new icon for a category
// Imported by: CategoryEdit

const IconSelector = ({ iconList, changes, setChanges, toggle }) => {

    const { setStatus } = useContext(statusContext)

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

    const handleUpload = () => {
        const file = document.getElementById("uploader").files[0]
        if (file) {
            if (uploaderChanges.name === "") {
                setStatus("An icon label sets the hover and alt text for that icon, and helps people understand what it is. Please set one before uploading.")
                return
            }
            const filepath = URL.createObjectURL(file)
            const iconSubmission = {
                name: uploaderChanges.name.toLowerCase(),
                alt: uploaderChanges.name.toLowerCase() + " icon",
                src: filepath
            }
            apiService.uploadIcon(iconSubmission, (res) => {
                if (res.error) {
                    setStatus("We were not able to upload your icon.")
                } else {
                    setStatus(`The icon ${ res.name } has been created.`)
                }
            })
        }
    }

    const [ unsaved, setUnsaved ] = useState(false)
    const [ uploaderChanges, setUploaderChanges ] = useState({
        name: ""
    })

    return (
        <div id="icon-selector-box">
            <div className="icon-selector">
                { displayIcons }
            </div>
            <Button text="Upload New Icon" linkTo={ toggleUpload } type="nav" />
            { uploadForm && (
            <div className="row row-info">
                <div className="col col-info">
                    <div className="col-head">
                        File
                    </div>
                    <div className="col-content">
                        <input type="file" id="uploader" accept="image/png" />
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