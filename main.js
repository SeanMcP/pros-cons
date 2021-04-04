var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function main() {
    // Code goes here
    var lists = {
        cons: document.getElementById("cons"),
        pros: document.getElementById("pros")
    };
    var store = {
        pros: [],
        cons: []
    };
    var dataFromStorage = localStorage.getItem("pros-cons");
    if (dataFromStorage) {
        store = JSON.parse(dataFromStorage);
    }
    function copy(value) {
        return JSON.parse(JSON.stringify(value));
    }
    function syncWithStorage() {
        localStorage.setItem("pros-cons", JSON.stringify(store));
    }
    function renderItems() {
        var weightTotal = {
            pros: 0,
            cons: 0
        };
        Object.keys(store).forEach(function (_type) {
            // Somebody save me from myself
            var type = _type;
            var items = store[type];
            lists[type].textContent = "";
            items.forEach(function (item) {
                // @ts-ignore
                weightTotal[type] += Number(item.weight);
                var li = document.createElement("li");
                li.classList.add("p-2", "flex", "justify-between");
                var span = document.createElement("span");
                span.textContent = item.text;
                li.appendChild(span);
                var controlsDiv = document.createElement("div");
                li.appendChild(controlsDiv);
                var weightInput = document.createElement("input");
                weightInput.setAttribute("aria-label", "Weight");
                weightInput.type = "number";
                weightInput.value = String(item.weight);
                weightInput.addEventListener("input", function (event) {
                    event.preventDefault();
                    // @ts-ignore
                    setWeight(item.id, type, Number(event.target.value));
                });
                controlsDiv.appendChild(weightInput);
                var upButton = document.createElement("button");
                upButton.textContent = "Up";
                upButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    move(item.id, type, "up");
                });
                controlsDiv.appendChild(upButton);
                var downButton = document.createElement("button");
                downButton.textContent = "Down";
                downButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    move(item.id, type, "down");
                });
                controlsDiv.appendChild(downButton);
                var deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    remove(item.id, type);
                });
                controlsDiv.appendChild(deleteButton);
                lists[type].appendChild(li);
            });
            // @ts-ignore
            document.getElementById(type + "-total").textContent = weightTotal[type];
        });
        var heavier = "";
        if (weightTotal.cons > weightTotal.pros) {
            heavier = "cons";
        }
        else if (weightTotal.cons < weightTotal.pros) {
            heavier = "pros";
        }
        document.querySelectorAll(".list-container").forEach(function (node) {
            if (heavier && node.classList.contains("--" + heavier)) {
                node.classList.add("border-green-200");
            }
            else {
                node.classList.remove("border-green-200");
            }
        });
    }
    function update() {
        renderItems();
        // Now this can be parameterized
        syncWithStorage();
    }
    update();
    document.querySelectorAll('form[name="add"]').forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var value = String(new FormData(event.target).get("item"));
            if (value) {
                add(value, form.dataset.parent);
            }
            form.reset();
        });
    });
    function add(text, type) {
        store[type].push({
            id: String(new Date().getTime()).slice(-5),
            text: text,
            weight: 1
        });
        update();
    }
    function move(id, type, direction) {
        var next = copy(store[type]);
        var length = next.length;
        var index = -1;
        for (var i = 0; i < next.length; i++) {
            if (next[i].id === id) {
                index = i;
                break;
            }
        }
        var item = next.splice(index, 1)[0];
        var nextIndex = index;
        switch (direction) {
            case "up": {
                if (index === 0)
                    return;
                nextIndex = index - 1;
                break;
            }
            case "down": {
                if (index === length - 1)
                    return;
                nextIndex = index + 1;
                break;
            }
        }
        next.splice(nextIndex, 0, item);
        store[type] = next;
        update();
    }
    function remove(id, type) {
        store[type] = store[type].filter(function (item) { return item.id !== id; });
        update();
    }
    function setWeight(id, type, weight) {
        store[type] = store[type].map(function (item) {
            if (item.id === id) {
                return __assign(__assign({}, item), { weight: weight });
            }
            return item;
        });
        update();
    }
})();
