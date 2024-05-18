import Header from "../../components/header";
import SignUpBox from "../../components/registrationPage/signUpBox";

export default function SignUpPage() {
  return (
    <div>
      <Header currentPage="login_page" userStatus="guest"> </Header>
      <SignUpBox> </SignUpBox>
    </div>
  );
}
