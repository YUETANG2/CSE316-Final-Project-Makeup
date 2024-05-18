import PageBar from "../pageBar.js";
import Link from "./link.js";

export default function userQstnsDisplayBlock(props) {
  let itemElements = [];
  console.log(props.itemList);
  for (
    let i = (props.currentPage - 1) * 5;
    i < props.itemList.length && i < (props.currentPage - 1) * 5 + 5;
    i++
  ) {
    console.log(i);
    itemElements.push(props.itemList[i]);
  }

  return (
    <div className="content-div" id="question-list">
      {itemElements.map((item) => (
        <Link
          type={props.type}
          item={item}
          key={item._id}
          userStatus = {props.userStatus}
          /*setQstn={props.setQstn}
          setAnsList={props.setAnsList}
          calculateTimePosted={props.calculateTimePosted}
          getAnswersPageData={props.getAnswersPageData}
          getViews={props.getViews}
          viewCount={props.viewCount}
          switchTo={props.switchTo}*/
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
