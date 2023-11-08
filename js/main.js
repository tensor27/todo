const form = document.getElementById('form')
const taskInput = document.getElementById('taskInput')
const tasksList = document.getElementById('tasksList')
const emptyListTitle = document.getElementById('#emptyListTitle')
const themeButton = document.getElementById('themeButton')
const themeMenu = document.getElementById('themeMenu')
const themeContainer = document.getElementById('themesId')
const body = document.body
// const card = document.querySelectorAll('.card')
const cardTop = document.getElementById('cardTop')
const cardBottom = document.getElementById('cardBottom')

let tasks = []
if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
}

tasks.forEach(task => renderTask(task))

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)
checkEmptyList()

if (!tasks || tasks.length===0) {
	tasksList.removeEventListener('click', deleteTask)
	tasksList.removeEventListener('click', doneTask)
}

function addTask(event) {
	const someTask = taskInput.value

	const newTask = {
		id: Date.now(),
		text: someTask,
		done: false,
	}

	tasks.push(newTask)

	event.preventDefault()

	renderTask(newTask)

	taskInput.value = ''
	taskInput.focus()
	saveToLS()
	checkEmptyList()
}

function deleteTask(event) {
	if (event.target.dataset.action !== 'delete') return
	console.log(event.target)

	const currentNode = event.target.closest('li')

	const nodeId = Number(currentNode.id)
	tasks = tasks.filter(task => task.id !== nodeId)

	currentNode.remove()
	saveToLS()
	checkEmptyList()
}

function doneTask(event) {
	if (event.target.dataset.action !== 'done') return
	const currentNode = event.target.closest('li')
	const spanTitle = currentNode.querySelector('.task-title')
	spanTitle.classList.toggle('task-title--done')

	const doneTaskId = Number(currentNode.id)
	const findedTask = tasks.find(task => {
		if (task.id === doneTaskId) {
			return true
		}
	})
	findedTask.done = !findedTask.done
	saveToLS()
}

function checkEmptyList() {
	if (tasks.length == 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
		<div id='emptyListTitle' class="empty-list__title">Список дел пуст</div>
	</li>`
		tasksList.insertAdjacentHTML('beforeend', emptyListHTML)
	}

	//для избежания ошибок
	if (tasks.length > 0) {
		const emptyListHtmlDeleted = document.querySelector('#emptyList')
		emptyListHtmlDeleted ? emptyListHtmlDeleted.remove() : null
	}
}

function saveToLS() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title'
	const taskHtml = `<li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
		<span class="${cssClass}">${task.text}</span>
		<div class="task-item__buttons">
			<button type="button" data-action="done" class="btn-action">
				<img src="./img/tick.svg" alt="Done" width="18" height="18">
			</button>
			<button type="button" data-action="delete" class="btn-action">
				<img src="./img/cross.svg" alt="Done" width="18" height="18">
			</button>
		</div>
		</li>`

	tasksList.insertAdjacentHTML('beforeend', taskHtml)
}

themeButton.addEventListener('click', () => {
	themeMenu.classList.toggle('open')
})

// changing the theme color

const themeGradients = {
	green: {
		body: 'linear-gradient(109.6deg, rgba(102, 203, 149, 1) 11.2%, rgba(39, 210, 175, 1) 98.7%)',
		card: 'linear-gradient( 109.6deg, rgba(61, 131, 97, 1) 11.2%, rgba(28, 103, 88, 1) 91.1% )',
	},
	purple: {
		body: 'linear-gradient(83.2deg, rgba(150, 93, 233, 1) 10.8%, rgba(99,88,238,0.78) 94.3%)',
		card: 'linear-gradient(83.2deg, rgb(136, 83, 215) 10.8%, rgb(82, 75, 188) 94.3%)',
	},
	blue: {
		body: 'linear-gradient(109.6deg, rgba(39, 142, 255, 1) 11.2%, rgba(98, 124, 255, 0.78) 100.2%)',
		card: 'linear-gradient(109.6deg, rgb(45, 131, 224) 11.2%, rgba(57, 104, 235, 0.78) 100.2%)',
	},
	gray: {
		body: 'linear-gradient(110.3deg, rgb(122, 144, 163) 4.3%, rgb(92, 99, 127) 96.7%)',
		card: 'linear-gradient(110.3deg, rgb(91, 107, 120) 4.3%, rgb(59, 64, 83) 96.7%)',
	},
}

const savedTheme = localStorage.getItem('selectedTheme')

function setTheme(themeId) {
	const theme = themeGradients[themeId]
	body.style.backgroundImage = theme.body
	// card.forEach(card => {
	// 	card.style.backgroundImage = theme.card
	// })
	cardTop.style.backgroundImage = cardBottom.style.backgroundImage = theme.card
	localStorage.setItem('selectedTheme', themeId)
}

if (savedTheme && themeGradients[savedTheme]) {
	setTheme(savedTheme)
}

themeMenu.addEventListener('click', event => {
	const themeId = event.target.id
	if (themeGradients[themeId]) {
		setTheme(themeId)
	}
})
