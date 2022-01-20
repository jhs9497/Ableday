import React from 'react';
import BRouter from 'routes/Router.jsx';
import 'common/CSS/common.css';

// Redux
import { useSelector } from 'react-redux';

function App() {
  const bgCloudyRedux = useSelector((store) => store.BgCloudyReducer);
  return (
    <div id="background">
      <div id={bgCloudyRedux === true ? 'background-cloudy' : 'container'}>
        <BRouter />
      </div>
    </div>
  );
}

export default App;
