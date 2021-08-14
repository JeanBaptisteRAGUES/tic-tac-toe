import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Landing from '../Landing';
import Profile from '../Profile';
import Login from '../Login';
import SignUp from '../SignUp';
import ErrorPage from '../ErrorPage';
import PlayersList from '../PlayersList';
import PlayersList2 from '../PlayersList2';

function App() {
  return (
    <Router>
        <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/profile" component={Profile} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/playerslist" component={PlayersList} />
            <Route path="/playerslist2" component={PlayersList2} />
            <Route component={ErrorPage} />
        </Switch>
    </Router>
  );
}

export default App;