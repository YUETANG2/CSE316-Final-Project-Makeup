//Tag Box for All Tags Page
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TagBox(props) {
  const navigate = useNavigate();
  //let model = props.model;
  let tagArray = [];

  console.log(props.userStatus);

  const [tagNum, setTagNum] = useState(0);
  console.log(props.tag);

  /* testing */
  useEffect(() => {
    const getTagNum = async () => {
      let qstnList = await axios.get(
        "http://127.0.0.1:8000/question/getQstnsByTag?tagName=" + props.tag.name
      );

      let qstnNum = qstnList.data.length;
      //console.log(qstnNum);
      setTagNum(qstnNum);
    };

    getTagNum();
  }, []);

  let simulateSearchForTag = (userStatus, tagName) => {
    const searchBar = document.getElementById("search-by-text");
    console.log(searchBar);
    console.log(tagName);

    let input = "[" + tagName + "]";

    console.log(userStatus);

    if (userStatus === "guest") {
      navigate("/");
      navigate("/allQstns/guest", {
        state: { searchTerm: input },
      });
    } else if (userStatus === "user") {
      console.log(input);
      navigate("/allQstns/user", {
        state: { searchTerm: input },
      });
    }
  };

  return (
    <div className="tag-box" key={props.tag._id}>
      <form>
        <input
          type="submit"
          value={props.tag.name}
          className="tag-box-info"
          key="submit"
          onClick={(event) => {
            event.preventDefault();
            simulateSearchForTag(props.userStatus, props.tag.name);
          }}
        />
      </form>
      <div id="tag-box-num">
        {tagNum} {tagNum === 1 ? " question" : " questions"}
      </div>
    </div>
  );
}
