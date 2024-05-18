import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditTag(props) {
  const navigate = useNavigate();
  const [error, setErr] = useState([""]);
  const [tag, setTag] = useState("");
  let { tagId } = useParams();

  console.log(error);

  useEffect(() => {
    let setUpQstnInput = async (tagId) => {
      let res = await axios.get(
        "http://127.0.0.1:8000/profile/getTagById/" + tagId
      );
      let tagInput = res.data;
      console.log(tagInput);
      setTag(tagInput);
    };

    setUpQstnInput(tagId);
  }, []);

  let editTag = async () => {
    console.log("inside edit tag");
    let tags = document
      .getElementById("q-tags")
      .value.toLocaleLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    let uniqueTags = [...new Set(tags)];

    console.log(uniqueTags);

    let isGood = true;
    let err = [""];

    if (uniqueTags.length > 1) {
      isGood = false;
      //console.log("IT SHOUDL BE IN HERE");
      err.push("err-multiple-tag");
      console.log(err);
    }

    if (uniqueTags[0] == null || uniqueTags[0].length > 20) {
      isGood = false;
      err.push("err-tag-length");
    }

    if (isGood) {
      try {
        let tagName = uniqueTags[0];
        let newTagData = {
          name: tagName,
          tagId: tagId,
        };
        let res = await axios.post(
          "http://127.0.0.1:8000/profile/modifyTag",
          newTagData
        );
        console.log(res.data);
      } catch (e) {
        isGood = false;
        console.error(e);
        err.push(e.response.data.message);
      }
    }

    if (!isGood) {
      console.log(err);
      throw err;
    }
  };

  let deleteTag = async () => {
    let isGood = true;
    let err = [""];

    try {
      let tagData = {
        tagId: tagId,
      };
      let res = await axios.post(
        "http://127.0.0.1:8000/profile/deleteTag",
        tagData
      );

      console.log(res.data);
    } catch (e) {
      isGood = false;
      console.error(e);
      err.push(e.response.data.message);
    }

    if (!isGood) {
      console.log(err);
      throw err;
    }
  };

  console.log(tagId);

  return (
    <div className="main-div content-div" id="question-form">
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
          value={tag}
          onChange={(event) => {
            setTag(event.target.value);
          }}
        />
      </form>

      {error.includes("err-multiple-tag") && (
        <p className="err-msg" id="err-tags-length">
          {"*There should not be more than 1 tag"}
        </p>
      )}

      {error.includes("err-tag-length") && (
        <p className="err-msg" id="err-tag-length">
          {
            "*The length of the modified tag cannot be less than 1 or more than 20 characters"
          }
        </p>
      )}

      {error.includes("err-tag-in-use") && (
        <p className="err-msg" id="err-tag-reputation-points">
          {"*This tag is currently in use by other users"}
        </p>
      )}

      <button
        id="post-Q-button"
        type="button"
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
      >
        {"Save Changes"}
      </button>
      <button
        id="delete-T-button"
        type="button"
        onClick={async (event) => {
          console.log("post q is clicked");
          try {
            await deleteTag();
            if (props.userStatus === "USER") {
              navigate("/profile/user");
            } else if (props.userStatus === "ADMIN") {
              navigate("/profile/admin");
            }
          } catch (err) {
            console.log(err);
            setErr(err);
          }
        }}
      >
        {"Delete Tag"}
      </button>
      <p id="question-form-asterisk" className="form-asterisk">
        {"* indicates mandatory fields"}
      </p>
    </div>
  );
}
