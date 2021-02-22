import React from 'react';

import './Input.css';

const Input = ({ message, onChange, sendMessage }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      onChange={onChange}
      value={message}
      name="message"
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
    />
  </form>
)

export default Input;