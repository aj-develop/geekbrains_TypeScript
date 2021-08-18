import { renderBlock, convertDateToString } from './lib.js'

export function renderSearchFormBlock (checkinIn?: string, checkoutIn?: string) : void
{
  // дата сегодняшнего дня
  const today = new Date(Date.now())
  // дата завтрашнего дня
  const tomorrow = new Date(Date.now() + 24*60*60*1000)
  // последний день следующего месяца
  const lastDateOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0)

  // дата сегодняшнего дня в виде строки '2021-07-11'
  const min = convertDateToString(today)
  // дата последнего дня следующего месяца в виде строки '2021-08-31'
  const max = convertDateToString(lastDateOfNextMonth)

  // checkin
  let checkin = ''
  checkinIn = checkinIn ?? ''
  checkoutIn = checkoutIn ?? ''
  if ( !checkinIn ||
        Date.parse(checkinIn) < today.getTime() ||
          Date.parse(checkinIn) > lastDateOfNextMonth.getTime() ||
            Date.parse(checkinIn) > Date.parse(checkoutIn)
  ) {
    checkin = convertDateToString(tomorrow)
  }
  else {
    checkin = checkinIn
  }

  // checkout
  let checkout = ''
  if ( !checkoutIn && !checkinIn ) {
    const checkOutDefault = new Date(Date.now() + 3*24*60*60*1000)
    checkout = convertDateToString(checkOutDefault)
  }
  else if(!checkoutIn && checkinIn &&
            Date.parse(checkinIn) > today.getTime() &&
              Date.parse(checkinIn) < (lastDateOfNextMonth.getTime() - 24*60*60*1000)
  ) {
    const checkoutNew = new Date(Date.parse(checkinIn) + 24*60*60*1000)
    checkout = convertDateToString(checkoutNew)
  }
  else {
    checkout = checkoutIn ?? ''
  }

  renderBlock(
    'search-form-block',
    `
    <form id="search-form">
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input name="city" id="city" type="text" readonly="readonly" value="Санкт-Петербург" />
            <input name="cityCoordinates" type="hidden" readonly="readonly" value="59.9386,30.3141" />
          </div>
          <div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flatRent" checked /> FlatRent</label>
          </div>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value="${checkin}" min="${min}" max="${max}" name="checkInDate" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${checkout}" min="${min}" max="${max}" name="checkOutDate" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="priceLimit" class="max-price" />
          </div>
          <div>
            <div><button type="submit" ">Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )
}
