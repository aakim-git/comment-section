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
            prompt_id: GetCSIDFromURL(),
            num_chatboxes: 0
        };
    }

    componentDidMount() {
        // if we came from the home/creation page, use passed down data from Home page. 
        if (this.props.location.newPrompt) {
            this.setState({
                prompt: this.props.location.newPrompt["body"],
                prompt_id: this.props.location.newPrompt["id"],
                num_chatboxes: this.props.location.newPrompt["num_chatboxes"]
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
                            prompt: data["body"],
                            prompt_id: data["id"],
                            num_chatboxes: data["num_chatboxes"],
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
        let Chatboxes = [];
        for (var i = 1; i <= this.state.num_chatboxes; i++) {
            Chatboxes.push( <Chat id={this.state.prompt_id + "/" + i} /> );
        }

        return (
            <div>
                <h1> {this.state.prompt_id} </h1>
                <h1> {this.state.prompt} </h1>
                <div>{Chatboxes}</div>

            </div>
        );
    }
}

export default CommentSection;
