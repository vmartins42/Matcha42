import React from "react";
import Navbar from "../components/Navigation/index"

import SelectionUser from "../components/SelectionUser"
import NoFoundPage from "../components/NoFoundPage";

const SelectionUserPage = () => {
  return (
    <div style={{height: '100%'}}>
      <Navbar />
      {localStorage.usertoken === undefined ? <NoFoundPage /> : <SelectionUser />}
    </div>
  )
};

export default SelectionUserPage;