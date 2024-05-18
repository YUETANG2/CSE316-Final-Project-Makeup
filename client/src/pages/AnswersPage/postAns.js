import Header from "../../components/header.js";
import Navigator from "../../components/navigator.js";
import PostAns from "../../components/postAnswer/postAnswer.js";

export default function PostAnswer(props) {

  return (
    <div>
    <Header currentPage="postAns" userStatus="user">
      </Header>
      <div className="main" id="main" >
      <Navigator userStatus="user"> </Navigator>
      <PostAns></PostAns>
      </div>
    </div>
    
  );
}
