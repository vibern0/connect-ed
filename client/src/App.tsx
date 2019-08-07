import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Main from './Pages/Main';
import Historical from './Pages/Historical';
import Connections from './Pages/Connections';


class App extends Component {
    public render() {
        return (
            <Router>
                <Route path="/" exact={true} component={Main} />
                <Route path="/historical" component={Historical} />
                <Route path="/connections" component={Connections} />
            </Router>
        );
    }
}

export default App;
