import React, { Component } from 'react'

import { withStyles } from "@material-ui/core/styles"
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  containerText: {
    width: '500px',
    maxWidth: '100vw',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderRadius: '15px',
    boxShadow: '1px 1px 18px rgba(0,0,0,0.367)',
    ['@media (max-height:570px)']: { // eslint-disable-line no-useless-computed-key
      marginTop: '40px',
    }
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
    margin: '15px',
  },
  containerButton: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: '15px',
  },
  bigText: {
    width: '100%',
    textAlign: 'center',
  }
});

class Welcome extends Component {

  goToLogin = () => { window.location.pathname = '/login' }
  goToRegister = () => { window.location.pathname = '/register' }
  render() {
    const { classes } = this.props
    return (
      <div className={classes.containerText}>
        <h1 className={classes.bigText}>Bienvenu sur Matcha</h1>
        <Typography variant="h5" className={classes.text}>
          Venez découvrir l'expérience la plus incroyable qui existe ! Des gars et des filles quie ne cherchent que du réconford et de l'amusement!
                </Typography>
        <Typography className={classes.text}>
          Inscris toi maintenant ou connecte toi.
                </Typography>
        <div className={classes.containerButton}>
          <button onClick={this.goToLogin} className={classes.button}>Connexion</button>
          <button onClick={this.goToRegister} className={classes.button}>Inscription</button>
        </div>

      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Welcome)