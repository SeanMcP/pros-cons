type Type = "pros" | "cons";

type Item = {
  id: string;
  item: string;
};

type AppCache = {
  pros: Item[];
  cons: Item[];
};

type Lists = {
  pros: HTMLOListElement;
  cons: HTMLOListElement;
};

(function main() {
  // Code goes here
  const lists: Lists = {
    cons: document.getElementById("cons") as HTMLOListElement,
    pros: document.getElementById("pros") as HTMLOListElement,
  };

  const cache: AppCache = {
    pros: [],
    cons: [],
  };

  function updateCache() {
    cache.pros = JSON.parse(localStorage.getItem("pros") || "[]");
    cache.cons = JSON.parse(localStorage.getItem("cons") || "[]");
    // Fire event?
  }

  function renderItems() {
    Object.keys(cache).forEach((_type) => {
      // Somebody save me from myself
      const type = _type as Type;
      const items = cache[type];

      lists[type].textContent = "";
      items.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("p-2", "flex", "justify-between");
        const span = document.createElement("span");
        span.textContent = item.item;
        li.appendChild(span);

        const controlsDiv = document.createElement("div");
        li.appendChild(controlsDiv);

        const upButton = document.createElement("button");
        upButton.textContent = "Up";
        upButton.addEventListener("click", (event) => {
          event.preventDefault();
          move(item.id, type, "up");
        });
        controlsDiv.appendChild(upButton);

        const downButton = document.createElement("button");
        downButton.textContent = "Down";
        downButton.addEventListener("click", (event) => {
          event.preventDefault();
          move(item.id, type, "down");
        });
        controlsDiv.appendChild(downButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", (event) => {
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

  document.querySelectorAll('form[name="add"]').forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const item = new FormData(event.target as HTMLFormElement).get(
        "item"
      ) as string;

      if (item) {
        add(item, (form as HTMLElement).dataset.parent as Type);
      }

      (form as HTMLFormElement).reset();
    });
  });

  function add(item: Item["item"], type: Type) {
    const store = JSON.parse(localStorage.getItem(type) || "[]");
    store.push({
      id: String(new Date().getTime()).slice(-5),
      item,
    });
    localStorage.setItem(type, JSON.stringify(store));
    refreshUi();
  }

  function move(id: string, type: keyof AppCache, direction: "up" | "down") {
    const store = JSON.parse(localStorage.getItem(type) || "[]") as Item[];
    const length = store.length;
    let index = -1;
    for (let i = 0; i < store.length; i++) {
      if (store[i].id === id) {
        index = i;
        break;
      }
    }
    const [item] = store.splice(index, 1);
    let nextIndex = index;

    switch (direction) {
      case "up": {
        if (index === 0) return;
        nextIndex = index - 1;
        break;
      }
      case "down": {
        if (index === length - 1) return;
        nextIndex = index + 1;
        break;
      }
    }

    store.splice(nextIndex, 0, item);
    localStorage.setItem(type, JSON.stringify(store));
    refreshUi();
  }

  function remove(id: string, type: Type) {
    const store = JSON.parse(localStorage.getItem(type) || "[]") as Item[];
    localStorage.setItem(
      type,
      JSON.stringify(store.filter((item) => item.id !== id))
    );
    refreshUi();
  }
})();
