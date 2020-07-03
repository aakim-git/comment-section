import React, { Component } from 'react';
import * as signalR from '@aspnet/signalr';
import $ from "jquery";

import '../style/Chat.css';
import Bubble from '../assets/bubble.png';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            comment: '',
            comments_list: [],
            comment_ref_table: {},
            hubConnection: null,
            id: this.props.location,
            replying_to: 0
        };

        this.InitializeHubConnection = this.InitializeHubConnection.bind(this);
        this.InitializeComments = this.InitializeComments.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.SendComment = this.SendComment.bind(this);
        this.SetReplyTo = this.SetReplyTo.bind(this);
        this.GetChildrenComments = this.GetChildrenComments.bind(this);
        this.HideChildrenComments = this.HideChildrenComments.bind(this);
        this.RenderComments = this.RenderComments.bind(this);
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
            this.state.hubConnection.on("ReceiveComment", (comment) => {
                // If the received comment is not a reply, or the parent exists in the chatbox, display it
                if (!comment["parent_id"] || this.state.comment_ref_table[comment["parent_id"]]) {
                    let newComment = new CommentNode(comment);
                    this.setState(previousState => ({
                        comment_ref_table: {
                            ...previousState.comment_ref_table,
                            [comment.id]: newComment
                        }
                    }));

                    // if it is a reply, add as a child node. 
                    if (this.state.comment_ref_table[comment["parent_id"]]) {
                        let updated_comment_ref_table = this.state.comment_ref_table;
                        updated_comment_ref_table[comment["parent_id"]].replies.push(comment); 
                        this.setState({ comment_ref_table: updated_comment_ref_table });
                    }

                    // if not a reply, display as root level comment
                    if (!comment["parent_id"]) {
                        this.setState(previousState => ({
                            comments_list: [...previousState.comments_list, newComment]
                        }));
                    }
                }
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
        var id = this.props.location.split("/");   // id comes in the form: [prompt_id]/[chatbox_num]
        $.ajax({
            type: "GET",
            url: "./comment/GetChildren/-1/" + id[0] + "/" + id[1],
            success:
                (data) => {
                    console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        let newComment = new CommentNode(data[i]);
                        this.setState(previousState => ({
                            comment_ref_table: {
                                ...previousState.comment_ref_table,
                                [newComment.id]: newComment
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

    GetChildrenComments(of) {
        if (this.state.comment_ref_table[of].has_replies) {
            $.ajax({
                type: "GET",
                url: "./comment/GetChildren/" + of,
                success:
                    (data) => {
                        for (var i = 0; i < data.length; i++) {
                            let newComment = new CommentNode(data[i]);
                            let updated_comment_ref_table = this.state.comment_ref_table;
                            updated_comment_ref_table[of].replies.push(newComment);
                            updated_comment_ref_table[of].replies_shown = true;
                            updated_comment_ref_table[newComment.id] = newComment;
                            this.setState({ comment_ref_table: updated_comment_ref_table }); 
                        }
                    },

                error:
                    (error) => {
                        console.log(error);
                    }
            });
        }
    }

    HideChildrenComments(of) {
        if (this.state.comment_ref_table[of].has_replies) {
            let updated_ref_table = this.state.comment_ref_table;
            updated_ref_table[of].replies = [];
            updated_ref_table[of].replies_shown = false;
            this.setState({ comment_ref_table: updated_ref_table });
        }
    }

    handleUsernameChange(e) { this.setState({ username: e.target.value }); }

    handleCommentChange(e) { this.setState({ comment: e.target.value }); }

    SetReplyTo(comment_id) { this.setState({ replying_to: comment_id }); }

    SendComment() {
        this.state.hubConnection.invoke("SendComment", this.state.username, this.state.comment, this.state.id, this.state.replying_to).catch(function (err) {
            return console.error(err.toString());
        });
    }

    RenderComments(cmt) {
        let ShowOrHideRepliesButton;
        if (cmt.has_replies > 0) {
            if (cmt.replies_shown) {
                ShowOrHideRepliesButton =
                    <button onClick= {
                        (e) => {
                            this.HideChildrenComments(cmt.id);
                            e.preventDefault();
                        }}
                    > Hide Replies </button>
            }
            else {
                ShowOrHideRepliesButton =
                    <button onClick= {
                        (e) => {
                            this.GetChildrenComments(cmt.id);
                            e.preventDefault();
                        }}
                    > See Replies </button>
            }
        }

        return (
            <ul class="comment">
                <li className="Comment-Body"> {cmt.body} </li>
                <p className="Comment-Info"> {cmt.author} on {cmt.date} </p>
                <button onClick={
                    (e) => {
                        this.SetReplyTo(cmt.id);
                        e.preventDefault();
                    }}
                > Reply </button>

                {ShowOrHideRepliesButton}

                {
                    cmt.replies &&
                    cmt.replies.length > 0 &&
                    cmt.replies.map((comment) => {
                        return (
                            <div key={comment.id}>
                                {this.RenderComments(comment)}
                            </div>
                        )
                    })
                }

            </ul>
        );
    }


    

    render() {
        let CommentsList = this.state.comments_list.map((comment) =>
            <div key={comment.id}>
                { this.RenderComments(comment) }
            </div>
        );
             
        return (
            <div id={this.props.id} className="chatbox">
                <span></span>
                <div id="commentsList">
                    {CommentsList}
                </div>

                <div id="comment-field">
                    <div id="commentInputs">
                        <input type="text" id="commentInput" placeholder="Comment" onChange={this.handleCommentChange} />

                        <div id="send-button-div">
                            <button id="sendButton" ref={this.SendButton} onClick={(e) => { this.SendComment(); e.preventDefault(); }}>
                                <img src={Bubble} alt=""></img>
                            </button> 
                        </div>
                    </div>
                    <div onClick={(e) => { this.SetReplyTo(0); e.preventDefault(); }} id="messaging_to_display">
                        {this.state.replying_to ? 'Replying to ' + this.state.comment_ref_table[this.state.replying_to].author + '\'s comment:' : null}
                    </div>
                </div>
            </div>
        );
    }
}

class CommentNode {
    constructor(Comment) {
        if (!arguments.length) {
            this.id = null;
            this.body = null;
            this.date = null;
            this.rank = null;
            this.author = null;
            this.has_replies = null;
            this.replies_shown = false;
            this.replies = [];
        }

        else {
            this.id = Comment.id;
            this.body = Comment.body;
            this.date = Comment.date;
            this.rank = Comment.rank;
            this.author = Comment.author;
            this.has_replies = Comment.num_replies;
            this.replies_shown = false;
            this.replies = [];
        }
    }
}

export default Chat;
