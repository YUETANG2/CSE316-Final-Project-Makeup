import AnsPost from "./ansPost.js";
import PageBar from "../pageBar.js";

export default function AnsDisplayBlock(props) {
  let answerElements = [];

  for (
    let i = (props.currentPage - 1) * 5;
    i < props.answers.length && i < (props.currentPage - 1) * 5 + 5;
    i++
  ) {
    console.log(i);
    answerElements.push(props.answers[i]);
  }

  console.log("INSIDE ANS DISPLAY BLOCK"); 
  console.log(props.pageStatus); 

  return (
    <div className="content-div" id="answer-list">
      {answerElements.map((ans) => (
        <AnsPost
          pageStatus={props.pageStatus}
          ansId={ans}
          key={ans}
          calculateTimePosted={props.calculateTimePosted}
          userStatus={props.userStatus}
        />
      ))}

      <div className="ans-post"> </div>

      <PageBar
        incrementPageNum={props.incrementPageNum}
        decrementPageNum={props.decrementPageNum}
        pageNum={props.currentPage}
      ></PageBar>
    </div>
  );
}
