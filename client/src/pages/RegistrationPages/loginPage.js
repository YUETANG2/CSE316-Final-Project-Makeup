import Header from "../../components/header";
import LogInBox from "../../components/registrationPage/logInBox";

export default function LoginPage() {
  return (
    <div>
      <Header currentPage="login_page" userStatus="guest"> </Header>
      <LogInBox> </LogInBox>
    </div>
  );
}
