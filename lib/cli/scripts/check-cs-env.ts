const alfrescoApi = require('@alfresco/js-api');
const program = require('commander');
const path = require('path');
const fs = require('fs');

const MAX_RETRY = 3;
const TIMEOUT = 20000;
let counter = 0;

export default async function main(_args: string[]) {

    program
        .version('0.1.0')
        .description('Check Content service is up ')
        .usage('check-cs-env [options]')
        .option('--host [type]', 'Remote environment host adf.lab.com ')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .option('-t, --time [type]', 'time ')
        .option('-r, --retry [type]', 'retry ')
        .parse(process.argv);


    await checkEnv();
    await checkDiskSpaceFullEnv();
}

async function checkEnv() {
    try {
        const alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility({
            provider: 'ECM',
            hostEcm: program.host
        });

        await alfrescoJsApi.login(program.username, program.password);
    } catch (error) {
        console.log('Login error environment down or inaccessible');
        counter++;
        const retry = program.retry || MAX_RETRY;
        const time = program.time || TIMEOUT;
        if (retry === counter) {
            console.log('Give up');
            process.exit(1);
        } else {
            console.log(`Retry in 1 minute attempt N ${counter}`, error);
            sleep(time);
            checkEnv();
        }
    }
}

async function checkDiskSpaceFullEnv() {
    console.log(`Start Check disk full space`);

    try {

        const alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility({
            provider: 'ECM',
            hostEcm: program.host
        });

        await alfrescoJsApi.login(program.username, program.password);

        let folder;

        try {
            folder = await alfrescoJsApi.nodes.addNode('-my-', {
                'name': `try-env`,
                'relativePath': `Builds`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });

        } catch (error) {
            folder = await alfrescoJsApi.nodes.getNode('-my-', {
                'relativePath': `Builds/try-env`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });
        }
        let pathFile = path.join(__dirname, '../', 'README.md');

        let file = fs.createReadStream(pathFile);

        let uploadedFile = await alfrescoJsApi.upload.uploadFile(
            file,
            '',
            folder.entry.id,
            null,
            {
                'name': 'README.md',
                'nodeType': 'cm:content',
                'autoRename': true
            }
        );

        alfrescoJsApi.node.deleteNode(uploadedFile.entry.id, {permanent: true});
    } catch (error) {
        counter++;

        const retry = program.retry || MAX_RETRY;
        const time = program.time || TIMEOUT;
        if (retry === counter) {
            console.log('=============================================================');
            console.log('================ Not able to upload a file ==================');
            console.log('================ Possible cause CS is full ==================');
            console.log('=============================================================');
            process.exit(1);
        } else {
            console.log(`Retry N ${counter} ${error?.error?.status}`);
            sleep(time);
            checkDiskSpaceFullEnv();
        }

    }

}

function sleep(delay) {
    console.log(`Sleep ${delay}`);
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay) ;
}
