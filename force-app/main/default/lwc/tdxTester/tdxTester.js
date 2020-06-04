/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, api, track, wire } from 'lwc';
import { classSet } from 'c/utils';
import { isNarrow, isBase } from './utils';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import SF_COMMAND_CENTER_MSG_CHANNEL from '@salesforce/messageChannel/lightning__CommandCenterMessageChannel';
import TDX_LOGO from '@salesforce/resourceUrl/tdxlogo';

export default class TdxTester extends LightningElement {
    
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


   

    disconnectedCallback() {
        if (this.subscription) {
            unsubscribe(this.subscription);
        }
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