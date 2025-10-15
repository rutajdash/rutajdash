import AppDB from "./AppDB";

export default class VideoDB extends AppDB {
  static readonly STORE_NAME = "rutajs_portfolio_videos_db";

  static async initialize(): Promise<VideoDB> {
    const db = await super.openDB([VideoDB.STORE_NAME]);
    return new VideoDB(db);
  }

  async getVideo(key: IDBValidKey | string): Promise<Blob> {
    return super.getItem(VideoDB.STORE_NAME, key) as Promise<Blob>;
  }

  async preloadVideo(videoUrl: string): Promise<IDBValidKey> {
    if (!videoUrl) {
      throw new Error("Invalid video URL");
    }

    if (await this.hasItem(VideoDB.STORE_NAME, videoUrl)) {
      return videoUrl;
    }

    const response = await fetch(videoUrl, { mode: "no-cors" });
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const blob = await response.blob();

    return super.setItem(VideoDB.STORE_NAME, blob, videoUrl);
  }
}
