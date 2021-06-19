import { Youtube } from './Youtube';
import express from 'express';
import path from 'path';
import hbs from 'hbs';
import ytdl from 'ytdl-core';
import { chunkArray } from './utils/template';


const app = express();
app.use(express.static('static'));

app.set('view engine', 'hbs')
app.set('views', path.resolve(__dirname, '../views'));
app.set('env', 'development');
hbs.registerPartials(path.resolve(__dirname, '../views', 'partials'));


let apiKey = process.env.API_KEY || 'AIzaSyCqxPoQJsBKYBcaG4Y6VEBzVNsT5qShQew';

const youtube = new Youtube(apiKey);
app.get('/', async (req, res) => {
  let { pageToken, region } = req.query;
  region = region ? region + '' : 'us';
  try {
    const { data } = await youtube.getPopular(region, 20, { pageToken });
    const { prevPageToken, nextPageToken, items } = data;
    res.render('index', { videos: items, prevPageToken, nextPageToken });
  } catch (e) {
    res.status(500).send(e);
  }
})

app.get('/videos', async (req, res) => {
  const { pageToken, q } = req.query;
  try {
    const { data } = await youtube.searchAll(q + '', 30, { pageToken });
    const { items, nextPageToken, prevPageToken } = data;
    res.render('search', { videos: items, prevPageToken, nextPageToken });
  } catch (e) {
    res.status(500).send(e);
  }
})

app.get('/videos/:url', async (req, res) => {
  const { url } = req.params;
  try {
    const { data } = await youtube.getVideo(url);
    if (data.items) {
      const { id, snippet, statistics } = data.items[0];
      if (!id) throw new Error('id not found');
      const relatedVideos = await youtube.searchRelated(id)
      const info = await ytdl.getInfo(url);
      let format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
      res.render('video', {
        url: format.url,
        video: snippet,
        stats: statistics,
        relatedVideos: relatedVideos.data.items,
      })
    }
  } catch (e) {
    res.send(e);
  }
})

app.get('/channels/:id', async (req, res) => {
  const videos = await youtube.getVideosByChannel(req.params.id);
  res.render('search', { videos: videos.data.items })
})

app.get('/playlists/:id', async (req, res) => {
  try {
    const playlists = await youtube.getPlaylistsByChannel(req.params.id);
    res.render('playlist', { playlists: playlists.data.items });
  } catch (e) {
    res.send(e);
  }

})
const PORT: string | number = process.env.PORT || 8081;
app.listen(PORT);

