import $ from 'jquery'
import { createWorker } from 'tesseract.js'

declare global {
  interface Window {
    api: {
      testeSelection: () => void
      startAreaSelection: () => Promise<void>
      stopAreaSelection: () => Promise<void>
      getSources: () => Promise<unknown> // Use a specific type if known, otherwise 'unknown'
      captureArea: (area: {
        x: number
        y: number
        width: number
        height: number
      }) => Promise<{ success: boolean }>
      onAreaSelected: (
        callback: (
          event: Electron.IpcRendererEvent,
          area: { x: number; y: number; width: number; height: number }
        ) => void
      ) => Electron.IpcRenderer
      removeAllListeners: (channel: string) => Electron.IpcRenderer
    }
  }
}

$(document).ready(function () {
  $('.bt-select').click(async function () {
    $('.loading-area').html(`
    <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
    `)
    const worker = await createWorker('eng')
    const ret = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png')
    console.log(ret.data.text)
    await worker.terminate()
    $('.loading-area').html(`
    <div></div>
    `)
  })
})

$(document).ready(function () {
  $('.bt-select').click(async function () {
    window.api.startAreaSelection()
  })
})
