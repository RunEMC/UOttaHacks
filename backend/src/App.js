import React, { Fragment } from 'react';
import { CssBaseline, withStyles, Button, Typography, Paper, Grid, List, ListItem } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CheckmarkIcon from '@material-ui/icons/CheckCircleOutline'

import TopicSubscriber from './services/TopicSubscriber';
import TopicPublisher from './services/TopicPublisher';

const styles = theme => ({
  mainContainer: {
    backgroundColor: '#85C7F2',
    minHeight: '100vh',
    height: '100%'
  },
  root: {
    width: '100%',
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)'
  },
  grid: {
    padding: '5%',
  },
  userField: {
    marginLeft: '15px'
}
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      session: props.session,
      questions: [],
      users: [],
      userStatus: {},
      usersReady: 0
    }
    
    this.updateView = this.updateView.bind(this);

    var dataSubscriber = new TopicSubscriber(this, 'uottahacks');
    dataSubscriber.run();

    var idSubscriber = new TopicSubscriber(this, 'userid');
    idSubscriber.run();

    var statusSubscriber = new TopicSubscriber(this, 'userstatus');
    statusSubscriber.run();

    var statusSubscriber = new TopicSubscriber(this, 'requestquestions');
    statusSubscriber.run();
  }

  updateUserStatus(user) {
    var newUsers = this.state.usersReady;
    var statuses = this.state.userStatus;
    if (this.state.userStatus[user]) {
      newUsers += 1;
    } else {
      newUsers -= 1;
    }
    statuses[user] = !this.state.userStatus[user];
    this.setState({
      usersReady: newUsers,
      userStatus: statuses
    });
  }

  updateView(msg) {
    var qs = this.state.questions;
    qs.push(msg);
    this.setState({
      questions: qs
    });
  }

  updateUsers(name) {
    var us = this.state.users;
    us.push(name);
    var statuses = this.state.userStatus;
    statuses[name] = true;
    this.setState({
      users: us,
      userStatus: statuses
    });
  }

  sendUsers(name) {
    var publisher = new TopicPublisher('userCount');
    publisher.publish(this.state.users.length.toString());
  }

  sendQuestions(name) {
    console.log("Sending Questions");
    var publisher = new TopicPublisher(this.state.session, 'askpage');
    this.state.questions.forEach(question => {
      publisher.publish(question);
    });
  }

  render() {
    const { classes } = this.props;
    const listQuestions = this.state.questions.map((question) => (
      <ListItem><Typography>{question}</Typography></ListItem>
    ));
    const listNames = this.state.users.map((user) => (
      <ListItem><CheckmarkIcon style={{visibility: !this.state.userStatus[user] ? 'visible' : 'hidden' }}/><Typography className={classes.userField}>{user}</Typography></ListItem>
    ));

    return(
      <div className={classes.mainContainer}>
        <CssBaseline />
        <Grid container className={classes.grid} spacing={24} direction="row">

          <Grid item xs className={classes.gridItem}>
            <Paper>
              <List className={classes.root}>
              <Typography className={classes.grid}>Questions</Typography>
                {listQuestions}
              </List>
            </Paper>
          </Grid>

          <Grid item xs className={classes.gridItem}>
            <Paper>
              <List className={classes.root}>
              <Typography className={classes.grid}>Current Students ({this.state.usersReady} ready)</Typography>
                {listNames}
              </List>
            </Paper>
          </Grid>

        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);