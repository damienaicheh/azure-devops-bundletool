import task = require('azure-pipelines-task-lib');

const BUNDLETOOL_ENV_PATH = 'bundletoolpath';

async function run() {
    try {
        const bundletoolPath = task.getVariable(BUNDLETOOL_ENV_PATH) || process.env[BUNDLETOOL_ENV_PATH];
        if (!bundletoolPath) {
            task.error(`Bundletool is not found, the ${BUNDLETOOL_ENV_PATH} environment variable must be set before using this task (You can use 'InstallBundletool' task).`)
            task.setResult(task.TaskResult.Failed, `Bundletool is not defined.`);
            process.exit(1);
        }

        const bundletoolArguments = task.getPathInput('bundletoolArguments', true);

        let java: string = task.which('java', true);
        let args = ['-jar', bundletoolPath].concat(bundletoolArguments.split(' '));
        let javaResult = task.execSync(java, args);

        if (javaResult.code !== 0) {
            task.error(`An error occured when running bundletool: ${bundletoolPath} jar using java, verify java is correctly install in your agent.`);
            if (javaResult.error != null) {
                task.error(`${javaResult.error.name} ${javaResult.error.message}`);
                task.error(javaResult.error.stack);
            }

            process.exit(1);
        }

        task.setResult(task.TaskResult.Succeeded, `Task finished.`);
    }
    catch (err) {
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

run();