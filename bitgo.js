const BitGoJS = require('bitgo')
const request = require('request-promise')

/**
 * SmartFee Config
 * TODO: Enter your api key below.
 */
const smartFeeApiKey = 'XXXXXXXXXX'

/**
 * BitGo Config
 * TODO: Enter your BitGo info below.
 */
const BITGO_ACCESS_TOKEN = 'XXXXXXX'
const WALLET_ID = '5XXXXXXXXX'
const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: BITGO_ACCESS_TOKEN });


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


    // Send a BitGo transaction with a custom fee rate:
    const wallet = await bitgo.coin('tbtc').wallets().get({ id: WALLET_ID })
    const sendParams = {
        feeRate: twoBlockFeeRateSatsPerKb,
        // TODO: replace below with your transaction info:
        /*
        recipients: [{
          amount: 0.01 * 1e8,
          address: '2NFfxvXpAWjKng7enFougtvtxxCJ2hQEMo4',
        }, {
          amount: 0.01 * 1e8,
          address: '2MsMFw75RKRiMb548q6W4jrJ63jwvvDdR2w',
        }],
        walletPassphrase: 'secretpassphrase1a5df8380e0e30'
        */
    }
    const result = await wallet.sendMany(sendParams)
    console.dir(result)
}

createTransaction()
