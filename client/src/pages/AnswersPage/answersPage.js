import Header from "../../components/header.js";
import Navigator from "../../components/navigator.js";
import AnsPage from "../../components/answersPage/answersPage.js";

export default function AnswersPage(props) {
  console.log("in ans pg");
  return (
    <div>
    <Header currentPage="answersPage" userStatus={props.userStatus}>
      </Header>
      <div className="main" id="main">
      <Navigator userStatus={props.userStatus}> </Navigator>
      <AnsPage userStatus={props.userStatus}></AnsPage>
      </div>
    </div>
    
  );
}
