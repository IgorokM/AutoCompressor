const zlib = require("zlib");
const gzip = zlib.createGzip();
const fs = require("fs");
const path = require("path");

(function({ argv, exit }) {
    if (!Array.isArray(argv)) {
        exit(0);
        return;
    }
    const rootDir = argv.slice(2, 3).join();
    const wDir = fs.readdirSync(rootDir);
    if (Array.isArray(wDir)) {
        let files = fs.readdirSync(`${rootDir}/${wDir[0]}`);
        files.map((file) => {
            let pathToFile = `${rootDir}/${wDir[0]}/${file}`;
            packZip(pathToFile);
        });
    }
})(process);

function packZip(pathToFile) {
    const r = fs.createReadStream(pathToFile);
    const w = fs.createWriteStream(`${pathToFile}.gz`);
    r.pipe(gzip).pipe(w);
}
