import React from 'react';
import jwt_decode from 'jwt-decode'

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message }) => {
  const token = localStorage.usertoken
  const decoded = jwt_decode(token)
  return (
    <div>
      {message.me === decoded.username ? (
        <div key={Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)} className="messageContainer justifyEnd">
          <p className="sentText pr-10">{message.me}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(message.message)}</p>
          </div>
        </div>
      ) :
        (
          <div key={Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)} className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{ReactEmoji.emojify(message.message)}</p>
            </div>
            <p className="sentText pl-10 ">{message.me}</p>
          </div>)
      }
    </div>
  )
}

export default Message;