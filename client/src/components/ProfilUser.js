import React, { Component } from 'react'

import jwt_decode from 'jwt-decode'

import { withStyles } from "@material-ui/core/styles"
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';

import { blockUser, getUser, refreshUser, refreshUserDate, reportUser } from './UserFunctions'
import io from 'socket.io-client'

const socket = io("http://localhost:5000");

const styles = theme => ({
  layout: {
    marginTop: "100px",
    marginBottom: "-50%",
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    map: {
      width: '100%'
    }
  }
});

class ProfileUser extends Component {
  constructor() {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      liked: 0,
      likeYou: 0,
      online: 0,
      fromNotif: null,
      currentUser2: null,
      scorePop: 0,
      blocked: '',
      errors: {}
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onBlock = this.onBlock.bind(this)
    this.onReport = this.onReport.bind(this)
  }

  componentDidMount() {
    const currentUser = this.props.user;
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)

    this.setState({
      username: decoded.username,
      firstName: decoded.firstName ? decoded.firstName : decoded.firstname,
      lastName: decoded.lastName ? decoded.lastName : decoded.lastname,
      email: decoded.email,
      currentUser: currentUser,
    })
    /*****************  REFRESH USER ICI ******************/
    /******************************************************/
    
    const user = {
      email: decoded.email,
      username: decoded.username,
      usernameLiked: currentUser.username,
      liked: currentUser.email,
      scorePop: currentUser.scorePop,
      error: {},
    }

    if (currentUser.online === 1) {
      this.setState({
        online: 1,
      })
    }
    let user3 = {
      liked: user.usernameLiked,
      username: user.username
    }

    refreshUser(user3).then(res => {
      if (res) {
        if (res.like === "like") {
          this.setState({
            liked: 1,
          })
        }
        if (res.status === 'likeYou') {
          this.setState({
            likeYou: 1,
          })
        }
        if (res.status === 'noLike') {
          this.setState({
            likeYou: 0,
          })
        }
        if (res.like === 'noLike') {
          this.setState({
            liked: 0,
          })
        }
      }
    })

