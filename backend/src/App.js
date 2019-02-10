import React, { Fragment } from 'react';
import { CssBaseline, withStyles, Button, Typography, Paper, Grid, List, ListItem } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import TopicSubscriber from './services/TopicSubscriber'

const styles = theme => ({
  mainContainer: {
    backgroundColor: '#85C7F2',
    minHeight: '100vh',
    height: '100%'
  },
  root: {
    backgroundColor: '#F1F1F1',
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
      questions: []
    }
    
    this.updateView = this.updateView.bind(this);

    var subscriber = new TopicSubscriber(this, 'uottahacks');
    subscriber.run();
  }

  updateView(msg) {
    console.log("Updating:" + msg);
    var qs = this.state.questions;
    qs.push(msg);
    this.setState({
      questions: qs
    });
  }

  render() {
    const { classes } = this.props;
    const listQuestions = this.state.questions.map((question) => (
      <ListItem><Typography>{question}</Typography></ListItem>
    ))

    return(
      <div className={classes.mainContainer}>
        <CssBaseline />
        <Grid container className={classes.grid} spacing={24} direction="row">

          <Grid item xs className={classes.gridItem}>
            <List className={classes.root}>
            <Typography>Questions</Typography>
              {listQuestions}
            </List>
          </Grid>

          <Grid item xs className={classes.gridItem}>
            <List className={classes.root}>
            <Typography>Current Students</Typography>
              <ListItem>Test</ListItem>
            </List>
          </Grid>

        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);