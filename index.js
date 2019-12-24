const zlib = require("zlib");
const gzip = zlib.createGzip();
const fs = require("fs");
const path = require("path");

(function({ argv, exit }) {
    if (!Array.isArray(argv)) {
        exit(0);
        return;
    }
    const root = argv[2];
    console.log(`ROOT DIR: ${root}`);
    if (!createPathToFile(root)) {
        exit(-1);
        console.log('Internal Error');
    }
})(process);

function createPathToFile(root) {
    const insideRoot = fs.readdirSync(root);
    if (!Array.isArray(insideRoot)) return false;
    for (let item of insideRoot) {
        let insidePath = path.join(root, item);
        let stat = fs.statSync(insidePath);
        if (stat.isFile()) {
            packZip(insidePath);
            return true;
        } else {
            createPathToFile(insidePath);
        }
    }
}
function packZip(pathToFile) {
    const r = fs.createReadStream(pathToFile);
    const w = fs.createWriteStream(`${pathToFile}.gz`);
    r.pipe(gzip).pipe(w);
}
