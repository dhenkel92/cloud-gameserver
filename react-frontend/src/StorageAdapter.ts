export const AUTH_TOKEN_NAME = 'auth-token';

export class StorageAdapter {
  private static instance: StorageAdapter | null = null;

  public static getInstance(): StorageAdapter {
    if (this.instance === null) {
      this.instance = new StorageAdapter();
    }

    return this.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  public clearItem(key: string): void {
    localStorage.removeItem(key);
  }

  public setAuthToken(token: string): void {
    this.setItem(AUTH_TOKEN_NAME, token);
  }

  public getAuthToken(): string | null {
    return this.getItem(AUTH_TOKEN_NAME);
  }

  public clearAuthToken(): void {
    this.clearItem(AUTH_TOKEN_NAME);
  }
}
