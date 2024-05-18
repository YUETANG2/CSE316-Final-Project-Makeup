import AnsPost from "./ansPost.js";
import TextWithLinks from "./textWithLinks.js";
import AskQstnBtn from "../mainPage/askQstnBtn.js";
import CommentSection from "./commentSection.js";
//import AnsDisplayBlock from "./ansDisplayBlock.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function AnswersPage(props) {
  const { qstnId } = useParams();
  console.log("the qstn are", qstnId); //we have the data
  const navigator = useNavigate();

  const [qstn, setQstn] = useState([]);
  const [summary, setSummary] = useState([]);
  const [ansList, setAnsList] = useState([]);

  const [title, setTitle] = useState("");
  const [text, setText] = useState([]);
  const [tags, setTags] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [views, setViews] = useState(0);

  useEffect(() => {
    let getQstnData = async (qstnId) => {
      let res = await axios.get(
        "http://127.0.0.1:8000/question//getQstnById?qstnId=" + qstnId
      );

      console.log("HERE IS TEH DTA");
      console.log(res.data);

      let qstnData = res.data;
      setTitle(qstnData.title);
      setText(qstnData.text);
      setTags(qstnData.tags);
      setAnswers(qstnData.answers);
      setComments(qstnData.comments);

      let getUsername = await axios.get(
        "http://127.0.0.1:8000/answersPage/getUsername/" + qstnData.asked_by
      );
      setUserId(getUsername.data);
      setDate(qstnData.ask_date_time);
      setViews(qstnData.views);
    };
    getQstnData(qstnId);
  }, []);

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

  console.log(date);
  console.log("THE QEUSTION IS" + title);

  return (
    <div className="content-div main-div" id="answer-page">
      <div id="all-ans-page-top">
        <h1 id="num-of-ans">
          {answers.length} {answers.length === 1 ? " Answer" : " Answers"}
        </h1>
        <h1 id="ans-page-title">{title} </h1>
        {props.userStatus === "user" && <AskQstnBtn />}
      </div>

      <div id="all-ans-page-q-info">
        <h1 id="num-of-views">
          {views} {views === 1 ? " View" : " Views"}
        </h1>
        <p> {text} </p>
        <div className="user-info">
          <p>
            <span style={{ color: "red" }}> {userId} </span> asked{" "}
            {calculateTimePosted(new Date(date))}
          </p>
        </div>
      </div>

      <div className="content-div" id="answer-list">
        {answers.map((ans) => (
          <AnsPost
            ansId={ans}
            key={ans}
            calculateTimePosted={calculateTimePosted}
          />
        ))}
      </div>

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