import Tags from "./tags.js";
import UserInfo from "./userInfo.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

//Question Post for Main Page
export default function QtsnPost(props) {
  //console.log("mainpage view num: " + props.qstn.views);
  //console.log(props.qstn);
  const navigate = useNavigate();

  return (
    <div className="post" key={props.qstn._id}>
      {/*console.log("im updating: jj")*/}
      {/*props.qstn.tags.forEach((id) => console.log(id))*/}

      <div className="stats">
        <p className="stats-info">
          {props.qstn.upvote + props.qstn.downvote}
          {props.qstn.upvote + props.qstn.downvote === 1 ? " vote" : " votes"}
        </p>
        <p className="stats-info">
          {props.qstn.answers.length}
          {props.qstn.answers.length === 1 ? " answer" : " answers"}
        </p>
        <p className="stats-info">
          {" "}
          {props.qstn.views} {props.qstn.views === 1 ? " view" : " views"}
        </p>
      </div>
      <div className="title">
        <form>
          {(props.userStatus === "user" && (
            <Link
              type="submit"
              value={props.qstn.title}
              id={props.qstn._id}
              className="question"
              onClick={async (event) => {
                let res = await axios.post(
                  "http://127.0.0.1:8000/question/incrementViewOfQstnById",
                  { qstnId: props.qstn._id }
                );
                console.log(res.data);
              }}
              to={"/answersPage/user/" + props.qstn._id}
              key="submit"
            >
              {props.qstn.title}
            </Link>
          )) || (
            <Link
              type="submit"
              value={props.qstn.title}
              id={props.qstn._id}
              className="question"
              onClick={async (event) => {
                let res = await axios.post(
                  "http://127.0.0.1:8000/question/incrementViewOfQstnById",
                  { qstnId: props.qstn._id }
                );
                console.log(res.data);
              }}
              to={"/answersPage/guest/" + props.qstn._id}
              key="submit"
            >
              {props.qstn.title}
            </Link>
          )}
          <p> {props.qstn.summary} </p>
          {props.qstn.tags.length > 0 &&
            props.qstn.tags.map((tagId) => <Tags tag={tagId} key={tagId} />)}
        </form>
      </div>

      <UserInfo qstn={props.qstn}> </UserInfo>
    </div>
  );
}
