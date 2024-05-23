import Header from "../../components/header.js";
import Navigator from "../../components/navigator.js";
import EditAns from "../../components/postAnswerPages/EditAnswer.js";

export default function EditAnswer(props) {

  return (
    <div>
    <Header currentPage="postAns" userStatus="user">
      </Header>
      <div className="main" id="main" >
      <Navigator userStatus={props.userStatus}> </Navigator>
      <EditAns></EditAns>
      </div>
    </div>
  );
}
