// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PlayerSearch from './components/PlayerSearch';
import Home from './components/Home';

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/search" component={PlayerSearch} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
