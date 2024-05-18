//Sign Up Box
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { isValidElement, useEffect, useState } from "react";

export default function SignUpBox(props) {
  const [error, setError] = useState([""]);
  const navigate = useNavigate(); 

  useEffect(() => {
    console.log("Updated");
    console.log(error);
  });
  let isEmailValid = (email) => {
    if (!email.includes("@")) {
      return false;
    }

    let strs = email.split("@");
    let prefix = strs[0];
    let domain = strs[1];

    const prefixPattern = /^[a-z0-9]+(?:[_.-][a-z0-9]+)*$/i;
    if (!prefixPattern.test(prefix)) {
      return false;
    }
    const domainPattern = /^[a-z0-9-]+(?:\.[a-z0-9]+){1,}$/i;
    if (!domainPattern.test(domain)) {
      return false;
    }

    return true;
  };

  let onSubmit = async () => {
    let inputform = document.getElementById("log-in-form");
    console.log(inputform);
    let inputs = inputform.children;

    let userData = {
      fname: inputs[1].value,
      lname: inputs[3].value,
      email: inputs[5].value,
      password: inputs[7].value,
      password_verification: inputs[9].value,
    };

    console.log(userData);
    let errors = [];

    if (userData.fname.length == 0 || userData.lname.length == 0) {
      errors.push("First or last name can't be empty");
    }

    if (!isEmailValid(userData.email)) {
      errors.push("Invalid Email");
    }

    if (userData.password != userData.password_verification) {
      errors.push("Password doesn't match");
    }

    let prefix = userData.email.split("@")[0];
    let password = userData.password.toLowerCase();
    if (
      password.length == 0 ||
      password.includes(userData.fname.toLowerCase()) ||
      password.includes(userData.lname.toLowerCase()) ||
      password.includes(prefix.toLowerCase())
    ) {
      errors.push("Invalid Passowrd");
    }

    if (errors.length > 0) {
      setError(errors);
    } else {
      try {
        let res = await axios.post(
          "http://127.0.0.1:8000/user/sign-up",
          userData,
          {
            withCredentials: true,
          }
        );
        navigate("/allQstns/user");
        console.log(res.data);
      } catch(err) {
        setError([err.response.data.message]);
      }
    }
  };

  return (
    <div className="registration-page">
      <form id="log-in-form">
        <label className="registration-instruction" htmlFor="fname">
          First Name:
        </label>
        <input
          type="text"
          className="log-in-form-input"
          id="fname"
          name="fname"
          placeholder="Mandy"
        />
        <label className="registration-instruction" htmlFor="lname">
          Last Name:
        </label>
        <input
          type="text"
          className="log-in-form-input"
          id="lname"
          name="lname"
          placeholder="Tang"
        />
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
          Create your password:
        </label>
        <input
          type="text"
          className="log-in-form-input"
          id="password"
          name="password"
          placeholder="123"
        />
        <label
          className="registration-instruction"
          htmlFor="password_verification"
        >
          Verify your password:
        </label>
        <input
          type="text"
          className="log-in-form-input"
          id="password-verification"
          name="password_verification"
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
          Sign Up
        </button>
        <Link className="registration-page-link" to="/">
          {" "}
          I have an account{" "}
        </Link>
        <Link className="registration-page-link" to="/allQstns/guest">
          {" "}
          Continue as a guest{" "}
        </Link>
        {error.map((err) => {
          return (
            <p className="registration-err" key={err}>
              {" "}
              {err}{" "}
            </p>
          );
        })}
      </form>
    </div>
  );
}
