import Header from "../../components/header.js";
import Navigator from "../../components/navigator.js";
import QstnList from "../../components/mainPage/qstnList.js";
import { useLocation } from "react-router-dom";

export default function AllQstnsPage(props) {
  const location = useLocation();
  let searchInput = "";

  if (location.state != null) {
    searchInput = location.state.searchTerm;
  }

  return (
    <div>
      <Header
        currentPage="all_qstn_page"
        userStatus={props.userStatus}
      ></Header>
      <div className="main" id="main">
        <Navigator userStatus={props.userStatus} currentPage="main"> </Navigator>
        <QstnList
          searchInput={searchInput}
          userStatus={props.userStatus}
          setQstn = {props.setQstn}
          qstns={[]}
        >
        </QstnList>
      </div>
    </div>
  );
}
