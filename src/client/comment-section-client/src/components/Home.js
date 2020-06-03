import React, { Component } from 'react';
import $ from "jquery";

class Home extends Component {
    constructor(props) {
        super(props);
        this.PromptTextField = React.createRef();
        this.CreateNewPrompt = this.CreateNewPrompt.bind(this);
    }

    CreateNewPrompt() {
        var newPrompt = JSON.stringify(
            { body: this.PromptTextField.current.value }
        );

        $.ajax({
            type: "POST",
            url: "./prompt/create",
            data: newPrompt,
            contentType: "application/json",
            success:
                (data) => {
                    this.props.history.push({
                        pathname: '/' + data[0],
                        data: data
                    });
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
