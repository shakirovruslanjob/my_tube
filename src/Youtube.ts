import { google, youtube_v3 } from 'googleapis';

export class Youtube {
  youtube: youtube_v3.Youtube;

  constructor(apiKey: string) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: apiKey
    });
  }

  searchAll(q: string | undefined, maxResults: number = 30, options: object = {}) {
    return this.youtube.search.list({
      part: [
        "snippet",
      ],
      type: [
        "channel",
        "video"
      ],
      maxResults,
      q,
      ...options
    });
  }

  searchRelated(id: string, maxResults: number = 30, options: object = {}) {
    return this.youtube.search.list({
      part: [
        "snippet",
      ],
      relatedToVideoId: id,
      type: ['video'],
      maxResults,
      ...options,
    });
  }

  getVideosByChannel(id: string, maxResults: number = 50, options: object = {}) {
    return this.youtube.search.list({
      part: [
        "snippet",
      ],
      channelId: id,
      maxResults,
      order: "date",
      ...options,
    });
  }

  getPlaylistsByChannel(id: string, maxResults: number = 50, options: object = {}) {
    return this.youtube.playlists.list({
      part: [
        "snippet",
      ],
      channelId: id,
      maxResults,
      ...options,
    });
  }


  getVideo(id: string, options: object = {}) {
    return this.youtube.videos.list({
      part: [
        "snippet",
        "statistics"
      ],
      id: [id],
      ...options
    });
  }

  getPopular(regionCode: string, maxResults: number = 15, options: object = {}) {
    return this.youtube.videos.list({
      part: [
        "snippet",
        "statistics"
      ],
      chart: 'mostPopular',
      regionCode,
      maxResults,
      ...options
    })
  }

  async getComments(videoId: string, maxResults: number = 30, options = {}) {
    try {
      const comments = await this.youtube.commentThreads.list({
        part: ['snippet'],
        maxResults,
        videoId,
        ...options
      });
    } catch (e) {
      console.log(e);
    }
  }
}