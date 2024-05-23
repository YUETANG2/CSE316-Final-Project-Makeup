import { useState, useEffect } from "react";
import axios from "axios";

export default function Comment(props) {
  const [commment, setComment] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState("");
  const [upVotes, setUpVotes] = useState(0);



  useEffect(() => {
    let getCommentData = async (commentId) => {
      let getComment = await axios.get(
        "http://127.0.0.1:8000/comment/getCommentData/" + commentId
      );

      let commentData = getComment.data;

      //console.log("INISDE COMMENT");
      //console.log(commentData);

      setComment(commentData.text);
      setDate(commentData.comment_date_time);
      setUpVotes(commentData.upvote)

      let getUsername = await axios.get(
        "http://127.0.0.1:8000/answersPage/getUsername/" +
          commentData.comment_by
      );
      setUser(getUsername.data);
    };

    getCommentData(props.commentId);
  }, []);

  let incrementUpvote = async () => {
    try {
      let res = await axios.post(
        "http://127.0.0.1:8000/comment/incrementUpvoteById",
        { commentId: props.commentId }
      );

      //console.log(res.data);
      if(res.data === "DONE"){
        setUpVotes(upVotes+1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="comment-post">
      <h3 className="comment-post-vote" id="num-of-votes">
        {upVotes}
        <div
          class="arrow-up"
          onClick={() => {
            //console.log("upvote +122222");
            //console.log(props.userStatus);
            if (props.userStatus === "user") {
              //console.log("upvote +122222");
              incrementUpvote(); 
            }
          }}
        ></div>
      </h3>
      <div className="comment-post-text">{commment}</div>
      <div className="comment-post-user-info">
        <p>
          <span style={{ color: "blue" }}> {user} </span> commented{" "}
          {props.calculateTimePosted(new Date(date))}
        </p>
      </div>
    </div>
  );
}

