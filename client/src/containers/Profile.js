import React from "react";
import Navbar from "../components/Navigation/index"
import jwt_decode from 'jwt-decode'

const Profile = () => {

    const state = {
        first_name: '',
        last_name: '',
        email: '',
        errors: {}
    }

    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    state.setState({
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        email: decoded.email
    })

    return (
        <div>
            
        </div>
    )
};

export default Profile;