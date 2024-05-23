import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditAnswer(props) {
  const { qstnId, ansId } = useParams();
  const navigate = useNavigate();
  const inputElement = useRef();
  const [error, setErr] = useState([""]);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    let setUpAnsInput = async (ansId) => {
      let res = await axios.get(
        "http://127.0.0.1:8000/answersPage/getAnswerData/" + ansId
      );

      let ansData = res.data;
      setAnswerText(ansData.text);
    };

    setUpAnsInput(ansId);
  }, []);

  async function deleteAnswer() {
    let qId = qstnId;
    let aId = ansId;

    let answerData = {
      aId: aId,
      qId: qId,
    };

    try {
      let res = await axios.post(
        "http://127.0.0.1:8000/profile/deleteAnswer",
        answerData
      );
      console.log(res.data);
      setErr([""]);
    } catch (err) {
      console.error(err);
      setErr(err);
    }
  }

  async function editAnswer() {
    let text = inputElement.current.value;
    let qId = qstnId;
    let aId = ansId;

    /*----- check if each input is valid -----*/
    let err = [""];
    let isGood = true;

    if (text.length === 0) {
      isGood = false;
      err.push("err-a-text");
    }

    /*----- Check if inputs are valid -----*/
    if (!isGood) {
      throw err;
    } else {
      let newAnswerData = {
        aId: aId,
        text: text,
        qId: qId,
      };

      try {
        let res = await axios.post(
          "http://127.0.0.1:8000/profile/editAnswer",
          newAnswerData
        );
        console.log(res.data);
        setErr([""]);
      } catch (err) {
        console.error(err);
        setErr(err);
      }
    }
  }

  return (
    <div className="main-div content-div" id="answer-form">
      <h1 className="section-title">Answer Text*</h1>
      <form>
        <textarea
          id="a-text"
          ref={inputElement}
          className="section-input"
          placeholder="Type answer here."
          value={answerText}
          onChange={(event)=> {
            setAnswerText(event.target.value);
          }}
        ></textarea>
      </form>

      {error.includes("err-a-text") && (
        <p className="err-msg" id="err-a-text">
          {"*The content should not be empty"}
        </p>
      )}

      <button
        id="edit-A-button"
        type="button"
        onClick={async () => {
          console.log("post ans is clicked");
          try {
            await editAnswer();
            navigate("/profile/user");
          } catch (err) {
            console.log(err);
            setErr(err);
          }
        }}
      >
        {"Edit Answer"}
      </button>

      <button
        id="delete-A-button"
        type="button"
        onClick={async () => {
          console.log("post ans is clicked");
          try {
            await deleteAnswer();
            navigate("/profile/user");
          } catch (err) {
            console.log(err);
            setErr(err);
          }
        }}
      >
        {"Delete Answer"}
      </button>

      <p id="answer-form-asterisk" className="form-asterisk">
        {"* indicates mandatory fields"}
      </p>
    </div>
  );
}
