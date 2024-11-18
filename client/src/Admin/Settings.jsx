// external dependencies
import { useContext, useState, useEffect } from "react"

// internal dependencies
import { statusContext } from "../Services/Context"
import apiService from "../Services/apiService"

// components
import Error from "../Components/Error"
import Button from "../Components/Button"
import ChangePanel from "../Components/ChangePanel"
import Tag from "../Components/Tag"
import Statusbar from "../Components/Statusbar"
import RegularField from "../Components/RegularField"

//------ MODULE INFO
// This page allows the admin to set some global variables.
// * Organization Title (displayed in Header and Footer)
// * Organization URL (displayed in Footer)
// * Organization Logo (displayed in Header)
//     * Note that the Logo upload is handled separately.
// * Global Depreciation Rate (used to calculate items' current value)
// * Possible Unit Types (used by UnitCreate, UnitEdit)
// * Admin Email and Admin Password (the from email for password reset notifications)
// Imported by: App
// Nativated from: Dashboard

const Settings = () => {

    // setup
    const { setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")
    const [ forceValidation, setForceValidation ] = useState(0)

    // form handling
    const [ unsaved, setUnsaved ] = useState(false)
    const [ changes, setChanges ] = useState({
        depreciationRate: 0,
        unitTypes: [],
        name: "",
        url: "",
        logoSrc: "",
        errorFields: []
    })

    // get current settings from the API
    useEffect(() => {
        (async()=> {
            await apiService.getSettings(data => {
                if (data.error) {
                    setErr(data.error)
                } else {
                    const newChanges = {
                        depreciationRate: +data.settings.filter(sett => sett.name === "depreciationRate")[0].value * 100,
                        unitTypes: data.unitTypes.map(type => type.name),
                        name: data.settings.filter(sett => sett.name === "name")[0].value,
                        url: data.settings.filter(sett => sett.name === "url")[0].value,
                        logoSrc: data.settings.filter(sett => sett.name === "logoSrc")[0].value,
                        errorFields: []
                    }
                    setChanges(newChanges)
                    setErr(null)
                }
            })
        })()
    }, [])

    // text field where users can enter new unit types as tags
    const [ tagField, setTagField ] = useState("")
    const [ tagError, setTagError ] = useState(null)
    const handleTagField = (event) => {
        const text = event.target.value
        const newTagError = text.length > 255 ? "Input is too long." : null
        setTagError(newTagError)
        setTagField(text)
    }

    // add unit type (tag formatted)
    const addTag = () => {
        if (!tagError) {
            const newChanges = {...changes}
            newChanges.unitTypes.push(tagField.toLowerCase())
            setChanges(newChanges)
            setTagField("")
            setUnsaved(true)
        }
    }

    // remove unit type (tag formatted)
    const removeTag = (word) => {
        const newChanges = {...changes}
        const index = newChanges.unitTypes.findIndex(unitType => unitType.toLowerCase() === word.toLowerCase())
        newChanges.unitTypes.splice(index, 1)
        setChanges(newChanges)
        setUnsaved(true)
    }

    // handling file uploading and preview for the logo
    const [ file, setFile ] = useState(null)
    const [ preview, setPreview ] = useState(null)

    // when the file changes, update the preview and file
    useEffect(() => {
        if (!file) {
            setPreview(null)
            return
        }
        const filepath = URL.createObjectURL(file)
        setPreview(filepath)

        // don't keep the temporary filepaths for longer than necessary
        return () => URL.revokeObjectURL(filepath)
    }, [ file ])

    // handle uploading of a new logo
    const handleUpload = () => {
        if (file) {
            const ext = file.type.split("/")[1]
            const date = new Date().getTime()
            const logoSubmission = {
                file,
                date,
                ext
            }
            
            apiService.uploadLogo(logoSubmission, (res) => {
                if (res.error) {
                    setStatus({
                        message: "We were not able to upload your logo.",
                        error: true
                    })
                } else {
                    setStatus({
                        message: `The logo has been changed.`,
                        error: false
                    })
                }
            })
        }
    }

    const checkUrl = (url) => {
        let urlError = null
        if (!url.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) { urlError = "Invalid URL." }
        if (url.substring(0, 7) !== "http://" && url.substring(0, 8) !== "https://") { urlError = "URL must begin with http:// or https://" }
        return urlError
    }

    // save settings changes
    const saveChanges = async() => {

        // validation
        if (changes.name === "" || changes.url === "" || changes.depreciationRate === "" || changes.depreciationRate === 0 || changes.unitTypes.length === 0 || changes.errorFields.length > 0 || tagError) {
            setForceValidation(forceValidation + 1)
            setStatus({
                message: "Please review the form again to make sure all input is valid.",
                error: true
            })
            return
        }
        
        if (changes.unitTypes.length === 0) {
            setStatus({
                message: "Please set some unit types.",
                error: true
            })
            return
        }

        // convert the depreciation from percent to decimal
        const newChanges = {...changes}
        newChanges.depreciationRate = newChanges.depreciationRate / 100

        // send the updates to the api
        await apiService.postSettings(newChanges, (res) => {
            if (res.error) {
                setErr(res.error)
            } else {
                setStatus({
                    message: `You have successfully saved your changes to the settings.`,
                    error: false
                })
                setUnsaved(false)
            }
        })
    }

    const formControls = {
        changes,
        setChanges,
        unsaved,
        setUnsaved,
        force: forceValidation
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Global Settings</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo="/admin" type="nav" />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Organization Title
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
                    <div className="col col-info">
                        <div className="col-head">
                            Organization URL
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="text"
                                name="url"
                                formControls={ formControls }
                                checks={[ checkUrl ]}
                                required={ true }
                            />
                        </div>
                    </div>
                    {/* 
                    // this block will allow the user to change their organization icon in the header
                    // if you implement this, you can probably use an altered version of the icon uploader
                    // but we decided it was nonessential
                    <div className="col col-info">
                        <div className="col-head">
                            Organization Logo
                        </div>
                        <div className="col-content">
                            <div className="row">
                                <div className="col-2">
                                    <img className="img-fluid small-icon" src={ preview } />
                                </div>
                                <div className="col">
                                    <input type="file" id="uploader" accept="image/png,image/jpg,image/jpeg" onChange={ (e) => setFile(e.target.files[0]) } />
                                </div>
                            </div>
                        </div>
                        <div className="col-content">
                            <Button text="Upload Logo" linkTo={ handleUpload } type="action" />
                        </div>
                    </div> */}
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Global Depreciation Rate (Percent)
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="number"
                                name="depreciationRate"
                                formControls={ formControls }
                                required={ true }
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Possible Unit Types
                        </div>
                        { changes.unitTypes.length === 0 ? 
                            <div className="row row-info error">
                                <p className="my-2">There are no possible unit types yet. Please set some with the field below.</p>
                            </div> : 
                                <div className="col-content">
                                { changes.unitTypes.map(tag => {
                                    return <Tag word={ tag } key={ tag } remove={ removeTag } />
                                }) }
                            </div>
                        }
                        <div className="col-content">
                            <div className="row" id="submit-tag">
                                <div className="col">
                                    <input 
                                        type="text" 
                                        name="tag" 
                                        value={ tagField } 
                                        onChange={ (event) => handleTagField(event) } 
                                        className={ tagError && "error" }
                                    />
                                    { tagError && <div className="row row-info error error-message"><p className="my-2">{ tagError }</p></div> }
                                </div>
                                <div className="col">
                                    <Button text="Add Type" linkTo={ addTag } type="action" />
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut="/admin" /> }
            </div>
        </main>
    )
}

export default Settings