//Filter Buttons for Main Page
export default function filterBtn(props) {
    return (
      <button className="filter-button" id={props.value} type="button" onClick={props.onClick}> 
        {props.value}
      </button> 
    );
  }