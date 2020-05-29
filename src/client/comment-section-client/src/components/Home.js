import React, { Component } from 'react';
import $ from "jquery";

class Home extends Component {
    constructor(props) {
        super(props);
        this.PromptTextField = React.createRef();
        this.CreateNewPrompt = this.CreateNewPrompt.bind(this);
    }

    CreateNewPrompt() {
        // have button greyed out while waiting
        $.ajax({
            type: "GET",
            url: "./prompt/create",
            success:
                (data) => {
                    console.log(data);
                },

            error:
                (error) => {
                    console.log(error);
                }
        });
    }

    render() {
        return (
            <div className="container">
                <textarea placeholder="Type a discussion prompt here..." ref={this.PromptTextField} />
                <button type="button" value="Create New Prompt" onClick={(e) => { this.CreateNewPrompt(); e.preventDefault(); }}>
                    Create
                </button>
            </div>
        );
    }
}

export default Home;
