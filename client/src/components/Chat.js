import React, { Component } from 'react'
import jwt_decode from 'jwt-decode'

import io from 'socket.io-client'

import Navbar from "./Navigation/index"

import InfoBar from './InfoBar/InfoBar.js'
import Messages from './Messages/Messages.js'

import './Chat.css';
import './Input/Input.css';
import NoFoundPage from './NoFoundPage'

const socket = io("http://localhost:5000");

class Chat extends Component {
    constructor() {
        super()
        this.state = {
            firstName: '',
            username: '',
            message: '',
            messages: [],
            value: '',
            count: 25,
            stop: false,
            errors: {},
            noToken: false
        }
        this.onChange = this.onChange.bind(this)
    }

    componentDidMount() {
        if (localStorage.usertoken) {
            const token = localStorage.usertoken
            const decoded = jwt_decode(token)
            let currentUser = this.props.match.params.userName;
            this.setState({ 
                email: decoded.email, 
                username: decoded.username, 
                currentUser: currentUser 
            })
            
            const userData = {
                username: decoded.username,
                to: currentUser
            }
            socket.emit('join', userData);
            socket.on('receiveMessage', function (newMessage) {
                if (newMessage) {
                    if (newMessage.me !== this.state.username) {
                        let tmp = this.state.messages;
                        tmp.push(newMessage);
                        this.setState({ messages: tmp})
                    }
                }
            }.bind(this));
        }
        else {
            this.setState({noToken: true})
        }
    }

    componentWillUnmount() {
        this.setState({ 
            firstName: '',
            username: '',
            message: '',
            messages: [],
            value: '',
            count: 25,
            stop: false,
            errors: {},
            currentUser: null,
            noToken: false
         })
    }

    listener() {
        socket.on('messages', function (messages) {
            this.setState({ messages: messages })
        }.bind(this));
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    sendMessage(e) {
        e.preventDefault();
        const user = {
            username: this.state.username,
            to: this.state.currentUser,
        }
        if (this.state.message) {
            socket.emit('newmsg', this.state.message, user);
            let message = {
                message: this.state.message,
                me: this.state.username,
                to: this.state.currentUser
            }
            this.state.messages.push(message)
            this.setState({ message: '' });
        }
    }
    render() {
        this.listener()
        return (
            <div>
                <Navbar />
                <div className="outerContainer">
                    {this.state.noToken ? <NoFoundPage/> : 
                    <div className="container">
                        <InfoBar user={this.state.currentUser} />
                        <Messages messages={this.state.messages} notMe={this.state.currentUser} />
                        <form className="form">
                            <input
                                className="input"
                                type="text"
                                placeholder="Type a message..."
                                onChange={this.onChange}
                                value={this.state.message}
                                name="message"
                                onKeyPress={event => event.key === 'Enter' ? this.sendMessage(event) : null}
                            />
                        </form>
                    </div>}
                </div>
            </div>
        )
    }
}
export default Chat