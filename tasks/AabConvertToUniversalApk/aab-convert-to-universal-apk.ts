import task = require('azure-pipelines-task-lib');
import path = require('path');
import * as os from 'os';
var unzip = require('unzip-stream');
var fs = require('fs-extra'); 

const BUNDLETOOL_ENV_PATH = 'bundletoolpath';

async function run() {
    try {
        const bundletoolPath = task.getVariable(BUNDLETOOL_ENV_PATH) || process.env[BUNDLETOOL_ENV_PATH] || task.getPathInput('bundletoolJarPath', true);
        if (!bundletoolPath) {
            task.error(`Bundletool is not found, the ${BUNDLETOOL_ENV_PATH} environment variable must be set before using this task (You can use 'InstallBundletool' task). Also you can use the property bundletoolJarPath of this task to give your own bundletool jar path.`);
            task.setResult(task.TaskResult.Failed, `Bundletool is not defined.`);
            process.exit(1);
        }

        const aabFilePath = task.getPathInput('aabFilePath', true);

        // Resolve files for the specified value or pattern, should have only one match
        const filesToConvert: string[] = task.findMatch(null, aabFilePath);

        // Fail if no matching files were found
        if (!filesToConvert || filesToConvert.length === 0) {
            task.error(`No matching files for this path: ${aabFilePath} found: ${filesToConvert}`);
            process.exit(0);
        } else if (filesToConvert.length > 1) {
            task.error(`Too much files matching the pattern specified: ${aabFilePath} found: ${filesToConvert}`);
            process.exit(0);
        }

        const keystoreFilePath = task.getPathInput('keystoreFilePath', true);

        const keystorePassword: string = task.getInput('keystorePassword', true);
        const keystoreAlias: string = task.getInput('keystoreAlias', true);
        const keystoreAliasPassword: string = task.getInput('keystoreAliasPassword', true);

        const outputFolder: string = task.getPathInput('outputFolder');

        const workingDirectory = task.cwd();
        let outputApksPath = path.join(workingDirectory, 'extract.apks');

        let java: string = task.which('java', true);
        let args = ['-jar', bundletoolPath, 'build-apks', `--bundle=${filesToConvert[0]}`, '--mode=universal', `--output=${outputApksPath}`, `--ks=${keystoreFilePath}`, `--ks-pass=pass:${keystorePassword}`, `--ks-key-alias=${keystoreAlias}`, `--key-pass=pass:${keystoreAliasPassword}`, '--overwrite'];
        let javaResult = task.execSync(java, args);

        if (javaResult.code !== 0) {
            task.error(`An error occured when running bundletool: ${bundletoolPath} jar using java, verify java is correctly install in your agent.`);
            if (javaResult.error != null) {
                task.error(`${javaResult.error.name} ${javaResult.error.message}`);
                task.error(javaResult.error.stack);
            }

            process.exit(1);
        }

       
        let arch: string = findArchitecture();

        if (arch == 'windows') {
            unzipFile(outputApksPath, outputFolder);
        }
        else {
            let unzipCommand: string = task.which('unzip', true);
            task.execSync(unzipCommand, [outputApksPath, '-d', outputFolder]);
        }
       

        task.setResult(task.TaskResult.Succeeded, `The universal apk was succesfully generated here: ${outputFolder}`);
    }
    catch (err) {
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

function findArchitecture() {
    if (os.platform() === 'darwin') {
        return "macos";
    }
    else if (os.platform() === 'linux') {
        return "linux";
    } else {
        return "windows";
    }
}

function unzipFile( source:string,output:string) {
    return fs.createReadStream(source).pipe(unzip.Extract({ path: output }));
}

run();