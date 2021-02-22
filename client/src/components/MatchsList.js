import React, { Component } from 'react'

import jwt_decode from 'jwt-decode'

import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { Link } from "react-router-dom";

import { UserMatchList } from './UserFunctions'

import '@shwilliam/react-rubber-slider/dist/styles.css'

const styles = theme => ({
    container: {
        marginTop: "100px",
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    reglages: {
        width: "300px",
    }
});

class UserList extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            usersList: [],
            usersSortList: [],
            ageMax: 0,
            scorePop: 0,
            distanceKm: 30,
            lon: null,
            lat: null,
            noResult: 0,
            errors: {}
        }
    }

    componentDidMount() {
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)

        this.setState({
            firstName: decoded.firstName ? decoded.firstName : decoded.firstname,
            lastName: decoded.lastName ? decoded.lastName : decoded.lastname,
            email: decoded.email,
            genre: decoded.genre ? decoded.genre : decoded.sexe,
            lat: decoded.lat,
            lon: decoded.lon,
            username: decoded.username
        })
        const user = {
            username: decoded.username
        }
        UserMatchList(user).then(res => {
            if (res) {
                this.setState({
                    usersList: res,
                })
            }
        })
    }

    render() {
        const { classes } = this.props
        let $userList = null;

        if (this.state.usersList && this.state.usersSortList.length === 0 && this.state.noResult === 0) {
            $userList = (<Grid container spacing={4}>
                {this.state.usersList.map((user) => (
                    <Grid item key={user.email} xs={12} sm={6} md={4}>
                        <Card className={classes.card}>
                            {
                                user.pic1 ?
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image={user.pic1 ? user.pic1 : ""}
                                        title="Image title"
                                        prop={user}
                                    />
                                    : null
                            }
                            <CardContent className={classes.cardContent}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {user.username}
                                </Typography>
                                <Typography>
                                    {user.age} ans
                                </Typography>
                            </CardContent>
                            <CardActions >
                                <Link
                                    to={{
                                        pathname: `/Profile/${user.username}`,
                                        aboutProps: {
                                            user: user
                                        }
                                    }}> Visiter
                                </Link>
                                <Link
                                    to={{
                                        pathname: `/Chat/${user.username}`,
                                        aboutProps: {
                                            user: user
                                        }
                                    }}> Chat
                                </Link>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>);
        }
        else {
            $userList = (<div>No users found</div>)
        }

        return (
            <div className={classes.container}>
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Vos matchs
                </Typography>
                <Container className={classes.cardGrid} maxWidth="md">
                    {$userList}
                </Container>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(UserList)