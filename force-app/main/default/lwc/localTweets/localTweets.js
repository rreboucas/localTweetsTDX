import { LightningElement, wire, api } from 'lwc';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import getTweets from '@salesforce/apex/localTweetsServerController.getOfficialsTweets';
import SF_COMMAND_CENTER_MSG_CHANNEL from '@salesforce/messageChannel/lightning__CommandCenterMessageChannel';

export default class LocalTweets extends LightningElement {

    @api title;
    globalLocationName;
    globalLocationId;
    subscription;
    latestCityState;
    tweetsData;
    error;

    @wire(MessageContext)
    messageContext;
    
    @wire(getTweets, { locationId: '$globalLocationId' })
    wiredTweets({ error, data }) {
        if (data) {
            this.tweetsData = data;
            console.log('localTweets.js - tweetsData: ' + this.tweetsData);
            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }
   

    connectedCallback() {
        this.subscribeToChannel();
    }

/**
* Subscribe to Command Center Message Channel to listen to global filter changes
*/
subscribeToChannel() {
    if (!this.subscription) {
    this.subscription = subscribe(
        this.messageContext,
        SF_COMMAND_CENTER_MSG_CHANNEL, (message) => {
            this.handleEvent(message);
        },
        {scope: APPLICATION_SCOPE});


    }
    }
    /**
    * Any time global filter changes are captured get updated values
    * @param {} message
    */
    handleEvent(message) {
        switch (message.EventType) {
            case 'CC_LOCATION_CHANGE': {
                this.globalLocationName = message.EventPayload.locationName;
                console.log('localTweets.js - globalLocationName: ' + this.globalLocationName);
                this.globalLocationId = message.EventPayload.locationId;
                console.log('localTweets.js - globalLocationId: ' + this.globalLocationId);
                break;
            }
            default: {
            break;
            }
        } 
    }


   

    disconnectedCallback() {
        if (this.subscription) {
            unsubscribe(this.subscription);
        }
    }
    

}