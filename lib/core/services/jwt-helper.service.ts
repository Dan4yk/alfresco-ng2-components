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

import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class JwtHelperService {

    static USER_NAME = 'name';
    static FAMILY_NAME = 'family_name';
    static GIVEN_NAME = 'given_name';
    static USER_EMAIL = 'email';
    static USER_ACCESS_TOKEN = 'access_token';
    static REALM_ACCESS = 'realm_access';
    static RESOURCE_ACCESS = 'resource_access';
    static USER_PREFERRED_USERNAME = 'preferred_username';

    constructor(private storageService: StorageService) {
    }

    /**
     * Decodes a JSON web token into a JS object.
     * @param token Token in encoded form
     * @returns Decoded token data object
     */
    decodeToken(token): Object {
        const parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }

        return JSON.parse(decoded);
    }

    private urlBase64Decode(token): string {
        let output = token.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw new Error('Illegal base64url string!');
            }
        }
        return decodeURIComponent(escape(window.atob(output)));
    }

    /**
     * Gets a named value from the user access token.
     * @param key Key name of the field to retrieve
     * @returns Value from the token
     */
    getValueFromLocalAccessToken<T>(key: string): T {
        return this.getValueFromToken(this.getAccessToken(), key);
    }

    /**
     * Gets access token
     * @returns access token
     */
    getAccessToken(): string {
        return this.storageService.getItem(JwtHelperService.USER_ACCESS_TOKEN);
    }

    /**
     * Gets a named value from the user access token.
     * @param accessToken your SSO access token where the value is encode
     * @param key Key name of the field to retrieve
     * @returns Value from the token
     */
    getValueFromToken<T>(accessToken: string, key: string): T {
        let value;
        if (accessToken) {
            const tokenPayload = this.decodeToken(accessToken);
            value = tokenPayload[key];
        }
        return <T> value;
    }

    /**
     * Gets realm roles.
     * @returns Array of realm roles
     */
    getRealmRoles(): string[] {
        const access = this.getValueFromLocalAccessToken<any>(JwtHelperService.REALM_ACCESS);
        return access ? access['roles'] : [];
    }

    /**
     * Gets Client roles.
     * @returns Array of client roles
     */
    getClientRoles(clientName: string): string[] {
        const clientRole = this.getValueFromLocalAccessToken<any>(JwtHelperService.RESOURCE_ACCESS)[clientName];
        return clientRole ? clientRole['roles'] : [];
    }

    /**
     * Checks for single realm role.
     * @param role Role name to check
     * @returns True if it contains given role, false otherwise
     */
    hasRealmRole(role: string): boolean {
        let hasRole = false;
        if (this.getAccessToken()) {
            const realmRoles = this.getRealmRoles();
            hasRole = realmRoles.some((currentRole) => {
                return currentRole === role;
            });
        }
        return hasRole;
    }

    /**
     * Checks for realm roles.
     * @param rolesToCheck List of role names to check
     * @returns True if it contains at least one of the given roles, false otherwise
     */
    hasRealmRoles(rolesToCheck: string []): boolean {
        return rolesToCheck.some((currentRole) => {
            return this.hasRealmRole(currentRole);
        });
    }

    /**
     * Checks for client roles.
     * @param clientName Targeted client name
     * @param rolesToCheck List of role names to check
     * @returns True if it contains at least one of the given roles, false otherwise
     */
    hasRealmRolesForClientRole(clientName: string, rolesToCheck: string []): boolean {
        return rolesToCheck.some((currentRole) => {
            return this.hasClientRole(clientName, currentRole);
        });
    }

    /**
     * Checks for client role.
     * @param clientName Targeted client name
     * @param role Role name to check
     * @returns True if it contains given role, false otherwise
     */
    hasClientRole(clientName: string, role: string): boolean {
        let hasRole = false;
        if (this.getAccessToken()) {
            const clientRoles = this.getClientRoles(clientName);
            hasRole = clientRoles.some((currentRole) => {
                return currentRole === role;
            });
        }
        return hasRole;
    }
}
