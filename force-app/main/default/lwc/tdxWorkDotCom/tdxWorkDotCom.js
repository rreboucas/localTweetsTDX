import { LightningElement, wire } from 'lwc';
import TDX_LOGO from '@salesforce/resourceUrl/tdxlogo';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import SF_COMMAND_CENTER_MSG_CHANNEL from '@salesforce/messageChannel/lightning__CommandCenterMessageChannel';

export default class TdxWorkDotCom extends LightningElement {

    tdxLogoUrl = TDX_LOGO;
    
    // Work.com LMS Reactive Properties
    globalLocationName;
    globalLocationId;
    subscription;


    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToChannel();
    }

    disconnectedCallback() {
        if (this.subscription) {
            unsubscribe(this.subscription);
        }
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
            console.log('tdxTester.js - globalLocationName: ' + this.globalLocationName);
            this.globalLocationId = message.EventPayload.locationId;
            console.log('tdxTester.js - globalLocationId: ' + this.globalLocationId);
            break;
        }
        default: {
        break;
        }
    } 
}


}