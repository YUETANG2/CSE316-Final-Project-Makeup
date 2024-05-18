import { useEffect, useState } from "react";
import axios from "axios";
import FilterBtn from "../mainPage/filtersBtn.js";

export default function AdminStat(props) {
  const [userName, setUserName] = useState("");
  const [reputation, setReputation] = useState(0);
  const [timeJoined, setTimeJoined] = useState("");

  useEffect(() => {
    let getUserInfos = async () => {
      let res1 = await axios.get("http://127.0.0.1:8000/profile/getUsername/*");
      let name = res1.data;
      setUserName(name);
      console.log(userName);

      let res2 = await axios.get("http://127.0.0.1:8000/profile/getReputation/*");
      let reputationPoints = res2.data;
      setReputation(reputationPoints);
      console.log(reputation);

      let res3 = await axios.get("http://127.0.0.1:8000/profile/getDateJoined/*");
      let date = res3.data;
      setTimeJoined(date);
    };

    getUserInfos();
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
    <>
      <div className="content-div" id="all-questions">
        <h1 id="All-Questions"> {userName} </h1>
        <div className="user-info2 user-info2">
          <p> Joined since {calculateTimePosted(new Date(timeJoined))} </p>
          <p> {reputation} Reputation Points </p>
        </div>
      </div>

      <div className="content-div"></div>

      <div className="content-div">
        <p id="num-of-Q2">
          {props.itemListNum}{" "}
          {props.itemListNum === 1 ? props.item : props.item + "s"}
        </p>
      </div>

    </>
  );
}
