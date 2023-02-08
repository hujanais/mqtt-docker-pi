```
npm init
npm install typescript --save-dev
npm install @types/node --save-dev
npm install express
npm install @types/express --save-dev
npm install nodemon --save-dev
npm install ts-node --save-dev
npm install dotenv
npm install mqtt
npm install axios

npx tsc --init --rootDir src --outDir dist \
--esModuleInterop --resolveJsonModule --lib es6 \
--module commonjs --allowJs true --noImplicitAny true
```

### Setup prettier

npm install --save-dev prettier
create .prettierrc.json
create .prettierignore

create /src/index.ts

### MQTT info

topic = hass-topic

### MongoDB connectivity.

Using MongDB data api.
