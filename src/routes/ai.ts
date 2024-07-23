import express, { type Request, type Response } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Replicate from 'replicate'
const router = express.Router()

const genAI = new GoogleGenerativeAI(process.env.GIMINI_API_KEY!)

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
})

router.get('/', async (req: Request, res: Response) => {
    const { prompt } = req.body

    try {
        console.log({ prompt })

        const result = await model.generateContent(prompt)
        const response = result.response.text()
        return res.status(200).send(response)
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'internal error occured' })
    }
})

router.get('/images', async (req: Request, res: Response) => {
    const { prompt } = req.body

    try {
        console.log({ prompt })
        const input = {
            cfg: 3.5,
            steps: 28,
            prompt: prompt,
            aspect_ratio: '16:9',
            output_format: 'jpg',
            output_quality: 90,
            negative_prompt: '',
            prompt_strength: 0.85,
        }

        const output = await replicate.run('stability-ai/stable-diffusion-3', {
            input,
        })
        console.log(output)

        return res.status(200).send(output)
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'internal error occured' })
    }
})

export default router
