import express, { Request, Response } from 'express'
import axios from 'axios'
import processTokenSwaps from './fn/format'

const router = express.Router()

// Define the endpoint for your API
const SOLSCAN_API_URL = 'https://api-v2.solscan.io/v2/account/activity/dextrading'

// Your GET route handler
router.get('/', async (req: Request, res: Response) => {
    try {
        // Extract query parameters from the request
        const {
            address,
            page = 1,
            page_size = 10,
            remove_spam = false,
            exclude_amount_zero = false,
        } = req.query

        // Make a request to the Solscan API
        const response = await axios.get(SOLSCAN_API_URL, {
            params: {
                address,
                page,
                page_size,
                remove_spam,
                exclude_amount_zero,
            },
            headers: {
                accept: 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.5',
                cookie: 'cf_clearance=sMxbrHg5gx6yqU80Ir75hsGZsih8vz_RV_fUPU1n5Ow-1722662528-1.0.1.1-oMpWOMgpxkV2J6BYqHF73zWeI8UKFJOp9t4KOBpF_i6c1G2n_8kViwUIGFWDAX2HQFErkGMgLW9gQfYdUdJmrg',
                origin: 'https://solscan.io',
                priority: 'u=1, i',
                referer: 'https://solscan.io/',
                'sec-ch-ua':
                    '"Not)A;Brand";v="99", "Brave";v="127", "Chromium";v="127"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'sec-gpc': '1',
                'sol-aut': 'IEGmNeRB6uR81a3Kx1MB9dls0fKOGtdqIzWaT7xT',
                'user-agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            },
        })

        // Send the data from Solscan API as response
        const result= processTokenSwaps(response.data.data);
        res.json(result)


    } catch (error) {
        console.error('Error fetching data from Solscan API:', error)
        res.status(500).send('Internal Server Error')
    }
})

export default router
