import Comment from "./comment.js";
import PageBar from "../pageBar.js";
import getUserPtn from "../../utils/getUserRepPts.js";
import { useState } from "react";
import axios from "axios";

export default function CommentSection(props) {
  let commentsElements = [];
  const [errors, setErrors] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  for (
    let i = (props.currentPage - 1) * 3;
    i < props.commentIDsList.length && i < (props.currentPage - 1) * 3 + 3;
    i++
  ) {
    console.log(i);
    commentsElements.push(props.commentIDsList[i]);
  }

  // Handle form submission
  let handleChange = (event) => {
    setNewMessage(event.target.value);
  };

  let insertComment = async (event, postId) => {
    event.preventDefault();
    //check if comment is valid
    //no more than 140
    //user has to have more than 50 points
    let isGood = true;
    let errMsg = [];
    let points = await getUserPtn("*");
    if (points < 50) {
      errMsg.push("reputation-points");
      isGood = false;
    }

    if (newMessage.length > 140) {
      errMsg.push("comment-length");
      isGood = false;
    }

    if (isGood) {
      let newCommentData = {
        comment: newMessage,
        postId: postId,
      };
      let res = await axios.post(
        "http://127.0.0.1:8000/comment/addComment",
        newCommentData
      );

      console.log(res);
      setErrors([]);
      setNewMessage("");
    } else {
      setErrors(errMsg);
    }
    props.triggerRender();
  };

  return (
    <div className="comment-section">
      {commentsElements.map((commentId) => (
        <Comment
          userStatus={props.userStatus}
          commentId={commentId}
          key={commentId}
          calculateTimePosted={props.calculateTimePosted}
        />
      ))}

      <PageBar
        incrementPageNum={props.incrementPageNum}
        decrementPageNum={props.decrementPageNum}
        pageNum={props.currentPage}
      ></PageBar>

      {props.userStatus === "user" && (
        <div>
          <form
            className="comment-input"
            onSubmit={(event) => insertComment(event, props.postId)}
          >
            <label id="new-comment-text"> Add new comment: </label>
            <input
              type="text"
              id="new-comment-input"
              value={newMessage}
              onChange={handleChange}
            />
            <button type="submit" id="add-comment-button">
              {" "}
              Add Comment{" "}
            </button>
          </form>
          {errors.includes("reputation-points") && (
            <p className="err-msg" id="err-comment-ptn">
              {" "}
              *You need at least 50 reputation points to make a comment{" "}
            </p>
          )}
          {errors.includes("comment-length") && (
            <p className="err-msg" id="err-comment-length">
              {" "}
              *The length of a new tag cannot be more than 140 characters{" "}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
