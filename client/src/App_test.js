import "./stylesheets/App.css";
import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import LoginPage from "./pages/RegistrationPages/loginPage";
import SignUpPage from "./pages/RegistrationPages/signUpPage";
import AllQstnsPage from "./pages/QstnPages/allQstnsPage";
import NewQstnPage from "./pages/QstnPages/newQstnPage";
import EditQstnPage from "./pages/QstnPages/editQstnsPage";
import EditTagPate from "./pages/TagPages/editTagPage";
import UserProfilePage from "./pages/ProfilePages/userProfilePage";
import AdminProfilePage from "./pages/ProfilePages/adminProfilePage";
import TagsPage from "./pages/TagsPage/tagsPage";
import AnswersPage from "./pages/AnswersPage/answersPage";
import PostAnswer from "./pages/AnswersPage/postAns";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/allQstns/guest"
          element={<AllQstnsPage userStatus="guest" />}
        />
        <Route
          path="/allQstns/user"
          element={<AllQstnsPage userStatus="user" />}
        />
        <Route
          path="/allQstns/user/newQstn"
          element={<NewQstnPage userStatus="user" />}
        />
        <Route
          path="/profile/user"
          element={<UserProfilePage userStatus="user" />}
        />
        <Route
          path="/profile/admin"
          element={<AdminProfilePage userStatus="user" />}
        />
        <Route
          path="/profile/user/qstn/:qstnId"
          element={<EditQstnPage userStatus="user" />}
        ></Route>
        <Route
          path="/profile/user/tag/:tagId"
          element={<EditTagPate userStatus="user" />}
        ></Route>
        <Route
          path="/allTags/user"
          element={<TagsPage userStatus="user" />}
        ></Route>
        <Route
          path="/allTags/guest"
          element={<TagsPage userStatus="guest" />}
        ></Route>
        <Route
          path="/answersPage/user/:qstnId"
          element={<AnswersPage userStatus="user" />}
        ></Route>
        <Route
          path="/answersPage/guest/:qstnId"
          element={<AnswersPage userStatus="guest" />}
        ></Route>
        <Route
          path="/postAnswer/user/:qstnId"
          element={<PostAnswer userStatus="user" />}
        ></Route>

        <Route
          path="/postAnswer/guest/:qstnId"
          element={<PostAnswer userStatus="guest" />}
        ></Route>
      </Routes>
    </div>
  );
}
