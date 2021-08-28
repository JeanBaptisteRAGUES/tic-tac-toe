import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Landing from '../Landing';
import Profile from '../Profile';
import Login from '../Login';
import SignUp from '../SignUp';
import ErrorPage from '../ErrorPage';
import PlayersList from '../PlayersList';
import PlayersList2 from '../PlayersList2';
import ChallengesList from '../ChallengesList';
import MatchesList from '../MatchesList';
import Match from '../Match';
import HomePage from '../HomePage';
import Header from '../Header';

function App() {
  return (
    <Router>
      <Header/>
      <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/playerslist" component={PlayersList} />
          <Route path="/playerslist2" component={PlayersList2} />
          <Route path="/challengeslist" component={ChallengesList} />
          <Route path="/matcheslist" component={MatchesList} />
          <Route path="/match/:matchid" component={Match} />
          <Route path="/homepage" component={HomePage} />
          <Route component={ErrorPage} />
      </Switch>
    </Router>
  );
}

export default App;