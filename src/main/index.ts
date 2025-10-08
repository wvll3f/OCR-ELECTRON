import { app, shell, BrowserWindow, ipcMain, screen, desktopCapturer } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow: BrowserWindow | null = null
let newWindow: BrowserWindow | null = null

function createNewWindow(): void {
  //const displays = screen.getAllDisplays()
  const primaryDisplay = screen.getPrimaryDisplay()

  newWindow = new BrowserWindow({
    width: primaryDisplay.bounds.width,
    height: primaryDisplay.bounds.height,
    x: 0,
    y: 0,
    transparent: true,
    focusable: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js')
    }
  })

  newWindow.loadFile(join(__dirname, '../../src/renderer/selection.html'))
  newWindow.setIgnoreMouseEvents(false)

  // Remove a janela do overlay quando fechada
  newWindow.on('closed', () => {
    newWindow = null
  })
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow ? mainWindow.show() : console.log('mainWindow is not defined')
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.handle('start-area-selection', () => {
  createNewWindow()
})

ipcMain.on('stop-area-selection', () => {
  if (newWindow) {
    newWindow.close()
  }
})

ipcMain.handle('get-sources', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width: 800, height: 600 }
  })
  return sources
})

ipcMain.handle('capture-area', async (event, area) => {
  console.log(area)
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: screen.getPrimaryDisplay().workAreaSize
    })

    // Aqui você implementaria a lógica para capturar a área específica
    // Esta é uma implementação simplificada
    return { success: true, area }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
