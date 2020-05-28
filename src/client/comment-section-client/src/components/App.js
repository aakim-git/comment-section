import React from 'react';
import Home from './Home.js';
import Chat from './Chat.js';
import '../style/App.css';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

function App() {
  return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/chat" component={Chat} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
