import React from "react";
import Navbar from "../components/Navigation/index"
import MatchsList from "../components/MatchsList"
import NoFoundPage from "../components/NoFoundPage";

const Home = () => {
  return (
    <div style={{height: '100%'}}>
      <Navbar />
      {localStorage.usertoken === undefined ? <NoFoundPage /> : <MatchsList />}
    </div>
  )
};

export default Home;