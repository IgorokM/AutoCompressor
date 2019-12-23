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
    const wDir = path.resolve(rootDir);
    
    // const inp = fs.createReadStream(`input.txt`);
    // const out = fs.createWriteStream("input.txt.gz");
})(process);
