"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var task = require("azure-pipelines-task-lib");
var path = require("path");
var BUNDLETOOL_ENV_PATH = 'bundletoolpath';
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var bundletoolPath, aabFilePath, filesToConvert, keystoreFilePath, keystorePassword, keystoreAlias, keystoreAliasPassword, outputFolder, workingDirectory, outputApksPath, java, args, javaResult, unzip;
        return __generator(this, function (_a) {
            try {
                bundletoolPath = task.getVariable(BUNDLETOOL_ENV_PATH) || process.env[BUNDLETOOL_ENV_PATH] || task.getPathInput('bundletoolJarPath', true);
                if (!bundletoolPath) {
                    task.error("Bundletool is not found, the " + BUNDLETOOL_ENV_PATH + " environment variable must be set before using this task (You can use 'InstallBundletool' task). Also you can use the property bundletoolJarPath of this task to give your own bundletool jar path.");
                    task.setResult(task.TaskResult.Failed, "Bundletool is not defined.");
                    process.exit(1);
                }
                aabFilePath = task.getPathInput('aabFilePath', true);
                filesToConvert = task.findMatch(null, aabFilePath);
                // Fail if no matching files were found
                if (!filesToConvert || filesToConvert.length === 0) {
                    task.error("No matching files for this path: " + aabFilePath + " found: " + filesToConvert);
                    process.exit(0);
                }
                else if (filesToConvert.length > 1) {
                    task.error("Too much files matching the pattern specified: " + aabFilePath + " found: " + filesToConvert);
                    process.exit(0);
                }
                keystoreFilePath = task.getPathInput('keystoreFilePath', true);
                keystorePassword = task.getInput('keystorePassword', true);
                keystoreAlias = task.getInput('keystoreAlias', true);
                keystoreAliasPassword = task.getInput('keystoreAliasPassword', true);
                outputFolder = task.getPathInput('outputFolder');
                workingDirectory = task.cwd();
                outputApksPath = path.join(workingDirectory, 'extract.apks');
                java = task.which('java', true);
                args = ['-jar', bundletoolPath, 'build-apks', "--bundle=" + filesToConvert[0], '--mode=universal', "--output=" + outputApksPath, "--ks=" + keystoreFilePath, "--ks-pass=pass:" + keystorePassword, "--ks-key-alias=" + keystoreAlias, "--key-pass=pass:" + keystoreAliasPassword, '--overwrite'];
                javaResult = task.execSync(java, args);
                if (javaResult.code !== 0) {
                    task.error("An error occured when running bundletool: " + bundletoolPath + " jar using java, verify java is correctly install in your agent.");
                    if (javaResult.error != null) {
                        task.error(javaResult.error.name + " " + javaResult.error.message);
                        task.error(javaResult.error.stack);
                    }
                    process.exit(1);
                }
                unzip = task.which('unzip', true);
                task.execSync(unzip, [outputApksPath, '-d', outputFolder]);
                task.setResult(task.TaskResult.Succeeded, "The universal apk was succesfully generated here: " + outputFolder);
            }
            catch (err) {
                task.setResult(task.TaskResult.Failed, err.message);
            }
            return [2 /*return*/];
        });
    });
}
run();
