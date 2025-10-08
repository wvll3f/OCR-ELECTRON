import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  testeSelection: (): void => ipcRenderer.send('start-selection'),
  startAreaSelection: () => ipcRenderer.invoke('start-area-selection'),
  stopAreaSelection: () => ipcRenderer.invoke('stop-area-selection'),
  getSources: () => ipcRenderer.invoke('get-sources'),
  captureArea: (area) => ipcRenderer.invoke('capture-area', area),
  onAreaSelected: (callback) => ipcRenderer.on('area-selected', callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
