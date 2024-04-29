// internal dependencies
import { friendlyDate } from "../Services/dateHelper"

//------ MODULE INFO
// ** Available for SCSS **
// This module displays a single comment, with it's meta-information.
// It takes a comment object.
// Imported by: CommentBox

const Comment = ({ comment: cmt }) => {

    const { createdAt, inspectedBy, comment } = cmt

    return (
        <div className="comment">
            <p>{ comment }</p>
            <p className="comment-meta">
                { inspectedBy.name } on { friendlyDate(createdAt) }
            </p>
            <hr />
        </div>
    )
}

export default Comment