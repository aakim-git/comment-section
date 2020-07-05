import React from 'react';
import Header from './Header_Other.js';

import '../style/PageNotFound.css';

function PageNotFound() {
    return (
        <div>
            <Header />
            <div id="InvalidPage">
                <h1> 404 </h1>
                <p> Whoops! Nothing here </p>
            </div>
        </div>
    );
}

export default PageNotFound;
