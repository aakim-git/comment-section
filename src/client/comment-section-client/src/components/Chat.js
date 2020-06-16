import React, { Component } from 'react';
import * as signalR from '@aspnet/signalr';
import $ from "jquery";

class Chat extends Component {
    constructor(props) {
        super(props);

        var id = this.props.id.split("/");   // id comes in the form: [prompt_id]/[chatbox_num]
        this.state = {
            username: '',
            message: '',
            messages: [],
            message_ref_table: {},
            hubConnection: null,
            id: this.props.id,
            prompt_id: id[0], 
            chatbox_num: id[1]
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.SendMessage = this.SendMessage.bind(this);
        this.SendButton = React.createRef();
    }

    componentDidMount() {
        // ***** Initialize socket to chat controller ******
        this.SendButton.current.style.disabled = true;  // Disable send button until connection is established

        const hubConnection = new signalR.HubConnectionBuilder().withUrl("/Hubs/chatHub").build();
        this.setState({ hubConnection: hubConnection }, () => {
            this.state.hubConnection.on("ReceiveMessage", (user, message) => {
                var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                var msgs = this.state.messages;
                msgs.push(user + " says " + msg);
                this.setState({ messages: msgs });
            });

            this.state.hubConnection.start().then(() => {
                this.SendButton.current.style.disabled = true;
                this.state.hubConnection.invoke("JoinGroup", this.state.id).catch(function (err) {
                    return console.error(err.toString());
                });
            }).catch(function (err) {
                return console.error(err.toString());
            });
        });
        // **************************************************


        //  Retrieve first level of comments from database 
        $.ajax({
            type: "GET",
            url: "./comment/GetChildren/-1/" + this.state.prompt_id + "/" + this.state.chatbox_num,
                success:
                    (data) => {
                        for (var i = 0; i < data.length; i++) {
                            this.state.message_ref_table[data[i].id] = new CommentNode(data[i]);
                            this.state.messages.push(new CommentNode(data[i]));
                        }
                            
                    },

                error:
                    (error) => {
                        console.log(error);
                    }
        });

    }

    handleUsernameChange(e) { this.setState({ username: e.target.value }); }

    handleMessageChange(e) { this.setState({ message: e.target.value }); }

    SendMessage() {
        this.state.hubConnection.invoke("SendMessage", this.state.username, this.state.message, this.state.id).catch(function (err) {
            return console.error(err.toString());
        });
    }

    render() {
        let MessagesList =
            this.state.messages.map(function (msg, i) {
                console.log(msg);
                return <li key={i} > {msg.body} </li>
            });

        return (
            <div>
                <div className="container">
                    <div className="row">&nbsp;</div>

                    <div className="row">
                        <div className="col-2">User</div>
                        <div className="col-4">
                            <input type="text" id="userInput" onChange={this.handleUsernameChange} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">Message</div>
                        <div className="col-4">
                            <input type="text" id="messageInput" onChange={this.handleMessageChange} />
                        </div>
                    </div>

                    <div className="row">&nbsp;</div>

                    <div className="row">
                        <div className="col-6">
                            <input
                                type="button"
                                id="sendButton"
                                value="Send Message"
                                ref={this.SendButton}
                                onClick={(e) => {
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
                            {MessagesList}
                        </ul>
                    </div>
                </div>

            </div>
        );
    }
}

class CommentNode {
    constructor(comment) {
        this.body = comment["body"];
        this.date = comment["date"];
        this.rank = comment["rank"];
        this.author = comment["author"];
        this.next = null;
    }
}

export default Chat;
