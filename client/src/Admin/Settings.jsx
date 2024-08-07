import { useContext, useState, useEffect } from "react"
import { statusContext } from "../Services/Context"

import apiService from "../Services/apiService"
import handleChanges from "../Services/handleChanges"

import Error from "../Reusables/Error"
import Button from "../Reusables/Button"
import ChangePanel from "../Reusables/ChangePanel"
import Tag from "../Reusables/Tag"

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
                    data.depreciationRate = +data.depreciationRate * 100
                    data.unitTypes = data.unitTypes.map(type => type.name)
                    setChanges(data)
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

    const handleUpload = () => {
        const file = document.getElementById("uploader").files[0]
        if (file) {
            const filepath = URL.createObjectURL(file)
            apiService.uploadLogo(filepath, (res) => {
                if (res.error) {
                    setStatus("We were not able to upload your logo.")
                } else {
                    setStatus(`The new logo has been uploaded successfully.`)
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
                                    <img className="img-fluid small-icon" src={ `/img/${ changes.logoSrc }` } />
                                </div>
                                <div className="col">
                                    <input type="file" id="uploader" accept="image/png,image/jpg,image/jpeg" />
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
                            <div className="row">
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