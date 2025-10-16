export interface ElectronAPI {
  storeToken: (token: string) => Promise<boolean>
  getToken: () => Promise<string | null>
  setCompactMode: (isCompact: boolean, targetHeight?: number) => Promise<boolean>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

