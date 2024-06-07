//------ MODULE INFO
// ** Available for SCSS **
// This module is an SVG flag that can be used to convey the overall status of an item.
// Valid colors are red, yellow, and grey.
// Imported by: ItemDetails, ItemEdit, UnitDetails

export const flagTextOptions = [ "OK", "Inspect", "Discard" ]
export const flagColorOptions = [ "grey", "yellow", "red" ]
export const flagOptions = [
    {
        text: "OK",
        color: "grey"
    },
    {
        text: "Inspect",
        color: "yellow"
    },
    {
        text: "Discard",
        color: "red"
    }
]

const Flag = ({ color }) => {

    // set the styling
    const flagStyle = "flag flag-" + color

    return (
        <svg className="flag-box" viewBox="0 0 26.458346 26.458338" >
            <g transform="translate(-50.064129,-75.889943)">
                <path
                    className={ flagStyle }
                    d="m 50.940279,76.766093 v 24.706037 h 4.571969 V 89.119108 h 20.134204 l -6.340519,-6.176509 6.340519,-6.176506 H 55.512248 52.167363 Z"
                />
            </g>
        </svg>
    )
}

export default Flag