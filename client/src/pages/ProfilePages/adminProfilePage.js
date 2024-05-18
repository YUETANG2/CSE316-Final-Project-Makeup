import Header from "../../components/header.js";
import Navigator from "../../components/navigator.js";
import AdminUsersList from "../../components/adminProfilePage/adminUsersList.js";

export default function adminProfilePage(props) {
  return (
    <div>
      <Header currentPage="profile_page" userStatus={props.userStatus}>
      </Header>
      <div className="main" id="main">
        <Navigator userStatus={props.userStatus} currentPage="profile"> </Navigator>
        <AdminUsersList></AdminUsersList>
      </div>
    </div>
  );
}