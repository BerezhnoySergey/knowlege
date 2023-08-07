var Status;
(function (Status) {
    Status["TODO"] = "todo";
    Status["IN_PROGRESS"] = "in_progress";
    Status["DONE"] = "done";
})(Status || (Status = {}));
var Task = /** @class */ (function () {
    function Task(_a) {
        var _b = _a.id, id = _b === void 0 ? new Date().getTime().toString() : _b, _c = _a.name, name = _c === void 0 ? "Unnamed Task" : _c, _d = _a.status, status = _d === void 0 ? Status.TODO : _d;
        this.id = id;
        this.name = name;
        this.status = status;
        this.updateLocalStorage();
    }
    Task.prototype.changeStatus = function (status) {
        this.status = status;
        this.updateLocalStorage();
    };
    Task.prototype.updateLocalStorage = function () {
        localStorage.setItem(this.id, "".concat(this.status, ":").concat(this.name));
    };
    return Task;
}());
var TODOList = /** @class */ (function () {
    function TODOList(rootId) {
        var _this = this;
        var container = document.getElementById(rootId);
        if (!container) {
            alert("ROOT NOT FOUND");
            return;
        }
        var inputWrapper = document.createElement("div");
        var input = document.createElement("input");
        var button = document.createElement("button");
        var ul = document.createElement("ul");
        inputWrapper.className = "input-wrapp";
        input.className = "input";
        button.className = "input__btn";
        button.innerText = "Add TODO";
        button.onclick = function () { return _this.addTask({ name: input.value }); };
        ul.className = "list-contain__nav";
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(button);
        container.appendChild(inputWrapper);
        container.appendChild(ul);
        this.container = container;
        //@ts-expect-error es2017
        Object.entries(localStorage).forEach(function (_a) {
            var id = _a[0], value = _a[1];
            var _b = value.split(":"), status = _b[0], splittedName = _b.slice(1);
            _this.addTask({ id: id, status: status, name: splittedName.join("") });
        });
    }
    TODOList.prototype.addTask = function (data) {
        var _this = this;
        var _a;
        if (!data.name) {
            alert("Enter task name");
            return;
        }
        var task = new Task(data);
        var li = document.createElement("li");
        var status = document.createElement("span");
        var span = document.createElement("span");
        li.setAttribute("id", task.id);
        li.innerText = task.name;
        li.appendChild(status);
        li.appendChild(span);
        status.className = "status status-".concat(task.status);
        status.onclick = function () {
            var newStatus = task.status === Status.TODO ? Status.IN_PROGRESS : Status.DONE;
            task.changeStatus(newStatus);
            status.className = "status status-".concat(newStatus);
        };
        span.innerHTML = "\u00d7";
        span.onclick = function (e) { return _this.removeTask(e); };
        (_a = this.container.querySelector("ul")) === null || _a === void 0 ? void 0 : _a.appendChild(li);
        this.clearInput();
    };
    TODOList.prototype.removeTask = function (e) {
        e.target.parentElement.remove();
        localStorage.removeItem(e.target.parentElement.id);
    };
    TODOList.prototype.clearInput = function () {
        var input = this.container.querySelector("input");
        if (input) {
            input.value = "";
        }
    };
    return TODOList;
}());
new TODOList("root");
