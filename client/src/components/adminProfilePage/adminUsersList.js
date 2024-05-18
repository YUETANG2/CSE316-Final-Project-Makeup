//Main (Questions) Page  for FakeStackOverflow
import { useEffect, useState } from "react";
import axios from "axios";
import AdminStat from "./adminStat";
import AdminItemsDisplayBlock from "./adminUsersDiplayBlock";

export default function AdminUserList(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    let findAllUsers = async () => {
      try {
        let res1 = await axios.get("http://127.0.0.1:8000/profile//allUsers");
        let allUsers = res1.data;
        console.log(allUsers);
        setItemList(allUsers);
      } catch (err) {
        console.log(err);
      }
    };
    findAllUsers(); 
  }, []);

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
      <AdminStat
        itemListNum={itemList.length}
        item="User"
      ></AdminStat>
      <AdminItemsDisplayBlock
        incrementPageNum={incrementPageNum}
        decrementPageNum={decrementPageNum}
        currentPage={currentPage}
        itemList={itemList}
        type="User"
      ></AdminItemsDisplayBlock>
    </div>
  );
}
