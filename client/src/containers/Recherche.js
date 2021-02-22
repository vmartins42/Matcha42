import React, { Component } from "react";
import Navbar from "../components/Navigation/index"
import UserList from "../components/UserList"
import NoFoundPage from "../components/NoFoundPage";

class Recherche extends Component {


  componentDidMount() {
    // if (localStorage.usertoken)
  }


  render() {
    return (
      <div style={{height: '100%'}}>
        <Navbar />
        {localStorage.usertoken === undefined ? <NoFoundPage /> : <UserList />}
      </div>
    )
  }
};

export default Recherche;