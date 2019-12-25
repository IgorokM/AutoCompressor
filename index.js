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
    if (hasArchive === -1) {
        console.log(`Scanning ${root}`);
        for (let item of insideRoot) {
            let insidePath = path.join(root, item);
            let stat = fs.statSync(insidePath);
            if (stat.isFile()) {
                packZip(insidePath);
                return true;
            } else if (stat.isDirectory()) {
                run(insidePath);
            }
        }
    }else{
        console.log(`in folder '${root}' not work`);
    }
    return true;
}
function packZip(pathToFile) {
    const r = fs.createReadStream(pathToFile);
    const gzip = require("zlib").createGzip();
    const w = fs.createWriteStream(`${pathToFile}.gz`);
    r.pipe(gzip).pipe(w);
}
