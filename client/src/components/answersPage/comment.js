import upvoteComment from "./upvoteComment.js";
import TextWithLinks from "./textWithLinks.js";

export default function comment(props) {

    return (
      <div className="comment-post">
        <span className="comment-post-text">
          <TextWithLinks  text={props.comment.text} key={props.comment._id}></TextWithLinks>
        </span>
        <div className="comment-post-user-info">
          <p>
            <span style={{ color: "blue" }}> {props.comment.comment_by} </span>{" "}
            commented {props.calculateTimePosted(new Date(props.comment.comment_date_time))}
          </p>
        </div>
      </div>
    );
  }
  