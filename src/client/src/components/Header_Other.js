import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../style/Header_Other.css';

class Header extends Component {
    render() {
        return (
            <div id="main-header-other">
                <div id="main-navbar-other">
                    <div id="title-other">
                        <h1 id="logo"> chatbox<span id="title-dot">.</span> </h1>
                        <p id="logo-desc"> Create instant, sharable discussion spaces </p>
                    </div>

                    <div>
                        <Link to={'/'}> Register </Link>
                        <Link to={'/'}> Login </Link>
                        <Link to={'/'} id="create-link"> Create a discussion </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;
