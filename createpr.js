#!/usr/bin/env node

'use strict';

var d = require('debug')('createpr');
var _ = require('lodash');
var shelljs = require('shelljs');
var request = require('request');
var util = require('util');
var postRequest = util.promisify(request.post);



process.on('unhandledRejection', function(reason, p) {
    console.log(reason);
    console.log(p);
    console.log('Encountered unhandled promise rejection: ' + reason);
    console.log('- Stack: ' + reason.stack);
    console.log('- Error: ' + JSON.stringify(reason, undefined, 4));
});



// Requires:
// 1. Create a github personal access token and set it in the environment GIT_TOKEN=username:GIT_PERSONAL_ACCESS_TOKEN
// 2. Must be in the repo and branch with pushed commits
run(process.argv);

async function run(argv) {

    let repository = shelljs.exec('git remote -v | grep "(push)" | cut -d"/" -f2 | cut -d"." -f1', { silent: true }).stdout;
    let branch = shelljs.exec('git rev-parse --abbrev-ref HEAD', { silent: true }).stdout;
    let title = shelljs.exec('git log --pretty=format:"%s" -n1', { silent: true }).stdout;

    let pullRequest = await post('https://github.com/api/v3/repos/velox/' + repository + '/pulls', process.env.GIT_TOKEN, {
        title: title,
        head: branch,
        base: 'master'
    });

    if (pullRequest.statusCode >= 300) {
        console.error('Error: ');
        console.error(JSON.stringify(pullRequest, null, 4));
        console.error(' ');
        console.error('Typical problems:');
        console.error('- Verify that you have pushed your branch');
        console.error('- Run "git rev-parse --abbrev-ref HEAD" to verify you only have one (push) target');
        process.exit(1);
    }
}


async function post(uri, credentials, body) {

    let response = await postRequest({
        uri: uri,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        rejectUnauthorized: true,
        requestCert: true,
        auth: setCredentials(credentials),
        body: JSON.stringify(body)
    });

    if (response.body) {
        try {
            response.body = JSON.parse(response.body, null, 4);
        } catch (err) {
            console.log(response.body);
        }
    }

    return response;
}


function setCredentials(credentials) {
    if (credentials.indexOf(':') > 0) {
        let userAndPassword = _.split(credentials, ':');
        return {
            user: userAndPassword[0],
            pass: userAndPassword[1]
        };
    }

    return {
        bearer: credentials
    };
}
