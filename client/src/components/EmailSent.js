import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles"
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import NavBar from "./Navigation/index"

const styles = theme => ({
  containerText: {
    width: '500px',
    maxWidth: '100vw',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderRadius: '15px',
    boxShadow: '1px 1px 18px rgba(0,0,0,0.367)',
  },
  page: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
  },
  button: {
    width: '150px',
    height: '35px',
    color: '#fff',
    border: '1px solid white',
    background: '#f50057',
    cursor: 'pointer',
    overflow: 'hidden',
    borderRadius: '25px',
    fontSize: '18px',
  },
  text: {
    width: '100%',
    textAlign: 'center',
  },
  containerButton: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
class EmailSent extends Component {

  goTo() {
    window.location.pathname = "/"
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.page}>
        <NavBar />
        <div className={classes.containerText}>
          <CardContent>
            <h1 className={classes.text}>Email envoyé</h1>
            <Typography className={classes.text}>
              Un mail de confirmation va vous être envoyé afin de valider votre compte. Regardez dans vos spam si jamais vous ne le recevez pas.
          </Typography>
          </CardContent>
          <CardActions className={classes.containerButton}>
            <button className={classes.button} onClick={() => this.goTo()} >Accueil</button>
          </CardActions>
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(EmailSent)