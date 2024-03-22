import { friendlyDate } from "../Services/dateHelper"

//------ MODULE INFO
// This module displays a single comment, with it's meta-information.
// It takes a comment object.
// Imported by: CommentBox

const Comment = ({ comment }) => {

    const { commentDate, userName, commentText } = comment

    return (
        <div className="comment">
            <p>{ commentText }</p>
            <p className="comment-meta">
                { userName } on { friendlyDate(commentDate) }
            </p>
            <hr />
        </div>
    )
}

export default Comment