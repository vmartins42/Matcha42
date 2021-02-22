import React from "react";
import Navbar from "../components/Navigation/index"
import UserLike from "../components/UserBanner"
import UserVisit from "../components/UserVisitList"
import ProfilCard from "../components/profilCard"

const Home = () => {
  return (
    <div style={{height: '100%'}}>
        <Navbar />
        <ProfilCard />
        <UserLike/>
        <UserVisit/>
    </div>
  )
};

export default Home;

//<UserVisit/>