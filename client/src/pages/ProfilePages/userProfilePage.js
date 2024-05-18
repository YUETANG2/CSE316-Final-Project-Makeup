import Header from "../../components/header.js";
import Navigator from "../../components/navigator.js";
import UserQstnsList from "../../components/userProfilePage/userItemList.js";
import { useLocation } from "react-router-dom";

export default function UserProfilePage(props) {
  const location = useLocation();
  let userId = "*"; //accessing user's own acc
  let userStatus = "USER"; //it's a regular login user

  if (location.state != null) {
    userId = location.state.userId;
    console.log(userId);
    userStatus = location.state.userStatus;
    console.log(userStatus);
  }

  let needProfileBtn = (userId, userStatus) => {
    if (userStatus === "ADMIN" && userId != "*") {
      //when Admin is viewing other user's profile 
      console.log("This is trueee")
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      <Header
        currentPage="profile_page"
        needProfileBtn={needProfileBtn(userId, userStatus)}
        userStatus={props.userStatus}
      ></Header>
      <div className="main" id="main">
        <Navigator userStatus={props.userStatus} currentPage="profile"> </Navigator>
        <UserQstnsList userStatus={userStatus} userId={userId}></UserQstnsList>
      </div>
    </div>
  );
}

/*

export default function UserProfilePage(props) {
  return (
    <div>
      <Header currentPage="profile_page" userStatus={props.userStatus}>
        {" "}
      </Header>
      <div className="main" id="main">
        <Navigator currentPage="main"> </Navigator>
        <div className="main-div content-div" id="user-profile-page">
        <p> USER PROFILE PAGE </p>
        </div> 
      </div>
    </div>
  );
}

  
length of time the user has been a member + reputation 

Set of question titles 
   - for each title there is a link the brings to the newQstnPage 
       - the newQstnPage display the existing information of this qstn properly
       - to delete or modify the question 
  
Link to view all tags created by the user
   - After link if clicked, set of tags are displayed in the same for,at as in the Tags Page
   
Link to view all qstns ANSWERED by the user



  
  
  
  
  */
