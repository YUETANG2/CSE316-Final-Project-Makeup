//Answer Post for Answers Page
import TextWithLinks from "./textWithLinks";
import CommentSection from "./commentSection.js";
import axios from "axios";
import { useState, useEffect } from "react";

export default function AnsPost(props) {
  const [answer, setAnswer] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [upVotes, setUpVotes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [render, setRender] = useState(0);

  useEffect(() => {
    let getAnswerDate = async (ansId) => {
      let getAns = await axios.get(
        "http://127.0.0.1:8000/answersPage/getAnswerData/" + ansId
      );

      let ansData = getAns.data;

      console.log("INISDE ANSWERS PAGE");
      console.log(ansData);

      setAnswer(ansData.text);
      setDate(ansData.ans_date_time);
      setCommentsList(ansData.comments);

      let getUsername = await axios.get(
        "http://127.0.0.1:8000/answersPage/getUsername/" + ansData.ans_by
      );
      setUser(getUsername.data);
    };

    getAnswerDate(props.ansId);
  }, [render]);

  //for reading comments
  let incrementPageNum = () => {
    let num = currentPage;
    if (num >= Math.ceil(commentsList.length / 3)) {
      setCurrentPage(1);
    } else {
      setCurrentPage(++num);
    }
  };

  let decrementPageNum = () => {
    let num = currentPage;
    if (num != 1) {
      setCurrentPage(--num);
    }
  };

  let triggerRender = ()=> {
    setRender(render+1);
    setCurrentPage(1);
  }

  return (
    <div>
      <div className="ans-post">
        <h3 id="num-of-votes" className="ans-post-votes">
          {upVotes}
          <div
            class="arrow-up"
            onClick={() => {
              if (props.userStatus === "user") {
                console.log("upvote +1");
              }
            }}
          ></div>
        </h3>
        <p className="ans-post-text"> {answer}</p>
        <div className="ans-post-user-info">
          <p>
            <span style={{ color: "green" }}> {user} </span>{" "}
            {props.calculateTimePosted(new Date(date))} answered
          </p>
        </div>
      </div>

      <CommentSection
        commentIDsList={commentsList}
        calculateTimePosted={props.calculateTimePosted}
        currentPage={currentPage}
        incrementPageNum={incrementPageNum}
        decrementPageNum={decrementPageNum}
        userStatus={props.userStatus}
        postId={props.ansId}
        triggerRender={triggerRender}
      ></CommentSection>
    </div>
  );
}
