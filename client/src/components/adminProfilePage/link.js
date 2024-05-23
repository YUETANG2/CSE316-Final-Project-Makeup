//Filter Buttons for Main Page
import { Link, useNavigate } from "react-router-dom";

export default function UserLink(props) {
  console.log("WHAT IS THISSS");
  console.log(props.item._id);

  let onClickDeleteBtn = () => {
    alert("Are you sure to delete " + props.item.first_name + " " + props.item.last_name + "?");
  }
  return (
    <div>
      <div className="registration-page-link post2">
        <Link
          className="user-admin-view"
          style={{ display: "inline-block" }}
          to={"/profile/user"} // Link destination
          state={{ userStatus: "ADMIN", userId: props.item._id }}
        >
          {props.item.first_name + " " + props.item.last_name}{" "}
          {/* Display the question title */}
        </Link>

        <button
          className="delete-user"
          type="submit"
          style={{ display: "inline" }}
          onClick={onClickDeleteBtn}
        >
          {"Delete"}
        </button>
      </div>
    </div>
  );
}
