import React, { Fragment } from 'react';
import { CssBaseline, withStyles, Button, TextField, Paper, List, ListItem, Typography } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import TopicPublisher from '../services/TopicPublisher';
import TopicSubscriber from '../services/TopicSubscriber';

const styles = theme => ({
  headingOne:{
fontSize: 56,
  },
  headingTwo:{
    fontSize: 32,
      },
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
      input: '',
      isSignedIn: false,
      isBlank: true,
      users: []
    }

    this.sendMsg = this.sendMsg.bind(this);
    
    var idSubscriber = new TopicSubscriber(this, 'userid');
    idSubscriber.run();
  }

  sendMsg() {
    console.log("Sending id: " + this.state.input);
    // create the publisher, specifying the name of the subscription topic
    var publisher = new TopicPublisher('userid');
    publisher.publish(this.state.input);
    this.setState({
        isSignedIn: true
    });
  }

  updateUsers(name) {
    var us = this.state.users;
    us.push(name);
    this.setState({
      users: us
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
    const listNames = this.state.users.map((user) => (
      <ListItem><Typography>{user}</Typography></ListItem>
    ));

    return (
        <Paper>
            <h1 className={classes.headingOne}>Welcome</h1>
            <h2 className={classes.headingTwo}>I want to:</h2>
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
                    Sign In
                </Button>
            </form>
            <div style={{visibility: this.state.users.length ? 'visible' : 'hidden' }}>
                <Paper>
                    <List className={classes.root}>
                    <Typography className={classes.grid}>Current Students</Typography>
                        {listNames}
                    </List>
                </Paper>
                <Button className={classes.button} onClick={this.registerDone}>
                    Done
                </Button>
            </div>
        </Paper>
    );
  }
}

export default withStyles(styles)(Home);