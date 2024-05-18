//Ask Question button
import { useNavigate } from "react-router-dom";

export default function AskQstnBtn(props) {
  const navigate = useNavigate();

  return (
    <div className="content-div" id="ask-questions">
      <form>
        <input
          id="ask-Q-button"
          type="submit"
          value="Ask Question"
          onClick={(event) => {
            event.preventDefault();
            console.log("Ask Qstn Btn Clicked");
            //navigate("/allQstns/guest/newQstn");
            navigate("/allQstns/user/newQstn");
          }}
          style={
            (props.userStatus === "guest" && {
              visibility: "hidden",
            }) || {
              visibility: "visible",
            }
          }
        />
      </form>
    </div>
  );
}
