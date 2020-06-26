import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../style/Header.css';

class Header extends Component {
    render() {
        return (
            <div id="main-header">

                <div id="main-navbar">
                    <Link to={'/'}> Create a discussion </Link>
                </div>

                <h1> chatbox </h1>
                <p> Create an instant, sharable discussion space </p>

            </div> 
        );
    }
}

export default Header;
