export interface IThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface ILocalized {
  title: string;
  description: string;
}

export interface ISnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: IThumbnail;
    medium: IThumbnail;
    high: IThumbnail;
    standard: IThumbnail;
    maxres: IThumbnail;
  };
  channelTitle: string;
  tags: string[];
  categoryId: string;
  liveBroadcastContent: string;
  localized: ILocalized;
}

export interface IVideoItem {
  kind: string;
  etag: string;
  id: string;
  snippet: ISnippet;
}

export interface IYoutubeResult {
  kind: string;
  etag: string;
  items: IVideoItem[];
}