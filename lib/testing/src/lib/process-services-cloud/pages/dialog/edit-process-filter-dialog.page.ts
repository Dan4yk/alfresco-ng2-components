/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Locator, browser, by, element } from 'protractor';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';
import { BrowserActions } from '../../../core/utils/browser-actions';

export class EditProcessFilterDialogPage {

    componentElement = element(by.css('adf-cloud-process-filter-dialog-cloud'));
    title = element(by.id('adf-process-filter-dialog-title'));
    filterNameInput = element(by.id('adf-filter-name-id'));
    saveButtonLocator: Locator = by.id('adf-save-button-id');
    cancelButtonLocator: Locator = by.id('adf-cancel-button-id');

    async clickOnSaveButton(): Promise<void> {
        const saveButton = this.componentElement.element(this.saveButtonLocator);
        await BrowserActions.click(saveButton);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.componentElement);
        await browser.driver.sleep(1000);
    }

    async checkSaveButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.componentElement.element(this.saveButtonLocator));
        return this.componentElement.element(this.saveButtonLocator).isEnabled();
    }

    async clickOnCancelButton(): Promise<void> {
        const cancelButton = this.componentElement.element(this.cancelButtonLocator);
        await BrowserActions.click(cancelButton);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.componentElement);
    }

    async checkCancelButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.componentElement.element(this.cancelButtonLocator));
        return this.componentElement.element(this.cancelButtonLocator).isEnabled();
    }

    async getFilterName(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filterNameInput);
        return this.filterNameInput.getAttribute('value');
    }

    async setFilterName(filterName: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.filterNameInput, filterName);
    }

    async getTitle(): Promise<string> {
        return BrowserActions.getText(this.title);
    }

    async clearFilterName() {
        await BrowserActions.clearWithBackSpace(this.filterNameInput);
    }

}