    refreshUserDate(user3).then(res => {
      if (res.blocked) {
        this.setState({ blocked: 1 })
      }
      else {
        this.setState({ blocked: 0 })
      }
    })
    /*************** NOTIFICATION VISITED USER **************/
    /******************************************************/
    let tmp = { liked: user.usernameLiked, username: user.username, scorePop: currentUser.scorePop }
    socket.emit('visitNotif', tmp);
    /************************************************************/
    if (currentUser.email !== null) {
      const user = { username: currentUser.username, error: {} }
      getUser(user).then(res => {
        if (res) {
          this.setState({ currentUser: res[0] })
        }
      })
    }
  }

  /*****************  MYSQL DATA HANDLER ******************/
  /******************************************************/
  onSubmit(e) {
    e.preventDefault()
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    if (this.state.currentUser2 !== null) {
      const user = {
        username: this.state.username,
        email: this.state.currentUser.username,
        liked: this.state.currentUser2.username,
        scorePop: this.state.currentUser2.scorePop,
      }
      if (this.state.liked === 0) {
        socket.emit('likeNotif', user);
        this.setState({
          liked: 1,
        })
      }
      else {
        socket.emit('unLikeNotif', user);
        this.setState({
          liked: 0,
        })
      }
    }
    else {
      const user = {
        username: this.state.username,
        email: this.state.email,
        liked: this.state.currentUser.username,
        scorePop: this.state.currentUser.scorePop,
      }
      if (this.state.liked === 0) {
        socket.emit('likeNotif', user);
        this.setState({
          liked: 1,
        })
      }
      else {
        socket.emit('unLikeNotif', user);
        this.setState({
          liked: 0,
        })
      }
    }
  }

  onBlock(e) {
    e.preventDefault()
    const userData = {
      username: this.state.username,
      blocked: this.state.currentUser.username,
      error: {}
    }
    if (this.state.blocked === 0) {
      blockUser(userData).then(res => {
        if (res) {
          this.setState({
            blocked: 1,
          })
        }
      })
    }
    else {
      blockUser(userData).then(res => {
        if (res) {
          this.setState({
            blocked: 0,
          })
        }
      })
    }

  }

  onReport(e) {
    e.preventDefault()
    const userData = {
      username: this.state.username,
      email: this.state.email,
      blocked: this.state.currentUser.username,
      blockedEmail: this.state.currentUser.email,
      error: {}
    }
    reportUser(userData).then(res => {
      if (res) {
        alert(res.message)
      }
      else {
        alert("Une erreur s'est produite. Réessayz ulterieuement.")
      }
    })
  }
  //////// MYSQL DATA HANDLER END ////////////////////////////////////////

  TagsInput = props => {
    if (props.tags !== null) {
      const [tags] = React.useState(props.tags);
      return (
        <div className="tags-input">
          <ul id="tags">
            {tags.map((tag, index) => (
              <li key={index} className="tag">
                <span className='tag-title'>{tag}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    else {
      return (<div></div>)
    }
  };

  render() {
    const { classes } = this.props
    let profil = '';
    const selectedTags = tags => {
    };
    if (this.state.currentUser) {
      let connected = null;
      var interests = JSON.parse(this.state.currentUser.interests);
      connected = this.state.currentUser.connected;
      profil = (
        <div>
          <Typography variant="h6" gutterBottom>
            Profil de {this.state.currentUser.username}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <img width="80%" src={this.state.currentUser.pic1} alt="" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <img width="80%" src={this.state.currentUser.pic2} alt="" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <img width="80%" src={this.state.currentUser.pic3} alt="" />
            </Grid>
            <Grid item xs={12}>
              {
                this.state.online === 0 ? <Chip label={'derniere connection ' + connected} variant="outlined" />
                  : <Chip color="secondary" label="Utilisateur en ligne" variant="outlined" />
              }
              {
                this.state.likeYou === 0 ? <Chip color="secondary" label="Cet utilisteur ne vous like pas !" variant="outlined" /> : <Chip color="secondary" label="Cet utilisteur vous like !" variant="outlined" />
              }

              <Chip label={'score popularite : ' + (this.state.currentUser.scorePop ? this.state.currentUser.scorePop : 0)} variant="outlined" />
              {
                this.state.liked === 0 ?
                  <Grid item xs={12} sm={6}>
                    <form onSubmit={this.onSubmit}>
                      <Button
                        type="submit"
                        color="secondary"
                        onClick={this.onSubmit}
                      >Like</Button>
                    </form>
                  </Grid>
                  :
                  <Grid item xs={12} sm={6}>
                    <form onSubmit={this.onSubmit}>
                      <Button
                        type="submit"
                        color="secondary"
                        onClick={this.onSubmit}
                      >UnLike</Button>
                    </form>
                  </Grid>
              }
              {
                this.state.blocked === 0 ? (
                  <Grid item xs={12} sm={6}>
                    <form onSubmit={this.onBlock}>
                      <Button
                        type="submit"
                        color="secondary"
                        onClick={this.onBlock}
                      >Bloquer</Button>
                    </form>
                  </Grid>
                ) :
                  (
                    <Grid item xs={12} sm={6}>
                      <form onSubmit={this.onBlock}>
                        <Button
                          type="submit"
                          color="secondary"
                          onClick={this.onBlock}
                        >Débloquer</Button>
                      </form>
                    </Grid>
                  )
              }
              <Grid item xs={12} sm={6}>
                <form onSubmit={() => this.onReport}>
                  <Button
                    type="submit"
                    color="secondary"
                    onClick={this.onReport}
                  >SIGNALER</Button>
                </form>
              </Grid>
            </Grid>
            <Grid item xs={12} >
              <TextareaAutosize style={{ width: "100%", resize: "none", marginTop: "12px" }} name="bio" aria-label="minimum height" rowsMin={6} value={this.state.currentUser.bio} />
            </Grid>
            <Grid item xs={12} >
              <this.TagsInput selectedTags={selectedTags} tags={interests} />
            </Grid>
            <Grid item xs={12} >
              {
                this.state.currentUser.lat && this.state.currentUser.lon ?
                  <img style={{ width: "100%" }} src={`https://maps.googleapis.com/maps/api/staticmap?center=${this.state.currentUser.lat},${this.state.currentUser.lon}&zoom=10&size=600x300&sensor=false&markers=color:red%7C${this.state.currentUser.lat},${this.state.currentUser.lon}&key=AIzaSyDsG0tzNP2IhOpHeoN7n8H4EDdVonFZBRE`} alt='' />
                  :
                  null
              }
            Ville : {this.state.currentUser.city}
            </Grid>
          </Grid>
        </div>
      )
    }
    return (
      <div className="jumbotron mt-5">
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            {profil}
          </Paper>
        </main >
      </div >
    )
  }
}

export default withStyles(styles, { withTheme: true })(ProfileUser)