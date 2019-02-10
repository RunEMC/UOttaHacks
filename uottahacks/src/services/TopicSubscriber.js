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
    constructor(ui, topic) {
        this.subscriber = {
            view: ui,
            topicName: topic
        }

        // this.subscriber.view.updateView("Test");

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
        var view = this.subscriber.view;
        var topic = this.subscriber.topicName;

        // define session event listeners
        this.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
            console.log('=== Successfully connected and ready to subscribe. ===');
            // this.subscribe();
            if (this.session !== null) {
                // if (this.subscriber.subscribed) {
                //     console.log('Already subscribed to "' + this.subscriber.topicName
                //         + '" and ready to receive messages.');
                // } else {
                    console.log('Subscribing to topic: ' + topic);
                    try {
                        subscriberSession.subscribe(
                            solace.SolclientFactory.createTopicDestination(topic),
                            true, // generate confirmation when subscription is added successfully
                            topic, // use topic name as correlation key
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
            console.log(topic);

            switch (topic) {
                case "uottahacks":
                    view.updateView(message.getBinaryAttachment());
                    break;
                case "userid":
                    view.updateUsers(message.getBinaryAttachment());
                    break;
                case "userstatus":
                    view.updateUserStatus(message.getBinaryAttachment());
                    break;
                case "askpage":
                    view.updateUserStatus(message.getBinaryAttachment());
                    break;
                default:
                    view.updateView(message.getBinaryAttachment());
            }
            
            console.log('Received message: "' + message.getBinaryAttachment() + '", details:\n' +
                message.dump());
        });
        
    }
}

export default TopicSubscriber;