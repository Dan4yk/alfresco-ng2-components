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

import { Locator, by, element, ElementFinder } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class ProcessFiltersCloudComponentPage {

    filter: ElementFinder;
    filterIcon: Locator = by.css('adf-icon[data-automation-id="adf-filter-icon"]');

    processFilters = element(by.css("mat-expansion-panel[data-automation-id='Process Filters']"));

    activeFilter = element(by.css('.adf-active [data-automation-id="adf-filter-label"]'));
    processFiltersList = element(by.css('adf-cloud-process-filters'));

    async checkProcessFilterIsDisplayed(filterName: string): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async clickProcessFilter(filterName: string): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName(filterName);
        await BrowserActions.click(this.filter);
    }

    async clickAllProcessesFilter(): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName('all-processes');
        await BrowserActions.click(this.filter);
    }

    async clickCompletedProcessesFilter(): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName('completed-processes');
        await BrowserActions.click(this.filter);
    }

    async clickRunningProcessesFilter(): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName('running-processes');
        await BrowserActions.click(this.filter);
    }

    async checkAllProcessesFilterIsDisplayed(): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName('all-processes');
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async checkCompletedProcessesFilterIsDisplayed(): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName('completed-processes');
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async checkRunningProcessesFilterIsDisplayed(): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName('running-processes');
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async checkProcessFilterNotDisplayed(filterName: string): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter);
    }

    async clickOnProcessFilters(): Promise<void> {
        await BrowserActions.click(this.processFilters);
    }

    async getActiveFilterName(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.activeFilter);
        return BrowserActions.getText(this.activeFilter);
    }

    async isProcessFiltersListVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processFiltersList);
    }

    getProcessFilterLocatorByFilterName(filterName: string): ElementFinder {
        return element(by.css(`button[data-automation-id="${filterName}_filter"]`));
    }
}
