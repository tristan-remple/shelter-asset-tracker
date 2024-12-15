// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext } from '../Services/Context'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import ChangePanel from '../Components/ChangePanel'
import Statusbar from '../Components/Statusbar'

//------ MODULE INFO
// This module checks that the user wants to delete a unit.
// Imported by: App

const UnitDelete = () => {

    const navigate = useNavigate()

    // get context information
    const { id } = useParams()
    const { setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")
    
    // validate id
    if (id === undefined) {
        setErr("undefined")
    }

    // fetch data from the api
    const [ response, setResponse ] = useState({})
    useEffect(() => {
        (async()=>{
            await apiService.singleUnit(id, function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setResponse(data)
                    if (data.items.length > 0) {
                        setStatus({
                            message: "You cannot delete a unit that contains items.",
                            error: true
                        })
                        navigate(`/unit/${ id }`)
                    } else {
                        setStatus({
                            message: `Click Save to delete unit ${ data.name }.`,
                            error: false
                        })
                        setErr(null)
                    }
                }
            })
        })()
    }, [])

    const confirmDelete = async() => {
        await apiService.deleteUnit(response, (delres) => {
            if (delres.error) {
                setErr(delres.error)
            } else {
                setStatus({
                    message: `You have successfully deleted unit ${ delres.name }.`,
                    error: false
                })
                navigate(`/location/${ delres.facilityId }`)
            }
        })
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Deleting Unit { response?.name } in { response?.facility.name }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/unit/${ id }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <ChangePanel save={ confirmDelete } linkOut={ `/unit/${ id }` } locationId={ response?.facility.id } />
            </div>
        </main>
    )
}

export default UnitDelete