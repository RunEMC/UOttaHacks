import React, { Fragment } from 'react';
import { CssBaseline, withStyles, Button, TextField, Paper, List, ListItem, Typography } from '@material-ui/core';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import CheckmarkIcon from '@material-ui/icons/CheckCircleOutline'

import TopicPublisher from '../services/TopicPublisher';
import TopicSubscriber from '../services/TopicSubscriber';

const styles = theme => ({
    mainContainer: {
        padding: '15px',
        margin: '25px'
    },
    mainContainer: {
        padding: '15px',
        margin: '25px'
    },
    container: {
        padding: '15px',
        margin: '25px'
    },
    main: {
        zIndex: -1,
        backgroundColor: '#F1F1F1',
        margin: '40px 12% 40px 12%',
        height: '100%',
        padding: '2% 10% 6% 10%',
        boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)'
    },
    userField: {
        marginLeft: '15px'
    }
});

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      session: props.session,
      input: '',
      isSignedIn: false,
      isBlank: true,
      users: [],
      isDone: false,
      readyStatus: "Ready Up",
      userStatus: {},
      user: '',
      usersReady: 0
    }

    this.sendMsg = this.sendMsg.bind(this);
    this.registerDone = this.registerDone.bind(this);
    
    var idSubscriber = new TopicSubscriber(this, 'userid');
    idSubscriber.run();

    var statusSubscriber = new TopicSubscriber(this, 'userstatus');
    statusSubscriber.run();
  }

  sendMsg() {
    console.log("Sending id: " + this.state.input);
    // create the publisher, specifying the name of the subscription topic
    var publisher = new TopicPublisher('userid');
    publisher.publish(this.state.input);
    this.setState({
        isSignedIn: true,
        user: this.state.input
    });
  }

  registerDone() {
    var publisher = new TopicPublisher('userstatus');
    publisher.publish(this.state.user);
    var ready = this.state.isDone ? "Ready Up" : "Unready";
    this.setState({
        isSignedIn: true,
        readyStatus: ready,
        isDone: !this.state.isDone
    });
  }

  updateUserStatus(user) {
    var statuses = this.state.userStatus;
    statuses[user] = !this.state.userStatus[user];
    var ready = statuses[user] ? this.state.usersReady + 1 : this.state.usersReady - 1; 
    this.setState({
        userStatus: statuses,
        usersReady: ready
    });
    console.log(this.state);
    if (this.state.usersReady >= this.state.users.length) {
        console.log(this.props);
        this.props.history.push('/ask/');
    }
  }

  updateUsers(name) {
    var us = this.state.users;
    us.push(name);
    var statuses = this.state.userStatus;
    statuses[name] = false;
    this.setState({
      users: us,
      userStatus: statuses
    });
  }

  updateUsers(name) {
    var us = this.state.users;
    us.push(name);
    var statuses = this.state.userStatus;
    statuses[name] = false;
    this.setState({
      users: us,
      userStatus: statuses
    });
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
    if (event.target.value.length > 0) {
        this.setState({
            isBlank: false
        });
    } else {
        this.setState({
            isBlank: true
        });
    }
  };

  render() {
    const { classes } = this.props;
    const listNames = this.state.users.map((user) => {
        const status = this.state.userStatus[user];
        return (
            <ListItem><CheckmarkIcon style={{visibility: status ? 'visible' : 'hidden' }}/><Typography className={classes.userField}>{user}</Typography></ListItem>
        );
    });

    return (
        <Paper className={classes.mainContainer}>
            <Typography variant="h4">YesBrainer</Typography>
            <Typography variant="body1">Enter your name below to join a study group, press done when everyone in your group is ready to begin the session!</Typography>
            <form className={classes.container} noValidate autoComplete="off">
                <TextField
                disabled={this.state.isSignedIn}
                id="name"
                label="Name"
                className={classes.textField}
                value={this.state.input}
                onChange={this.handleChange('input')}
                margin="normal"
                fullWidth
                />
                <Button disabled={this.state.isSignedIn || this.state.isBlank} className={classes.button} onClick={this.sendMsg}>
                    Register
                </Button>
            </form>
            <div style={{visibility: this.state.users.length ? 'visible' : 'hidden' }}>
                <Paper className={classes.container}>
                    <List className={classes.root}>
                    <Typography className={classes.grid}>Current Students</Typography>
                        {listNames}
                    </List>
                </Paper>
                <Button className={classes.button} onClick={this.registerDone}>
                    {this.state.readyStatus}
                </Button>
            </div>
        </Paper>
    );
  }
}

export default withStyles(styles)(Home);