/* eslint-disable no-console */
// This file only slightly modified from https://javascript.plainenglish.io/playing-youtube-audio-in-the-background-using-javascript-on-mobile-c19aea937ec1
import express from 'express';
import path from 'path';
import ytdl from 'ytdl-core';

const app = express();

const getInfo = async (req, res) => {
  try {
    const { url } = req.query;
    const videoId = ytdl.getURLVideoID(url);

    const videoInfo = await ytdl.getInfo(videoId);
    const { thumbnail, author, title } = videoInfo.videoDetails;

    return res.status(200).json({
      success: true,
      data: {
        thumbnail: thumbnail['thumbnails'][0].url || null,
        videoId,
        author: author ? author['name'] : null,
        title,
      },
    });
  } catch (error) {
    console.log(`error --->`, error);
    return res
      .status(500)
      .json({ success: false, msg: 'Failed to get video info' });
  }
};

const getAudioStream = async (req, res) => {
  try {
    const { videoId } = req.params;
    const isValid = ytdl.validateID(videoId);

    if (!isValid) {
      throw new Error();
    }

    const videoInfo = await ytdl.getInfo(videoId);
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });

    const { itag, container, contentLength } = audioFormat;

    // define headers
    const rangeHeader = req.headers.range || null;
    const rangePosition = rangeHeader
      ? rangeHeader.replace(/bytes=/, '').split('-')
      : null;
    console.log(`rangePosition`, rangePosition);
    const startRange = rangePosition ? parseInt(rangePosition[0], 10) : 0;
    const endRange =
      rangePosition && rangePosition[1].length > 0
        ? parseInt(rangePosition[1], 10)
        : parseInt(contentLength, 10) - 1;
    const chunksize = endRange - startRange + 1;

    //         Send partial response
    res.writeHead(206, {
      'Content-Type': `audio/${container}`,
      'Content-Length': chunksize,
      'Content-Range':
        'bytes ' + startRange + '-' + endRange + '/' + contentLength,
      'Accept-Ranges': 'bytes',
    });

    const range = { start: startRange, end: endRange };
    const audioStream = ytdl(videoId, {
      filter: (format) => format.itag === itag,
      range,
    });
    audioStream.pipe(res);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/info', getInfo);
app.get('/stream/:videoId', getAudioStream);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Screamin' Streaming Server on ${PORT}`));
