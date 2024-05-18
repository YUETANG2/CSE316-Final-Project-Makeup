export default function pageBar(props) {
  return (
    <div class="pageBar">
      <div
        class="pageBar-element arrow-left"
        onClick={props.decrementPageNum}
        style={
          (props.pageNum === 1 && {
            display: "none"
          }) || {
            display: "block"
          }
        }
      ></div>
      <p class="pageBar-element"> {props.pageNum}</p>
      <div
        class="pageBar-element arrow-right"
        onClick={props.incrementPageNum}
      ></div>
    </div>
  );
}
