import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path"

const sourceFile = path.join("03-buffers-and-streams", 'source.txt');
const destFile = path.join('03-buffers-and-streams', 'destination.txt');

fs.writeFileSync(sourceFile, 'chunk 1. Node.js streams are ultra fast! \n Chunk 2: Memory stays low.')

console.log("---Starting stream pipeline---")

const readStream = fs.createReadStream(sourceFile, {
    highWaterMark: 16,
});

let chunkcount = 0;
readStream.on('data', (chunk) => {
    chunkcount++;
    console.log(`📦 Received Chunk #${chunkcount} (${chunk.length} bytes):`);
    console.log(`   "${chunk.toString('utf-8').trim()}"`)
})

const writeStream = fs.createWriteStream(destFile);

await pipeline(readStream, writeStream);

console.log('\n✅ Pipeline complete! File copied safely without memory spikes.');