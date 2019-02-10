import React, { Fragment } from 'react';
import { CssBaseline, withStyles, Button, TextField } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';


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
      
    }

    this.sendMsg = this.sendMsg.bind(this);
  }

  sendMsg() {
    console.log("Sending msg" + this.state.session);
    // create the publisher, specifying the name of the subscription topic
    // var publisher = new TopicPublisher(this.state.session, 'tutorial/topic');
    // publisher.publish(this.state.input);
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return(
    <div className={classes.mainContainer}>
    
    <h1 className={classes.headingOne}>Welcome</h1>
    <h2 className={classes.headingTwo}>I want to:</h2>
    <Button variant="contained" color="primary">
      Ask
    </Button>
    <Button variant="contained" color="primary">
      Done
    </Button>
   
    </div>
    );
  }
}

export default withStyles(styles)(Home);