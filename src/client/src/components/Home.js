import React, { Component } from 'react';
import $ from "jquery";
import Header from './Header_Home.js';

import '../style/Home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            discussion_settings: {
                "is_discussion": true,
                "two_sided": false,
                "login_required": false
            }
        };

        this.CreateNewPrompt = this.CreateNewPrompt.bind(this);
        this.UpdateSettings_IsDiscussion = this.UpdateSettings_IsDiscussion.bind(this);
        this.UpdateSettings_IsTwoSided = this.UpdateSettings_IsTwoSided.bind(this);
        this.UpdateSettings_LoginRequired = this.UpdateSettings_LoginRequired.bind(this);

        this.PromptTextField = React.createRef();
    }


    CreateNewPrompt() {
        // if there is no text, don't do anything
        if (!this.PromptTextField.current.value.trim()) {
            return;
        }

        let num_chatboxes = (this.state.discussion_settings["is_discussion"]) ? 1 : 2;
        $.ajax({
            type: "POST",
            url: "./prompt/create",
            data: JSON.stringify({
                "id": -1,
                "body": this.PromptTextField.current.value,
                "num_chatboxes": num_chatboxes
            }),
            contentType: "application/json",
            success:
                (newPrompt) => {
                    this.props.history.push({
                        pathname: '/' + newPrompt["id"],
                        newPrompt: newPrompt
                    });
                },

            error:
                (error) => {
                    console.log(error);
                }
        });
    }

    UpdateSettings_IsDiscussion() {
        var new_settings = this.state.discussion_settings;
        new_settings["is_discussion"] = true;
        new_settings["two_sided"] = false;
        this.setState({ discussion_settings: new_settings });
    }

    UpdateSettings_IsTwoSided() {
        var new_settings = this.state.discussion_settings;
        new_settings["is_discussion"] = false;
        new_settings["two_sided"] = true;
        this.setState({ discussion_settings: new_settings });
    }

    UpdateSettings_LoginRequired() {
        var new_settings = this.state.discussion_settings;
        new_settings["login_required"] = true;
        this.setState({ discussion_settings: new_settings });
    }

    render() {
        return (
            <div>
                <Header />
                <div id="Home" className="container">
                    <textarea rows="1" placeholder="Enter your discussion prompt here" ref={this.PromptTextField} />
                    <div id="Prompt-Buttons">
                        <div id="Settings-Buttons">
                            <input type="radio" name="discussion-settings" value="discussion" onClick={this.UpdateSettings_IsDiscussion} defaultChecked ></input>
                            <label> Discussion? </label> <br />
                            <input type="radio" name="discussion-settings" value="two-sided" onClick={this.UpdateSettings_IsTwoSided} ></input>
                            <label> Two-Sided Debate? </label> <br />
                            <input type="radio" name="other-settings" value="login-required" onClick={this.UpdateSettings_LoginRequired} ></input>
                            <label> Login Required? </label> <br />
                        </div>

                        <div>
                            <button type="button" value="Create New Prompt" onClick={(e) => { this.CreateNewPrompt(); e.preventDefault(); }}>
                                Create
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;