(function main() {
    // Code goes here
    var lists = {
        cons: document.getElementById("cons"),
        pros: document.getElementById("pros")
    };
    var cache = {
        pros: [],
        cons: []
    };
    function updateCache() {
        cache.pros = JSON.parse(localStorage.getItem("pros") || "[]");
        cache.cons = JSON.parse(localStorage.getItem("cons") || "[]");
        // Fire event?
    }
    function renderItems() {
        Object.keys(cache).forEach(function (_type) {
            // Somebody save me from myself
            var type = _type;
            var items = cache[type];
            lists[type].textContent = "";
            items.forEach(function (item) {
                var li = document.createElement("li");
                li.classList.add("p-2", "flex", "justify-between");
                var span = document.createElement("span");
                span.textContent = item.item;
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
        });
    }
    function refreshUi() {
        updateCache();
        renderItems();
    }
    refreshUi();
    document.querySelectorAll('form[name="add"]').forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var item = new FormData(event.target).get("item");
            if (item) {
                add(item, form.dataset.parent);
            }
            form.reset();
        });
    });
    function add(item, type) {
        var store = JSON.parse(localStorage.getItem(type) || "[]");
        store.push({
            id: String(new Date().getTime()).slice(-5),
            item: item
        });
        localStorage.setItem(type, JSON.stringify(store));
        refreshUi();
    }
    function move(id, type, direction) {
        var store = JSON.parse(localStorage.getItem(type) || "[]");
        var length = store.length;
        var index = -1;
        for (var i = 0; i < store.length; i++) {
            if (store[i].id === id) {
                index = i;
                break;
            }
        }
        var item = store.splice(index, 1)[0];
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
        store.splice(nextIndex, 0, item);
        localStorage.setItem(type, JSON.stringify(store));
        refreshUi();
    }
    function remove(id, type) {
        var store = JSON.parse(localStorage.getItem(type) || "[]");
        localStorage.setItem(type, JSON.stringify(store.filter(function (item) { return item.id !== id; })));
        refreshUi();
    }
})();
