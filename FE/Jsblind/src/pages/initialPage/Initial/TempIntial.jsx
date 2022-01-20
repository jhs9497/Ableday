import React from 'react';

import { Link } from 'react-router-dom';

const TempIntial = () => {
  return (
    <div>
      <div>
        <Link to="/">Initial</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <Link to="/signup">SignUP</Link>
      </div>
      <div>
        <Link to="/main">Main</Link>
      </div>
      <div>
        <Link to="/imageupload">ImageUpload</Link>
      </div>
      <div>
        <Link to="/join">Chatting</Link>
      </div>

      <div>
        <Link to="/user/mypage">MyPage</Link>
      </div>
      <div>
        <Link to="/video/quick">Quick</Link>
      </div>
      <div>
        <Link to="/video/review">VideoReview</Link>
      </div>
      <div>
        <Link to="/video/videochat">VideoChat</Link>
      </div>
    </div>
  );
};

export default TempIntial;
