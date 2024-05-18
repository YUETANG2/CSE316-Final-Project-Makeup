import Comment from "./comment.js";
import PageBar from "../pageBar.js";

export default function commentSection(props) {
  let commentsElements = [];

  for (
    let i = (props.currentPage - 1) * 3;
    i < props.commentIDsList.length && i < (props.currentPage - 1) * 3 + 3;
    i++
  ) {
    console.log(i);
    commentsElements.push(props.commentIDsList[i]);
  }

  return (
    <div className="comment-section">
      {commentsElements.map((commentId) => (
        <Comment
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

      <form className="comment-input">
        <label id="new-comment-text"> Add new comment: </label>
        <input type="text" id="new-comment-input" />
        <button id="add-comment-button"> Add Comment </button>
      </form>
    </div>
  );
}
