import { renderBlock } from './lib.js'

export function renderSearchFormBlock (checkinIn?: string, checkoutIn?: string) : void
{
  // дата сегодняшнего дня
  const today = new Date(Date.now())
  // дата завтрашнего дня
  const tomorrow = new Date(Date.now() + 24*60*60*1000)
  // последний день следующего месяца
  const lastDateOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0)

  // дата сегодняшнего дня в виде строки '2021-07-11'
  const min = [
    today.getFullYear(),
    (today.getMonth()+1).toString().padStart(2, '0'),
    today.getDate().toString().padStart(2, '0')
  ].join('-')

  // дата последнего дня следующего месяца в виде строки '2021-08-31'
  const max = [
    lastDateOfNextMonth.getFullYear(),
    (lastDateOfNextMonth.getMonth()+2).toString().padStart(2, '0'),
    lastDateOfNextMonth.getDate().toString().padStart(2, '0')
  ].join('-')

  // checkin
  let checkin = ''
  if ( !checkinIn ||
        Date.parse(checkinIn) < today.getTime() ||
          Date.parse(checkinIn) > lastDateOfNextMonth.getTime() ||
            Date.parse(checkinIn) > Date.parse(checkoutIn)
  ) {
    checkin = [
      tomorrow.getFullYear(),
      (tomorrow.getMonth()+1).toString().padStart(2, '0'),
      tomorrow.getDate().toString().padStart(2, '0')
    ].join('-')
  }
  else {
    checkin = checkinIn
  }

  // checkout
  let checkout = ''
  if ( !checkoutIn && !checkinIn ) {
    const checkOutDefault = new Date(Date.now() + 3*24*60*60*1000)
    checkout = [
      checkOutDefault.getFullYear(),
      (checkOutDefault.getMonth()+1).toString().padStart(2, '0'),
      checkOutDefault.getDate().toString().padStart(2, '0')
    ].join('-')
  }
  else if(!checkoutIn && checkinIn &&
            Date.parse(checkinIn) > today.getTime() &&
              Date.parse(checkinIn) < (lastDateOfNextMonth.getTime() - 24*60*60*1000)
  ) {
    const checkoutNew = new Date(Date.parse(checkinIn) + 24*60*60*1000)
    checkout = [
      checkoutNew.getFullYear(),
      (checkoutNew.getMonth()+1).toString().padStart(2, '0'),
      checkoutNew.getDate().toString().padStart(2, '0')
    ].join('-')
  }
  else {
    checkout = checkoutIn
  }

  renderBlock(
    'search-form-block',
    `
    <form>
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value="${checkin}" min="${min}" max="${max}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${checkout}" min="${min}" max="${max}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )
}
