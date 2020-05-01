echo "Publish"

cd tasks/InstallBundletool/
npm install
tsc

cd ../AabConvertToUniversalApk
npm install
tsc

cd ../Bundletool
npm install
tsc

cd ../../

tfx extension create --manifest-globs vss-extension.json