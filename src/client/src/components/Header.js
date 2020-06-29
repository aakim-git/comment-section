import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../style/Header.css';
import logo from '../assets/person_icon.png'; 

class Header extends Component {
    render() {
        return (
            <div id="main-header">

                <div id="main-navbar">
                    <img src={logo} alt="" />
                    <div>
                        <Link to={'/'}> Register </Link>
                        <Link to={'/'}> Login </Link>
                        <Link to={'/'} id="create-link"> Create a discussion </Link>
                    </div>
                </div>

                <h1> chatbox<span id="title-dot">.</span> </h1>
                <p> <i>Create instant, sharable discussion spaces</i> </p>

            </div> 
        );
    }
}

export default Header;
