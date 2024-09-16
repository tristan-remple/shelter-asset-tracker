// internal dependencies
import capitalize from '../Services/capitalize'

const Tag = ({ word, remove }) => {

    const keyboardHandler = (event) => {
        if (event.code === "Enter" || event.code === "Space") {
            remove(word)
        }
    }

    return (
        <div className="btn btn-small btn-secondary tag" id={ word } >
            { capitalize(word) }
            <span 
                className="remove" 
                onClick={ () => remove(word) } 
                onKeyUp={ keyboardHandler }
                tabIndex={ 0 }
            >×</span>
        </div>
    )
}

export default Tag