import { useContext, useState } from "react"
import { statusContext } from "../Services/Context"

import apiService from "../Services/apiService"
import handleChanges from "../Services/handleChanges"

import Error from "../Reusables/Error"
import Button from "../Reusables/Button"
import ChangePanel from "../Reusables/ChangePanel"

const Settings = () => {

    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState(null)

    const [ unsaved, setUnsaved ] = useState(false)
    const [ changes, setChanges ] = useState({
        depreciationRate: 0,
        name: "",
        url: "",
        logoSrc: ""
    })

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
        } else if (changes.name === "" || changes.url === "" || changes.logoSrc === "") {
            setStatus("Please set your organization's identity.")
            return
        }

        await apiService.postSettings(changes, (res) => {
            if (res.success) {
                setStatus(`You have successfully saved your changes to the settings.`)
                setUnsaved(false)
            } else {
                setStatus("We weren't able to process the changes to the settings.")
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
                { unsaved && <ChangePanel save={ saveChanges } linkOut="/admin" /> }
            </div>
        </main>
    )
}

export default Settings