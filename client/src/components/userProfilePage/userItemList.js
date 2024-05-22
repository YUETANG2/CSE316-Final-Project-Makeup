//Main (Questions) Page  for FakeStackOverflow
import { useEffect, useState } from "react";
import axios from "axios";
import UserStat from "./userStat";
import UserItemsDisplayBlock from "./userQstnsDisplayBlock";

export default function UserQstnList(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemList, setItemList] = useState([]);
  const [type, setType] = useState("");

  useEffect(() => {
    findAllQstnsCreated();
  }, []);

  let findAllQstnsCreated = async () => {
    console.log("Get all Questions");
    let allQstnsList = await axios.get(
      "http://127.0.0.1:8000/profile/allQstns/" + props.userId,
      {
        withCredentials: true,
      }
    );
    console.log(allQstnsList.data);
    setItemList(allQstnsList.data);
    setType("Question");
    setCurrentPage(1);
  };

  let findAllAnsCreated = async () => {
    console.log("Get all Answers");
    let allQstnsList = await axios.get(
      "http://127.0.0.1:8000/profile/allAns/" + props.userId
    );
    console.log(allQstnsList.data);
    setItemList(allQstnsList.data);
    setType("Answer");
    setCurrentPage(1);
  };

  let findAllTagsCreated = async () => {
    console.log("Get all Tags");
    let tagsList = await axios.get(
      "http://127.0.0.1:8000/profile/allTags/" + props.userId
    );
    console.log(tagsList.data);
    setItemList(tagsList.data);
    setType("Tag");
    setCurrentPage(1);
  };

  let incrementPageNum = () => {
    let num = currentPage;
    if (num >= Math.ceil(itemList.length / 5)) {
      setCurrentPage(1);
    } else {
      setCurrentPage(++num);
    }
  };

  let decrementPageNum = () => {
    let num = currentPage;
    if (num != 1) {
      setCurrentPage(--num);
    }
  };

  return (
    <div className="main-div" id="content">
      <UserStat
        userId={props.userId}
        itemListNum={itemList.length}
        item={type}
        findAllQstnsCreated={findAllQstnsCreated}
        findAllAnsCreated={findAllAnsCreated}
        findAllTagsCreated={findAllTagsCreated}
      ></UserStat>
      <UserItemsDisplayBlock
        userId={props.userId}
        incrementPageNum={incrementPageNum}
        decrementPageNum={decrementPageNum}
        currentPage={currentPage}
        itemList={itemList}
        type={type}
        userStatus={props.userStatus}
      ></UserItemsDisplayBlock>
    </div>
  );
}
