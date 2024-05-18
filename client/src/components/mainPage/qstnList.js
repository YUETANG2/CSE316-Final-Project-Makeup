import React from "react";
import QstnStat from "./qstnStat.js";
import QstnsDisplayBlock from "./qstnsDisplayBlock.js";

import { useState, useEffect } from "react";
import axios from "axios";

//Main (Questions) Page  for FakeStackOverflow
export default function QstnList(props) {
  const [qstnsList, setQstnsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const searchTerm = props.searchInput;

  async function updateQstnsListHelper(input) {
    if (input !== "") {
      let qstnSet = new Set();
      let search_terms = input.split(" ");

      let tags = search_terms.filter((term) => {
        var pattern = /\[.*\]/;
        return pattern.test(term);
      });

      for (let tag of tags) {
        try {
          tag = tag.slice(1, -1).toLowerCase();
          console.log(tag);

          let qstnList = await axios.get(
            "http://127.0.0.1:8000/question/getQstnsByTag?tagName=" + tag
          );

          qstnList = qstnList.data;

          console.log(qstnList);

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

      let keyWords = search_terms.filter((term) => {
        var pattern = /\[.*\]/;
        return !pattern.test(term);
      });

      for (let word of keyWords) {
        try {
          let qstnList = await axios.get(
            "http://127.0.0.1:8000/question/getQstnsByKeyWord?keyword=" + word
          );

          qstnList = qstnList.data;
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
    
      setQstnsList(Array.from(qstnSet));
    } else {
      let qstnsbynewest = await axios.get(
        "http://127.0.0.1:8000/question/getAllQstns?filter=newest"
      );
      setQstnsList(qstnsbynewest.data)
      console.log(qstnsbynewest.data);
    }
    setCurrentPage(1);
  }

  useEffect(() => {
    console.log(searchTerm);
    updateQstnsListHelper(searchTerm);
  }, [searchTerm]);

  /**Sort questions by Newest */
  let filterByNewest = async () => {
    console.log("Newest");

    let qstnsbynewest = await axios.get(
      "http://127.0.0.1:8000/question/getAllQstns?filter=newest"
    );

    setQstnsList(qstnsbynewest.data);
    setCurrentPage(1);
    //setRender(render + 1);
  };

  let filterByActive = async () => {
    console.log("Active");

    let qstnsbyactive = await axios.get(
      "http://127.0.0.1:8000/question/getAllQstns?filter=active"
    );

    setQstnsList(qstnsbyactive.data);
    setCurrentPage(1);
    //setRender(render + 1);
  };

  /** filter questions by unanswered */
  let filterByUnanswered = async () => {
    console.log("Unanswered");

    let qstnsbyunanswered = await axios.get(
      "http://127.0.0.1:8000/question/getAllQstns?filter=unanswered"
    );

    setQstnsList(qstnsbyunanswered.data);
    setCurrentPage(1);
    //setRender(render + 1);
  };

  let incrementPageNum = () => {
    let num = currentPage; 
    if(num >= Math.ceil(qstnsList.length/5)){
      setCurrentPage(1);
    }else{
      setCurrentPage(++num);
    }
  }

  let decrementPageNum = () => {
    let num = currentPage;
    if(num != 1){
      setCurrentPage(--num);
    }
  }

  //console.log("Inside qstnList: " + props.userStatus);
  return (
    <div className="main-div" id="content">
      <QstnStat
        filterByNewest={filterByNewest}
        filterByActive={filterByActive}
        filterByUnanswered={filterByUnanswered}
        qstnsNum={qstnsList.length}
        userStatus={props.userStatus}
      ></QstnStat>
      <QstnsDisplayBlock
        qstnsList={qstnsList}
        currentPage={currentPage}
        incrementPageNum = {incrementPageNum}
        decrementPageNum = {decrementPageNum}
        setQstn = {props.setQstn}
        userStatus = {props.userStatus}
      ></QstnsDisplayBlock>
    </div>
  );
}
