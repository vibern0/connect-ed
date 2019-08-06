import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Main from './Pages/Main';
import Historical from './Pages/Historical';


class App extends Component {
    public render() {
        return (
            <Router>
                <Route path="/" exact={true} component={Main} />
                <Route path="/historical" component={Historical} />
            </Router>
        );
    }
}

export default App;
