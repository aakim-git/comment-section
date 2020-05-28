import React, { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
    this.PromptTextField = React.createRef();
    this.CreateNewPrompt = this.CreateNewPrompt.bind(this);
  }

  CreateNewPrompt() {
    console.log(this.PromptTextField.current.value);
  }

  render() {
    return (
      <div className="container">

        <textarea placeholder="Type a discussion prompt here..." ref={this.PromptTextField} />
        <button type="button" value="Create New Prompt" onClick={(e) => { this.CreateNewPrompt(); e.preventDefault();}}>
          Create
        </button>

      </div>
    );
  }
}

export default Home;
