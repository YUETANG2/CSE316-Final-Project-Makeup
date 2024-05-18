import Header from "../../components/header";
import Navigator from "../../components/navigator.js";
import EditQuestion from "../../components/questionPages/EditQuestion.js";
import { useLocation } from "react-router-dom";

export default function EditQstnPage(props) {
  const location = useLocation();
  let userStatus = location.state.userStatus;

  return (
    <div>
      <Header currentPage="edit_qstn_page" userStatus="user"></Header>
      <div className="main" id="main">
        <Navigator userStatus={props.userStatus} > </Navigator>
        <EditQuestion userStatus={userStatus}></EditQuestion>
      </div>
    </div>
  );
}
