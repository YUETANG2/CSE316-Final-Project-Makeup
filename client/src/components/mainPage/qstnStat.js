import FilterBtn from "./filtersBtn.js";
import AskQstnBtn from "./askQstnBtn.js";

export default function QstnStat(props) {
  //console.log("Inside qstnState: " + props.userStatus);
  return (
    <>
      <div className="content-div" id="all-questions">
        <h1 id="All-Questions">All Questions</h1>
        <p id="num-of-Q">
          {props.qstnsNum} {props.qstnsNum === 1 ? " question" : " questions"}
        </p>
      </div>

      <AskQstnBtn userStatus={props.userStatus} />

      <div className="content-div" id="filters">
        <form id="filters-form">
          <FilterBtn
            value="Newest"
            onClick={props.filterByNewest}
            key="Newest"
          />
          <FilterBtn
            value="Active"
            onClick={props.filterByActive}
            key="Active"
          />
          <FilterBtn
            value="Unanswered"
            onClick={props.filterByUnanswered}
            key="Unanswered"
          />
        </form>
      </div>
    </>
  );
}
