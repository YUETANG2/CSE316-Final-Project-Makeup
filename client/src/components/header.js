//header for FakeStackOverflow
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Header(props) {
  const navigate = useNavigate();
  //onst history = useHistory();

  let signOut = async () => {
    let result = await axios.get("http://127.0.0.1:8000/user/sign-out", {
      withCredentials: true,
    });
    console.log(result);
  };

  let getUserStatus = async () => {
    let result = await axios.get("http://127.0.0.1:8000/user/adminOrUser");

    let userStatus = result.data;
    console.log(userStatus);
    if (userStatus === "ADMIN") {
      navigate("/profile/admin");
    } else if (userStatus === "USER") {
      navigate("/profile/user");
    }
  };

  async function searching(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log("A ENTER KEY IS HIT");
      let input = document.getElementById("search-by-text").value;
      console.log(input);
      if (props.userStatus === "guest") {
        navigate("/");
        navigate("/allQstns/guest", {
          state: { searchTerm: input },
        });
      } else if (props.userStatus === "user") {
        console.log(input);
        navigate("/allQstns/user", {
          state: { searchTerm: input },
        });
      }
    }
  }

  return (
    <div id="header" className="flex-container header">
      <h id="header-name">
        <strong> {"Fake Stack Overflow"} </strong>
      </h>
      <form className="search-bar">
        <input
          type="text"
          className="search"
          id="search-by-text"
          placeholder="Search..."
          onKeyDown={(event) => {
            searching(event);
          }}
          style={
            (props.currentPage === "login_page" && {
              visibility: "hidden",
            }) || {
              visibility: "visible",
            }
          }
        />
      </form>
      <form className="login-form">
        <button
          className="login-btn"
          onClick={(event) => {
            event.preventDefault();
            getUserStatus();
          }}
          style={
            ((props.userStatus === "guest" ||
              props.currentPage === "profile_page" && !props.needProfileBtn) && {
              visibility: "hidden",
            }) || {
              visibility: "visible",
            }
          }
        >
          My Profile
        </button>
      </form>

      <form className="login-form">
        <button
          className="login-btn"
          style={
            (props.currentPage === "login_page" && {
              visibility: "hidden",
            }) || {
              visibility: "visible",
            }
          }
          onClick={async (event) => {
            event.preventDefault();
            await signOut();
            navigate("/");
          }}
        >
          {(props.userStatus === "guest" && "Log in") ||
            (props.userStatus === "user" && "Sign Out")}
        </button>
      </form>
    </div>
  );
}
