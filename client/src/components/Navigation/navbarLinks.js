import React from "react"
import styled from "styled-components"
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import Notif from './Notifs'

const NavItem = styled(Link)`
  text-decoration: none;
  color: #111;
  display: inline-block;
  white-space: nowrap;
  margin: 0 1vw;
  transition: all 150ms ease-in;
  position: relative;

  :after {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 0%;
    content: ".";
    color: transparent;
    background: goldenrod;
    height: 1px;
    transition: all 0.4s ease-in;
  }

  :hover {
    color: goldenrod;
    ::after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    padding: 20px 0;
    font-size: 1.5rem;
    z-index: 6;
  }
`
const useStyles = makeStyles((theme) => ({
  button: {
    textDecoration: 'none'
  },
}));

const NavbarLinks = () => {

  const classes = useStyles();

  const logOutButton = (
    <div >
      <NavItem to="/signOut">Sign Out</NavItem>
    </div>
  )
  const gestionProfil = (
    <div >
      <NavItem to="/profile">Profile configuration</NavItem>
    </div>
  )

  return (
    <>
      <NavItem to="/" >Accueil</NavItem>
      {localStorage.usertoken ? <NavItem to="/Matchs">Match(s)</NavItem> : ""}
      {localStorage.usertoken ? <NavItem to="/blockedList">Black list</NavItem> : ""}
      {localStorage.usertoken ? <NavItem to="/Recherche">Recherche</NavItem> : ""}
      {localStorage.usertoken ? <NavItem to="/matcheur">Matcheur</NavItem> : ""}
      {localStorage.usertoken ? <NavItem to="/SelectionUserPage">Selection profils</NavItem> : ""}
      {localStorage.usertoken ? gestionProfil : null}
      {localStorage.usertoken ? <Notif /> : null}
      {!localStorage.usertoken ?
        <>
          <Link className={classes.button} to="/login"><Button color="secondary" >Connection</Button></Link>
          <Link className={classes.button} to="/register"><Button color="secondary" >Inscription</Button></Link>
        </> : logOutButton}

    </>
  )
}

export default NavbarLinks