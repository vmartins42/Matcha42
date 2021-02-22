import React, { Component } from 'react'
import { register } from './UserFunctions'
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
  }
});

class Register extends Component {
  constructor() {
    super()
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      username: '',
      errors: '',
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()
    if (this.state.email === "" || this.state.username === "" || this.state.firstname === "" || this.state.lastname === "")
      return this.setState({ error: "Des champs sont vide. Remplissez les." })
    else if (!RegExp(/^[A-Za-zÀ-ÖØ-öø-ÿ]{3,10}$/).test(this.state.username))
      return this.setState({ error: "Nom d'utilisateur mauvais. Autorisé : A-Z, a-z, À-Ö, Ø-ö, ø-ÿ, 3-10 caractères max." })
    else if (!RegExp(/^[A-Za-z]{3,10}$/).test(this.state.firstname))
      return this.setState({ error: "Prénom mauvais. Autorisé : A-Z, a-z, 3-10 caractères max." })
    else if (!RegExp(/^[A-Za-z]{3,10}$/).test(this.state.lastname))
      return this.setState({ error: "Nom mauvais. Autorisé : A-Z, a-z, 3-10 caractères max." })
    else if (!RegExp(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/).test(this.state.email))
      return this.setState({ error: "L'email n'est pas bon. Autorisé : ex@exemple.ex" })

    else {
      const newUser = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email,
        password: this.state.password,
        username: this.state.username,
      }
      register(newUser).then(res => {
        if (!res) {
          this.setState({ error: "Service momentanement indisponible." })
        }
        if (res) {
          if (res.error) {
            this.setState({ error: res.error })
            localStorage.removeItem("usertoken")
          }
        }
        else {
          this.props.history.push('/emailsent')
        }
      })
    }
  }


  render() {
    const { classes } = this.props
    return (
      <div className={classes.page}>
        <NavBar />
        <div className={classes.containerText}>
          <h1 className={classes.bigText}>Inscription</h1>
          {this.state.error ? <p className={classes.errorText}>{this.state.error}</p> : ""}
          <form noValidate className={classes.form} onSubmit={this.onSubmit}>
            <label className={classes.inputNames} htmlFor="name">Nom d'utilisateur</label>
            <input
              type="text"
              className={classes.inputField}
              name="username"
              placeholder="Entrez votre nom d'utilisateur"
              value={this.state.username}
              onChange={this.onChange}
            />

            <label className={classes.inputNames} htmlFor="name">Prénom</label>
            <input
              type="text"
              className={classes.inputField}
              name="firstname"
              placeholder="Entrez votre prénom"
              value={this.state.firstname}
              onChange={this.onChange}
            />

            <label className={classes.inputNames} htmlFor="name">Nom</label>
            <input
              type="text"
              className={classes.inputField}
              name="lastname"
              placeholder="Entrez votre nom"
              value={this.state.lastname}
              onChange={this.onChange}
            />
            <label className={classes.inputNames} htmlFor="email">Adresse mail</label>
            <input
              type="email"
              className={classes.inputField}
              name="email"
              placeholder="Entrez adresse mail"
              value={this.state.email}
              onChange={this.onChange}
            />

            <label className={classes.inputNames} htmlFor="password">Mot de passe</label>
            <input
              type="password"
              className={classes.inputField}
              name="password"
              placeholder="Entrez votre mot de passe"
              value={this.state.password}
              onChange={this.onChange}
            />
            <div className={classes.buttonContainer}>
              <button type="submit" className={classes.button}>S'inscrire!</button>
            </div>
          </form>
          <p className={classes.bigText}>Déjà inscris ? <b><a className={classes.click} href="/login">Clique ici. </a></b></p>
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Register)