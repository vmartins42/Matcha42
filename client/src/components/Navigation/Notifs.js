import React, { Component } from 'react'

import jwt_decode from 'jwt-decode'

import { withStyles } from "@material-ui/core/styles"
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

import io from 'socket.io-client'
import { getNotificationsNav } from '../UserFunctions'

const socket = io("http://localhost:5000");

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
    _isMounted = false;
    constructor() {
        super()
        this.state = {
            nombreNotifs: 0,
            email: '',
            notifs: [],
            errors: {}
        }
    }

    // LOCATION HANDLER
    componentDidMount() {
        this._isMounted = true;
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)
        if (this._isMounted) {
            this.setState({
                email: decoded.email,
            })
        }
        const user = {
            username: decoded.username,
        }
        socket.on('newNotif', function (user) {
            if (this._isMounted) {
                if (decoded.username === user.liked) {
                    this.setState({
                        nombreNotifs: +1,
                    })
                }
            }
        }.bind(this));
        getNotificationsNav(user).then(res => {
            if (res) {
                if (this._isMounted) {
                    this.setState({
                        notifs: res,
                        nombreNotifs: res.length,
                    })
                }
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.setState({
            nombreNotifs: 0,
            email: '',
            notifs: [],
            errors: {}
        })
    }

    StyledBadge = withStyles((theme) => ({
        badge: {
            right: -3,
            top: 13,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 4px',
        },
    }))(Badge);

    render() {
        return (
            <div>
                <IconButton href="/Notifications" aria-label="cart">
                    <this.StyledBadge badgeContent={this.state.nombreNotifs} color="secondary">
                        <NotificationsNoneIcon />
                    </this.StyledBadge>
                </IconButton>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(NotificationsList)