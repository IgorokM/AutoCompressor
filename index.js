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
    console.log(`Start Scanning ${root}`);
    for (let item of insideRoot) {
        let insidePath = path.join(root, item);
        let stat = fs.statSync(insidePath);
        if (stat.isFile() && item.search(/.gz?/) === -1) {
            console.log(`Find file: ${item}`);
            let reg = new RegExp(`${item}.gz?`);
            let archive = insideRoot.filter(file => file.search(reg) !== -1).join();
            if (archive) {
                console.log(`Find archive: ${archive}`);
                let statGz = fs.statSync(path.join(root, archive));
                if (stat.mtimeMs > statGz.mtimeMs) {
                    packZipLog(insidePath, item, stat, statGz);
                }
            } else {
                packZipLog(insidePath, item, stat);
            }
        } else if (stat.isDirectory()) {
            run(insidePath);
        }
    }
    return true;
}

function packZipLog(pathToFile, item, stat, statGz=null) {
    console.log(`Start Packing File: ${pathToFile}`);
    packZip(pathToFile, item, stat, statGz);
    console.log(`Done Packing File: ${pathToFile}`);
}

function packZip(pathToFile, item, stat, statGz) {
    const r = fs.createReadStream(pathToFile);
    const gzip = require("zlib").createGzip();
    const w = fs.createWriteStream(`${pathToFile}.gz`);
    const pipeW = r.pipe(gzip).pipe(w);
    pipeW.on('close', () => console.log(`Modify ${item}: ${stat.mtime} - Modify ${item}.gz: ${statGz!==null?statGz.mtime : 'Empty'}`));
}
