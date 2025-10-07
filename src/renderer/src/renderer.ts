import $ from 'jquery'
import { createWorker } from 'tesseract.js'

declare global {
  interface Window {
    api: {
      openTransparentWindow: () => void
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
    window.api.openTransparentWindow()
  })
})
