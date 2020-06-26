import React from 'react';
import Home from './Home.js';
import Chat from './Chat.js';
import Header from './Header.js';
import CommentSection from './CommentSection';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import '../style/App.css';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/chat" component={Chat} />
                <Route path="/(\d+)/" component={CommentSection} / >
            </Switch>
        </BrowserRouter>
    );
}

export default App;
