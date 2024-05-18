import { useNavigate } from "react-router-dom";

export default function Navigator(props) {
  const navigator = useNavigate();

  return (
    <div id="navigator">
      <form className="nav-form" id="nav-form">
        <button
          className="nav-button"
          id="Questions"
          type="button"
          style={{
            backgroundColor:
              props.currentPage === "main"
                ? "rgb(180, 180, 180)"
                : "rgb(239, 239, 239)",
          }}
          onClick={(event) => {
            event.preventDefault();
            if(props.userStatus === "user"){
              navigator("/allQstns/user");
            }else if(props.userStatus === "guest"){
              navigator("/allQstns/guest");
            }
          }}
        >
          {"Questions"}
        </button>
        <button
          className="nav-button"
          id="Tags"
          type="button"
          style={{
            backgroundColor:
              props.currentPage === "tagsPage"
                ? "rgb(180, 180, 180)"
                : "rgb(239, 239, 239)",
          }}
          onClick={(event) => {
            event.preventDefault();
            if(props.userStatus === "user"){
              navigator("/allTags/user");
            }else if(props.userStatus === "guest"){
              navigator("/allTags/guest");
            }
          }}
        >
          {"Tags"}
        </button>
      </form>
    </div>
  );
}
