import axios from 'axios'
import express, { type Request, type Response } from 'express'
import { JSDOM } from 'jsdom'
const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    async function extractImageUrls(url) {
        try {
            // Fetch the webpage content
            const response = await axios.get(url)
            const htmlContent = response.data

            // Load the content into jsdom
            const dom = new JSDOM(htmlContent)
            const document = dom.window.document

            // Extract all image URLs
            const imgElements = document.querySelectorAll('img')
            const imgUrls = Array.from(imgElements).map((img: any) => img?.src)

            return imgUrls
        } catch (error) {
            console.error('Error fetching the webpage:', error)
            return []
        }
    }

    const url = 'https://www.producthunt.com/'
    const imageArray = await extractImageUrls(url)

    // let image;
    // if(imageArray.length > 0){
    //     imageArray.map((img) => {

    //     })
    // }
    console.log(imageArray)

    const obj = Object.fromEntries(imageArray.map((value, index) => [index, value]))
    return res.status(200).send({
        error: false,
        image: obj,
    })
})

export default router
