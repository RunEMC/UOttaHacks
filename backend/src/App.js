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
  },
  quesion: {
    width: '100%'
  },
  solutions: {
    paddingLeft: '35px'
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
      usersReady: 0,
      userSolutions: [],
      sentQuestion: false,
      usersDone: 0,
      rawSolutions: [],
      sentSolutions: false
    }
    
    this.updateView = this.updateView.bind(this);

    var dataSubscriber = new TopicSubscriber(this, 'uottahacks');
    dataSubscriber.run();

    var idSubscriber = new TopicSubscriber(this, 'userid');
    idSubscriber.run();

    var statusSubscriber = new TopicSubscriber(this, 'userstatus');
    statusSubscriber.run();

    var questionSubscriber = new TopicSubscriber(this, 'requestquestions');
    questionSubscriber.run();

    var responseSubscriber = new TopicSubscriber(this, 'sendsolution');
    responseSubscriber.run();

    var ucountSubscriber = new TopicSubscriber(this, 'getusers');
    ucountSubscriber.run();

    var responsesSubscriber = new TopicSubscriber(this, 'requestresponses');
    responsesSubscriber.run();
  }

  sendResponses() {
    if (!this.state.sentSolutions) {
      this.setState({
        sentSolutions: true
      });
      console.log("Sending Solutions");
      this.state.rawSolutions.forEach(solution => {
        var publisher = new TopicPublisher('getresponses');
        publisher.publish(solution);
      });
    }
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

  updateSolutions(solutionobj) {
    var raw = this.state.rawSolutions;
    raw.push(solutionobj);
    var sol = solutionobj.split(":");
    var index = parseInt(sol[1]);
    var curSol = this.state.userSolutions;
    var newSol = curSol[index];
    if (newSol == undefined) {
      newSol = {};
      newSol[sol[0]] = sol[2];
      curSol.push(newSol);
    } else {
      newSol[sol[0]] = sol[2];
      curSol[index] = newSol;
    }
    var newDone = this.state.usersDone;
    if (index == this.state.questions.length - 1) {
      newDone += 1;
    }
    
    if (newDone >= this.state.users.length) {
      this.setState({
        sentQuestion: false
      });
      var publisher = new TopicPublisher('solutionspage');
      publisher.publish("solpage");
    }

    this.setState({
      userSolutions: curSol,
      usersDone: newDone,
      rawSolutions: raw
    });
    console.log(this.state.userSolutions);
  }

  sendUsers(name) {
    console.log("Sending USERS!");
    var publisher = new TopicPublisher('usercount');
    publisher.publish(this.state.users.length.toString());
  }

  sendQuestions(name) {
    if (!this.state.sentQuestion) {
      this.setState({
        sentQuestion: true
      });
      console.log("Sending Questions");
      this.state.questions.forEach(question => {
        var publisher = new TopicPublisher('askpage');
        publisher.publish(question);
      });
    }
  }

  render() {
    const { classes } = this.props;
    const listQuestions = this.state.questions.map((question, index) => {
      const listResponses = this.state.userSolutions.length > index ? Object.keys(this.state.userSolutions[index]).map((user) => (
        <ListItem className={classes.solutions}>
          <Typography>{user}: {this.state.userSolutions[index][user]}</Typography>
        </ListItem>
      )) : <div></div>;

      return (
      <ListItem>
        <Grid container direction="column">
          <Grid item xs>
            <Typography className={classes.question}>{question}</Typography>
          </Grid>
          <Grid item xs>
            <List>
              {listResponses}
            </List>
          </Grid>
        </Grid>
      </ListItem>
    )});
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