export function renderBlock (elementId: string, html: string) : void
{
  const element = document.getElementById(elementId)
  element.innerHTML = html
}

export function renderToast (message, action?) : void
{
  let messageText = ''
  
  if (message != null) {
    messageText = `
      <div id="info-block" class="info-block ${message.type}">
        <p>${message.text}</p>
        <button id="toast-main-action">${action?.name || 'Закрыть'}</button>
      </div>
    `
  }
  
  renderBlock(
    'toast-block',
    messageText
  )

  const button = document.getElementById('toast-main-action')
  if (button != null) {
    button.onclick = function() {
      if (action != null && action.handler != null) {
        action.handler()
      }
      renderToast(null)
    }
  }
}

/**
 * convert date to string '2021-07-11'
 * @param date
 */
export function convertDateToString(date: Date) :string
{
  return date.toISOString().substr(0,10)
}
