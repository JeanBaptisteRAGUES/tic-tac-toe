import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Landing from '../Landing';
import Profile from '../Profile';
import Login from '../Login';
import SignUp from '../SignUp';
import ErrorPage from '../ErrorPage';

function App() {
  return (
    <Router>
        <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/profile" component={Profile} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route component={ErrorPage} />
        </Switch>
    </Router>
  );
}

export default App;