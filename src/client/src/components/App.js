import React from 'react';
import Home from './Home.js';
import PageNotFound from './PageNotFound.js';
import CommentSection from './CommentSection';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import '../style/App.css';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/(\d+)" component={CommentSection} />
                <Route path="*" component={PageNotFound} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
