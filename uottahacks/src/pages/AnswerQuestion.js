import React, { Fragment, Children } from 'react';
import { CssBaseline, withStyles, Button, TextField, Card, CardContent, ExpansionPanel, ExpansionPanelDetails, Typography } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CardActions from '@material-ui/core/CardActions';

import TopicPublisher from '../services/TopicSubscriber';
import TopicSubscriber from '../services/TopicSubscriber';

const styles = theme => ({
  mainContainer: {
    backgroundColor: '#85C7F2',
    minHeight: '100vh',
    height: '100%'
  },
  main: {
    zIndex: -1,
    backgroundColor: '#F1F1F1',
    margin: '40px 12% 40px 12%',
    height: '100%',
    padding: '2% 10% 6% 10%',
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)'
  }
});

class AnswerQuestion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      session: props.session,
      input: ''
    }

    this.sendMsg = this.sendMsg.bind(this);

    var questionSubscriber = new TopicSubscriber(this, 'askpage');
    questionSubscriber.run();
  }

  beginRequestingQuestions() {
    console.log("Requesting questions");
    var publisher = new TopicPublisher('requestquestions');
    publisher.publish(this.state.input);
    this.setState({
        isSignedIn: true,
        user: this.state.input
    });
  }

  sendMsg() {
    console.log("Sending msg" + this.state.session);
    // create the publisher, specifying the name of the subscription topic
    // var publisher = new TopicPublisher(this.state.session, 'tutorial/topic');
    // publisher.publish(this.state.input);
  }

  updateAndSetQuestions(question) {
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
       Question 1</Typography>
    </CardContent>
    <CardActions>
        <Button size="small">Answer This Question</Button>
      </CardActions>
    </Card>
    
    <div>
       <form>
       <textarea styles="font-family:Helvetica;font-size:12px;" align="center"
       value="Enter your answer here..." rows="15" cols="50"/>
       <br/>
          <input type="submit" value="Submit Answer" align="right"/>
       </form>
    </div>
    
    </div>
    );
  }
}

export default withStyles(styles)(AnswerQuestion);