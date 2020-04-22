import React, { Component } from 'react';
import * as signalR from '@aspnet/signalr';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            message: '',
            messages: [],
            hubConnection: null,
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.SendMessage = this.SendMessage.bind(this);
        this.SendButton = React.createRef();
    }

    componentDidMount() {
        // Disable send button until connection is established
        this.SendButton.current.style.disabled = true;  

        // ***** Initialize socket to chat controller ******
        const hubConnection = new signalR.HubConnectionBuilder().withUrl("/Hubs/chatHub").build();
        this.setState({ hubConnection: hubConnection }, () => {
            this.state.hubConnection.on("ReceiveMessage", (user, message) => {
                var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                var msgs = this.state.messages;
                msgs.push(user + " says " + msg);
                this.setState({ messages: msgs });
            });

            this.state.hubConnection.start().then( () => {
                this.SendButton.current.style.disabled = true;
            }).catch(function (err) {
                return console.error(err.toString());
            });
        });
        // **************************************************

    }

    handleUsernameChange(e) { this.setState({ username: e.target.value }); }

    handleMessageChange(e) { this.setState({ message: e.target.value }); }

    SendMessage() {
        this.state.hubConnection.invoke("SendMessage", this.state.username, this.state.message).catch(function (err) {
            return console.error(err.toString());
        });
    }

    render() {
        let MessagesList =
            this.state.messages.map(function(msg, i) {
                return <li key={i} > {msg} </li>
            });

        return (
            <div>
                <div className="container">
                    <div className="row">&nbsp;</div>

                    <div className="row">
                        <div className="col-2">User</div>
                        <div className="col-4">
                            <input type="text" id="userInput" onChange={this.handleUsernameChange}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">Message</div>
                        <div className="col-4">
                            <input type="text" id="messageInput" onChange={this.handleMessageChange}/>
                        </div>
                    </div>

                    <div className="row">&nbsp;</div>

                    <div className="row">
                        <div className="col-6">
                            <input
                                type="button"
                                id="sendButton"
                                value="Send Message"
                                ref={ this.SendButton }
                                onClick={ (e) => {
                                    this.SendMessage();
                                    e.preventDefault();
                                    }
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        <ul id="messagesList">
                            { MessagesList }
                        </ul>
                    </div>
                </div>

            </div>
        );
    }
}

export default Chat;
