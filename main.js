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
        Object.keys(store).forEach(function (_type) {
            // Somebody save me from myself
            var type = _type;
            var items = store[type];
            lists[type].textContent = "";
            var weightTotal = 0;
            items.forEach(function (item) {
                weightTotal += item.weight || 1;
                var li = document.createElement("li");
                li.classList.add("p-2", "flex", "justify-between");
                var span = document.createElement("span");
                span.textContent = item.text;
                li.appendChild(span);
                var controlsDiv = document.createElement("div");
                li.appendChild(controlsDiv);
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
            document.getElementById(type + "-total").textContent = weightTotal;
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
})();
