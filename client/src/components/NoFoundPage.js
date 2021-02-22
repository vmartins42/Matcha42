import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  page: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
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
  errorText: {
    width: '100%',
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
});

class NoFoundPage extends Component {
  constructor() {
    super()

    this.goToAccueil = this.goToAccueil.bind(this)
  }

  goToAccueil = () => { window.location.pathname = '/' }
  render() {
    const { classes } = this.props
    return (
      <div className={classes.page}>
        <p className={classes.errorText}>La page n'est pas accessible, veuillez vous connecté d'abord</p>
        <button className={classes.button} onClick={() => { this.goToAccueil() }} >Accueil</button>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(NoFoundPage)