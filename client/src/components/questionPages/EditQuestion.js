import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditQuestion(props) {
  const [error, setErr] = useState([""]);
  const [title, setTitle] = useState([""]);
  const [summary, setSummary] = useState([""]);
  const [text, setText] = useState([""]);
  const [tags, setTags] = useState([""]);
  let { qstnId } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    let setUpQstnInput = async (qstnId) => {
      let res = await axios.get(
        "http://127.0.0.1:8000/profile/getQstnById/" + qstnId
      );
      let qstnInput = res.data;

      console.log(qstnInput);

      setTitle(qstnInput.title);
      setSummary(qstnInput.summary);
      setText(qstnInput.text);
      setTags(qstnInput.tags);
    };

    setUpQstnInput(qstnId);
  }, []);

  /** Insert new questions from ask question page */
  async function modifyQuestion() {
    /*---- extract input in each field ----*/
    let title = document.getElementById("q-title").value;
    let summary = document.getElementById("q-summary").value;
    let text = document.getElementById("q-text").value;
    let tags = document
      .getElementById("q-tags")
      .value.toLocaleLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    let uniqueTags = [...new Set(tags)];

    /*----- check if each input is valid -----*/
    let err = [""];
    let isGood = true;
    if (title.length > 50 || title.length === 0) {
      isGood = false;
      err.push("err-title");
    }

    if (summary.length > 140 || summary.length === 0) {
      isGood = false;
      err.push("err-summary");
    }

    if (text.length === 0) {
      isGood = false;
      err.push("err-text");
    }
    /*-------- check if links are valid --------*/
    console.log(text);
    let link_indicator = /\[(.*?)\]\((.*?\))/g;
    let http = /^http(s?):\/\//;
    let matches;
    while ((matches = link_indicator.exec(text)) !== null) {
      if (!http.test(matches[2])) {
        //console.log("link error: " + matches[2]);
        isGood = false;
        err.push("err-link");
        break;
      }
    }

    if (uniqueTags.length > 5) {
      isGood = false;
      err.push("err-tags-length");
    } else {
      for (let tag of uniqueTags) {
        if (tag.length > 20) {
          isGood = false;
          err.push("err-tag-length");
          break;
        }
      }
    }

    /*----- Check if inputs are valid -----*/
    if (isGood) {
      /* update model to include this new question*/
      let newQuestionData = {
        title: title,
        summary: summary,
        text: text,
        tags: uniqueTags,
        qstnId: qstnId,
      };

      console.log("new data: ");
      console.log(newQuestionData);
      //model.insertNewQstn(newQuestionData);
      try {
        let res = await axios.post(
          "http://127.0.0.1:8000/profile/modifyQstn",
          newQuestionData
        );
        console.log(res.data);
      } catch (e) {
        isGood = false;
        console.error(e);
        err.push(e.response.data.message);
      }
    }

    if (!isGood) {
      throw err;
    }
  }

  async function deleteQuestion() {
    try {
      let res = await axios.get(
        "http://127.0.0.1:8000/profile/deleteQstn/" + qstnId
      );
      console.log(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="main-div content-div" id="question-form">
      <h1 className="section-title">Question Title*</h1>
      <p className="section-description">
        Limited title to 40 characters or less
      </p>
      <form>
        <input
          type="text"
          id="q-title"
          className="section-input"
          placeholder="Web scripting invalid syntax URL"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </form>

      {error.includes("err-title") && (
        <p className="err-msg" id="err-title">
          {
            "*The title should not be more than 40 characters and should not be empty"
          }
        </p>
      )}

      <h1 className="section-title">Question Summary*</h1>
      <p className="section-description">
        Limited title to 140 characters or less
      </p>
      <form>
        <input
          type="text"
          id="q-summary"
          className="section-input"
          placeholder="Web scripting invalid syntax URL"
          value={summary}
          onChange={(event) => {
            setSummary(event.target.value);
          }}
        />
      </form>

      {error.includes("err-summary") && (
        <p className="err-msg" id="err-title">
          {
            "*The summary should not be more than 140 characters and should not be empty"
          }
        </p>
      )}

      <h1 className="section-title">Question Text*</h1>
      <p className="section-description">Add details</p>
      <form>
        <textarea
          id="q-text"
          className="section-input"
          placeholder="I am a beginner of web scripting. There is a syntax error shown..."
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
        ></textarea>
      </form>

      {error.includes("err-text") && (
        <p className="err-msg" id="err-text">
          {"*The content should not be empty"}
        </p>
      )}

      {error.includes("err-link") && (
        <p className="err-msg" id="err-text">
          {"*Invalid URL"}
        </p>
      )}
      <h1 className="section-title">Tags*</h1>
      <p className="section-description">
        Add keywords separated by whitespace
      </p>
      <form>
        <input
          type="text"
          id="q-tags"
          className="section-input"
          placeholder="web-scription html urls"
          value={tags}
          onChange={(event) => {
            setTags(event.target.value);
          }}
        />
      </form>

      {error.includes("err-tags-length") && (
        <p className="err-msg" id="err-tags-length">
          {"*There should not be more than 5 tags"}
        </p>
      )}

      {error.includes("err-tag-length") && (
        <p className="err-msg" id="err-tag-length">
          {"*The length of a new tag cannot be more than 20 characters"}
        </p>
      )}

      {error.includes("err-tag-reputation-points") && (
        <p className="err-msg" id="err-tag-reputation-points">
          {"*You need at least 50 reputation points to create a new tag name"}
        </p>
      )}
      <button
        id="save-changes-button"
        type="button"
        onClick={async (event) => {
          //console.log("post q is clicked");
          try {
            await modifyQuestion(event);
            if(props.userStatus === "USER"){
              navigate("/profile/user");
            }else if (props.userStatus === "ADMIN") {
              navigate("/profile/admin");
            }
          } catch (err) {
            console.log(err);
            setErr(err);
          }
        }}
      >
        {"Save Changes"}
      </button>

      <button
        id="delete-Q-button"
        type="button"
        onClick={async (event) => {
          try {
            //await modifyQuestion(event);
            navigate("/profile/user");
          } catch (err) {
            console.log(err);
            setErr(err);
          }
        }}
      >
        {"Delete Question"}
      </button>
      <p id="question-form-asterisk" className="form-asterisk">
        {"* indicates mandatory fields"}
      </p>
    </div>
  );
}
