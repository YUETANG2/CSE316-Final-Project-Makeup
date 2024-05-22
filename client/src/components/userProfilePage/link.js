//Filter Buttons for Main Page
import { Link, useNavigate } from "react-router-dom";

export default function QstnLink(props) {
  console.log("LINKKKK")
  console.log(props.userStatus)
  console.log(props.userId);
  return (
    <div>
      {props.type === "Question" && ( // Check if the type is "Question"
        <Link
          className="registration-page-link post2" // CSS class for styling
          to={"/profile/user/qstn/" + props.item._id} // Link destination
          state={{ userStatus: props.userStatus }}
        >
          {props.item.title} {/* Display the question title */}
        </Link>
      )}

      {props.type === "Answer" && ( // Check if the type is "Question"
        <Link
          className="registration-page-link post2" // CSS class for styling
          to={"/answersPage/user/" + props.item._id} // Link destination
          state={{ userStatus: props.userStatus, userId: props.userId }}
        >
          {props.item.title} {/* Display the question title */}
        </Link>
      )}

      {props.type === "Tag" && (
        <div className="registration-page-link post2">
          <Link
            className="user-admin-view"
            to={"/profile/user/tag/" + props.item._id}
            state={{ userStatus: props.userStatus }} // ADMIN OR USER
          >
            {props.item.name} {/* Display the question title */}
          </Link>
        </div>
      )}
    </div>
  );
}
