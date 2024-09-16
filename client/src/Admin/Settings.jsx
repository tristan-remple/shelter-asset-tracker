// external dependencies
import { useContext, useState, useEffect } from "react"

// internal dependencies
import { statusContext } from "../Services/Context"
import apiService from "../Services/apiService"
import handleChanges from "../Services/handleChanges"

// components
import Error from "../Components/Error"
import Button from "../Components/Button"
import ChangePanel from "../Components/ChangePanel"
import Tag from "../Components/Tag"

const Settings = () => {

    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState(null)

    const [ unsaved, setUnsaved ] = useState(false)
    const [ changes, setChanges ] = useState({
        depreciationRate: 0,
        unitTypes: [],
        name: "",
        url: "",
        logoSrc: ""
    })

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
                        logoSrc: data.settings.filter(sett => sett.name === "logoSrc")[0].value
                    }
                    console.log(newChanges)
                    setChanges(newChanges)
                }
            })
        })()
    }, [])

    const [ tagField, setTagField ] = useState("")
    const handleTagField = (event) => {
        const text = event.target.value
        setTagField(text)
    }

    const addTag = () => {
        const newChanges = {...changes}
        newChanges.unitTypes.push(tagField.toLowerCase())
        setChanges(newChanges)
        setTagField("")
        setUnsaved(true)
    }

    const removeTag = (word) => {
        const newChanges = {...changes}
        const index = newChanges.unitTypes.findIndex(unitType => unitType.toLowerCase() === word.toLowerCase())
        newChanges.unitTypes.splice(index, 1)
        setChanges(newChanges)
        setUnsaved(true)
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
            const ext = file.type.split("/")[1]
            const date = new Date().getTime()
            const logoSubmission = {
                file,
                date,
                ext
            }
            
            apiService.uploadLogo(logoSubmission, (res) => {
                if (res.error) {
                    setStatus("We were not able to upload your logo.")
                } else {
                    setStatus(`The logo has been changed.`)
                }
            })
        }
    }

    const saveChanges = async() => {
        if (changes.depreciationRate <= 0) {
            setStatus("The global depreciation rate must be a positive number.")
            return
        } else if (changes.name === "" || changes.url === "") {
            setStatus("Please set your organization's identity.")
            return
        } else if (changes.unitTypes.length === 0) {
            setStatus("Please set some unit types.")
            return
        }

        const newChanges = {...changes}
        newChanges.depreciationRate = newChanges.depreciationRate / 100

        await apiService.postSettings(newChanges, (res) => {
            if (res.error) {
                setErr(res.error)
            } else {
                setStatus(`You have successfully saved your changes to the settings.`)
                setUnsaved(false)
            }
        })
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
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Organization Title
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="name" 
                                value={ changes.name } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Organization URL
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="url" 
                                value={ changes.url } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
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
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Global Depreciation Rate (Percent)
                        </div>
                        <div className="col-content">
                            <input 
                                type="number" 
                                name="depreciationRate" 
                                value={ changes.depreciationRate } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Possible Unit Types
                        </div>
                        <div className="col-content">
                            { changes.unitTypes.length === 0 ? 
                            "There are no possible unit types yet. Please set some with the field below." : 
                            changes.unitTypes.map(tag => {
                                return <Tag word={ tag } key={ tag } remove={ removeTag } />
                            })
                            }
                        </div>
                        <div className="col-content">
                            <div className="row" id="submit-tag">
                                <div className="col">
                                    <input 
                                        type="text" 
                                        name="tag" 
                                        value={ tagField } 
                                        onChange={ (event) => handleTagField(event) } 
                                    />
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