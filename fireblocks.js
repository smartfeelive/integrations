const fs = require('fs')
const path = require('path')
const request = require('request-promise')

/**
 * SmartFee Config.
 * TODO: Enter your api key below.
 */
const smartFeeApiKey = 'XXXXXXXXXX'

/**
 * Fireblocks Config
 * TODO: Enter your fireblocks info below.
 */
const privateKey = fs.readFileSync(path.resolve(__dirname, "./api-client-key.pem"), "utf8");
const apiKey = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";
const fireblocks = new FireblocksSDK(privateKey, apiKey);


/**
 * This creates a transaction with a custom fee from Smart Fee.
 */
async function createTransaction() {
    // Get a fee estimate from Smart Fee:
    const smartFeeResponse = await request({
        url: `https://api.smartfee.live/latest`,
        headers: {
            'X-API-KEY': smartFeeApiKey
        }
    })
    const smartFeeResponseObject = JSON.parse(smartFeeResponse)
    // Use the 2-block target.
    const twoBlockFeeRateSatsPerKb = smartFeeResponseObject.feeByBlockTarget["2"]

    // SmartFee returns an integer in sats/kilobyte but Fireblocks requires a string in sats/byte
    const satsPerByteString = (twoBlockFeeRateSatsPerKb / 1000).toString()

    // Create the Fireblocks transaction with a custom fee:
    const payload = {
        fee: satsPerByteString,
        // TODO: add your transaction information below:
        /*
        assetId: asset,
        source: {
            type: sourceType,
            id: sourceId || 0
        },
        destination: {
            type: destinationType,
            id: destinationId
        },
        amount: amount,
        */
    }
    const result = await fireblocks.createTransaction(payload);
    console.dir(result)
}

createTransaction()