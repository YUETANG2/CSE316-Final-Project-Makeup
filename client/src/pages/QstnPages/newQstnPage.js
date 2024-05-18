import Header from "../../components/header";
import Navigator from "../../components/navigator.js";
import AskQuestion from "../../components/questionPages/AskQuestion.js";

export default function NewQstnPage(props) {
  return (
    <div>
      <Header currentPage="new_qstn_page" userStatus="user"></Header>
      <div className="main" id="main">
        <Navigator userStatus={props.userStatus}> </Navigator>
        <AskQuestion></AskQuestion>
      </div>
    </div>
  );
}
