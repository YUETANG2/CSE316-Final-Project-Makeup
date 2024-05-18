import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";


export default function PostAnswer(props) {
  const {qstnId} = useParams();
  const navigate = useNavigate();
  const [error, setErr] = useState([""]);

  async function postAnswer() {
    let text = document.getElementById("a-text").value;
    let ansID = qstnId;

    /*----- check if each input is valid -----*/
    let err = [""];
    let isGood = true;

    if (text.length === 0) {
      isGood = false;
      err.push("err-a-text");
    }

    /*-------- check if links are valid --------*/
    let link_indicator = /\[(.*?)\]\((.*?\))/g;
    let http = /^http(s?):\/\//;
    let matches;
    while ((matches = link_indicator.exec(text)) !== null) {
      if (!http.test(matches[2])) {
        //console.log("link error: " + matches[2]);
        isGood = false;
        err.push("err-a-link");
        break;
      }
    }

    /*----- Check if inputs are valid -----*/
    if (!isGood) {
      throw err;
    } else {
      let newAnswerData = {
        text: text,
        ansDate: new Date(),
        ansQID: qstnId,
      };

      try {
        let res = await axios.post(
          "http://127.0.0.1:8000/addNewAnswer",
          newAnswerData
        );
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  }


  
  return (
    <div className="main-div content-div" id="answer-form">
      
      <h1 className="section-title">Answer Text*</h1>
      <form>
        <textarea
          id="a-text"
          className="section-input"
          placeholder="Type answer here."
        ></textarea>
      </form>

      {error.includes("err-a-text") && (
        <p className="err-msg" id="err-a-text">
          {"*The content should not be empty"}
        </p>
      )}

      {error.includes("err-a-link") && (
        <p className="err-msg" id="err-a-link">
          {"*Invalid URL"}
        </p>
      )}


      <button
        id="post-A-button"
        type="button"
        onClick={async (event) => {
          console.log("post ans is clicked");
          try {
            await postAnswer(event);
            navigate("/answersPage/user/" + qstnId._id);
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