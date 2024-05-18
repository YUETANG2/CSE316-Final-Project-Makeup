//Log In Box
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function LogInBox() {
  const [error, setError] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    let checkCredential = async (navigate) => {
      let res = await axios.post("http://127.0.0.1:8000/user/", {
        withCredentials: true,
      });
      console.log(res.data);
      if (res.data === "PASS") {
        navigate("/allQstns/user");
      }
    };
    checkCredential(navigate);
  }) 

  let onSubmit = async () => {
    let inputform = document.getElementById("log-in-form");
    let inputs = inputform.children;

    let userData = {
      email: inputs[1].value,
      password: inputs[3].value,
    };

    //console.log(userData);
    try {
      let res = await axios.post(
        "http://127.0.0.1:8000/user/log-in",
        userData,
        { withCredentials: true }
      );
      
      navigate("/allQstns/user");
    } catch(err) {
      setError(true);
    }
  };

  return (
    <div className="registration-page">
      <form id="log-in-form">
        <label className="registration-instruction" htmlFor="email">
          Enter your email:
        </label>
        <input
          type="text"
          className="log-in-form-input"
          id="email"
          name="email"
          placeholder="yt2@sb.edu"
        />
        <label className="registration-instruction" htmlFor="password">
          Enter your password:
        </label>
        <input
          type="text"
          className="log-in-form-input"
          id="password"
          name="password"
          placeholder="123"
        />
        <button
          className="log-in-form-btn"
          id="log-in-btn"
          onClick={async (event) => {
            event.preventDefault();
            await onSubmit();
          }}
        >
          Log In
        </button>
        <Link className="registration-page-link" to="/signup">
          {" "}
          I'm a new user{" "}
        </Link>
        <Link className="registration-page-link" to="/allQstns/guest">
          {" "}
          Continue as a guest{" "}
        </Link>
      </form>
      {error && <p class="registration-err"> Invalid username or password </p>}
    </div>
  );
}
