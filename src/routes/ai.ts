import express, { type Request, type Response } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = express.Router()

const genAI = new GoogleGenerativeAI(process.env.GIMINI_API_KEY!)

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

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

export default router
