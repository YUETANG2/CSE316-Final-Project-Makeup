import Comment from "./comment.js";

export default function commentSection(props) {
let commentArray =[];
/*
for (
  let i = (props.currentPage - 1) * 5;
  (i < props.qstnsList.length && i < (props.currentPage - 1)*5 + 5);
  i++
) {
  console.log(i);
  questionElements.push(props.qstnsList[i]);
}
*/

return (
    <div className = "comment-section">

    {commentArray.map((comment) => (
    <Comment
      comment={comment}
      key={comment._id}
    />
  ))}
    </div>
    );
}