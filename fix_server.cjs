const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// The messed up part is at the end.
const splitStr = "export const appPromise = startServer();";
if (code.includes(splitStr)) {
   code = code.split(splitStr)[0] + splitStr;
}

fs.writeFileSync('server.ts', code);
