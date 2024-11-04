import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { fileURLToPath } from "url";
import { DdcClient, File, Link, DagNode, TESTNET } from "@cere-ddc-sdk/ddc-client";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

// Constants
const CERE = 10_000_000_000n;
const user = "hybrid label reunion only dawn maze asset draft cousin height flock nation";
const clusterId = "0x825c4b2352850de9986d9d28568db6f0c023a1e3";
const bucketId = 1033n; // Replace with your specific bucket ID if you have one

// Create a new DDC client instance
async function initializeClient() {
  const client = await DdcClient.create(user, TESTNET);
  return client;
}

// Function to create a bucket in the DDC network
export async function createBucket() {
  const client = await initializeClient();

  try {
    const deposit = await client.getDeposit();
    console.log("Current deposit:", deposit / CERE, "CERE");

    if (deposit === 0n) {
      await client.depositBalance(5n * CERE);
      console.log("Deposited 5 CERE");
    }

    const newBucketId = await client.createBucket(clusterId, { isPublic: true });
    console.log("Public bucket created with ID:", newBucketId);
    return newBucketId;
  } finally {
    await client.disconnect();
  }
}

// Function to store a single file in the DDC network
export async function storeFile(filePath) {
  const client = await initializeClient();

  try {
    const inputFileStats = fs.statSync(filePath);
    const inputFileStream = fs.createReadStream(filePath);
    const ddcFile = new File(inputFileStream, { size: inputFileStats.size });

    const fileUri = await client.store(bucketId, ddcFile);
    console.log("File stored with CID:", fileUri.cid);
    return fileUri.cid;
  } finally {
    await client.disconnect();
  }
}

// Function to read a file from the DDC network
export async function readFile(cid, outputFilePath) {
  const client = await initializeClient();

  try {
    const fileResponse = await client.read({ cid });
    const outputFileStream = fs.createWriteStream(outputFilePath);

    await pipeline(Readable.fromWeb(fileResponse.body), outputFileStream);
    console.log("File downloaded to:", outputFilePath);
  } finally {
    await client.disconnect();
  }
}

// Function to upload a directory as a website to the DDC network
export async function uploadWebsite(websiteDir, websiteCnsName) {
  const client = await initializeClient();

  async function uploadFile(filePath, stats) {
    const fileStream = fs.createReadStream(filePath);
    const file = new File(fileStream, { size: stats.size });

    const { cid } = await client.store(bucketId, file);
    console.log("File stored with CID:", cid);
    return new Link(cid, stats.size, path.relative(websiteDir, filePath));
  }

  async function uploadDir(dir) {
    const links = [];
    const files = await fsPromises.readdir(dir);

    for (const fileName of files) {
      const filePath = path.join(dir, fileName);
      const stats = await fsPromises.stat(filePath);

      if (stats.isDirectory()) {
        links.push(...(await uploadDir(filePath)));
      } else {
        links.push(await uploadFile(filePath, stats));
      }
    }
    return links;
  }

  try {
    const fileLinks = await uploadDir(websiteDir);
    const websiteNode = new DagNode("v1.0.0", fileLinks);
    const websiteNodeUri = await client.store(bucketId, websiteNode, { name: websiteCnsName });

    console.log("Website uploaded with CID:", websiteNodeUri.cid);
    return websiteNodeUri.cid;
  } finally {
    await client.disconnect();
  }
}
