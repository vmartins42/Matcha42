import React, { Component } from 'react'

import jwt_decode from 'jwt-decode'

import { UserBlockedList, blockUser } from './UserFunctions'

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import '@shwilliam/react-rubber-slider/dist/styles.css'

import { getPreciseDistance } from 'geolib';
import Navbar from "../components/Navigation"
import NoFoundPage from './NoFoundPage';

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

class blockedList extends Component {
    constructor() {
        super()
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            usersList: [],
            usersSortList: [],
            ageMax2: 0,
            scorePop: [0, 800],
            distanceKm: [0][6000],
            lon: null,
            lat: null,
            noResult: 0,
            valuetext: '',
            value: [20, 50],
            intervalKm: [20, 5000],
            reverseScore: 0,
            reverseAge: 0,
            reverseKm: 0,
            newValue: null,
            distance: 0,
            tags: 0,
            errors: {},
            noToken: false
        }
        this.onBlock = this.onBlock.bind(this)
    }

    componentDidMount() {

        if (localStorage.usertoken){

            const token = localStorage.usertoken
            const decoded = jwt_decode(token)
    
            this.setState({
                genre: decoded.genre,
                username: decoded.username,
                lookingFor: decoded.lookingFor,
                age: decoded.age,
                completed: decoded.completed
            })
    
            const tmp = {
                username: decoded.username,
                error: '',
            }
            UserBlockedList(tmp).then(res => {
                if (res) {
                    this.setState({
                        usersList: res,
                    })
                    if (!this.state.scorePop) {
                        this.setState({
                            scorePop: 0,
                        })
                    }
                }
            })
            this.setState({
                firstName: decoded.firstName ? decoded.firstName : decoded.firstname,
                lastName: decoded.lastName ? decoded.lastName : decoded.lastname,
                email: decoded.email,
                genre: decoded.genre ? decoded.genre : decoded.sexe,
                lat: decoded.lat,
                lon: decoded.lon,
            })
        }
        else {
            this.setState({noToken: true})
        }
    }

    componentWillUnmount() {
        this.setState({ tags: 0 })
    }

    //////// BLOCKED DATA HANDLER ////////////////////////////////////////////
    onBlock(userBlocked) {
        const userData = {
            username: this.state.username,
            blocked: userBlocked,
            error: {}
        }
        blockUser(userData).then(res => {
            if (res) {
                let tmp = this.state.usersList.filter(function (user) {
                    return user.name !== userData.blocked;
                });
                if (tmp) {
                    this.setState({
                        userList: tmp,
                    })
                }
            }
        })
    }

    render() {
        const { classes } = this.props
        let $userList = null;
        if (this.state.usersList.length > 0) {
            let distance = 0;
            $userList = (<Grid container spacing={4}>
                {this.state.usersList.map((user) =>
                    (
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
                                        {user.blocked}
                                    </Typography>
                                    <Typography>
                                        {user.age} ans
                                </Typography>
                                    {user.city} ({distance === 0 ? ((getPreciseDistance(
                                        { latitude: user.lat, longitude: user.lon },
                                        { latitude: this.state.lat, longitude: this.state.lon },
                                    )) / 1000) : null} Km)
                                <Typography>
                                        score pop : {user.scorePop ? user.scorePop : 0}
                                    </Typography>
                                    <Grid item xs={12} sm={6}>
                                        <form onSubmit={() => {this.onBlock(user.blocked)}}>
                                            <Button
                                                type="submit"
                                                color="secondary"
                                            >Débloquer</Button>
                                        </form>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
            </Grid>);
        }
        else {
            $userList = (<div>Pas d'utilisateurs blockés.</div>)
        }
        return (
            <div className={classes.container}>
                <Navbar />
                {this.state.noToken ? <NoFoundPage /> : $userList}
            </div>
        )
    }
}
export default withStyles(styles, { withTheme: true })(blockedList)