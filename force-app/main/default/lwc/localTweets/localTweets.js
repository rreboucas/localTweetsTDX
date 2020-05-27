import { LightningElement, wire, api } from 'lwc';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import getLocationData from '@salesforce/apex/localTweetsServerController.getLocationAddress';
import getTweets from '@salesforce/apex/localTweetsServerController.getOfficialsTweets';
import SF_COMMAND_CENTER_MSG_CHANNEL from '@salesforce/messageChannel/back2work__CommandCenterMessageChannel__c';

export default class LocalTweets extends LightningElement {

    @api title;
    globalLocationName;
    globalLocationId;
    subscription;
    latestCityState;
    hasData = false;
    error;

    @wire(MessageContext)
    messageContext;

    @wire(getLocationData, { locationID: '$globalLocationId' })
    wiredLocation({ error, data }) {
        if (data) {
            this.latestCityState = data.city + ',' + data.state;
            this.hasData = true;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.latestCityState = undefined;
        }
    }
    
    
    @wire(getTweets, { cityState: '$latestCityState' })
    wiredTweets({ error, data }) {
        if (data) {
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
                this.globalLocationId = message.EventPayload.locationId;
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