import React from 'react';
import { Redirect } from 'react-router-dom';
import { logOut } from './UserFunctions'
import jwt_decode from 'jwt-decode'

const signOut = props => {
  const token = localStorage.usertoken
  const decoded = jwt_decode(token)
  const user = {
    firstnjame: decoded.firstname,
    lastname: decoded.lastname,
    email: decoded.email,
  }
  logOut(user).then(res => {
    
  })
  if (localStorage.getItem('usertoken')) {
    localStorage.removeItem('usertoken');
  }
  return <Redirect to="/" />;
}

export default signOut;