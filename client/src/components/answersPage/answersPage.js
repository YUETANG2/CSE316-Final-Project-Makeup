
import AskQstnBtn from "../mainPage/askQstnBtn.js";
import AnsDiplayBlock from "./ansDisplayBlock.js";
import CommentSection from "./commentSection.js";
import Tags from "../mainPage/tags.js";
//import AnsDisplayBlock from "./ansDisplayBlock.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function AnswersPage(props) {
  const { qstnId } = useParams();
  console.log("the qstn are", qstnId); //we have the data
  const navigator = useNavigate();
  const location = useLocation();

  //console.log("The userId is" + location.state.userId)

  const [title, setTitle] = useState("");
  const [text, setText] = useState([]);
  const [tags, setTags] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [comments, setComments] = useState([]);
  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [date, setDate] = useState("");
  const [views, setViews] = useState(0);
  const [upVotes, setUpVotes] = useState(0);
  const [downVotes, setDownVotes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [pageStatus, setPageStatus] = useState("-");

  const [render, setRender] = useState(0);

  useEffect(() => {
    let getQstnData = async (qstnId) => {
      let userId = "-"; //regular answer page
      if (location.state != null && location.state.userId != null) {
        userId = location.state.userId; //profile answer page
      }

      let res = await axios.get(
        "http://127.0.0.1:8000/question/getQstnById?qstnId=" +
          qstnId +
          "&userId=" +
          userId
      );

      let qstnData = res.data;
      setTitle(qstnData.title);
      setText(qstnData.text);
      setTags(qstnData.tags);
      setAnswers(qstnData.answers);
      setComments(qstnData.comments);
      setDate(qstnData.ask_date_time);
      setViews(qstnData.views);
      setUpVotes(qstnData.upvote);
      setDownVotes(qstnData.downvote);
      setTags(qstnData.tags);
      setComments(qstnData.comments);
      setUserID(qstnData.asked_by);

      let getUsername = await axios.get(
        "http://127.0.0.1:8000/answersPage/getUsername/" + qstnData.asked_by
      );
      setUsername(getUsername.data);
      setPageStatus(userId);
    };
    getQstnData(qstnId);
  }, [render]);

  function calculateTimePosted(timePosted) {
    let currentTime = new Date();
    let time = timePosted.toString().split(" ");
    if (timePosted.getFullYear() < currentTime.getFullYear()) {
      return (
        time[1] + " " + time[2] + ", " + time[3] + " at " + time[4].substr(0, 5)
      );
    } else if (timePosted.getMonth() < currentTime.getMonth()) {
      return time[1] + " " + time[2] + " " + "at " + time[4].substr(0, 5);
    } else if (timePosted.getDate() < currentTime.getDate()) {
      return time[1] + " " + time[2] + " " + "at " + time[4].substr(0, 5);
    } else if (timePosted.getHours() < currentTime.getHours()) {
      let difference = currentTime.getHours() - timePosted.getHours();
      if (difference === 1) {
        return difference + " hour ago";
      } else {
        return difference + " hours ago";
      }
    } else if (timePosted.getMinutes() < currentTime.getMinutes()) {
      let difference = currentTime.getMinutes() - timePosted.getMinutes();
      if (difference === 1) {
        return difference + " minute ago";
      } else {
        return difference + " minutes ago";
      }
    } else {
      let difference = currentTime.getSeconds() - timePosted.getSeconds();
      if (difference === 1) {
        return difference + " second ago";
      } else {
        return difference + " seconds ago";
      }
    }
  }

  let incrementPageNum = () => {
    let num = currentPage;
    if (num >= Math.ceil(answers.length / 5)) {
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

  let incrementPageNum2 = () => {
    let num = currentPage2;
    if (num >= Math.ceil(comments.length / 3)) {
      setCurrentPage2(1);
    } else {
      setCurrentPage2(++num);
    }
  };

  let decrementPageNum2 = () => {
    let num = currentPage2;
    if (num != 1) {
      setCurrentPage2(--num);
    }
  };

  let triggerRender = () => {
    setRender(render + 1);
    setCurrentPage2(1);
  };

  let incrementUpvote = async () => {
    try {
      let res = await axios.post(
        "http://127.0.0.1:8000/question/incrementUpvoteById",
        { qstnId: qstnId, ask_by: userID }
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
        "http://127.0.0.1:8000/question/incrementDownvoteById",
        { qstnId: qstnId, ask_by: userID }
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
    <div className="content-div main-div" id="answer-page">
      <div id="all-ans-page-top">
        <h1 id="ans-page-title">{title} </h1>
        {props.userStatus === "user" && <AskQstnBtn />}
      </div>

      <div id="all-ans-page-q-info">
        <div>
          <h3 id="num-of-ans">
            {answers.length} {answers.length === 1 ? " Answer" : " Answers"}
          </h3>
          <h3 id="num-of-views">
            {views} {views === 1 ? " View" : " Views"}
          </h3>
          <h3 id="num-of-votes">
            {upVotes}
            <div
              class="arrow-up"
              onClick={() => {
                if (props.userStatus === "user") {
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
        <div>
          <p> {text} </p>
          {tags.length > 0 &&
            tags.map((tagId) => <Tags tag={tagId} key={tagId} />)}
        </div>
        <div className="user-info">
          <p>
            <span style={{ color: "red" }}> {username} </span> asked{" "}
            {calculateTimePosted(new Date(date))}
          </p>
        </div>
      </div>

      <CommentSection
        commentIDsList={comments}
        calculateTimePosted={calculateTimePosted}
        currentPage={currentPage2}
        incrementPageNum={incrementPageNum2}
        decrementPageNum={decrementPageNum2}
        userStatus={props.userStatus}
        postId={qstnId}
        triggerRender={triggerRender}
      ></CommentSection>

      <AnsDiplayBlock
        pageStatus={pageStatus}
        answers={answers}
        calculateTimePosted={calculateTimePosted}
        userStatus={props.userStatus}
        incrementPageNum={incrementPageNum}
        decrementPageNum={decrementPageNum}
        currentPage={currentPage}
        qstnId={qstnId}
      ></AnsDiplayBlock>

      {props.userStatus === "user" && (
        <form id="ask-A-button-form">
          <input
            id="ask-A-button"
            type="submit"
            value="Post Answer"
            onClick={(event) => {
              event.preventDefault();
              navigator("/postAnswer/user/" + qstnId);
            }}
          />
        </form>
      )}
    </div>
  );
}
