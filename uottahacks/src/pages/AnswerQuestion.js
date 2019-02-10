import React, { Fragment, Children } from 'react';
import { CssBaseline, withStyles, fontFamily, Button, TextField,Paper, Card, CardContent, ExpansionPanel, ExpansionPanelDetails,Typography } from '@material-ui/core';
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
  }
});

class AnswerQuestion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      session: props.session,
      input: '',
      questions: [],
      curPos: 0
    }

    this.sendMsg = this.sendMsg.bind(this);
  }

  sendMsg() {
    this.setState({
      curPos: this.state.curPos + 1
    });
    if (this.state.curPos >= this.state.questions.length) {

    }
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
    console.log(question)
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return(
    <div className={classes.mainContainer}>
      <Card className={classes.card} styles="width:10px;height:10px;">
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {this.state.questions[this.state.curPos]}
          </Typography>
        </CardContent>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
          id="response"
          label="Response"
          multiline
          className={classes.textField}
          value={this.state.input}
          onChange={this.handleChange('input')}
          margin="normal"
          fullWidth
          />
          <Button variant="contained" disabled={this.state.isDone} className={classes.button} onClick={this.sendMsg}>
            Next
          </Button>
          <Button variant="contained" disabled={this.state.isDone} className={classes.button} onClick={this.sendMsg}>
            Skip
          </Button>
        </form>
      </Card>
    
    </div>
    );
  }
}

export default withStyles(styles)(AnswerQuestion);