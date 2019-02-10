import React, { Fragment } from 'react';
import { CssBaseline, withStyles, Button, Typography, Paper, Grid, List, ListItem } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';

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
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      session: props.session,
      questions: [],
      users: []
    }
    
    this.updateView = this.updateView.bind(this);

    var dataSubscriber = new TopicSubscriber(this, 'uottahacks');
    dataSubscriber.run();

    var idSubscriber = new TopicSubscriber(this, 'userid');
    idSubscriber.run();
  }

  updateView(msg) {
    console.log("Updating:" + msg);
    var qs = this.state.questions;
    qs.push(msg);
    this.setState({
      questions: qs
    });
  }

  updateUsers(name) {
    var us = this.state.users;
    us.push(name);
    this.setState({
      users: us
    });
  }

  render() {
    const { classes } = this.props;
    const listQuestions = this.state.questions.map((question) => (
      <ListItem><Typography>{question}</Typography></ListItem>
    ));
    const listNames = this.state.users.map((user) => (
      <ListItem><Typography>{user}</Typography></ListItem>
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
              <Typography className={classes.grid}>Current Students</Typography>
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