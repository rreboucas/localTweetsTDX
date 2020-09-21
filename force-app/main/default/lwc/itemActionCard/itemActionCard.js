/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, api, track } from 'lwc';
import { classSet } from 'c/utils';
import { isNarrow, isBase } from './utils';
import FORM_FACTOR from '@salesforce/client/formFactor';
import { NavigationMixin } from 'lightning/navigation';
import TWT_BLUE_LOGO from '@salesforce/resourceUrl/TwitterBlue';

export default class ItemActionCard extends NavigationMixin(LightningElement) {
    @api createdat;
    @api twitterhandle;
    @api textbody;
    @api locationid;
    @api masterlocationid;

    twitterLogoUrl = TWT_BLUE_LOGO;

    fullTitle;
    fullCompany;
    whichDate;
    companyId;
    isMobile = false;
    isTablet = false;
    isDesktop = false;
    formfactorName;
    rowIconName;
    computedChildClassName;
    computedHeaderIconSize;
    computedIconSize;
    computedYearFormat;
    computedMonthFormat;
    computedDayFormat;
    computedWeekDayFormat;
    computedPckgIconPadding;
    computedAcctIconPadding;
    computedClockIconPadding;
    screenWidth;
    locationIdToUse;

    @track privateVariant = 'base';

    connectedCallback() {
        this.screenWidth = window.screen.width;
        console.log('ItemActionCard.js - screenWidth: ' + this.screenWidth);

        
        if (this.locationid !== null)
            this.locationIdToUse = this.locationid
        else
            this.locationIdToUse = this.masterlocationid;

        console.log('ItemActionCard.js - locationIdToUse: ' + this.locationIdToUse);

        this.createdat = this.createdat.slice(0, 19);
        this.twitterhandle = '@' + this.twitterhandle;
        this.computedPckgIconPadding = 'slds-p-top_xx-small';
        this.computedAcctIconPadding = 'slds-p-top_xx-small';
        this.computedClockIconPadding = 'slds-p-top_xx-small';
        console.log('ItemActionCard.js - FORM_FACTOR: ' + FORM_FACTOR);
        console.log('ItemActionCard.js - locationid: ' + this.locationid);
        console.log('ItemActionCard.js - flexipageRegionWidth: ' + this.flexipageRegionWidth);

         // Check formfactor being used to access this LWC
      switch(FORM_FACTOR) {
        case 'Large':
            this.isDesktop = true;
            this.formfactorName = 'Desktop';
            this.computedChildClassName = 'desktop';
            this.computedHeaderIconSize = 'small';
            this.computedIconSize = 'x-small';
            this.computedYearFormat = '2-digit';
            this.computedMonthFormat = 'short';
            this.computedDayFormat = '2-digit';
            this.computedWeekDayFormat = 'long';
            
            if (this.screenWidth <= 1440){
                this.computedYearFormat = 'numeric';
                this.computedMonthFormat = 'numeric';
                this.computedDayFormat = 'numeric';
                this.computedWeekDayFormat = 'narrow';
                this.title = this.title.substring(0, 22) + '...';
            }
          break;
        case 'Medium':
            this.isTablet = true;
            this.formfactorName = 'Tablet';
            this.computedChildClassName = 'desktop';
            this.computedHeaderIconSize = 'small';
            this.computedIconSize = 'xx-small';
            this.computedYearFormat = '2-digit';
            this.computedMonthFormat = 'short';
            this.computedDayFormat = '2-digit';
            this.computedWeekDayFormat = 'long';
          break;
        case 'Small':
            this.isMobile = true;
            this.formfactorName = 'Phone';
            this.computedChildClassName = 'mobile';
            this.computedHeaderIconSize = 'x-small';
            this.computedPckgIconPadding = 'slds-p-top_small';
            this.computedAcctIconPadding = 'slds-p-top_small';
            this.computedClockIconPadding = 'slds-p-top_xx-small';
            this.computedIconSize = 'xx-small';
            this.computedYearFormat = 'numeric';
            this.computedMonthFormat = 'numeric';
            this.computedDayFormat = 'numeric';
            this.computedWeekDayFormat = 'narrow';
        break;
        default:
      }

    }

    createTaskHandler(event) {
        event.preventDefault();
        console.log('ItemActionCard.js - createTaskHandler ');
        

        console.log('ItemActionCard.js - locationIdToUse: ' + this.locationIdToUse);
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Task',
                actionName: 'new'
            },
            state : {
                nooverride: '1',
                defaultFieldValues:"Subject=Twitter Announcement: " + this.textbody + ",wkcc__ActionCategory__c=Location Alert,wkcc__Location__c=" + this.locationIdToUse
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