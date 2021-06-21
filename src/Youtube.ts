import { google, youtube_v3 } from 'googleapis';

export class Youtube {
  youtube: youtube_v3.Youtube;

  constructor(apiKey: string) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: apiKey
    });
  }

  async searchAll(q: string | undefined, maxResults: number = 30, options: object = {}) {
    const res = await this.youtube.search.list({
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
    const ids = res.data.items?.filter(i => i.id?.videoId).map(i => i.id?.videoId);
    const statistics = await this.getVideoStatistics(ids as string[]);
    return res.data.items?.map(i => {
      if (i.id?.videoId) {
        return {...i, statistics: statistics[i.id.videoId]}
      }
      return {...i}
    })
  }

  searchRelated(relatedToVideoId: string, maxResults: number = 30, options: object = {}) {
    return this.youtube.search.list({
      part: [
        "snippet",
      ],
      relatedToVideoId,
      type: ['video'],
      maxResults,
      ...options,
    });
  }

  async getVideosByChannel(id: string, maxResults: number = 50, options: object = {}) {
    const res = await this.youtube.search.list({
      part: ['snippet'],
      channelId: id,
      type: ['video'],
      maxResults,
      order: "date",
      ...options,
    });
    const ids = res.data.items?.map(i => i.id?.videoId);
    const statistics = await this.getVideoStatistics(ids as string[]);
    return res.data.items?.map(i => ({...i, statistics: statistics[i.id?.videoId]}))
  }

  getPlaylistsByChannel(id: string, maxResults: number = 50, options: object = {}) {
    return this.youtube.playlists.list({
      part: [
        'snippet',
        'contentDetails'
      ],
      channelId: id,
      maxResults,
      ...options,
    });
  }

  getVideosByPlaylist(playlistId: string, maxResults: number = 50) {
    return this.youtube.playlistItems.list({
      part: [
        "snippet, contentDetails"
      ],
      playlistId,
      maxResults,
    })
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

  async getVideoStatistics(ids: string[]) {
    const {data} = await this.youtube.videos.list({
      part: ['statistics'],
      id: ids
    });
    const statistics = data.items?.reduce((o, value) => ({...o, [value.id as string]: value.statistics}), {});
    return statistics;
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