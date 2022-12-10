import express, {Request, Response} from 'express'
import bodyParser from "body-parser";
const app = express()
const port = 3001

const availableResolutionsArr: string[] = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]

let videos: any[] = []

const today = new Date()
const tomorrow = new Date()
tomorrow.setDate(today.getDate()+ 1)

// interface IVideo {
//     id: number,
//     title: string,
//     author: string,
//     canBeDownloaded: boolean,
//     minAgeRestriction: null | number,
//     createdAt: string,
//     publicationDate: string,
//     availableResolutions: string[] | null,
// }


const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = []
    res.send(204)
})

app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videos)
})

app.get('/videos/:id', (req: Request, res: Response) => {
    let video = videos.find(p => p.id === +req.params.id)
    if (!video) {
        res.send(404)
    } else {
        res.send(video)
    }
})

app.post('/videos', (req: Request, res: Response) => {

    let errorsMessages = [];

    const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body

    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.map((resolution: string) => {
            if (!availableResolutionsArr.includes(resolution)) {
                errorsMessages.push({
                    message: "Incorrect resolution value provided",
                    field: "availableResolutions"
                })
            }

        })
    }

    if(availableResolutions) {
        if (!Array.isArray(availableResolutions) || availableResolutions.length > availableResolutionsArr.length || availableResolutions.length === 0) {
            errorsMessages.push({
                message: "Incorrect resolutions provided",
                field: "availableResolutions"
            })
        }
    }



    if (!title || typeof title !== 'string' || title.length > 40 || !title.trim()) {
        errorsMessages.push({
            message: "Title incorrect",
            field: "title"
        })


    }

    if (!author || typeof author !== 'string' || author.length > 20 || !author.trim()) {
        errorsMessages.push({
            message: "Author incorrect",
            field: "author"
        })


    }
    if (errorsMessages.length) {
        res.status(400).send({'errorsMessages':errorsMessages})
    }
    const newVideo  = {
        id: videos.length,
        title: title,
        author: author,
        canBeDownloaded: canBeDownloaded || false,
        minAgeRestriction: minAgeRestriction || null,
        createdAt: today.toISOString(),
        publicationDate: publicationDate || tomorrow.toISOString(),
        availableResolutions: availableResolutions || null,
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
})

app.put('/videos/:id', (req: Request, res: Response) => {

    let foundVideo = videos.find(p => p.id === +req.params.id)

    let errorsMessages = [];

    const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body

    if (!foundVideo) {
        res.send(404)
    }

    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions?.map((resolution: string) => {
            if (!availableResolutionsArr.includes(resolution)) {
                errorsMessages.push({
                    message: "Incorrect resolution value provided",
                    field: "availableResolutions"
                })
            }

        })
    }

    if(availableResolutions) {
        if (!Array.isArray(availableResolutions) || availableResolutions.length > availableResolutionsArr.length || availableResolutions.length === 0) {
            errorsMessages.push({
                message: "Incorrect resolutions provided",
                field: "availableResolutions"
            })
        }
        foundVideo.availableResolutions = availableResolutions
    }




    if (!title || typeof title !== 'string' || title.length > 40 || !title.trim()) {
        errorsMessages.push({
            message: "Title incorrect",
            field: "title"
        })


    }

    if (!author || typeof author !== 'string' || author.length > 20 || !author.trim()) {
        errorsMessages.push({
            message: "Author incorrect",
            field: "author"
        })


    }
    if (canBeDownloaded) {
        if (typeof canBeDownloaded !== 'boolean') {
            errorsMessages.push({
                message: "canBeDownloaded incorrect",
                field: "canBeDownloaded"
            })
        }
        foundVideo.canBeDownloaded = canBeDownloaded
    }

    if (minAgeRestriction) {
        if (typeof minAgeRestriction !== 'number' || minAgeRestriction > 18 || minAgeRestriction < 1) {
            errorsMessages.push({
                message: "minAgeRestriction incorrect",
                field: "minAgeRestriction"
            })
        }
        foundVideo.minAgeRestriction = minAgeRestriction
    }

    if (publicationDate){
        if (typeof publicationDate !== 'string') {
            errorsMessages.push({
                message: "publicationDate incorrect",
                field: "publicationDate"
            })
        }
        foundVideo.publicationDate = publicationDate
    }



    if (errorsMessages.length) {
        res.status(400).send({'errorsMessages':errorsMessages})
    }


    foundVideo.title = title
    foundVideo.author = author

    res.status(204).send(foundVideo)


})

app.delete('/videos/:id', (req: Request, res: Response) => {
    for (let i = 0; i < videos.length; i++)  {
        if (videos[i].id === +req.params.id) {
            videos.splice(i,1);
            res.send(204)
            return;
        }
    }
    res.send(404)
})

// start app
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
