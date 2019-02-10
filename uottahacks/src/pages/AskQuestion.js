import React, { Fragment } from 'react';
import { CssBaseline, withStyles, Button, TextField, Paper } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import TopicPublisher from '../services/TopicPublisher';

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

class Home extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      session: props.session,
      input: ''
    }

    this.sendMsg = this.sendMsg.bind(this);
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

  registerDone() {
      
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
                id="question"
                label="Question"
                multiline
                className={classes.textField}
                value={this.state.input}
                onChange={this.handleChange('input')}
                margin="normal"
                fullWidth
                />
                <Button className={classes.button} onClick={this.sendMsg}>
                    Ask Question
                </Button>
                <div className={classes.space}></div>
                <Button className={classes.button} onClick={this.registerDone}>
                    Done
                </Button>
            </form>
        </Paper>
    </div>
    );
  }
}

export default withStyles(styles)(Home);