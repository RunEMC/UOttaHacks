/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Solace Systems Node.js API
 * Publish/Subscribe tutorial - Topic Publisher
 * Demonstrates publishing direct messages to a topic
 */

/*jslint es6 node:true devel:true*/

import solace from 'solclientjs';

class TopicPublisher {
    constructor(sess, topic) {
        this.publisher = {
            // session: sess,
            topicName: topic
        }
        
        // Initialize factory with the most recent API defaults
        var factoryProps = new solace.SolclientFactoryProperties();
        factoryProps.profile = solace.SolclientFactoryProfiles.version10;
        solace.SolclientFactory.init(factoryProps);

        this.session = solace.SolclientFactory.createSession({ 
            url: "ws://mr4b11zr8yp.messaging.mymaas.net:80", 
            vpnName: "msgvpn-4b11zr8xv", 
            userName: "solace-cloud-client", 
            password: "ndll0aatbdoghi2h6stjmdgg4j", 
        }); 
        try { 
            this.session.connect(); 
            console.log("Connected");
        } catch (error) { 
            console.log(error); 
        }
    }

    run() {
        this.publish();
        // this.publisher.exit();
        // connect the session
        // try {
        //     this.session.connect();
        // } catch (error) {
        //     console.log(error.toString());
        // }
    }

    // Publishes one message
    publish() {
        var publisher = this.session;
        // define session event listeners
        this.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
            console.log('=== Successfully connected and ready to publish messages. ===');
            // publisher.publish();
            if (this.session !== null) {
                var messageText = 'Sample Message';
                var message = solace.SolclientFactory.createMessage();
                message.setDestination(solace.SolclientFactory.createTopicDestination("uottahacks"));
                message.setBinaryAttachment(messageText);
                message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
                console.log('Publishing message "' + messageText + '" to topic "' + "uottahacks" + '"...');
                try {
                    publisher.send(message);
                    console.log('Message published.');
                } catch (error) {
                    console.log(error.toString());
                }
            } else {
                console.log('Cannot publish because not connected to Solace message router.');
            }
            // this.publisher.exit();
        });
        this.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
            console.log('Connection failed to the message router: ' + sessionEvent.infoStr +
                ' - check correct parameter values and connectivity!');
        });
        this.session.on(solace.SessionEventCode.DISCONNECTED, function (sessionEvent) {
            console.log('Disconnected.');
            if (this.publisher.session !== null) {
                this.publisher.session.dispose();
                this.publisher.session = null;
            }
        });

    };

    exit() {
        this.publisher.disconnect();
        setTimeout(function () {
            process.exit();
        }, 1000); // wait for 1 second to finish
    };

    // Gracefully disconnects from Solace message router
    disconnect() {
        console.log('Disconnecting from Solace message router...');
        if (this.publisher.session !== null) {
            try {
                this.publisher.session.disconnect();
            } catch (error) {
                console.log(error.toString());
            }
        } else {
            console.log('Not connected to Solace message router.');
        }
    };
    
}

export default TopicPublisher;
