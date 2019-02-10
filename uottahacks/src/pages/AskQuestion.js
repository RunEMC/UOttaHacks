import React, { Fragment } from 'react';
import { CssBaseline, withStyles, Button, TextField, Paper } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import TopicPublisher from '../services/TopicPublisher';
import TopicSubscriber from '../services/TopicSubscriber';


const styles = theme => ({
  mainContainer: {
    backgroundColor: '#85C7F2',
    minHeight: '100vh',
    height: '100%'
  },
  container: {
    margin: '15px'
  },
  button: {
      marginBottom: '10px'
  }
});

class AskQuestion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      session: props.session,
      input: '',
      isDone: false,
      readyStatus: "Ready Up",
      usersReady: 0,
      userCount: 0
    }

    this.sendMsg = this.sendMsg.bind(this);
    this.registerDone = this.registerDone.bind(this);

    var usercountSubscriber = new TopicSubscriber(this, 'usercount');
    usercountSubscriber.run();

    var donequestionsSubscriber = new TopicSubscriber(this, 'donequestions');
    donequestionsSubscriber.run();

  }

  sendMsg() {
    console.log("Sending msg " + this.state.input);
    // create the publisher, specifying the name of the subscription topic
    var publisher = new TopicPublisher('uottahacks');
    publisher.publish(this.state.input);
    this.setState({
        input: ''
    })
  }

  beginRequestingQuestions() {
    var publisher = new TopicPublisher('getusers');
    publisher.publish(this.state.input);
  }

  registerDone() {
    this.setState({
        isDone: true
    });
    var publisher = new TopicPublisher('donequestions');
    publisher.publish(this.state.input);
  }

  updateUserCount(count) {
      this.setState({
          userCount: parseInt(count)
      })
  }

  updateWaitingClients(name) {
    var nowReady = this.state.usersReady + 1;
    if (nowReady >= this.state.userCount) {
        this.props.history.push('/answer/');
    } else {
        this.setState({
            usersReady: nowReady
        });
    }
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return(
    <div className={classes.mainContainer}>
        <Paper className={classes.container}>
            <form className={classes.container} noValidate autoComplete="off">
                <TextField
                disabled={this.state.isDone}
                id="question"
                label="Question"
                multiline
                className={classes.textField}
                value={this.state.input}
                onChange={this.handleChange('input')}
                margin="normal"
                fullWidth
                />
                <Button disabled={this.state.isDone} className={classes.button} onClick={this.sendMsg}>
                    Ask Question
                </Button>
                <div className={classes.space}></div>
                <Button disabled={this.state.isDone} className={classes.button} onClick={this.registerDone}>
                    {this.state.readyStatus}
                </Button>
            </form>
        </Paper>
    </div>
    );
  }
}

export default withStyles(styles)(AskQuestion);