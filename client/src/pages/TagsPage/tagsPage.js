import Header from "../../components/header.js";
import Navigator from "../../components/navigator.js";
import TagsPage from "../../components/tagsPage/tagsPage.js";

//Tags Page  for FakeStackOverflow
export default function TagPage(props) {
  console.log("IM INSIDE THE TAGPAGE");
  console.log(props.userStatus);
  return (
    <div>
       <Header
        currentPage="tagsPage"
        userStatus={props.userStatus}
      ></Header>
      <div class="main" id="main">
      <Navigator currentPage={"tagsPage"} userStatus={props.userStatus}> </Navigator>
      <TagsPage userStatus={props.userStatus}></TagsPage>
      </div>
    </div>

  );
}
