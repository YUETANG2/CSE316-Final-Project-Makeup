//Answer Post for Answers Page
import TextWithLinks from "./textWithLinks";
import CommentSection from "./commentSection.js";
import axios from "axios";
import { useState, useEffect } from "react";

export default function AnsPost(props) {
  const [answer, setAnswer] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    let getAnswerDate = async (ansId) => {
      let getAns = await axios.get(
        "http://127.0.0.1:8000/answersPage/getAnswerData/" + ansId
      );

      let ansData = getAns.data;
      setAnswer(ansData.text);
      setDate(ansData.ans_date_time);

      let getUsername = await axios.get(
        "http://127.0.0.1:8000/answersPage/getUsername/" + ansData.ans_by
      );
      setUser(getUsername.data);
    };

    getAnswerDate(props.ansId);
  });

  return (
    <div className="ans-post">
      <span className="ans-post-text">
        <div> Likes</div>
        <p> {answer}</p>
      </span>
      <div className="ans-post-user-info">
        <p>
          <span style={{ color: "green" }}> {user} </span>{" "}
          {props.calculateTimePosted(new Date(date))} answered
        </p>
      </div>
    </div>
  );
}

//{props.calculateTimePosted(new Date(props.ans.ans_date_time))}

/*
<div className="ans-post">
      <span className="ans-post-text">
        <TextWithLinks
          text={props.ans.text}
          key={props.ans.aid}
        ></TextWithLinks>
      </span>
      <div className="ans-post-user-info">
        <p>
          <span style={{ color: "green" }}> {props.ans.ans_by} </span> answered
        </p>
      </div>
    </div>*/
