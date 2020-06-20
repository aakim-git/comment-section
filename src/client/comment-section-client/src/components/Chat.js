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
            id: this.props.id,
            replying_to: 0
        };

        this.InitializeHubConnection = this.InitializeHubConnection.bind(this);
        this.InitializeComments = this.InitializeComments.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.SendComment = this.SendComment.bind(this);
        this.SetReplyTo = this.SetReplyTo.bind(this);
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
                        // find a cleaner way to do this
                        let newComment = new CommentNode();
                        newComment.id = data[i].id;
                        newComment.body = data[i].body;
                        newComment.author = data[i].author;
                        newComment.date = data[i].date;
                        newComment.rank = data[i].rank;
                        newComment.has_replies = data[i].num_replies;

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

    SetReplyTo(comment_id, comment_author) { console.log(comment_id + " " + comment_author); this.setState({ replying_to: comment_id }); }

    SendComment() {
        this.state.hubConnection.invoke("SendComment", this.state.username, this.state.comment, this.state.id).catch(function (err) {
            return console.error(err.toString());
        });
    }

    render() {
        let CommentsList =
            this.state.comments_list.map((cmt, i) => {
                return (
                    <div key={i}>
                        <li> {cmt.body} </li>
                        <button onClick={
                            (e) => {
                                this.SetReplyTo(cmt.id, cmt.author);
                                e.preventDefault();
                            }}
                        > Reply </button>
                    </div>
                );
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
                                onClick={(e) => { this.SendComment(); e.preventDefault(); }}
                            />
                        </div>
                        <div
                            onClick={(e) => { this.SetReplyTo(0, ''); e.preventDefault(); }}
                            id="messaging_to_display">
                                {this.state.replying_to ? 'Replying to ' + this.state.comment_ref_table[this.state.replying_to].author + '\'s comment:' : null}
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
        this.id = null;
        this.body = null;
        this.date = null;
        this.rank = null;
        this.author = null;
        this.has_replies = null;
        this.next = null;
    }
}

export default Chat;
