import React, { Fragment } from 'react';
import { CssBaseline, withStyles, Button, TextField, AppBar } from '@material-ui/core';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import image from './Logo/YesBrainerLogo.png';
import TopicPublisher from './services/TopicPublisher';
import AnswerQuestion from './pages/AnswerQuestion';
import AskQuestion from './pages/AskQuestion';
import Home from './pages/Home';

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
      session: props.session,
      input: ''
    }

    this.sendMsg = this.sendMsg.bind(this);
  }

  sendMsg() {
    console.log("Sending msg" + this.state.session);
    // create the publisher, specifying the name of the subscription topic
    var publisher = new TopicPublisher(this.state.session, 'uottahacks');
    publisher.publish(this.state.input);
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return(
      <Router>
        <div className={classes.mainContainer}>
        <head Title="YesBrainer"></head>
          <div>
            <Link to="/" className={classes.text}>Home</Link>
            <Link to="/answer/" className={classes.text}>Answer</Link>
            <Link to="/ask/" className={classes.text}>Ask</Link>
          </div>
          <Fragment>
            <CssBaseline />
            <div classes={classes.main}>
              <Route exact path="/" component={Home} />
              <Route path="/answer/" component={AnswerQuestion} />
              <Route path="/ask/" component={AskQuestion} />
            </div>
          </Fragment>
        </div>
      </Router>
    );
  }
}

export default withStyles(styles)(App);