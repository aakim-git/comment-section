import React, { Component } from 'react';
import Chat from './Chat.js';
import $ from "jquery";
import Header from "./Header_Other.js"

import '../style/CommentSection.css';

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
        Chatboxes.push(<Chat id={this.state.prompt_id + "/" + 1} key={1} />);
        if (this.state.num_chatboxes > 1) {
            Chatboxes.push(<div className="spacer"></div>);
            Chatboxes.push(<Chat id={this.state.prompt_id + "/" + 2} key={2} />);
        }

        return (
            <div>
                <Header />
                <div id="CommentSection">
                    <p> <b>Topic:</b> {this.state.prompt} </p>
                    <div id="Chatboxes">
                        {Chatboxes}
                    </div>
                </div>
            </div>
        );
    }
}

export default CommentSection;
