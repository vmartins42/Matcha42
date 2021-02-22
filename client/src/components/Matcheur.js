import React, { Component } from 'react'

import jwt_decode from 'jwt-decode'

import { UserSortListMatch } from './UserFunctions'

import { withStyles } from '@material-ui/core/styles';
import NavBar from "./Navigation/index"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import '@shwilliam/react-rubber-slider/dist/styles.css'
import NoFoundPage from './NoFoundPage';
import io from 'socket.io-client'

const socket = io("http://localhost:5000");

const styles = theme => ({

    page: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        borderRadius: '15px',
        flexDirection: 'column',
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
    containerButton: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    picture: {
        display: 'flex',
        minWidth: '300px',
        minHeight: '409px',
        alignItems: 'flex-end',
        borderRadius: '15px',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        width: '300px'
    },
    cardContent: {
        display: 'flex',
        flexWrap: 'wrap',

        backgroundColor: 'white',
        width: '100%',
        margin: '10px',
        borderRadius: '15px',
    },
    littleText: {
        width: '100%'
    },
    littleTag: {
        margin: '3px'
    }
});

class Matcheur extends Component {
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
            index: 0,
        }
    }

    componentDidMount() {
        if (localStorage.usertoken) {

            const token = localStorage.usertoken
            const decoded = jwt_decode(token)

            this.setState({
                genre: decoded.genre,
                lookingFor: decoded.lookingFor,
                age: decoded.age,
                completed: decoded.completed,
                firstName: decoded.firstName ? decoded.firstName : decoded.firstname,
                lastName: decoded.lastName ? decoded.lastName : decoded.lastname,
                email: decoded.email,
                lat: decoded.lat,
                lon: decoded.lon,
                username: decoded.username
            })

            const user = {
                email: decoded.email,
                orientation: !decoded.orientation ? decoded.lookingFor : decoded.orientation,
                sexe: !decoded.genre ? decoded.sexe : decoded.genre,
                lat: decoded.lat,
                lon: decoded.lon,
                username: decoded.username
            }
            if (decoded.completed === 1) {
                UserSortListMatch(user).then(res => {
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
            }
        }
        else {
            this.setState({ noToken: true })
        }
    }

    likeUser = async () => {
        const user = {
            username: this.state.username,
            email: this.state.email,
            liked: this.state.usersList[this.state.index].username,
            scorePop: this.state.usersList[this.state.index].scorePop,
          }
            await socket.emit('likeNotif', user);
            this.setState({
              liked: 1,
            })
        this.setState({ index: this.state.index + 1 })
    }

    skipUser = () => {
        this.setState({ index: this.state.index + 1 })
    }

    render() {
        const { classes } = this.props
        let $userList = null;
        let users = this.state.usersList
        let index = this.state.index
        if (this.state.usersList.length > 0 && this.state.usersSortList.length === 0 && this.state.noResult === 0 && index < users.length) {
            $userList = (
                <>
                <Card className={classes.picture} style={{ backgroundImage: `url(${users[index].pic1})` }}>
                    <CardContent className={classes.cardContent}>
                        <span className={classes.littleText}>{users[index].firstname}</span>
                        <span className={classes.littleText}>{users[index].age} ans </span>
                        <span className={classes.littleTag}>#{JSON.parse(users[index].interests)[0] ? JSON.parse(users[index].interests)[0] : ""}</span>
                        <span className={classes.littleTag}>#{JSON.parse(users[index].interests)[1] ? JSON.parse(users[index].interests)[1] : ""}</span>
                        <span className={classes.littleTag}>#{JSON.parse(users[index].interests)[2] ? JSON.parse(users[index].interests)[2] : ""}</span>
                    </CardContent>
                </Card>
                <div>
                    <button className={classes.button} onClick={() => { this.skipUser() }}>SKIP</button>
                    <button className={classes.button} onClick={() => { this.likeUser() }}>LIKE</button>
                </div>
                </>
                )
        }
        else {
            $userList = (
                <p>Plus d'utilisateurs à vous proposer. Revenez plus tard.</p>
            )
        }

        return (
            <>
                {this.state.noToken ? <NoFoundPage /> :
                    <div className={classes.page}>
                        <NavBar />
                        {$userList}

                    </div>
                }
            </>
        )
    }
}
export default withStyles(styles, { withTheme: true })(Matcheur)