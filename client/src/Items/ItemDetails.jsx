import { useParams } from 'react-router-dom'

import Button from "../Reusables/Button"
import Flag from "../Reusables/Flag"
import apiService from "../Services/apiService"

const ItemDetails = () => {

    const { id } = useParams

    if (parseInt(id) == NaN) {
        return <Error />
    }

    const item = apiService.singleItem(id)
    if (item.error) {
        return <Error />
    }

    let flagColor = "grey"
    let flagText = "OK"
    if ( item.toDiscard ) {
        flagColor = "red"
        flagText = "Discard"
    } else if ( item.toAssess ) {
        flagColor  = "yellow"
        flagText = "Assess"
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h1>{ item.category.categoryName } in { item.unit.unitName }</h1>
                </div>
                <div className="col">
                    <Button text="Edit" linkTo={ `/item/${id}/edit` } type="action" />
                </div>
            </div>
            <div className="page-content">
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Label
                        </div>
                        <div className="col-content">
                            { item.itemLabel }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Item Category
                        </div>
                        <div className="col-content">
                            { item.category.categoryName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Updated By
                        </div>
                        <div className="col-content">
                            { item.inpsected.firstName } { item.inpsected.lastName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Updated At
                        </div>
                        <div className="col-content">
                            { item.inpsected.inspectedDate }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Status
                        </div>
                        <div className="col-content">
                            <Flag color={ flagColor } />
                            { flagText }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col-2 col-content col-icon">
                        <img className="img-fluid icon" src={ `img/${ item.category.categoryIcon }.png` } alt={ item.category.categoryName + " icon" } />
                    </div>
                    <div className="col-8 col-content">
                        <strong>Comments:</strong>
                        <p>{ item.comment }</p>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Acquired Date
                        </div>
                        <div className="col-content">
                            { item.added.addedDate }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Initial Value
                        </div>
                        <div className="col-content">
                            ${ item.initialValue.toFixed(2) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Current Value
                        </div>
                        <div className="col-content">
                            ${ item.currentValue.toFixed(2) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Vendor
                        </div>
                        <div className="col-content">
                            { item.vendor }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Donated
                        </div>
                        <div className="col-content">
                            { item.donated ? "Yes" : "No" }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            { item.unit.locationName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit
                        </div>
                        <div className="col-content">
                            { item.unit.unitName }
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ItemDetails