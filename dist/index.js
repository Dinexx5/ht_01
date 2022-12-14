"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
exports.app = (0, express_1.default)();
const port = 3001;
const availableResolutionsArr = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
let videos = [];
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const parserMiddleware = (0, body_parser_1.default)({});
exports.app.use(parserMiddleware);
//testing purposes
exports.app.delete('/testing/all-data', (req, res) => {
    videos = [];
    res.send(204);
});
exports.app.get('/videos', (req, res) => {
    res.status(200).send(videos);
});
exports.app.get('/videos/:id', (req, res) => {
    let video = videos.find(p => p.id === +req.params.id);
    if (!video) {
        res.send(404);
    }
    else {
        res.send(video);
    }
});
exports.app.post('/videos', (req, res) => {
    let errorsMessages = [];
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.map((resolution) => {
            if (!availableResolutionsArr.includes(resolution)) {
                errorsMessages.push({
                    message: "Incorrect resolution value provided",
                    field: "availableResolutions"
                });
            }
        });
    }
    if (availableResolutions) {
        if (!Array.isArray(availableResolutions) || availableResolutions.length > availableResolutionsArr.length || availableResolutions.length === 0) {
            errorsMessages.push({
                message: "Incorrect resolutions provided",
                field: "availableResolutions"
            });
        }
    }
    if (!title || typeof title !== 'string' || title.length > 40 || !title.trim()) {
        errorsMessages.push({
            message: "Title incorrect",
            field: "title"
        });
    }
    if (!author || typeof author !== 'string' || author.length > 20 || !author.trim()) {
        errorsMessages.push({
            message: "Author incorrect",
            field: "author"
        });
    }
    if (errorsMessages.length) {
        res.status(400).send({ 'errorsMessages': errorsMessages });
        return;
    }
    const newVideo = {
        id: videos.length,
        title: title,
        author: author,
        canBeDownloaded: canBeDownloaded || false,
        minAgeRestriction: minAgeRestriction || null,
        createdAt: today.toISOString(),
        publicationDate: publicationDate || tomorrow.toISOString(),
        availableResolutions: availableResolutions || null,
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.put('/videos/:id', (req, res) => {
    let foundVideo = videos.find(p => p.id === +req.params.id);
    let errorsMessages = [];
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    if (!foundVideo) {
        res.send(404);
    }
    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions === null || availableResolutions === void 0 ? void 0 : availableResolutions.map((resolution) => {
            if (!availableResolutionsArr.includes(resolution)) {
                errorsMessages.push({
                    message: "Incorrect resolution value provided",
                    field: "availableResolutions"
                });
            }
        });
    }
    if (availableResolutions) {
        if (!Array.isArray(availableResolutions) || availableResolutions.length > availableResolutionsArr.length || availableResolutions.length === 0) {
            errorsMessages.push({
                message: "Incorrect resolutions provided",
                field: "availableResolutions"
            });
        }
    }
    if (!title || typeof title !== 'string' || title.length > 40 || !title.trim()) {
        errorsMessages.push({
            message: "Title incorrect",
            field: "title"
        });
    }
    if (!author || typeof author !== 'string' || author.length > 20 || !author.trim()) {
        errorsMessages.push({
            message: "Author incorrect",
            field: "author"
        });
    }
    if (canBeDownloaded) {
        if (typeof canBeDownloaded !== 'boolean') {
            errorsMessages.push({
                message: "canBeDownloaded incorrect",
                field: "canBeDownloaded"
            });
        }
    }
    if (minAgeRestriction) {
        if (typeof minAgeRestriction !== 'number' || minAgeRestriction > 18 || minAgeRestriction < 1) {
            errorsMessages.push({
                message: "minAgeRestriction incorrect",
                field: "minAgeRestriction"
            });
        }
    }
    if (publicationDate) {
        if (typeof publicationDate !== 'string') {
            errorsMessages.push({
                message: "publicationDate incorrect",
                field: "publicationDate"
            });
        }
    }
    if (errorsMessages.length) {
        res.status(400).send({ 'errorsMessages': errorsMessages });
        return;
    }
    if (canBeDownloaded) {
        foundVideo.canBeDownloaded = canBeDownloaded;
    }
    if (minAgeRestriction) {
        foundVideo.minAgeRestriction = minAgeRestriction;
    }
    if (publicationDate) {
        foundVideo.publicationDate = publicationDate;
    }
    if (availableResolutions) {
        foundVideo.availableResolutions = availableResolutions;
    }
    foundVideo.title = title;
    foundVideo.author = author;
    res.status(204).send(foundVideo);
});
exports.app.delete('/videos/:id', (req, res) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(404);
});
// start app
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
