const fs = require("fs");
const path = require("path");

(function ({ argv, exit }) {
    if (!Array.isArray(argv)) {
        exit(0);
        return;
    }
    const root = argv[2];
    console.log(`ROOT DIR: ${root}`);
    if (!run(root)) {
        exit(-1);
        console.log('Internal Error');
    }
})(process);

function run(root) {
    const insideRoot = fs.readdirSync(root);
    const stringInsideRoot = insideRoot.join();
    const hasArchive = stringInsideRoot.search(/.gz?/);
    console.log(`Scanning ${root}`);
    if (!Array.isArray(insideRoot)) return false;

    for (let item of insideRoot) {
        let insidePath = path.join(root, item);
        let stat = fs.statSync(insidePath);
        console.log(stat);
        if (stat.isFile()) {
            packZip(insidePath);
            return true;
        } else if(stat.isDirectory()) {
            run(insidePath);
        }
    }
}
function packZip(pathToFile) {
    const r = fs.createReadStream(pathToFile);
    const gzip = require("zlib").createGzip();
    const w = fs.createWriteStream(`${pathToFile}.gz`);
    r.pipe(gzip).pipe(w);
}
