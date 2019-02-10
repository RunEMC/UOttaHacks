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
 * Publish/Subscribe tutorial - Topic Subscriber
 * Demonstrates subscribing to a topic for direct messages and receiving messages
 */

/*jslint es6 node:true devel:true*/

import solace from 'solclientjs';

class TopicSubscriber {
    constructor(sess, topic) {
        this.subscriber = {
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
        var subscriberSession = this.session;

        // define session event listeners
        this.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
            console.log('=== Successfully connected and ready to subscribe. ===');
            // this.subscribe();
            if (this.session !== null) {
                // if (this.subscriber.subscribed) {
                //     console.log('Already subscribed to "' + this.subscriber.topicName
                //         + '" and ready to receive messages.');
                // } else {
                    console.log('Subscribing to topic: ' + "uottahacks");
                    try {
                        subscriberSession.subscribe(
                            solace.SolclientFactory.createTopicDestination("uottahacks"),
                            true, // generate confirmation when subscription is added successfully
                            "uottahacks", // use topic name as correlation key
                            10000 // 10 seconds timeout for this operation
                        );
                    } catch (error) {
                        console.log(error.toString());
                    }
                // }
            } else {
                console.log('Cannot subscribe because not connected to Solace message router.');
            }
        });

        // define message event listener
        this.session.on(solace.SessionEventCode.MESSAGE, function (message) {
            console.log('Received message: "' + message.getBinaryAttachment() + '", details:\n' +
                message.dump());
        });
        // this.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
        //     subscriber.log('Connection failed to the message router: ' + sessionEvent.infoStr +
        //         ' - check correct parameter values and connectivity!');
        // });
        // this.session.on(solace.SessionEventCode.DISCONNECTED, function (sessionEvent) {
        //     subscriber.log('Disconnected.');
        //     subscriber.subscribed = false;
        //     if (this.session !== null) {
        //         this.session.dispose();
        //         this.session = null;
        //     }
        // });
        // this.session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, function (sessionEvent) {
        //     subscriber.log('Cannot subscribe to topic: ' + sessionEvent.correlationKey);
        // });
        // this.session.on(solace.SessionEventCode.SUBSCRIPTION_OK, function (sessionEvent) {
        //     if (subscriber.subscribed) {
        //         subscriber.subscribed = false;
        //         subscriber.log('Successfully unsubscribed from topic: ' + sessionEvent.correlationKey);
        //     } else {
        //         subscriber.subscribed = true;
        //         subscriber.log('Successfully subscribed to topic: ' + sessionEvent.correlationKey);
        //         subscriber.log('=== Ready to receive messages. ===');
        //     }
        // });
        
    }

    subscribe() {
        if (this.session !== null) {
            // if (this.subscriber.subscribed) {
            //     console.log('Already subscribed to "' + this.subscriber.topicName
            //         + '" and ready to receive messages.');
            // } else {
                console.log('Subscribing to topic: ' + "uottahacks");
                try {
                    this.session.subscribe(
                        solace.SolclientFactory.createTopicDestination("uottahacks"),
                        true, // generate confirmation when subscription is added successfully
                        "uottahacks", // use topic name as correlation key
                        10000 // 10 seconds timeout for this operation
                    );
                } catch (error) {
                    console.log(error.toString());
                }
            // }
        } else {
            console.log('Cannot subscribe because not connected to Solace message router.');
        }
    }
}

export default TopicSubscriber;