import task = require('azure-pipelines-task-lib/task');
import path = require('path');
import tool = require('azure-pipelines-tool-lib/tool');
import * as os from 'os';

const BUNDLETOOL_NAME = 'bundletool';
const BUNDLETOOL_ENV_PATH = 'bundletoolpath';
const GITHUB_API_URL = 'https://api.github.com/repos/google/bundletool/releases/latest';

async function run() {
    try {

        // Getting current platform identifier
        let arch = findArchitecture();

        const githubUsername = task.getInput('username', false);
        const githubPersonalAccesToken = task.getInput('personalAccessToken', false);

        // Get jar url and version
        let curl: string = task.which('curl', true);
        var args = ['-s', GITHUB_API_URL];

        if (githubUsername && githubPersonalAccesToken) {
            args.unshift('-u', `${githubUsername}:${githubPersonalAccesToken}`);
        }

        let curlGithubResult = task.execSync(curl, args);

        let res = JSON.parse(curlGithubResult.stdout);
        let versionTag = res['tag_name'];
        let bundletoolJarUrl = res['assets'][0]['browser_download_url'];
        let bundletoolJarName = res['assets'][0]['name'];
        var bundletoolPath = tool.findLocalTool(BUNDLETOOL_NAME, versionTag, arch);
        let agentTempDirectory = task.getVariable("Agent.TempDirectory");
        let downloadDirectory = path.join(agentTempDirectory, BUNDLETOOL_NAME, versionTag, arch);
        task.mkdirP(downloadDirectory);
        let outputDownloadedFile: string = path.join(downloadDirectory, bundletoolJarName);

        // Check if bundletool already available
        if (!bundletoolPath) {
            let curlResult = await downloading(bundletoolJarName, bundletoolJarUrl, outputDownloadedFile);

            if (curlResult.code !== 0) {
                if (curlResult.error != null) {
                    task.error(`${curlResult.error}`);
                }
                task.error(`An error occured when downloading bundletool from this url, please verify that the url exist by copy-paste it into your favorite navigator: ${bundletoolJarUrl}`);

                process.exit(1);
            }

            const workingDirectory = task.cwd();
            const toolPath = path.join(workingDirectory, bundletoolJarName);

            tool.cacheDir(toolPath, BUNDLETOOL_NAME, versionTag, arch);

            let cacheDir = await tool.cacheDir(downloadDirectory, BUNDLETOOL_NAME, versionTag, arch);
            const toolPath = path.join(cacheDir, bundletoolJarName);

            task.setVariable(BUNDLETOOL_ENV_PATH, toolPath);

        } else {
            const toolPath = path.join(bundletoolPath, bundletoolJarName);
            task.setVariable(BUNDLETOOL_ENV_PATH, toolPath);
        }

        task.setResult(task.TaskResult.Succeeded, "Bundletool is ready to use.");
    }
    catch (err) {
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

async function downloading(fileName: string, url: string, downloadedFile:string) {
    const curlIsSilent: boolean = task.getBoolInput('curlIsSilent', false);
    const ignoreSsl = task.getBoolInput('ignorSslError', false);
    let curl: string = task.which('curl', true);
    var args = ['--location', /*'-o', fileName,*/ url];
    if (ignoreSsl && ignoreSsl == true) {
        args.push('--ssl-no-revoke');
    }
    if (curlIsSilent && curlIsSilent == true) {
        args.push('--silent');
    }
    if (downloadedFile) {
        args.push('--output', downloadedFile);
    }
    
    let curlResult = task.execSync(curl, args);
    return curlResult;
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

run();