import React, { Component } from 'react';
import Chat from './Chat.js';
import $ from "jquery";


function GetCSIDFromURL() {
    let url = window.location.href;
    url = url.split('/'); 
    url = url.pop();   
    return url;         
}

class CommentSection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prompt: "",
            prompt_id: GetCSIDFromURL()
        };
    }

    componentDidMount() {
        // if we came from the home/creation page, use passed down data from Home page. 
        if (this.props.location.data) {
            this.setState({
                prompt: this.props.location.data[1],
                prompt_id: this.props.location.data[0]
            });
        }

        // else, fetch from database
        else {
            $.ajax({
                type: "GET",
                url: "./prompt/get/" + GetCSIDFromURL(),
                success:
                    (data) => {
                        this.setState({
                            prompt: data,
                            prompt_id: GetCSIDFromURL()
                        });
                    },

                error:
                    (error) => {
                        console.log(error);
                    }
            });
        }
    }

    render() {
        // Is hard coded to have two chat boxes for now. 
        return (
            <div>
                <h1> {this.state.prompt_id} </h1>
                <h1> {this.state.prompt} </h1>

                <Chat id={this.state.prompt_id + "/1"} /> 
                <Chat id={this.state.prompt_id + "/2"} /> 
            </div>
        );
    }
}

export default CommentSection;
