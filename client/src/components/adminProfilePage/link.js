//Filter Buttons for Main Page
import { Link, useNavigate } from "react-router-dom";

export default function UserLink(props) {
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

        <input
          className="delete-user"
          type="submit"
          value="Delete"
          style={{ display: "inline" }}
        />
      </div>
    </div>
  );
}
