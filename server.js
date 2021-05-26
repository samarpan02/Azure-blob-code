
const { StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol, BlobServiceClient } = require("@azure/storage-blob");

// Load the .env file if it exists
require("dotenv").config();

async function main(containerName, blobName) {

    const account = process.env.ACCOUNT_NAME || "";
    const accountKey = process.env.ACCOUNT_KEY || "";

    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
    const blobServiceClient = new BlobServiceClient(
        // When using AnonymousCredential, following url should include a valid SAS or support public access
        `https://${account}.blob.core.windows.net`,
        sharedKeyCredential
    );



    const containerClient = blobServiceClient.getContainerClient(containerName)
    const blobclient = containerClient.getBlockBlobClient(blobName);
    const blobSAS = generateBlobSASQueryParameters({
        containerName, // Required
        blobName, // Required
        permissions: BlobSASPermissions.parse("racwd"), // Required
        startsOn: new Date(), // Optional
        expiresOn: new Date(new Date().valueOf() + 86400), // Required. Date type
        cacheControl: "cache-control-override", // Optional
        contentDisposition: "content-disposition-override", // Optional
        //contentEncoding: "content-encoding-override", // Optional
        //contentLanguage: "content-language-override", // Optional
        //contentType: "content-type-override", // Optional
        //ipRange: { start: "0.0.0.0", end: "255.255.255.255" }, // Optional
        //protocol: SASProtocol.HttpsAndHttp, // Optional
        version: "2016-05-31" // Optional
    },
        sharedKeyCredential // StorageSharedKeyCredential - `new StorageSharedKeyCredential(account, accountKey)`
    ).toString();
    // console.log(JSON.stringify(blobSAS));

    console.log(JSON.stringify(`${blobclient.url}?${blobSAS}`));
}


main().catch((err) => {
    console.error("Error running sample:", err.message);
});
