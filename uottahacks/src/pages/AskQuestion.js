import React, { Fragment } from 'react';
import { CssBaseline, withStyles, Button, TextField } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import TopicPublisher from '../services/TopicPublisher';

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
    console.log("Sending msg" + this.state.session);
    // create the publisher, specifying the name of the subscription topic
    var publisher = new TopicPublisher(this.state.session, 'tutorial/topic');
    publisher.publish(this.state.input);
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return(
    <div className={classes.mainContainer}>
        <form className={classes.container} noValidate autoComplete="off">
            <TextField
            id="standard-name"
            label="Name"
            className={classes.textField}
            value={this.state.input}
            onChange={this.handleChange('input')}
            margin="normal"
            />
        </form>
        <Button onClick={this.sendMsg}>
            Send Msg
        </Button>
    </div>
    );
  }
}

export default withStyles(styles)(Home);