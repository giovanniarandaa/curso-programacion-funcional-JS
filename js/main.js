const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data) 

  // {
  //   tag: 'h1',
  //   attr: {
  //     class: 'title'
  //   }
  // }
// const attrsToString = (obj = {}) => {
//   const keys = Object.keys(obj)
//   const attrs = []

//   for(let i=0; i<keys.length; i++) {
//     let attr = keys[i]
//     attrs.push(`${attr}="${obj[attr]}"`)
//   }

//   const string = attrs.join('')
//   return string
// }

const attrsToString = (obj = {}) => 
  Object.keys(obj)
    .map(attr => `${attr}="${obj[attr]}"`)
    .join('')


const tagAttrs = obj => (content = "") => 
  `<${obj.tag}${obj.attrs ? ' ' : ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`

// const tag = t => {
//   if(typeof t === 'string') {
//     return tagAttrs({ tag: t })
//   }
//   return tagAttrs(t)
// }

const tag = t => typeof t === 'string' ? tagAttrs({tag: t}) : tagAttrs(t)

const tableRowTag = tag('tr')
const tableRow = items => compose(tableRowTag, tableCells)(items)

const tableCell = tag('td')
const tableCells = items => items.map(tableCell).join('')

const trashIcon = tag({tag: 'i', attrs: { class: 'fas fa-trash-alt'}})()

const description = document.getElementById('description')
const calories = document.getElementById('calories')
const carbs = document.getElementById('carbs')
const protein = document.getElementById('protein')

let list = []

description.addEventListener('keypress', () => description.classList.remove('is-invalid'))
calories.addEventListener('keypress', () => calories.classList.remove('is-invalid'))
carbs.addEventListener('keypress', () => carbs.classList.remove('is-invalid'))
protein.addEventListener('keypress', () => protein.classList.remove('is-invalid'))

const validateInputs = () => {
  description.value ? '' : description.classList.add('is-invalid')
  calories.value ? '' : calories.classList.add('is-invalid')
  carbs.value ? '' : carbs.classList.add('is-invalid')
  protein.value ? '' : protein.classList.add('is-invalid')

  if (description.value && calories.value && carbs.value && protein.value) 
    add()
}

const add = () => {
  const newItem = {
    description: description.value,
    calories: parseInt(calories.value),
    carbs: parseInt(carbs.value),
    protein: parseInt(protein.value)
  }

  list.push(newItem)
  cleanInputs()
  updateTotals()
  renderItems()
  console.table(list)
}

const updateTotals = () => {
  let calories = 0, carbs = 0, protein = 0

  list.map(item => {
    calories += item.calories,
    carbs += item.carbs,
    protein += item.protein
  })

  document.getElementById('totalCalories').innerText = calories
  document.getElementById('totalCarbs').innerText = carbs
  document.getElementById('totalProtein').innerText = protein
}

const cleanInputs = () => {
  description.value = ''
  calories.value = ''
  carbs.value = ''
  protein.value = ''
}

const renderItems = () => {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = ''

  list.map((item, index) => {

    const removeButton = tag({
      tag: 'button',
      attrs: {
        class: 'btn btn-outline-danger',
        onclick: `removeItem(${index})`
      }
    })(trashIcon)

    tbody.innerHTML += tableRow([
      item.description,
      item.calories,
      item.carbs,
      item.protein,
      removeButton
    ])
  })
}

const removeItem = (index) => {
  list.splice(index, 1)
  updateTotals()
  renderItems()
}