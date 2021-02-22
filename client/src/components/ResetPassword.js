import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles"
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import NavBar from "./Navigation/index"
import { resetpassword } from './UserFunctions'

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

class ResetPassword extends Component {

    constructor() {
        super()
        this.state = {
            passwordReset: false,
            password1: '',
            password2: '',
            email: '',
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
            password1: this.state.password1,
            password2: this.state.password2,
            email: this.state.email,
            hash: this.props.match.params.hash
        }
        resetpassword(newUser).then(res => {
            if (res.error) {
                this.setState({ error: res.error })
            }
            else
                this.setState({ passwordReset: true })
        })
    }

    render() {
        const { classes } = this.props
        return (
            <div className={classes.page}>
                <NavBar />
                <div className={classes.containerText}>
                    {!this.state.passwordReset ?
                        <CardContent>
                            <h1 className={classes.text}>Réinitialiser mot de passe</h1>
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
                                <label className={classes.inputNames}>Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    name="password1"
                                    className={classes.inputField}
                                    placeholder="Entrez mot de passe"
                                    value={this.state.password1 || ""}
                                    onChange={this.onChange}
                                />
                                <label className={classes.inputNames}>Confirmer mot de passe</label>
                                <input
                                    type="password"
                                    name="password2"
                                    className={classes.inputField}
                                    placeholder="Entrez mot de passe"
                                    value={this.state.password2 || ""}
                                    onChange={this.onChange}
                                />
                                <div className={classes.buttonContainer}>
                                    <button type="submit" className={classes.button}>Réinitialiser</button>
                                </div>
                            </form>
                        </CardContent>
                        :
                        <CardContent>
                            <h1 className={classes.text}>Nouveau mot de passe</h1>
                            <Typography className={classes.text}>
                                Votre mot de passe a été réinitialisé. Vous pouvez à présent vous connecter.
                            </Typography>
                            <CardActions className={classes.containerButton}>
                                <button className={classes.button} onClick={() => this.goTo()}>Se connecter</button>
                            </CardActions>
                        </CardContent>}

                </div>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(ResetPassword)