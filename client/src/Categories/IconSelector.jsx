import capitalize from "../Services/capitalize"

const IconSelector = ({ icon, setIcon }) => {

    const availableIcons = [
        "bathtub", "bureau", "chair", "coffee-table", "console-table", "empty-bed", "fire-alarm", "fridge", "furniture", "garbage-disposal", "interior-mirror", "lamp", "lights", "microwave", "mosquito-net", "power-strip", "room", "sink", "smoke-detector", "sofa", "stove", "trash", "tv-show", "wc", "window-shade"
    ]

    const pickIcon = (event) => {
        const target = event.target.id
        const filename = `icons8-${ target }-100`
        setIcon(filename)
    }

    const displayIcons = availableIcons.map(icon => {
        const iconTitle = capitalize(icon.split("-").join(" "))
        return <img
            className="icon-pick" 
            key={ icon }
            id={ icon } 
            alt={ iconTitle }
            title={ iconTitle }
            src={ `/img/icons8-${ icon }-100.png` } 
            onClick={ pickIcon }
        />
    })

    return (
        <div id="icon-selector">
            { displayIcons }
        </div>
    )
}

export default IconSelector