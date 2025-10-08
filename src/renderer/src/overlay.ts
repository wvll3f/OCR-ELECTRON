let isSelecting = false
let startX, startY
let currentX, currentY
const selectionArea = document.getElementById('selection-area') as HTMLElement
const selectionInfo = document.getElementById('selection-info') as HTMLElement
const overlay = document.getElementById('selection-overlay') as HTMLElement

document.addEventListener('mousedown', startSelection)
document.addEventListener('mousemove', updateSelection)
document.addEventListener('mouseup', endSelection)
document.addEventListener('keydown', handleKeyPress)

function startSelection(e): void {
  isSelecting = true
  window.api.testeSelection()
  startX = e.clientX
  startY = e.clientY

  selectionArea.style.left = startX + 'px'
  selectionArea.style.top = startY + 'px'
  selectionArea.style.width = '0px'
  selectionArea.style.height = '0px'
  selectionArea.style.display = 'block'

  updateInfo()
  selectionInfo.style.display = 'block'
}

function updateSelection(e): void {
  window.api.testeSelection()
  if (!isSelecting) return

  currentX = e.clientX
  currentY = e.clientY

  const width = currentX - startX
  const height = currentY - startY

  selectionArea.style.width = Math.abs(width) + 'px'
  selectionArea.style.height = Math.abs(height) + 'px'
  selectionArea.style.left = (width < 0 ? currentX : startX) + 'px'
  selectionArea.style.top = (height < 0 ? currentY : startY) + 'px'

  updateInfo()
}

function endSelection(): void {
  window.api.testeSelection()
  if (!isSelecting) return
  isSelecting = false

  const area = {
    x: parseInt(selectionArea.style.left),
    y: parseInt(selectionArea.style.top),
    width: parseInt(selectionArea.style.width),
    height: parseInt(selectionArea.style.height)
  }

  // Envia a área selecionada para a janela principal
  if (window.api) {
    window.api.captureArea(area).then((result) => {
      if (result.success) {
        // Fecha o overlay e inicia a captura
        window.api.stopAreaSelection()

        // Envia mensagem para a janela principal (simulação)
        // Em uma implementação real, você usaria IPC para comunicar entre janelas
        console.log('Área selecionada:', area)
      }
    })
  }
}

function updateInfo(): void {
  window.api.testeSelection()
  const width = parseInt(selectionArea.style.width)
  const height = parseInt(selectionArea.style.height)

  selectionInfo.textContent = `${width} x ${height}`
  selectionInfo.style.left = parseInt(selectionArea.style.left) + width + 10 + 'px'
  selectionInfo.style.top = parseInt(selectionArea.style.top) - 25 + 'px'
}

function handleKeyPress(e): void {
  if (e.key === 'Escape') {
    endSelection()
    if (window.api) {
      window.api.stopAreaSelection()
    }
  }
}
