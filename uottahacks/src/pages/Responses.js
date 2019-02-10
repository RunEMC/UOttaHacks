import React, { Fragment, Children } from 'react';
import { CssBaseline, withStyles, List, ListItem, Grid, Paper, Typography } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CardActions from '@material-ui/core/CardActions';

import TopicPublisher from '../services/TopicPublisher';
import TopicSubscriber from '../services/TopicSubscriber';

const styles = theme => ({
  mainContainer: {
    margin: '15px',
    padding: '15px'
  },
  container: {
    margin: '35px'
  },
  main: {
    zIndex: -1,
    backgroundColor: '#F1F1F1',
    margin: '40px 12% 40px 12%',
    height: '100%',
    padding: '2% 10% 6% 10%',
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)'
  },
  button: {
    marginRight: '15px'
  },
  questiontext: {
    marginTop: '25px',
    marginLeft: '15px'
  }
});

class Responses extends React.Component {
  constructor(props) {
    super(props);

    var username = this.props.location.pathname;
    var arr = username.split('/answer/');
    username = arr[1];
    console.log("USERNAME: " + username);

    this.state = {
      session: props.session,
      input: '',
      questions: [],
      userSolutions: [],
      curPos: 0,
      isDone: false,
      userName: username
    }

    this.sendMsg = this.sendMsg.bind(this);

    var questionSubscriber = new TopicSubscriber(this, 'askpage');
    questionSubscriber.run();
    
    var respSubscriber = new TopicSubscriber(this, 'getresponses');
    respSubscriber.run();
  }

  updateSolutions(solutionobj) {
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
    
    this.setState({
      userSolutions: curSol,
      usersDone: newDone
    });
    console.log(this.state.userSolutions);
  }

  beginRequestingQuestions() {
    console.log("Requesting questions");
    var publisher = new TopicPublisher('requestquestions');
    publisher.publish(this.state.input);
    
    var publisherResp = new TopicPublisher('requestresponses');
    publisherResp.publish(this.state.input);
  }

  sendMsg() {
    if (this.state.curPos + 1 >= this.state.questions.length) {
      this.setState({
        isDone: true
      });
    } else {
      this.setState({
        curPos: this.state.curPos + 1
      });  
    }
    console.log("SENDING: " + this.state.userName + ":" + this.state.curPos + ":" + this.state.input);
    var publisher = new TopicPublisher('sendsolution');
    publisher.publish(this.state.userName + ":" + this.state.curPos + ":" + this.state.input);
    // create the publisher, specifying the name of the subscription topic
    // var publisher = new TopicPublisher(this.state.session, 'tutorial/topic');
    // publisher.publish(this.state.input);
  }

  updateAndSetQuestions(question) {
    var questions = this.state.questions;
    questions.push(question);
    this.setState({
      questions: questions
    });
    console.log("QUEIEAJTAEUIFAEU" + question)
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const listQuestions = this.state.questions.map((question, index) => {
      const listResponses = this.state.userSolutions.length > index ? Object.keys(this.state.userSolutions[index]).map((user) => (
        <ListItem button className={classes.solutions}>
          <Typography>{user}: {this.state.userSolutions[index][user]}</Typography>
        </ListItem>
      )) : <div></div>;

      return (
      <ListItem button>
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

    return(
      <div className={classes.mainContainer}>
        <Paper>
          <List className={classes.root}>
          <Typography variant="h5" className={classes.grid} style={{margin: '15px'}}>Responses</Typography>
            {listQuestions}
          </List>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Responses);