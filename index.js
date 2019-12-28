const fs = require("fs");
const path = require("path");

(function ({ argv, exit }) {
    if (!Array.isArray(argv)) {
        exit(0);
        return;
    }
    const root = argv[2];
    if (!run(root)) {
        exit(-1);
        console.log('Internal Error');
    }
})(process);

function run(root) {
    const insideRoot = fs.readdirSync(root);
    const stringInsideRoot = insideRoot.join();
    const hasArchive = stringInsideRoot.search(/.gz?/);
    console.log(`Start Scanning ${root}`);
    for (let item of insideRoot) {
        let insidePath = path.join(root, item);
        let stat = fs.statSync(insidePath);
        if (stat.isFile()) {
            if (hasArchive !== -1) {
                let statGz = fs.statSync(`${insidePath}.gz`);
                if (stat.mtimeMs > statGz.mtimeMs) {
                    packZipLog(insidePath, item, stat, statGz);
                }
            } else {
                packZipLog(insidePath);
            }
            return true;
        } else if (stat.isDirectory()) {
            run(insidePath);
        }

    }
    return true;
}

function packZipLog(pathToFile, item, stat, statGz) {
    console.log(`Start Packing File: ${pathToFile}`);
    packZip(pathToFile, item, stat, statGz);
    console.log(`Done Packing File: ${pathToFile}`);
}

function packZip(pathToFile, item, stat, statGz) {
    const r = fs.createReadStream(pathToFile);
    const gzip = require("zlib").createGzip();
    const w = fs.createWriteStream(`${pathToFile}.gz`);
    r.pipe(gzip).pipe(w).on('close', () => console.log(`Modify ${item}: `, stat.mtime, `Modify ${item}.gz: `, statGz.mtime));
}
