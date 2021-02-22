import React from 'react';

import './Messages.css';
import Message from './Message/Message';

import ScrollToBottom from 'react-scroll-to-bottom';

const Messages = (messages) => {
  return (
    <div>
      <ScrollToBottom className="messages">
        {messages.messages.map((message, i) => <div key={i}><Message message={message}/></div>)}
      </ScrollToBottom>
    </div>
  );
}

export default Messages;