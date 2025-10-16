import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  storeToken: (token: string) => ipcRenderer.invoke('store-token', token),
  getToken: () => ipcRenderer.invoke('get-token'),
  setCompactMode: (isCompact: boolean, targetHeight?: number) => ipcRenderer.invoke('set-compact-mode', isCompact, targetHeight),
})

