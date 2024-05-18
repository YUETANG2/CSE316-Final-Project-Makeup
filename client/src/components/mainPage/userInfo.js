import { useEffect, useState } from "react";
import axios from "axios";

export default function UserInfo(props) {
  const [name, setName] = useState("");

  useEffect(() => {
    let getUserName = async () => {
      let userName = await axios.get(
        "http://127.0.0.1:8000/question/userName?name=" + props.qstn.asked_by
      );
      setName(userName.data);
      //console.log("This is the name " + name);
    };
    getUserName();
  });

  function calculateTimePosted(timePosted) {
    let currentTime = new Date();
    let time = timePosted.toString().split(" ");
    if (timePosted.getFullYear() < currentTime.getFullYear()) {
      return (
        time[1] + " " + time[2] + ", " + time[3] + " at " + time[4].substr(0, 5)
      );
    } else if (timePosted.getMonth() < currentTime.getMonth()) {
      return time[1] + " " + time[2] + " " + "at " + time[4].substr(0, 5);
    } else if (timePosted.getDate() < currentTime.getDate()) {
      return time[1] + " " + time[2] + " " + "at " + time[4].substr(0, 5);
    } else if (timePosted.getHours() < currentTime.getHours()) {
      let difference = currentTime.getHours() - timePosted.getHours();
      if (difference === 1) {
        return difference + " hour ago";
      } else {
        return difference + " hours ago";
      }
    } else if (timePosted.getMinutes() < currentTime.getMinutes()) {
      let difference = currentTime.getMinutes() - timePosted.getMinutes();
      if (difference === 1) {
        return difference + " minute ago";
      } else {
        return difference + " minutes ago";
      }
    } else {
      let difference = currentTime.getSeconds() - timePosted.getSeconds();
      if (difference === 1) {
        return difference + " second ago";
      } else {
        return difference + " seconds ago";
      }
    }
  }

  return (
    <div className="user-info">
      <p>
        <span style={{ color: "red" }}> {name} </span> asked{" "}
        {calculateTimePosted(new Date(props.qstn.ask_date_time))}
      </p>
    </div>
  );
}
