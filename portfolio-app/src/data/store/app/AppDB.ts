export default class AppDB {
  static readonly DB_NAME = "rutajs_portfolio_db";
  static readonly DB_VERSION = 1;

  private db: IDBDatabase;

  constructor(db: IDBDatabase) {
    this.db = db;
  }

  static async openDB(storeNames?: string[]): Promise<IDBDatabase> {
    if (!("indexedDB" in window)) {
      throw new Error("IndexedDB is not supported in this browser.");
    }

    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(AppDB.DB_NAME, AppDB.DB_VERSION);

      request.onupgradeneeded = function () {
        const db = this.result;
        if (!storeNames) return;
        for (const storeName of storeNames) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        }
      };

      request.onsuccess = function () {
        resolve(this.result);
      };

      request.onerror = function () {
        reject(this.error);
      };
    });
  }

  public closeDB(): void {
    this.db.close();
  }

  protected async getItem(
    storeName: string,
    key: IDBValidKey | string,
  ): Promise<object> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  protected async hasItem(
    storeName: string,
    key: IDBValidKey | string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.count(key);

      request.onsuccess = () => {
        resolve(request.result > 0);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  protected async setItem(
    storeName: string,
    value: object,
    key?: IDBValidKey | string,
  ): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(value, key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}
