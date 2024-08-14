
const Checkbox = ({ id, name, checked, changeHandler }) => {

    const keyboardHandler = (event) => {
        if (event.code === "Enter" || event.code === "Space") {
            changeHandler()
        }
    }

    return (
        <>
            <label htmlFor={ id }>{ name }</label>
            <div className="checkbox" onClick={ (event) => changeHandler(event) } onKeyUp={ keyboardHandler } name={ id } id={ id } >
                { checked ? 
                    <p>✓</p> : 
                    <p style={{ opacity: 0 }} >0</p>
                }
            </div>
        </>
    )
}

export default Checkbox