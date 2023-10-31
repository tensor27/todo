const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyListTitle = document.querySelector('#emptyListTitle')

let tasks = [] //создаём массив, кодорый содержит объекты-таски
if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
}

tasks.forEach(task => renderTask(task))

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)
checkEmptyList()

function addTask(event) {

	const someTask = taskInput.value

	//создаём объект, содержащий id, текст и статус выполнения
	const newTask = {
		id: Date.now(),
		text: someTask,
		done: false,
	}

	tasks.push(newTask) // пушим объект в массив

	event.preventDefault()

	renderTask(newTask)

	taskInput.value = ''
	taskInput.focus()
	saveToLS()
	checkEmptyList()

}

function deleteTask(event) {
	if (event.target.dataset.action !== 'delete') return

	const currentNode = event.target.closest('li')

	/*чтобы идентифицировать элемент списка, который мы хотим удалить,
	создадим переменную, куда запишем id удаляемого li*/

	const nodeId = Number(currentNode.id) // возвращает длинный айди

	/* Создадим переменную, куда запишется индекс элемента массива, который содержит в себе nodeId. Это делается, чтобы удалить из массива объект, который содержит в себе nodeId. */

	// __________________________________________________

	//Способ 1
	// const index = tasks.findIndex(el => {
	// 	if (el.id === nodeId) return true
	// })
	// /*index содержит в себе индекс объекта (в массиве), содержащий в себе nodeId*/

	// tasks.splice(index, 1) /*Удаление в массиве элементов, начиная с
	// индекса index, после этого индекса удаляется 1 элемент */
	// __________________________________________________

	//Способ 2
	tasks = tasks.filter(task => task.id !== nodeId) /*т.е тут в массив
	попадают только те элементы, у которых task.id не равен nodeId */

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

	//ниже код для избежания ошибок
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
