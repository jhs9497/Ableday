import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';
import Message from 'pages/userpage/chatting/components/Messages/Message/Message';

import './Messages.css';

const Messages = ({ messages, name }) => {
  console.log('name', name, messages);

  return (
    <ScrollToBottom className="messages">
      {messages.map((message, i) => (
        <div key={i}>
          <Message message={message} name={name} />
        </div>
      ))}
    </ScrollToBottom>
  );
};

export default Messages;
