import React, { useState, useRef} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";


export default function PostAnswer(props) {
  const {qstnId} = useParams();
  const navigate = useNavigate();
  const [error, setErr] = useState([""]);
  const inputElement = useRef();

  async function postAnswer() {
    let text = inputElement.current.value;
    console.log(text);
    let qId = qstnId;

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
        text: text,
        qId: qId,
      };

      try {
        let res = await axios.post(
          "http://127.0.0.1:8000/answersPage/addNewAnswer",
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
        ></textarea>
      </form>

      {error.includes("err-a-text") && (
        <p className="err-msg" id="err-a-text">
          {"*The content should not be empty"}
        </p>
      )}

      <button
        id="post-A-button"
        type="button"
        onClick={async (event) => {
          console.log("post ans is clicked");
          try {
            await postAnswer(event);
            navigate("/answersPage/user/" + qstnId);
          } catch (err) {
            console.log(err);
            setErr(err);
          }
        }}
      >
        {"Post Answer"}
      </button>

      <p id="answer-form-asterisk" className="form-asterisk">
        {"* indicates mandatory fields"}
      </p>
    </div>
  );
}