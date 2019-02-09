import React, { Fragment } from 'react';
import { CssBaseline, withStyles, Button } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';

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

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      session: props.session
    }

    this.sendMsg = this.sendMsg.bind(this);
  }

  sendMsg() {
    console.log("Sending msg");
  }

  render() {
    const { classes } = this.props;

    return(
      <Router>
        <div className={classes.mainContainer}>
          <Fragment>
            <CssBaseline />
            <Button onClick={this.sendMsg}>
              Send Msg
            </Button>
          </Fragment>
        </div>
      </Router>
    );
  }
}

export default withStyles(styles)(App);