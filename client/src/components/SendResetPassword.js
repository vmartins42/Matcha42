import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles"
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import NavBar from "./Navigation/index"
import { emailReset } from './UserFunctions'

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
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputNames: {
      width: '100%',
      textAlign: 'center',
      fontWeight: 'bold',
      margin: '20px'
    },
    errorText: {
        width: '100%',
        textAlign: 'center',
        color: 'red',
        fontWeight: 'bold',
    },
});

class SendResetPassword extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            emailSent: false,
            error: '',
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    goTo() {
        window.location.pathname = "/"
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault()

        const newUser = {
            email: this.state.email,
        }
        emailReset(newUser).then(res => {
            if (res.error) {
                this.setState({ error: res.error })
            }
            else
                this.setState({ emailSent: true })
        })
    }

    render() {
        const { classes } = this.props
        return (
            <div className={classes.page}>
                <NavBar />
                <div className={classes.containerText}>
                    {!this.state.emailSent ?
                        <CardContent>
                            <h1 className={classes.text}>Mot de passe oublié</h1>
                            <Typography className={classes.text}>
                                Veuillez indiquer votre mot de passe ci dessous. Un mail va vous être envoyé afin de le réinitialiser.
                            </Typography>
                            {this.state.error ? <p className={classes.errorText}>{this.state.error}</p> : ""}
                            <form noValidate className={classes.form} onSubmit={this.onSubmit}>
                                <label className={classes.inputNames} htmlFor="email">Adresse mail</label>
                                <input
                                    type="email"
                                    className={classes.inputField}
                                    name="email"
                                    placeholder="Entrez adresse mail"
                                    value={this.state.email || ""}
                                    onChange={this.onChange}
                                />
                                <div className={classes.buttonContainer}>
                                    <button type="submit" className={classes.button}>Réinitialiser</button>
                                </div>
                            </form>
                        </CardContent>
                        :
                        <CardContent>
                            <h1 className={classes.text}>Email envoyé</h1>
                            <Typography className={classes.text}>
                                Un email vous vient de vous être envoyé afin de réinitialiser votre mot de passe
          </Typography>
                            <CardActions className={classes.containerButton}>
                                <button className={classes.button} onClick={() => this.goTo()} >Accueil</button>
                            </CardActions>
                        </CardContent>}
                </div>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(SendResetPassword)