import express, { NextFunction, Request, Response } from 'express'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3Client } from '@aws-sdk/client-s3'
import axios from 'axios'

const router = express.Router()

export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_SECRET_ACCESS_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
})

const FILE_SIZE_LIMIT: number = 5 * 1024 * 1024

const putObjectURL = async (filename: string, contentType: string) => {
    console.log(process.env.AWS_BUCKET)
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: filename,
        ContentType: contentType,
    })
    const url = await getSignedUrl(s3Client, command)
    console.log('Generated PUT URL:', url)
    return url
}
const objectURL = (key: string) => {
    const url = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    console.log('Public URL:', url)
    return url
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    const { fileName, contentType, fileSize, url } = req.body
    console.log({ fileName, contentType, fileSize })
    // Validate the input parameters
    if (!fileName) {
        return res.status(400).send({
            success: false,
            message: 'Filename is required',
        })
    }
    if (!url) {
        return res.status(400).send({
            success: false,
            message: 'Url is required',
        })
    }
    if (!contentType) {
        return res.status(400).send({
            success: false,
            message: 'Content-type is required',
        })
    }
    if (fileSize > FILE_SIZE_LIMIT) {
        return res.status(400).send({
            success: false,
            message: 'Exceeded file size limit',
        })
    }
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
    })
    if (response.status !== 200)
        return res.status(500).send({
            success: false,
        })
    // Generate the pre-signed URL for uploading the file
    const uploadUrl = await putObjectURL(fileName, contentType)

    // Generate the public URL for accessing the uploaded file
    const publicUrl = objectURL(fileName)
    const upload = await axios.put(uploadUrl, response.data)
    if (upload.status === 200)
        return res.status(201).send({
            success: true,
            // uploadUrl,
            publicUrl,
        })
    else {
        return res.status(500).send({
            success: false,
        })
    }
    // Respond with the URLs
})

export default router
