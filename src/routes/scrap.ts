import axios from 'axios'
import express, { type Request, type Response } from 'express'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    const API_URL = 'https://api.producthunt.com/v2/api/graphql'
    const api_token_ph = process.env.PRODUCT_HUNT_API_TOKEN // Replace with your Product Hunt API token

    const query = {
        query: `
        query todayPosts {
            posts {
                totalCount
                edges {
                    node {
                        id
                        name
                        tagline
                        votesCount
                        featuredAt
                        makers {
                            name
                            followers {
                                totalCount
                            }
                            following {
                                totalCount
                            }
                            madePosts {
                                totalCount
                            }
                            twitterUsername
                        }
                    }
                }
            }
        }
    `,
    }
    async function fetchProducts() {
        try {
            const response = await axios.post(
                API_URL,
                { query },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + api_token_ph,
                        Host: 'api.producthunt.com',
                    },
                },
            )

            const { data } = response.data
            console.log(data)

            // if (data && data.categories) {
            //     data.categories.edges.forEach((categoryEdge) => {
            //         const category = categoryEdge.node
            //         console.log(`Category: ${category.name}`)

            //         category.products.edges.forEach((productEdge) => {
            //             const product = productEdge.node
            //             console.log(`  Product: ${product.name}`)
            //             console.log(`    Tagline: ${product.tagline}`)
            //             console.log(`    Votes: ${product.votesCount}`)
            //         })
            //     })
            // } else {
            //     console.error('No data found')
            // }
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

    fetchProducts()

    return res.status(200).send({
        message: '👋 Hello, World! scrap',
    })
})

export default router
