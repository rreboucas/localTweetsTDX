import { LightningElement, wire, api, track } from 'lwc';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import getTweets from '@salesforce/apex/localTweetsServerController.getOfficialsTweets';
import SF_COMMAND_CENTER_MSG_CHANNEL from '@salesforce/messageChannel/lightning__CommandCenterMessageChannel';

import { classSet } from 'c/utils';
import { isNarrow, isBase } from './utils';
import FORM_FACTOR from '@salesforce/client/formFactor';
import { NavigationMixin } from 'lightning/navigation';
import TWT_WHITE_LOGO from '@salesforce/resourceUrl/TwitterWhite';

export default class LocalTweets extends NavigationMixin(LightningElement) {

    @api title;
    globalLocationName;
    globalLocationId;
    subscription;
    latestCityState;
    tweetsData;
    error;
    isLoading = false;

    locationid;
    privateVariant = 'base';
    twitterLogoUrl = TWT_WHITE_LOGO;
    headerClassName;
    screenWidth;
    computedChildClassName;
    dataFound;

    @wire(MessageContext)
    messageContext;
    


    
    @wire(getTweets, { locationId: '$globalLocationId' })
    wiredTweets({ error, data }) {
        this.isLoading = true;
        if (data) {
            this.tweetsData = data;
            console.log('localTweets.js - tweetsData: ' + this.tweetsData);
            this.error = undefined;
            this.isLoading = false;
            if (this.tweetsData.length === 0)
            {
                this.dataFound = false;
                console.log('localTweets.js - this.dataFound: ' + this.dataFound);
            }
            else
            this.dataFound = true;
                
        } else if (error) {
            
            this.error = error;
        }
    }
   

    connectedCallback() {
        
        // IMPORTANT: Subscribe to Command Center Location Message Channel 
        this.subscribeToChannel();
        
        this.showFooter = false;
        this.screenWidth = window.screen.width;
        console.log('WrapperCard.js - screenWidth: ' + this.screenWidth);

        this.computedChildClassName = 'desktopLarge';
        if (this.screenWidth <= 1440)
            this.computedChildClassName = 'desktopSmall';

        if (this.tweetsData === null)
            this.dataFound = false;
        else
            this.dataFound = true;
       
       
        console.log('LocalTweets.js - this.tweetsData: ' + this.tweetsData);
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

    createTweeterHandle(event) {
        event.preventDefault();
        console.log('localTweets.js - createTweeterHandle ');
        

        console.log('localTweets.js - globalLocationId: ' + this.globalLocationId);
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Twitter_Handle__c',
                actionName: 'new'
            },
            state : {
                nooverride: '1',
                defaultFieldValues:"Location__c=" + this.globalLocationId
            }
        });
    }

    set variant(value) {
        if (isNarrow(value) || isBase(value)) {
            this.privateVariant = value;
        } else {
            this.privateVariant = 'base';
        }
    }

    @api get variant() {
        return this.privateVariant;
    }

    @track showFooter = true;
    renderedCallback() {
        if (this.footerSlot) {
            this.showFooter = this.footerSlot.assignedElements().length !== 0;
        }
    }

    get footerSlot() {
        return this.template.querySelector('slot[name=footer]');
    }

    get computedWrapperClassNames() {
        return classSet('slds-card').add({
            'slds-card_narrow': isNarrow(this.privateVariant)
        });
    }

    get hasIcon() {
        return !!this.iconName;
    }

    get hasStringTitle() {
        return !!this.title;
    }
    

}