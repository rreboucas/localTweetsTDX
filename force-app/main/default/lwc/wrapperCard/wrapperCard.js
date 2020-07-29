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
import TWT_WHITE_LOGO from '@salesforce/resourceUrl/TwitterWhite';

export default class WrapperCard extends NavigationMixin(LightningElement) {
    @api title;
    @api tweets;
    @track privateVariant = 'base';
    twitterLogoUrl = TWT_WHITE_LOGO;
    headerClassName;
    screenWidth;
    computedChildClassName;

    connectedCallback() {
        this.screenWidth = window.screen.width;
        console.log('WrapperCard.js - screenWidth: ' + this.screenWidth);

        this.computedChildClassName = 'desktopLarge';
        if (this.screenWidth <= 1440)
            this.computedChildClassName = 'desktopSmall';
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