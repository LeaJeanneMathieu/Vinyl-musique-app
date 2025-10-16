import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let mainWindow: BrowserWindow | null = null
let lastNormalBounds: Electron.Rectangle | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 400,
    minHeight: 100,
    backgroundColor: '#FFF8F0',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hiddenInset',
    useContentSize: true,
    title: 'Spotify Vinyl Player',
  })

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers for secure storage
ipcMain.handle('store-token', async (_, token: string) => {
  // In a production app, you'd want to use electron-store or keytar
  // For now, we'll just acknowledge receipt
  return true
})

ipcMain.handle('get-token', async () => {
  // Return stored token
  return null
})

// Resize window when toggling compact mode
ipcMain.handle('set-compact-mode', async (_evt, isCompact: boolean, targetHeight?: number) => {
  if (!mainWindow) return false
  try {
    if (isCompact) {
      // Store current bounds to restore later
      lastNormalBounds = mainWindow.getBounds()
      // Smaller, thin bar window
      const [curW, curWinH] = mainWindow.getSize()
      const [curContentW, curContentH] = mainWindow.getContentSize()
      const frameHeight = Math.max(0, curWinH - curContentH)
      const targetWidth = Math.max(420, Math.min(curW, 680))
      const h = Math.max(60, Math.min(targetHeight ?? 120, 180))
      mainWindow.setResizable(true)
      mainWindow.setMinimumSize(320, frameHeight + 50)
      // Set content size so visible area matches compact bar
      mainWindow.setContentSize(targetWidth, h)
    } else {
      // Restore last normal bounds if available
      if (lastNormalBounds) {
        mainWindow.setMinimumSize(400, 500)
        mainWindow.setResizable(true)
        mainWindow.setBounds(lastNormalBounds)
        lastNormalBounds = null
        return true
      }
      // Fallback to a comfortable default
      const [curW, curH] = mainWindow.getSize()
      const targetWidth = Math.max(curW, 900)
      const targetHeight = Math.max(curH, 700)
      mainWindow.setMinimumSize(400, 500)
      mainWindow.setResizable(true)
      mainWindow.setSize(targetWidth, targetHeight)
    }
    return true
  } catch {
    return false
  }
})

