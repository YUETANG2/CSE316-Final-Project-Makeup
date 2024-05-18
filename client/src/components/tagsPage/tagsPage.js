import AskQstnBtn from "../mainPage/askQstnBtn.js";
import TagBox from "./tagsPageBox.js";
import { useState, useEffect } from "react";
import axios from "axios";

//Tags Page  for FakeStackOverflow
export default function TagPage(props) {
  const [tagsList, setTagsList] = useState([""]);

  useEffect(() => {
    async function updateTags() {
      try {
        let tagsList = await axios.get("http://127.0.0.1:8000/getAllTags");
        setTagsList(tagsList.data);
      } catch (err) {
        console.error(err);
      }
    }

    updateTags();
  }, []);

  let tags = tagsList;
  console.log(tags);
  console.log("INSIDE TAG PAGE");
  console.log(props.userStatus);

  return (
    <div id="all-tags-page" className="main-div content-div">
      <div id="all-tags-page-top">
        <h1 id="num-of-tags">
          {tags.length} {tags.length === 1 ? " tag" : " tags"}
        </h1>
        <h1 id="All-Tags-heading">All Tags</h1>
        <AskQstnBtn userStatus={props.userStatus} /*switchTo={props.switchTo}*/ />
      </div>
      <div id="tag-list">
        {tags.map((tag) => (
          <TagBox
            userStatus={props.userStatus}
            tag={tag}
            //simulateSearchForTag={props.simulateSearchForTag}
            //getTagQstnCount={props.getTagQstnCount}
            key={tag._id}
          />
        ))}
      </div>
    </div>
  );
}
