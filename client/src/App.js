// THIS FILE NOT IN USE -> use App_test.js

// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import "./stylesheets/App.css";
import React, { useState, useEffect } from "react";
import Header from "./components/header.js";
import Navigator from "./components/navigator.js";
import MainPage from "./components/mainPage/qstnList.js";
//import Model from "./models/model.js";
import AskQuestion from "./components/questionPages/AskQuestion.js";
import TagPage from "./components/tagsPage/tagsPage.js";
import PostAnswer from "./components/postAnswer/postAnswer.js";
import AnswersPage from "./components/answersPage/answersPage.js";
import LoginPage from "./components/registrationPage/loginPage.js";
import axios from "axios";

//let model = new Model();

function App() {
  const [qstnsList, setQstnsList] = useState([]); //Track all the questions
  const [render, setRender] = useState(0); //Trigger re-rendering after updating the qstnsList
  const [currentPage, setCurrentPage] = useState("login"); //track current page + trigger re-rendering
  const [qstn, setQstn] = useState(""); // get the question when clicked on to generate ans page
  const [ansList, setAnsList] = useState([]); // provide answers when generating ans page
  const [tagsList, setTagsList] = useState([]);

  //not in use
  const allPages = ["login", "main", "askQstns", "ansPage", "postAns", "tags"];

  /* Retrieve all questions from mongoDB when App first mount */
  useEffect(() => {
    let getQstnList = async () => {
      let qstnList = await axios.get(
        "http://127.0.0.1:8000/getAllQstns?filter=newest"
      );
      setQstnsList(qstnList.data);
    };
    getQstnList();
  }, []);

  /* Filter questions using tags and text */
  async function updateQstnsList(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      switchTo(event, "main");

      let input = document.getElementById("search-by-text").value;
      try {
        let qstnsList = await updateQstnsListHelper(input);
        setQstnsList(qstnsList);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function updateQstnsListHelper(input) {
    if (input !== "") {
      let qstnSet = new Set();
      let search_terms = input.split(" ");

      /* Search by tags */
      let tags = search_terms.filter((term) => {
        var pattern = /\[.*\]/;
        return pattern.test(term);
      });

      for (let tag of tags) {
        try {
          tag = tag.slice(1, -1).toLowerCase();

          let qstnList = await axios.get(
            "http://127.0.0.1:8000/getQstnsByTag?tagName=" + tag
          );

          qstnList = qstnList.data;
          //console.log("Questions List");
          //console.log(qstnList);
          qstnList.forEach((qstn) => {
            let contains = false;
            qstnSet.forEach((q) => {
              if (q._id === qstn._id) {
                contains = true;
              }
            });
            if (!contains) {
              qstnSet.add(qstn);
            }
          });
        } catch (err) {
          console.error(err);
        }
      }

      /* Search by key words (title + text)*/
      let keyWords = search_terms.filter((term) => {
        var pattern = /\[.*\]/;
        return !pattern.test(term);
      });

      for (let word of keyWords) {
        try {
          let qstnList = await axios.get(
            "http://127.0.0.1:8000/getQstnsByKeyWord?keyword=" + word
          );

          qstnList = qstnList.data;
          //console.log("Questions List");
          //console.log(qstnList);
          qstnList.forEach((qstn) => {
            let contains = false;
            qstnSet.forEach((q) => {
              if (q._id === qstn._id) {
                contains = true;
              }
            });
            if (!contains) {
              qstnSet.add(qstn);
            }
          });
        } catch (err) {
          console.error(err);
        }
      }

      //console.log("question set: ");
      //console.log(qstnSet);
      return Array.from(qstnSet);
    } else {
      let qstnsbynewest = await axios.get(
        "http://127.0.0.1:8000/getAllQstns?filter=newest"
      );
      return qstnsbynewest.data;
    }
  }

  /**Sort questions by Newest */
  let filterByNewest = async () => {
    console.log("Newest");

    let qstnsbynewest = await axios.get(
      "http://127.0.0.1:8000/getAllQstns?filter=newest"
    );

    setQstnsList(qstnsbynewest.data);
    setRender(render + 1);
  };

  let filterByActive = async () => {
    console.log("Active");

    let qstnsbyactive = await axios.get(
      "http://127.0.0.1:8000/getAllQstns?filter=active"
    );

    setQstnsList(qstnsbyactive.data);
    setRender(render + 1);
  };

  /** filter questions by unanswered */
  let filterByUnanswered = async () => {
    console.log("Unanswered");

    let qstnsbyunanswered = await axios.get(
      "http://127.0.0.1:8000/getAllQstns?filter=unanswered"
    );

    setQstnsList(qstnsbyunanswered.data);
    setRender(render + 1);
  };

  function switchTo(event, page) {
    event.preventDefault();
    console.log("change to " + page);
    setCurrentPage(page);
  }

  /** Insert new questions from ask question page */
  async function postQuestion() {
    /*---- extract input in each field ----*/
    let title = document.getElementById("q-title").value;
    let text = document.getElementById("q-text").value;
    let tags = document
      .getElementById("q-tags")
      .value.toLocaleLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    let uniqueTags = [...new Set(tags)];
    let username = document.getElementById("q-username").value;

    /*----- check if each input is valid -----*/
    let err = [""];
    let isGood = true;
    if (title.length > 100 || title.length === 0) {
      isGood = false;
      err.push("err-title");
    }

    if (text.length === 0) {
      isGood = false;
      err.push("err-text");
    }
    /*-------- check if links are valid --------*/
    console.log(text);
    let link_indicator = /\[(.*?)\]\((.*?\))/g;
    let http = /^http(s?):\/\//;
    let matches;
    while ((matches = link_indicator.exec(text)) !== null) {
      if (!http.test(matches[2])) {
        //console.log("link error: " + matches[2]);
        isGood = false;
        err.push("err-link");
        break;
      }
    }

    if (uniqueTags.length < 1 || uniqueTags.length > 5) {
      isGood = false;
      err.push("err-tags-length");
    } else {
      for (let tag of uniqueTags) {
        if (tag.length > 20) {
          isGood = false;
          err.push("err-tag-length");
          break;
        }
      }
    }

    if (username.length === 0) {
      isGood = false;
      err.push("err-username");
    }

    /*----- Check if inputs are valid -----*/
    if (!isGood) {
      throw err;
    } else {
      /* update model to include this new question*/
      let newQuestionData = {
        title: title,
        text: text,
        tags: uniqueTags,
        askedBy: username,
        askDate: new Date(),
      };

      console.log("new data: ");
      console.log(newQuestionData);
      //model.insertNewQstn(newQuestionData);
      try {
        let res = await axios.post(
          "http://127.0.0.1:8000/addNewQstn",
          newQuestionData
        );

        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
      /* testing */
      //console.log("after insertion: ");
      //console.log(model.getAllQstns());
      //console.log("Inside the state");
      //console.log(qstnsList);

      filterByNewest();
    }
  }

  /**make sure the questions are displayed in
   * newest order the first time webpage is opened*/
  if (render === 0) {
    filterByNewest();
  }

  async function postAnswer() {
    let username = document.getElementById("a-username").value;
    let text = document.getElementById("a-text").value;
    let ansQID = qstn._id;

    /*----- check if each input is valid -----*/
    let err = [""];
    let isGood = true;

    if (username.length === 0) {
      isGood = false;
      err.push("err-a-username");
    }

    if (text.length === 0) {
      isGood = false;
      err.push("err-a-text");
    }

    /*-------- check if links are valid --------*/
    let link_indicator = /\[(.*?)\]\((.*?\))/g;
    let http = /^http(s?):\/\//;
    let matches;
    while ((matches = link_indicator.exec(text)) !== null) {
      if (!http.test(matches[2])) {
        //console.log("link error: " + matches[2]);
        isGood = false;
        err.push("err-a-link");
        break;
      }
    }

    /*----- Check if inputs are valid -----*/
    if (!isGood) {
      throw err;
    } else {
      let newAnswerData = {
        text: text,
        ansBy: username,
        ansDate: new Date(),
        ansQID: qstn._id,
      };

      try {
        let res = await axios.post(
          "http://127.0.0.1:8000/addNewAnswer",
          newAnswerData
        );
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  }

  function calculateTimePosted(timePosted) {
    let currentTime = new Date();
    let time = timePosted.toString().split(" ");
    if (timePosted.getFullYear() < currentTime.getFullYear()) {
      return (
        time[1] + " " + time[2] + ", " + time[3] + " at " + time[4].substr(0, 5)
      );
    } else if (timePosted.getMonth() < currentTime.getMonth()) {
      return time[1] + " " + time[2] + " " + "at " + time[4].substr(0, 5);
    } else if (timePosted.getDate() < currentTime.getDate()) {
      return time[1] + " " + time[2] + " " + "at " + time[4].substr(0, 5);
    } else if (timePosted.getHours() < currentTime.getHours()) {
      let difference = currentTime.getHours() - timePosted.getHours();
      if (difference === 1) {
        return difference + " hour ago";
      } else {
        return difference + " hours ago";
      }
    } else if (timePosted.getMinutes() < currentTime.getMinutes()) {
      let difference = currentTime.getMinutes() - timePosted.getMinutes();
      if (difference === 1) {
        return difference + " minute ago";
      } else {
        return difference + " minutes ago";
      }
    } else {
      let difference = currentTime.getSeconds() - timePosted.getSeconds();
      if (difference === 1) {
        return difference + " second ago";
      } else {
        return difference + " seconds ago";
      }
    }
  }

  async function getAnswersPageData(id) {

    try {
      let answersList = await axios.get(
        "http://127.0.0.1:8000/getAnswersPageData?id=" + id
      );
      setAnsList(answersList.data);
      let question = await axios.get(
        "http://127.0.0.1:8000/getAnswersPageQstn?id=" + id
      );
      setQstn(question.data);
      let qstnList = await axios.get(
        "http://127.0.0.1:8000/getAllQstns?filter=newest"
      );
      setQstnsList(qstnList.data);
    } catch (err) {
      console.error(err);
    }

  }

  async function updateTags() {
    try {
      let tagsList = await axios.get("http://127.0.0.1:8000/getAllTags");
      setTagsList(tagsList.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function getTagQstnCount(id) {
    try {
      //let tagQstnCount = await axios.get(
      //"http://127.0.0.1:8000/getTagQstnCount?id=" + id);
      //return tagQstnCount;
    } catch (err) {
      console.error(err);
    }
  }

  function simulateSearchForTag(tagName) {
    const event = new KeyboardEvent("keydown", {
      key: "Enter",
    });
    let searchBar = document.getElementById("search-by-text");
    searchBar.value = "[" + tagName + "]";
    console.log("dispatcthing");
    searchBar.dispatchEvent(event);
    updateQstnsList(event);
    console.log("dispatched.");
  }

  return (
    <section>
      {console.log("inside rendering")}
      {console.log(qstnsList)}
      <Header currentPage={currentPage} onKeyDown={updateQstnsList} />

      <div className="main" id="main">
        {currentPage !== "login" && (
          <Navigator
            switchTo={switchTo}
            currentPage={currentPage}
            updateQstnsList={updateQstnsList}
            updateTags={updateTags}
          />
        )}

        {currentPage === "login" && <LoginPage />}

        {currentPage === "main" && (
          <MainPage
            qstns={qstnsList}
            filterByNewest={filterByNewest}
            filterByActive={filterByActive}
            filterByUnanswered={filterByUnanswered}
            setQstn={setQstn}
            setAnsList={setAnsList}
            getAnswersPageData={getAnswersPageData}
            calculateTimePosted={calculateTimePosted}
            switchTo={switchTo}
          />
        )}

        {currentPage === "askQstns" && (
          <AskQuestion postQuestion={postQuestion} switchTo={switchTo} />
        )}

        {currentPage === "ansPage" && (
          <AnswersPage
            answersPage={AnswersPage}
            qstn={qstn}
            ansList={ansList}
            setAnsList={setAnsList}
            getAnswersPageData={getAnswersPageData}
            calculateTimePosted={calculateTimePosted}
            switchTo={switchTo}
          />
        )}

        {currentPage === "postAns" && (
          <PostAnswer
            postAnswer={postAnswer}
            qstn={qstn}
            setAnsList={setAnsList}
            getAnswersPageData={getAnswersPageData}
            switchTo={switchTo}
          />
        )}

        {currentPage === "tags" && (
          <TagPage
            tags={tagsList}
            updateTags={updateTags}
            simulateSearchForTag={simulateSearchForTag}
            getTagQstnCount={getTagQstnCount}
            switchTo={switchTo}
          />
        )}
      </div>
    </section>
  );
}

export default App;

/*

*/
