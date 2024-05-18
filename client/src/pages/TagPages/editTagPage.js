import Header from "../../components/header";
import Navigator from "../../components/navigator.js";
import EditTag from "../../components/tagsPage/editTagPags.js";
import { useLocation } from "react-router-dom";

export default function EditTagPage(props) {
  const location = useLocation();
  let userStatus = location.state.userStatus;

  console.log("INSIDE THE EDIT TAG PAGE");
  console.log(userStatus);

  return (
    <div>
      <Header currentPage="edit_tag_page" userStatus="user"></Header>
      <div className="main" id="main">
        <Navigator> </Navigator>
        <EditTag userStatus={userStatus}></EditTag>
      </div>
    </div>
  );
}
