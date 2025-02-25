// internal dependencies
import { friendlyDate } from "../Services/dateHelper"

import Button from "./Button"

//------ MODULE INFO
// This module displays a single comment, with it's meta-information.
// It takes a comment object.
// Imported by: CommentBox

const Comment = ({ comment: cmt, setPreview }) => {

    const { createdAt, inspectedBy, comment, attachments } = cmt

    const clickToPreview = (filename) => {
        setPreview(filename)
    }

    const displayAttachments = attachments?.map(attach => {
        let filename = attach
        const ext = attach.split(".").pop()

        if (filename.length > 35) {
            filename = `${ filename.substring(0, 32) }...${ ext }`
        }

        if (ext == "png" || ext == "jpg" || ext == "jpeg")
        {
            return (
                <div className="attachment" key={ attach } >
                    <div className="btn btn-small btn-secondary btn-attachment" onClick={ () => clickToPreview(`/attachments/${ attach }`) } tabIndex={ 0 }>
                        <img src={ `/graphics/${ ext }.png` } className="attachment-icon" />
                        <span>{ filename }</span>
                    </div>
                    <Button text="Download" linkTo={ `/attachments/${ attach }` } type="small" id="atch-img" download={ true } />
                </div>
            )
        } else {
            return (
                <div className="attachment" key={ attach } >
                    <div className="btn btn-small btn-secondary btn-attachment no-hover">
                        <img src={ `/graphics/${ ext }.png` } className="attachment-icon" />
                        <span>{ filename }</span>
                    </div>
                    <Button text="Download" linkTo={ `/attachments/${ attach }` } type="small" id="atch-img" download={ true } />
                </div>
            )
        }
    })

    return (
        <div className="comment">
            <p>{ comment }</p>
            { displayAttachments.length > 0 && <div className="attachments">{ displayAttachments }</div> }
            <p className="comment-meta">
                { inspectedBy.name } on { friendlyDate(createdAt) }
            </p>
            <hr />
        </div>
    )
}

export default Comment