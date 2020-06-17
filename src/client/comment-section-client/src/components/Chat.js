import React, { Component } from 'react';
import * as signalR from '@aspnet/signalr';
import $ from "jquery";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            comment: '',
            comments_list: [],
            comment_ref_table: {},
            hubConnection: null,
            id: this.props.id
        };

        this.InitializeHubConnection = this.InitializeHubConnection.bind(this);
        this.InitializeComments = this.InitializeComments.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.SendComment = this.SendComment.bind(this);
        this.SendButton = React.createRef();
    }

    componentDidMount() {
        this.InitializeHubConnection();
        this.InitializeComments();
    }

    InitializeHubConnection() {
        this.SendButton.current.style.disabled = true;  // Disable send button until connection is established

        const hubConnection = new signalR.HubConnectionBuilder().withUrl("/Hubs/chatHub").build();
        this.setState({ hubConnection: hubConnection }, () => {
            this.state.hubConnection.on("ReceiveComment", (id, body, author, date) => {
                let newComment = new CommentNode();
                newComment.body = body;
                newComment.author = author;
                newComment.date = date;

                this.setState(previousState => ({
                    comment_ref_table: {
                        ...previousState.comment_ref_table,
                        [id]: newComment
                    },
                    comments_list: [...previousState.comments_list, newComment]
                }));
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
    }

    InitializeComments() {
        //  Retrieve first level of comments from database 
        var id = this.props.id.split("/");   // id comes in the form: [prompt_id]/[chatbox_num]
        $.ajax({
            type: "GET",
            url: "./comment/GetChildren/-1/" + id[0] + "/" + id[1],
            success:
                (data) => {
                    for (var i = 0; i < data.length; i++) {
                        let newComment = new CommentNode();
                        newComment.body = data[i].body;
                        newComment.author = data[i].author;
                        newComment.date = data[i].date;

                        this.setState(previousState => ({
                            comment_ref_table: {
                                ...previousState.comment_ref_table,
                                [data[i].id]: newComment
                            },
                            comments_list: [...previousState.comments_list, newComment]
                        }));
                    }

                },

            error:
                (error) => {
                    console.log(error);
                }
        });
    }

    handleUsernameChange(e) { this.setState({ username: e.target.value }); }

    handleCommentChange(e) { this.setState({ comment: e.target.value }); }

    SendComment() {
        this.state.hubConnection.invoke("SendComment", this.state.username, this.state.comment, this.state.id).catch(function (err) {
            return console.error(err.toString());
        });
    }

    render() {
        let CommentsList =
            this.state.comments_list.map(function (cmt, i) {
                return <li key={i} > {cmt.body} </li>
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
                        <div className="col-2">Comments</div>
                        <div className="col-4">
                            <input type="text" id="commentInput" onChange={this.handleCommentChange} />
                        </div>
                    </div>

                    <div className="row">&nbsp;</div>

                    <div className="row">
                        <div className="col-6">
                            <input
                                type="button"
                                id="sendButton"
                                value="Send Comment"
                                ref={this.SendButton}
                                onClick={(e) => {
                                        this.SendComment();
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
                        <ul id="commentsList">
                            {CommentsList}
                        </ul>
                    </div>
                </div>

            </div>
        );
    }
}

class CommentNode {
    constructor() {
        this.body = null;
        this.date = null;
        this.rank = null;
        this.author = null;
        this.next = null;
    }
}

export default Chat;
