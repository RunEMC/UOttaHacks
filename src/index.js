import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

import solace from 'solclientjs';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

// Initialize factory with the most recent API defaults
var factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);

var session = solace.SolclientFactory.createSession({ 
    url: "ws://mr4b11zr8yp.messaging.mymaas.net:80", 
    vpnName: "msgvpn-4b11zr8xv", 
    userName: "solace-cloud-client", 
    password: "ndll0aatbdoghi2h6stjmdgg4j", 
 }); 
 try { 
    session.connect(); 
    console.log("Connected");
 } catch (error) { 
    console.log(error); 
 }

if (module.hot) module.hot.accept();