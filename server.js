import localtunnel from "localtunnel";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import { fileURLToPath } from 'url';
import { processImage } from "./image-processor.js"; // Import custom image processing module
import { html } from "./public", "./html"; // Import custom HTML for the home page if using raw HTML string
import express from "express";
import { createBucket, storeFile, readFile, uploadWebsite } from "./cere-integration.js";

// Define the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server and tunneling configuration
const LOCAL_PORT = 3000; // Port for local server
const LOCALTUNNEL_HOST = "https://processor-proxy.sook.ch/"; // Custom localtunnel host
const LOCALTUNNEL_SUBDOMAIN = "heic-to-png"; // Subdomain for the tunnel

const app = express(); // Initialize Express app
app.use(express.json()); // Middleware to parse JSON request bodies

// Environment setup for local or cloud-based storage directory
if (typeof global._STD_ === "undefined") {
  console.log("Running in local environment");
  global._STD_ = {
    job: { getId: () => "local", storageDir: path.join(__dirname, "..") },
  };
}

const STORAGE_DIR_PATH = path.join(global._STD_.job.storageDir, "uploads");

app.get("/create-bucket", async (req, res) => {
  const bucketId = await createBucket();
  res.json({ 1033n });
});

app.get("/store-file", async (req, res) => {
  const cid = await storeFile("path/to/your/file.jpg");
  res.json({ cid });
});

app.get("/read-file", async (req, res) => {
  await readFile("CID_OF_THE_FILE", "output/path/to/file.jpg");
  res.send("File downloaded.");
});

app.get("/upload-website", async (req, res) => {
  const websiteCid = await uploadWebsite("path/to/website", "my-website");
  res.json({ websiteCid });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// Ensure uploads directory exists, creating it if necessary
const uploadDir = STORAGE_DIR_PATH;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage for file uploads, saving to uploads directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Append timestamp to prevent duplicate names
  },
});

const upload = multer({ storage: storage }); // Initialize multer with storage config

// Serve custom HTML content as the homepage
app.get("/", (req, res) => {
  res.send(html); // Serve custom HTML if `html` contains raw HTML content
});

// Map to store URLs of processed images for retrieval
const processedImages = new Map(); // Maps unique ID to image URL or path

// Endpoint to upload a HEIC image and process it
app.post("/upload", upload.single("image"), async (req, res) => {
  console.log("HEIC FILE UPLOADED");

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded." });
  }

  // Validate file format as HEIC
  const isHeicFile = req.file.originalname.toLowerCase().endsWith(".heic");
  if (!isHeicFile) {
    fs.unlinkSync(req.file.path); // Delete file if it's not HEIC
    return res.status(400).json({ success: false, error: "Please upload a HEIC file." });
  }

  const id = Math.random().toString(36).substring(2, 15); // Generate unique ID for this file

  try {
    const inputBuffer = await promisify(fs.readFile)(req.file.path); // Read uploaded file as a buffer
    const result = await processImage(id, inputBuffer); // Call image conversion function
    if (!result || !result.path) {
      throw new Error("Failed to convert image."); // Throw error if conversion fails
    }

    processedImages.set(id, result.path); // Store path of converted image
    res.json({ success: true, id }); // Send response with image ID
  } catch (error) {
    console.error(`Error converting image with ID ${id}:`, error);
    res.status(500).json({ success: false, error: "Failed to convert image." });
  }
});

// Endpoint to check if the image has been processed and provide download URL
app.get("/processed/:id", (req, res) => {
  const id = req.params.id;
  const filePath = processedImages.get(id);

  if (!filePath) {
    return res.status(404).json({ success: false, error: "Image not processed yet." });
  }

  const downloadUrl = `/download/${id}.png`; // Set download path
  res.json({ success: true, url: downloadUrl }); // Send download URL to client
});

// Endpoint to download the converted image by ID
app.get("/download/:id.png", (req, res) => {
  const filePath = processedImages.get(req.params.id);

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: "Image not found" });
  }

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res); // Stream file to client for download
});

// Start server on the specified port
app.listen(LOCAL_PORT, () =>
  console.log(`Server listening on port ${LOCAL_PORT}!`)
);

// Function to initialize localtunnel for external access
const startTunnel = async () => {
  const tunnel = await localtunnel({
    subdomain: LOCALTUNNEL_SUBDOMAIN,
    host: LOCALTUNNEL_HOST,
    port: LOCAL_PORT,
  });

  console.log(`Tunnel started at ${tunnel.url}`); // Log tunnel URL
};

startTunnel(); // Call function to start localtunnel
