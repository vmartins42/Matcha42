import React, { Component } from 'react'
import { Link } from "react-router-dom";

import jwt_decode from 'jwt-decode'

import { withStyles } from "@material-ui/core/styles"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { getNotifications } from './UserFunctions'

import "./tag.scss"

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        marginTop: "45px",
    },

});

class NotificationsList extends Component {

    constructor() {
        super()
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            notifs: [],
            errors: {}
        }
    }
    // LOCATION HANDLER
    componentDidMount() {
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)
        this.setState({
            firstName: decoded.firstName ? decoded.firstName : decoded.firstname,
            lastName: decoded.lastName ? decoded.lastName : decoded.lastname,
            email: decoded.email,
            genre: decoded.genre ? decoded.genre : decoded.sexe,
            lookingFor: decoded.lookingFor ? decoded.lookingFor : decoded.orientation,
            age: decoded.age,
            city: decoded.city,
            state: decoded.state,
            zip: decoded.zip,
            country: decoded.countryy,
            bio: decoded.bio,
            pic1: decoded.pic1,
            interests: decoded.interests,
            latitude: decoded.lat,
            longitude: decoded.lon,
            adressUser: decoded.adressUser,
        })

        const user = {
            username: decoded.username,
        }
        getNotifications(user).then(res => {
            if (res) {
                this.setState({
                    notifs: res,
                })
            }
        })
    }

    componentWillUnmount() {
        this.setState({
            firstName: '',
            lastName: '',
            email: '',
            genre: '',
            lookingFor: '',
            age: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            bio: '',
            pic1: '',
            interests: '',
            latitude: '',
            longitude: '',
            adressUser: '',
        })
    }

    render() {
        const { classes } = this.props
        return (
            <React.Fragment>
                <div className={classes.container}>
                    <Typography variant="h6" gutterBottom>
                        Notifications :
              </Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date notification</TableCell>
                                <TableCell>Nom utilisateur</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell >Profil</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.notifs.map((notif) => (
                                <TableRow key={notif.id}>
                                    <TableCell>{notif.date}</TableCell>
                                    <TableCell>{notif.sender}</TableCell>
                                    {notif.notification === "liker" || notif.notification === "visiter" ? <TableCell>Cet utilisateur à {notif.notification} ton profil</TableCell> :<TableCell>{notif.notification}</TableCell>}
                                    <TableCell><Link
                                        to={{
                                            pathname: `/ProfileNotif/${notif.username}`,
                                            aboutProps: {
                                                user: notif
                                            }
                                        }}> Visiter
                                </Link></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </React.Fragment>
        )
    }
}

export default withStyles(styles, { withTheme: true })(NotificationsList)