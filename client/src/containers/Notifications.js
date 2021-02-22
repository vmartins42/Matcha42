import React from "react";
import Navbar from "../components/Navigation/index"
import NotificationsList from "../components/NotificationsList"
import NoFoundPage from "../components/NoFoundPage";

const Notifications = () => {
  return (
    <div style={{height: '100%'}}>
      <Navbar />
      {localStorage.usertoken === undefined ? <NoFoundPage /> : <NotificationsList />}
    </div>
  )
};

export default Notifications;