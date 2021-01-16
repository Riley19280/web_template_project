
if [ -z "$1" ]; then
  echo No function name supplied
  exit 1
fi

if [ "$2" = 'install' ]; then
  cd lambda/$1/
  npm install
  cd ../..
  rm ./lambda/$1/package-lock.json
fi

cp database.js ./lambda/$1/database.js

cd lambda/$1/
zip -r ../$1.zip *
cd ../..

aws lambda update-function-code --function-name $1 --zip-file fileb://lambda/$1.zip --profile lambda

rm ./lambda/$1.zip
rm lambda/$1/database.js
