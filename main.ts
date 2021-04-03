type Type = "pros" | "cons";

type Item = {
  id: string;
  item: string;
};

type Store = {
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

  let store: Store = {
    pros: [],
    cons: [],
  };

  const dataFromStorage = localStorage.getItem("pros-cons");
  if (dataFromStorage) {
    store = JSON.parse(dataFromStorage);
  }

  function copy(value: any) {
    return JSON.parse(JSON.stringify(value));
  }

  function syncWithStorage() {
    localStorage.setItem("pros-cons", JSON.stringify(store));
  }

  function renderItems() {
    Object.keys(store).forEach((_type) => {
      // Somebody save me from myself
      const type = _type as Type;
      const items = store[type];

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

  function update() {
    renderItems();
    // Now this can be parameterized
    syncWithStorage();
  }

  update();

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
    store[type].push({
      id: String(new Date().getTime()).slice(-5),
      item,
    });
    update();
  }

  function move(id: string, type: keyof Store, direction: "up" | "down") {
    const next = copy(store[type]);
    const length = next.length;
    let index = -1;
    for (let i = 0; i < next.length; i++) {
      if (next[i].id === id) {
        index = i;
        break;
      }
    }
    const [item] = next.splice(index, 1);
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

    next.splice(nextIndex, 0, item);
    store[type] = next;
    update();
  }

  function remove(id: string, type: Type) {
    store[type] = store[type].filter((item) => item.id !== id);
    update();
  }
})();
