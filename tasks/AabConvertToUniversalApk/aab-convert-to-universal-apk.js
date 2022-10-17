"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var os = __importStar(require("os"));
var extract = require('extract-zip');
var fs = __importStar(require("fs"));
var BUNDLETOOL_ENV_PATH = 'bundletoolpath';
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var bundletoolPath, aabFilePath, filesToConvert, keystoreFilePath, keystorePassword, keystoreAlias, keystoreAliasPassword, outputFolder, workingDirectory, outputApksPath, java, args, javaResult, arch, err_1, unzipCommand, newApkName, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
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
                    arch = findArchitecture();
                    task.debug("current platform is " + arch);
                    if (!(arch === 'windows')) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    task.debug("starting extraction on windows platform ...");
                    return [4 /*yield*/, extract(outputApksPath, { dir: outputFolder })];
                case 2:
                    _a.sent();
                    task.debug('Extraction complete');
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    // handle any errors
                    task.error("Error while extracting " + outputApksPath + " to " + outputFolder + " ");
                    task.error(err_1);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    task.debug("starting extraction on linux or mac platform ...");
                    unzipCommand = task.which('unzip', true);
                    task.execSync(unzipCommand, [outputApksPath, '-d', outputFolder]);
                    task.debug('Extraction complete');
                    _a.label = 6;
                case 6:
                    newApkName = task.getInput('newUniversalApkName', false);
                    if (newApkName) {
                        try {
                            task.debug("a new name has been set for universal.apk : " + newApkName);
                            task.debug("renaming " + outputFolder + "/universal.apk -> " + outputFolder + "/" + newApkName);
                            fs.renameSync(path.join(outputFolder, 'universal.apk'), path.join(outputFolder, newApkName));
                            task.debug("file renamed");
                            task.setResult(task.TaskResult.Succeeded, "The " + newApkName + " apk was succesfully generated here: " + outputFolder);
                        }
                        catch (err) {
                            task.error("Error while renaming " + outputFolder + "/universal.apk -> " + outputFolder + "/" + newApkName + " ");
                            task.error(err);
                            process.exit(1);
                        }
                    }
                    else {
                        task.setResult(task.TaskResult.Succeeded, "The universal apk was succesfully generated here: " + outputFolder);
                    }
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _a.sent();
                    task.setResult(task.TaskResult.Failed, err_2.message);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function findArchitecture() {
    if (os.platform() === 'darwin') {
        return "macos";
    }
    else if (os.platform() === 'linux') {
        return "linux";
    }
    else {
        return "windows";
    }
}
run();
