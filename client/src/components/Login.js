import React, { Component } from 'react'
import { login } from './UserFunctions'
import NavBar from "./Navigation/index"
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  page: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
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
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigText: {
    width: '100%',
    textAlign: 'center',
  },
  inputNames: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    margin: '20px'
  },
  inputField: {
    width: '65%',
    boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.400)',
    borderRadius: '50px',
    height: '35px',
    fontSize: '15px',
    paddingLeft: '10px',
    border: 'none',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '20px',
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
  click: {
    textDecoration: 'none',
    color: '#f50057',
  },
  errorText: {
    width: '100%',
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
  forgotPassword:{
    width: '100%',
    textAlign: 'center',
    cursor: 'pointer',
  }
});

class Login extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      errors: {}
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()
    const user = {
      username: this.state.username,
      password: this.state.password
    }
    login(user).then(res => {
      if(!res){
        this.setState({error: "Service momentanement indisponible."})
      }
      if (res) {
        if (res.error) {
          this.setState({error: res.error})
          localStorage.removeItem("usertoken")
        }
        else {
          this.props.history.push(`/profile`)
        }
      }
    })
  }

  goToReset = () => {window.location.pathname = '/sendresetpassword'}

  render() {
    const { classes } = this.props
    return (
      <div className={classes.page}>
        <NavBar />
        <div className={classes.containerText}>
          <form noValidate className={classes.form} onSubmit={this.onSubmit}>
            <h1 className={classes.bigText}>Se connecter</h1>
            {this.state.error ? <p className={classes.errorText}>{this.state.error}</p>: ""}

            <label className={classes.inputNames} htmlFor="username">Nom d'utilisateur</label>
            <input
              type="username"
              className={classes.inputField}
              name="username"
              placeholder="Entrez votre nom d'utilisateur"
              value={this.state.username}
              onChange={this.onChange}
            />
            <label className={classes.inputNames} htmlFor="password">Not de passe</label>
            <input
              type="password"
              className={classes.inputField}
              name="password"
              placeholder="Entrez votre mot de passe"
              value={this.state.password}
              onChange={this.onChange}
            />
            <div className={classes.buttonContainer}>
              <button className={classes.button} type="submit" >Connexion</button>
            </div>
          </form>
          <b className={classes.forgotPassword} onClick={this.goToReset}><p>Mot de passe oublié ? </p></b>
          <p className={classes.bigText}>Pas encore incris ? <b><a className={classes.click} href="/register">Clique ici. </a></b></p>
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Login)