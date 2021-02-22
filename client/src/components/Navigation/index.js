import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import NavbarLinks from "./navbarLinks"

import styled from "styled-components"

const Toggle = styled.div`
  display: none;
  height: 100%;
  cursor: pointer;
  padding: 0 10vw;

  @media (max-width: 768px) {
    display: flex;
  }
`

const Navbox = styled.div`
  display: flex;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
  position: center;
  overflow: auto;

  @media (max-width: 768px) {
    flex-direction: column;
    position: fixed;
    width: 100%;
    justify-content: flex-start;
    padding-top: 10vh;
    background-color: #fff;
    transition: all 0.3s ease-in;
    top: 8vh;
    left: ${props => (props.open ? "-100%" : "0")};
  }
`

const Hamburger = styled.div`
  background-color: #111;
  width: 30px;
  height: 3px;
  transition: all .3s linear;
  align-self: center;
  position: relative;
  transform: ${props => (props.open ? "rotate(-45deg)" : "inherit")};

  ::before,
  ::after {
    width: 30px;
    height: 3px;
    background-color: #111;
    content: "";
    position: absolute;
    transition: all 0.3s linear;
  }

  ::before {
    transform: ${props =>
    props.open ? "rotate(-90deg) translate(-10px, 0px)" : "rotate(0deg)"};
    top: -10px;
  }

  ::after {
    opacity: ${props => (props.open ? "0" : "1")};
    transform: ${props => (props.open ? "rotate(90deg) " : "rotate(0deg)")};
    top: 10px;
  }
`

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    height: "64px",
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 0.5),
  },
  link1: {
    margin: theme.spacing(1, 4),
  },
  card: {
    marginLeft: 20,
    fontSize: 30,
  },
  menuLeft: {
    marginRight: 40,
    //marginLeft: '32%',
  },
  menuRight: {
    marginRight: 100,
  },
}));


const NavBar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)

  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Toggle navbarOpen={navbarOpen} onClick={() => setNavbarOpen(!navbarOpen)}>
            {navbarOpen ? <Hamburger open /> : <Hamburger />}
          </Toggle>
          {navbarOpen ? (
            <Navbox>
              <NavbarLinks />
            </Navbox>
          ) : (
              <Navbox open>
                <NavbarLinks />
              </Navbox>
            )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default NavBar;
