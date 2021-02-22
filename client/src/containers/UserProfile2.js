import React from "react";
import Navbar from "../components/Navigation/index"
import ProfilUser2 from "../components/ProfilUser2"
import NoFoundPage from "../components/NoFoundPage";

const UserProfil2 = (props) => {
    let user;
    if (props.location.aboutProps !== undefined) {
        user = props.location.aboutProps.user;
        localStorage.setItem('currentUser', JSON.stringify(user))
    }
    else {
        user = JSON.parse(localStorage.getItem('currentUser'));
    }
    return (
        <div style={{height: '100%'}}>
            <Navbar />
            {localStorage.usertoken === undefined ? <NoFoundPage /> : <ProfilUser2 user={user} />}
        </div>
    )
};

export default UserProfil2;