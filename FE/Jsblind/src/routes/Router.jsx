import ImageUpload from "pages/imageUpload/Index";
import SignUp from "pages/initialPage/signup/Signup";
import MainPage from "pages/mainpage/Main";
import Chat from "pages/userpage/chatting/components/Chat/Chat";
import MyPage from "pages/userpage/myPage/Mypage";
import SnabTest from "pages/videoChat/test/SnabTest";
import VideoChatPage from "pages/videoChat/videoChat/VideoChatPage";
import { Router, Route, Switch } from "react-router-dom";
import history from "utils/history";
import test from "pages/videoChat/test/test";
import Login from "pages/initialPage/login/Login";
import ReviewPage from "pages/videoChat/reviewPage/ReviewPage";
import QuickMatch from "pages/videoChat/quickMatch/QuickMatches";

const BRouter = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Login} />
        {/* <Route path="/login" exact component={Login} /> */}
        <Route path="/signup" exact component={SignUp} />
        <Route path="/imageupload" exact component={ImageUpload} />
        <Route path="/main" exact component={MainPage} />
        {/* <Route path="/join" exact component={Join} /> */}

        <Route path="/chat" component={Chat} />
        <Route path="/user/mypage" exact component={MyPage} />
        <Route path="/video/quick" exact component={QuickMatch} />
        <Route path="/video/review" exact component={ReviewPage} />
        <Route path="/video/videochat" exact component={VideoChatPage} />
        <Route path="/snabTest" exact component={SnabTest} />
        <Route path="/test" exact component={test} />
      </Switch>
    </Router>
  );
};
export default BRouter;
