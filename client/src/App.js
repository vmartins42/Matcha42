
import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './containers/Home'
import Recherche from './containers/Recherche'
import UserProfile from './containers/UserProfile'
import UserProfile2 from './containers/UserProfile2'
import Matchs from './containers/Matchs'
import Notifications from './containers/Notifications'
import SelectionUserPage from './containers/SelectionUserPage'

import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import blockedList from './components/blockedList'
import SignOut from './components/SignOut'
import Chat from './components/Chat'
import EmailValidation from './components/EmailValidation'
import EmailSent from './components/EmailSent'
import SendResetPassword from './components/SendResetPassword'
import ResetPassword from './components/ResetPassword'
import Matcheur from './components/Matcheur'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App" style={{height: '100vh'}}>
          <Route exact path="/" component={Home} />
          <Route exact path="/sendresetpassword" component={SendResetPassword} />
          <Route path="/resetpassword/:hash" component={ResetPassword} />
          <Route exact path="/Chat/:userName" component={Chat} />
          {/* <div > */}
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/blockedList" component={blockedList} />
          <Route exact path="/Matchs" component={Matchs} />
          <Route exact path="/Notifications" component={Notifications} />
          <Route exact path="/signOut" component={SignOut} />
          <Route exact path="/recherche" component={Recherche} />
          <Route exact path="/SelectionUserPage" component={SelectionUserPage} />
          <Route exact path="/validated" component={EmailValidation} />
          <Route exact path="/emailsent" component={EmailSent} />
          <Route path="/Profile/:userName" component={UserProfile} />
          <Route path="/ProfileNotif/:userName" component={UserProfile2} />
          <Route path="/matcheur" component={Matcheur} />
          {/* </div> */}
        </div>
      </Router>
    )
  }
}

export default App