export const AUTH_TOKEN_NAME = 'auth-token';

export class StorageAdapter {
  private static instance: StorageAdapter | null = null;

  public static getInstance(): StorageAdapter {
    if (this.instance === null) {
      this.instance = new StorageAdapter();
    }

    return this.instance;
  }

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
    const token = this.getItem(AUTH_TOKEN_NAME);
    // Discard values serialized by the old unchecked authentication callback.
    if (token === 'undefined' || token === 'null' || token?.trim() === '') {
      this.clearAuthToken();
      return null;
    }
    return token;
  }

  public clearAuthToken(): void {
    this.clearItem(AUTH_TOKEN_NAME);
  }
}
