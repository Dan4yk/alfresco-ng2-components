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

import { browser, Locator, by, element, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../utils/public-api';
import { DropdownPage } from '../material/dropdown.page';

export class FormFields {

    formContent = element(by.css('adf-form-renderer'));
    refreshButton = element(by.css('div[class*="form-reload-button"] mat-icon'));
    saveButton = element(by.cssContainingText('mat-card-actions[class*="adf-for"] span', 'SAVE'));
    valueLocator: Locator = by.css('input');
    labelLocator: Locator = by.css('label');
    noFormMessage = element(by.css('.adf-empty-content__title'));
    noFormMessageStandaloneTask = element(by.css('adf-task-standalone #adf-no-form-message'));
    noFormTemplate = element(by.css('adf-empty-content'));
    completedTaskNoFormMessage = element(by.css('div[id*="completed-form-message"] p'));
    completedStandaloneTaskNoFormMessage = element(by.css('adf-task-standalone #adf-completed-form-message'));
    attachFormButton = element(by.id('adf-attach-form-attach-button'));
    completeButton = element(by.id('adf-form-complete'));
    completeNoFormButton = element(by.id('adf-no-form-complete-button'));
    cancelButton = element(by.id('adf-no-form-cancel-button'));
    errorMessage: Locator = by.css('.adf-error-text-container .adf-error-text');

    selectFormDropdown = new DropdownPage(element.all(by.css('.adf-attach-form .mat-select-arrow')).first());

    async setFieldValue(locator, field, value: string): Promise<void> {
        const fieldElement = element(locator(field));
        await BrowserActions.clearSendKeys(fieldElement, value);
    }

    async checkWidgetIsVisible(fieldId: string): Promise<void> {
        const fieldElement = element.all(by.css(`adf-form-field div[id='field-${fieldId}-container']`)).first();
        await BrowserVisibility.waitUntilElementIsVisible(fieldElement);
    }

    async checkWidgetIsClickable(fieldId: string): Promise<void> {
        const fieldElement = element.all(by.css(`adf-form-field div[id='field-${fieldId}-container']`)).first();
        await BrowserVisibility.waitUntilElementIsClickable(fieldElement);
    }

    async checkWidgetIsHidden(fieldId: string): Promise<void> {
        const hiddenElement = element(by.css(`adf-form-field div[id='field-${fieldId}-container'][hidden]`));
        await BrowserVisibility.waitUntilElementIsVisible(hiddenElement);
    }

    async getWidget(fieldId: string): Promise<ElementFinder> {
        return element(by.css(`adf-form-field div[id='field-${fieldId}-container']`));
    }

    async getFieldValue(fieldId: string, valueLocatorParam?: any): Promise<string> {
        const valueWidget = await (await this.getWidget(fieldId)).element(valueLocatorParam || this.valueLocator);
        await BrowserVisibility.waitUntilElementIsVisible(valueWidget);

        return BrowserActions.getInputValue(valueWidget);
    }

    async getFieldLabel(fieldId: string, labelLocatorParam?: any) {
        const label = await (await this.getWidget(fieldId)).all(labelLocatorParam || this.labelLocator).first();
        return BrowserActions.getText(label);
    }

    async getFieldErrorMessage(fieldId: string): Promise<string> {
        const error = await (await this.getWidget(fieldId)).element(this.errorMessage);
        return BrowserActions.getText(error);
    }

    async getFieldText(fieldId: string, labelLocatorParam?: any) {
        const label = await (await this.getWidget(fieldId)).element(labelLocatorParam || this.labelLocator);
        return BrowserActions.getText(label);
    }

    async getFieldPlaceHolder(fieldId: string, locator = 'input'): Promise<string> {
        const placeHolderLocator = element(by.css(`${locator}#${fieldId}`));
        await BrowserVisibility.waitUntilElementIsVisible(placeHolderLocator);
        return placeHolderLocator.getAttribute('data-placeholder');
    }

    async checkFieldValue(locator, field, val): Promise<void> {
        await BrowserVisibility.waitUntilElementHasValue(element(locator(field)), val);
    }

    async refreshForm(): Promise<void> {
        await BrowserActions.click(this.refreshButton);
        await browser.sleep(500);
    }

    async saveForm(): Promise<void> {
        await BrowserActions.click(this.saveButton);
    }

    async isNoFormTemplateDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(
                this.noFormTemplate
            );
            return true;
        } catch (error) {
            return false;
        }
    }

    async noFormIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.formContent);
    }

    async checkFormIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.formContent);
    }

    async getNoFormMessage(): Promise<string> {
        return BrowserActions.getText(this.noFormMessage);
    }

    async getNoFormMessageStandaloneTask(): Promise<string> {
        return BrowserActions.getText(this.noFormMessageStandaloneTask);
    }

    async getCompletedTaskNoFormMessage(): Promise<string> {
        return BrowserActions.getText(this.completedTaskNoFormMessage);
    }

    async getCompletedStandaloneTaskNoFormMessage(): Promise<string> {
        return BrowserActions.getText(this.completedStandaloneTaskNoFormMessage);
    }

    async isStandaloneTaskNoFormMessageDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.noFormMessageStandaloneTask);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isAttachFormButtonDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.attachFormButton);
            return true;
        } catch (error) {
            return false;
        }
    }

    async clickOnAttachFormButton(): Promise<void> {
        await BrowserActions.click(this.attachFormButton);
    }

    async selectForm(formName: string): Promise<void> {
        await this.selectFormDropdown.selectDropdownOption(formName);
    }

    async selectFormFromDropDown(formName: string): Promise<void> {
        const formNameElement = element(by.cssContainingText('span', formName));
        await BrowserActions.click(formNameElement);
    }

    async checkWidgetIsReadOnlyMode(fieldId: string): Promise<ElementFinder> {
        const widget = element(by.css(`adf-form-field #field-${fieldId}-container .adf-readonly`));
        await BrowserVisibility.waitUntilElementIsVisible(widget);
        return widget;
    }

    async isFormFieldEnabled(formFieldId: string): Promise<boolean> {
        return element(by.id(`${formFieldId}`)).isEnabled();
    }

    async completeForm(): Promise<void> {
        await BrowserActions.click(this.completeButton);
    }

    async completeNoFormTask(): Promise<void> {
        await BrowserActions.click(this.completeNoFormButton);
    }

    async clickCancelButton(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async setValueInInputById(fieldId: string, value: string): Promise<void> {
        const input = element(by.id(fieldId));
        await BrowserActions.clearSendKeys(input, value);
    }

    async isCompleteButtonDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isCompleteNoFormButtonDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.completeNoFormButton);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isCompleteFormButtonEnabled(): Promise<boolean> {
        return this.completeButton.isEnabled();
    }

    async isCompleteNoFormButtonEnabled(): Promise<boolean> {
        return this.completeNoFormButton.isEnabled();
    }

    async isCancelButtonDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isCancelButtonEnabled(): Promise<boolean> {
        return this.cancelButton.isEnabled();
    }

}
