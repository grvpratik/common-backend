import axios from 'axios'
import express, { type Request, type Response } from 'express'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    const API_URL = 'https://api.producthunt.com/v2/api/graphql'
    const api_token_ph = process.env.PRODUCT_HUNT_API_TOKEN

    if (!api_token_ph) {
        console.error('API token is not defined')
        return res.status(500).send({
            error: true,
            message: 'API token is not defined',
        })
    }

    const query = {
        query: `
        query {
            posts(first: 10, order: RANKING,topic:"developer-tools") {
                edges {
                    node {
                         id
                             name
                             tagline
                             votesCount
                             featuredAt
                             createdAt
       
                             reviewsCount
                             reviewsRating
                             commentsCount
                            url
                            website
                           productLinks{
                                    type
                                     url
                                     }
                             media {
                               type
                               url
                             }
        
      }
    }
  }
        }
        `,
    }

    try {
        const response = await axios.post(API_URL, query, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + api_token_ph,
            },
        })

        console.log(response.data) // Log the entire response for debugging

        const data = response.data
        if (data && data.data) {
            return res.status(200).send({
                success: true,
                data: data.data, // Send back the fetched data
            })
        } else {
            console.error('Unexpected response structure', data)
            return res.status(500).send({
                error: true,
                message: 'Unexpected response structure',
            })
        }
    } catch (error) {
        console.error(
            'Error fetching products:',
            error.response ? error.response.data : error.message,
        )
        return res.status(500).send({
            error: true,
            message: 'Error fetching products',
        })
    }
})

export default router
