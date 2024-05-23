//Answer Post for Answers Page

import CommentSection from "./commentSection.js";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AnsPost(props) {
  const [answer, setAnswer] = useState("");
  const [date, setDate] = useState("");
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState("");

  const [commentsList, setCommentsList] = useState([]);
  const [upVotes, setUpVotes] = useState(0);
  const [downVotes, setDownVotes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [render, setRender] = useState(0);
  const [canModifyAns, setCanModifyAns] = useState(false);

  const navigate = useNavigate();

  console.log("INSIDE ANS POST4444");
  console.log(props.pageStatus);

  useEffect(() => {
    let getAnswerDate = async (ansId) => {
      let getAns = await axios.get(
        "http://127.0.0.1:8000/answersPage/getAnswerData/" + ansId
      );

      let ansData = getAns.data;

      setUpVotes(ansData.upvote);
      setDownVotes(ansData.downvote);
      setAnswer(ansData.text);
      setDate(ansData.ans_date_time);
      setCommentsList(ansData.comments);
      setUserId(ansData.ans_by);

      let getUsername = await axios.get(
        "http://127.0.0.1:8000/answersPage/getUsername/" + ansData.ans_by
      );
      setUser(getUsername.data);
    };

    getAnswerDate(props.ansId, props.pageStatus);
  }, [render]);

  useEffect(() => {
    let getCanModifyAns = async (userId, pageStatus) => {
      console.log("PAGE STATUSSSSS4444444");
      console.log(pageStatus);
      //this is not working
      let res = await axios.get(
        "http://127.0.0.1:8000/answersPage/canModifyAnswer?ans_by=" +
          userId +
          "&pageStatus=" +
          pageStatus
      );

      let result = res.data;
      console.log("RESULT");
      console.log(result);
      setCanModifyAns(result);
    };

    getCanModifyAns(userId, props.pageStatus);
  });

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

  let triggerRender = () => {
    setRender(render + 1);
    setCurrentPage(1);
  };

  let incrementUpvote = async () => {
    try {
      let res = await axios.post(
        "http://127.0.0.1:8000/answersPage/incrementUpvoteById",
        { ansId: props.ansId, ans_by: userId }
      );

      console.log(res.data);
      if (res.data === "DONE") {
        setUpVotes(upVotes + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  let incrementDownvote = async () => {
    try {
      let res = await axios.post(
        "http://127.0.0.1:8000/answersPage/incrementDownvoteById",
        { ansId: props.ansId, ans_by: userId }
      );

      console.log(res.data);
      if (res.data === "DONE") {
        setDownVotes(downVotes + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="ans-post">
        <div className="ans-post-votes">
          <h3 id="num-of-votes">
            {upVotes}
            <div
              class="arrow-up"
              onClick={() => {
                if (props.userStatus === "user") {
                  console.log("upvote +1");
                  incrementUpvote();
                }
              }}
            ></div>
          </h3>
          <h3 id="num-of-votes">
            {downVotes}
            <div
              class="arrow-down"
              onClick={() => {
                if (props.userStatus === "user") {
                  incrementDownvote();
                }
              }}
            ></div>
          </h3>
        </div>
        <p className="ans-post-text"> {answer}</p>
        <div className="ans-post-user-info">
          <p>
            <span style={{ color: "green" }}> {user} </span>{" "}
            {props.calculateTimePosted(new Date(date))} answered
          </p>
          {canModifyAns && (
            <button
              id="modify-edit-ans"
              type="button"
              onClick={() => {
                console.log("IS Clicked");
                navigate("/modfiyAnswer/user/" + props.qstnId+ "/" + props.ansId);
              }}
            >
              {"Modify Answers"}
            </button>
          )}
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

/*
        onClick={async (event) => {
          try {
            await editTag(event);
            if (props.userStatus === "USER") {
              navigate("/profile/user");
            } else if (props.userStatus === "ADMIN") {
              navigate("/profile/admin");
            }
          } catch (err) {
            //console.log("THERE IS A ERROR");
            console.log(err);
            setErr(err);
          }
        }}
*/
