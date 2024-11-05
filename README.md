**HEIC to PNG Conversion with Decentralized Storage and Compute**

This project is a bounty submission that combines Acurast's image conversion functionality with Cere Network's decentralized data storage capabilities. The main objective is to create a simple web application that converts HEIC files to PNG files, storing original and converted images in Cere's decentralized storage network and using Acurast for the image processing.

**Video Link:** https://cdn.dragon.cere.network/1033/baear4ibrbpu4lotuhl4qnfoquak75luntcogf54kqg42lscnwelpep4i64/04.11.2024_21.21.50_REC.mp4

**The link:** https://heic-to-png.processor-proxy.sook.ch/            (it might have issues in case the Node js session ended.)

**Screenshots**
1. https://cdn.dragon.cere.network/1033/baear4ie66mswfhhtggb4iqbbb5bngh5oai4l6qfvb324fruo6477r2g4yu/Screenshots%20-%20Copy/Screenshot%202024-11-04%20212410.png
2. https://cdn.dragon.cere.network/1033/baear4ie66mswfhhtggb4iqbbb5bngh5oai4l6qfvb324fruo6477r2g4yu/Screenshots%20-%20Copy/Screenshot%202024-11-04%20212423.png
3. https://cdn.dragon.cere.network/1033/baear4ie66mswfhhtggb4iqbbb5bngh5oai4l6qfvb324fruo6477r2g4yu/Screenshots%20-%20Copy/Screenshot%202024-11-04%20212435.png
4. https://cdn.dragon.cere.network/1033/baear4ie66mswfhhtggb4iqbbb5bngh5oai4l6qfvb324fruo6477r2g4yu/Screenshots%20-%20Copy/Screenshot%202024-11-04%20212448.png
5. https://cdn.dragon.cere.network/1033/baear4ie66mswfhhtggb4iqbbb5bngh5oai4l6qfvb324fruo6477r2g4yu/Screenshots%20-%20Copy/Screenshot%202024-11-04%20212459.png
   
**Summary**

This bounty project implements a fully decentralized HEIC-to-PNG image conversion system. The application allows users to:

1. Upload a HEIC image to a public bucket in Cere Network.
2. Convert the HEIC file to PNG using Acurast's compute functionality.
3. Store the resulting PNG in the same Cere bucket.
4. Provide a downloadable or shareable link for the converted PNG file.

**Expected Result**

1. Create a developer account on the Cere Developer Console.
2. Create a public bucket in Cere Network using the developer console.
3. Build a simple web interface with a file browser and a "Convert" button.
4. Allow the user to:
  - Upload a HEIC file to the Cere bucket.
  - Press the "Convert" button to send the HEIC file to Acurast for conversion.
  - Receive the converted PNG stored back in the Cere bucket, with a link to download or share the file.

**Project Setup and Requirements**

**1. Clone the repository and install dependencies:**
   git clone https://github.com/yourusername/yourrepository.git
cd yourrepository
npm install

**2. Create a Cere Developer Account and Bucket:**

- Register at the Cere Developer Console.
- Create a new project and a public bucket, noting the bucket ID for later use.

**3. Configure Environment Variables:**

- Store sensitive data (e.g., API keys) in environment variables. Create a .env file in the root directory:
  CERE_USER_SEED="your-seed-phrase"
CLUSTER_ID="your-cluster-id"
BUCKET_ID="your-bucket-id"

**4. Run the Application:**
npm start

This starts the local server and opens a tunnel for accessing the Acurast cloud functions.

**Usage**

1. Upload HEIC File: Navigate to the application’s file browser and select a HEIC file to upload.
2. Convert: Click the "Convert" button to trigger the conversion. This uploads the file to Cere, sends it to Acurast for processing, and stores the resulting PNG in the Cere bucket.
3. Download: Once the conversion completes, a link to the PNG file will be generated for download or sharing.
   
**Resources**

-Developer Console: Cere Developer Console
-Acurast Image Conversion Repo: Acurast HEIC to PNG Example
-Cere Network DDC Example: Cere DDC SDK Examples
-Cere Network DDC SDK: Cere DDC SDK

**Dependencies**

- @cere-ddc-sdk/ddc-client - For interacting with Cere Network's decentralized storage.
- express, multer - For handling file uploads and routing.
- localtunnel - For local testing with Acurast’s cloud environment.
- dotenv - For secure management of environment variables.
  

**Submission Requirements**
- Complete source code via GitHub
- Documentation in this README, with instructions and screenshots
- Working demo URL
- Attribution for third-party libraries
- Well-commented code, licensed under MIT or Apache 2.0
  
**Judging Criteria**

- Speed of Delivery: Prompt submission.
- Code Quality and Organization: Clear structure and documentation.
- Proper Use of SDKs: Effective integration of Cere and Acurast SDKs.
- Error Handling: Graceful and informative error messages.
  
**License**

- This project is open source under the MIT or Apache 2.0 license.
