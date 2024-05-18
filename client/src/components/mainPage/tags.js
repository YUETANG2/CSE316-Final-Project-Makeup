import axios from "axios";
import React, { useState, useEffect } from "react";

function Tags(props) {
  const [tagName, setTagName] = useState("");

  /* testing */
  useEffect(() => {
    const getName = async () => {
      let name = await axios.get(
        "http://127.0.0.1:8000/getTagById?id=" + props.tag
      );
      //console.log(name.data);
      setTagName(name.data);
    };
    getName();
  }, []);

  //console.log(props.tag);
  return <input type="submit" value={tagName} className="tag" />;
}

export default Tags;
