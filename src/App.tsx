import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({} as any);
  const [userData, setuserData] = useState({
    username: "",
    password: "",
  });
  const [emailValid, setEmailValid] = useState(true);
  const [userNotFound, setuserNotFound] = useState(false);

  useEffect(() => {
    checkLoggedIn();
  }, [])

  async function checkLoggedIn() {
    const isUserLoggedIn = localStorage.getItem("user")
    if (isUserLoggedIn) {
      const foundUser = JSON.parse(isUserLoggedIn);
      var details = await axios.get("https://api.getcountapp.com/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${foundUser.token}`
        }
      })
      await setLoggedIn(true);
      await setLoggedInUser(details.data);
    }
  }

  function setData(value: string, type: string) {
    let userObj = {
      username: userData.username,
      password: userData.password
    };
    if (type === "name") {
      userObj.username = value;
    }
    if (type === "password") {
      userObj.password = value;
    }
    setuserData(userObj)
  }

  async function login() {
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (userData.username && regex.test(userData.username) === true && userData.password.length > 0) {
      setEmailValid(true)
      var api = "https://api.getcountapp.com/api/v1/authenticate/"
      return axios.post(api, userData)
        .then(function (response) {
          console.log(response);
          setLoggedIn(true);
          setLoggedInUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data))
          setuserNotFound(false)
        })
        .catch(function (error) {
          console.log(error);
          setLoggedIn(false);
          setuserNotFound(true)
        });
    } else {
      setEmailValid(false)
      setuserNotFound(false)
    }

  }

  function logOut() {
    localStorage.removeItem('user')
    setLoggedIn(false);
    setLoggedInUser({});
  }

  return (
    <div className="App">
      <header className="App-header">

        {!loggedIn ?
          <div>
            <input placeholder='Username' type={"email"} onChange={(e) => setData(e.target.value, "name")}></input>
            <input placeholder='Password' type={"password"} onChange={(e) => setData(e.target.value, "password")}></input>
            <button onClick={() => login()}>LOG IN</button>
            <br></br>
            {!emailValid ? "Email or password invalid" : ""}
            <br />
            {userNotFound ? "unable to login" : ""}
          </div>
          :
          <div>
            YOU ARE LOGGED IN
            <br></br>
            {loggedInUser ? JSON.stringify(loggedInUser.firstName + " " + loggedInUser.lastName) : ""}
            <br></br>
            <button onClick={() => logOut()}>LOG OUT</button>
          </div>
        }

      </header>
    </div>
  );
}

export default App;
