import QtsnPost from "./qtsnPost.js";
import PageBar from "../pageBar.js";

export default function qstnsDisplayBlock(props) {
  let questionElements = [];

  for (
    let i = (props.currentPage - 1) * 5;
    (i < props.qstnsList.length && i < (props.currentPage - 1)*5 + 5);
    i++
  ) {
    console.log(i);
    questionElements.push(props.qstnsList[i]);
  }

  return (
    <div className="content-div" id="question-list">
      {questionElements.map((qstn) => (
        <QtsnPost
          qstn={qstn}
          key={qstn._id}
          userStatus = {props.userStatus}
        />
      ))}
      <div className="post"> </div>
      <PageBar
        incrementPageNum={props.incrementPageNum}
        decrementPageNum={props.decrementPageNum}
        pageNum={props.currentPage}
      ></PageBar>
    </div>
  );
}
