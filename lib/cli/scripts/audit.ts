#!/usr/bin/env node

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

import * as shell from 'shelljs';
import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs';
import * as program from 'commander';

let options;

export default function main(_args: string[], workingDir: string) {
    program
        .version('0.2.0')
        .description('Generate an audit report')
        .usage('audit [options]')
        .requiredOption('-p, --package <path>', 'Path to package file (default: package.json in working directory)')
        .requiredOption('-d, --outDir <dir>', 'Ouput directory (default: working directory)')
        .parse(process.argv);

    options = program.opts();

    let packagePath = path.resolve(workingDir, 'package.json');

    if (options.package) {
        packagePath = path.resolve(options.package);
    }

    if (!fs.existsSync(packagePath)) {
        console.error('The package.json file was not found');
        process.exit(1);
    }

    const templatePath = path.resolve(__dirname, '../templates/auditPage.ejs');
    if (!fs.existsSync(templatePath)) {
        console.error(`Cannot find the report template: ${templatePath}`);
        process.exit(1);
    }

    return new Promise((resolve, reject) => {
        // tslint:disable-next-line: no-console
        console.log(`Running audit on ${packagePath}`);

        const packageJson = JSON.parse(fs.readFileSync(packagePath).toString());
        const cmd = 'npm audit --json';
        const jsonAudit = JSON.parse(shell.exec(cmd, { silent: true }));

        ejs.renderFile(templatePath, {
            jsonAudit,
            projVersion: packageJson.version,
            projName: packageJson.name
        }, {}, (err: any, mdText: string) => {
            if (err) {
                console.error(err);
                reject(1);
            } else {
                const outputPath = path.resolve(options.outDir || workingDir);
                const outputFile = path.join(outputPath, `audit-info-${packageJson.version}.md`);

                fs.writeFileSync(outputFile, mdText);

                // tslint:disable-next-line: no-console
                console.log(`Report saved as ${outputFile}`);
                resolve(0);
            }
        });
    });
}
