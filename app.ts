enum Status {
	TODO = "todo",
	IN_PROGRESS = "in_progress",
	DONE = "done",
}

class Task {
	id: string;
	name: string;
	status: Status;

	constructor({
		id = new Date().getTime().toString(),
		name = "Unnamed Task",
		status = Status.TODO,
	}: Partial<Task>) {
		this.id = id;
		this.name = name;
		this.status = status;
		this.updateLocalStorage();
	}

	changeStatus(status: Status) {
		this.status = status;
		this.updateLocalStorage();
	}

	updateLocalStorage() {
		localStorage.setItem(this.id, `${this.status}:${this.name}`);
	}
}

class TODOList {
	container: HTMLElement;

	constructor(rootId: string) {
		const container = document.getElementById(rootId);

		if (!container) {
			alert("ROOT NOT FOUND");

			return;
		}

		const inputWrapper = document.createElement("div");
		const input = document.createElement("input");
		const button = document.createElement("button");
		const ul = document.createElement("ul");

		inputWrapper.className = "input-wrapp";

		input.className = "input";

		button.className = "input__btn";
		button.innerText = "Add TODO";
		button.onclick = () => this.addTask({ name: input.value });

		ul.className = "list-contain__nav";

		inputWrapper.appendChild(input);
		inputWrapper.appendChild(button);
		container.appendChild(inputWrapper);
		container.appendChild(ul);

		this.container = container;

		//@ts-expect-error es2017
		Object.entries(localStorage).forEach(([id, value]: [string, string]) => {
			const [status, ...splittedName] = value.split(":") as [Status, string[]];

			this.addTask({ id, status, name: splittedName.join("") });
		});
	}

	addTask(data: Partial<Task>) {
		if (!data.name) {
			alert("Enter task name");

			return;
		}

		const task = new Task(data);

		const li = document.createElement("li");
		const status = document.createElement("span");
		const span = document.createElement("span");

		li.setAttribute("id", task.id);
		li.innerText = task.name;
		li.appendChild(status);
		li.appendChild(span);

		status.className = `status status-${task.status}`;
		status.onclick = () => {
			const newStatus =
				task.status === Status.TODO ? Status.IN_PROGRESS : Status.DONE;

			task.changeStatus(newStatus);
			status.className = `status status-${newStatus}`;
		};

		span.innerHTML = "\u00d7";
		span.onclick = (e) => this.removeTask(e);
		this.container.querySelector("ul")?.appendChild(li);

		this.clearInput();
	}

	removeTask(e) {
		e.target.parentElement.remove();
		localStorage.removeItem(e.target.parentElement.id);
	}

	clearInput() {
		const input = this.container.querySelector("input");

		if (input) {
			input.value = "";
		}
	}
}

new TODOList("root");
