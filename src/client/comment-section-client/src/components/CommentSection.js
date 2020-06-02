import React, { Component } from 'react';

function GetCSIDFromURL() {
    let url = window.location.href;
    url = url.split('/'); 
    url = url.pop();   
    return url;         
}

class CommentSection extends Component {
    constructor(props) {
        super(props);

        this.CSID = GetCSIDFromURL();
    }

    render() {
        return (
            <div>
                <h1> {this.CSID} </h1>
            </div>
        );
    }
}

export default CommentSection;
