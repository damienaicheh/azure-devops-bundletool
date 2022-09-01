# Bundletool Helper

## Quick overview

The tasks available in this extension are:

- InstallBundletool
- AabConvertToUniversalApk
- Bundletool

Check the [Github](https://github.com/damienaicheh/azure-devops-bundletool) repository for more informations!

## Basic usage

Install latest version of bundletool:

```yml
- task: InstallBundletool@1
  inputs:
    username: 'githubUsername' # Optional but RECOMMANDED
    personalAccessToken: '$(githubPersonnalAccessToken)' # Optional but RECOMMANDED
    ignorSslError: 'ignorSslError' # Optional set it to true only if you have ssl error
    curlIsSilent: 'curlIsSilent' # Optional false by default, set it to true if you want curl to log info
```

The Github credentials are used to only read the bundletool public repository. If you don't specify it you will be limited by the [defaults rate limits of the Github API](https://developer.github.com/v3/#rate-limiting). If the limit is reached then the task will obviously failed.

Then with the bundletool installed in your agent you can use these following tasks:

Convert your Android App Bundle (Aab) into a universal Apk, it's useful for platform distribution like App Center:

```yaml
- task: AabConvertToUniversalApk@1
  inputs:
    aabFilePath: 'path/to/*.aab'
    keystoreFilePath: '$(keyStore.secureFilePath)'
    keystorePassword: '$(keystore.password)'
    keystoreAlias: '$(key.alias)'
    keystoreAliasPassword: '$(key.password)'
    outputFolder: 'path/to/folder' # Optional. Default is: $(Build.SourcesDirectory)
    bundletoolJarPath: 'path/to/bundletooljar' # Optional if you use the InstallBundletool task or set the bundletoolpath environment variable.
    newUniversalApkName: 'com.my.appication.apk' # Optional if blank the output file will be universal.apk
```

Use custom arguments for bundletool:

```yaml
- task: Bundletool@1
  inputs:
    bundletoolArguments: 'version'
    bundletoolJarPath: 'path/to/bundletooljar' # Optional if you use the InstallBundletool task or set the bundletoolpath environment variable.
```