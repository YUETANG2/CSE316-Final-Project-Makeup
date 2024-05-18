import AnsPost from "./ansPost.js";

export default function AnsDisplayBlock(props) {
let answers =[];
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

    {answers.map((ans) => (
      <AnsPost
        ans={ans}
        key={ans._id}
        calculateTimePosted={props.calculateTimePosted}
        switchTo={props.switchTo}
      />
    ))}
    </div>
    );
}

















<div className="content-div" id="answer-list">
{answers.map((ans) => (
  <AnsPost
    ans={ans}
    /*model={model}*/ key={ans._id}
    calculateTimePosted={props.calculateTimePosted}
    switchTo={props.switchTo}
  />
))}
</div>