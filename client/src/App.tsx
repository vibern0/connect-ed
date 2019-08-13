import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Admin from './Pages/Admin';
import Connections from './Pages/Connections';
import Donate from './Pages/Donate';
import Historical from './Pages/Historical';
import Main from './Pages/Main';


class App extends Component<{}, {}> {
    public render() {
        return (
            <Router>
                <Route path="/" exact={true} component={Main} />
                <Route path="/historical" component={Historical} />
                <Route path="/connections" component={Connections} />
                <Route path="/donate" component={Donate} />
                <Route path="/admin" component={Admin} />
            </Router>
        );
    }
}

export default App;
