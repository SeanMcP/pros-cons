type Type = "pros" | "cons";

type Item = {
  id: string;
  text: string;
  weight: number;
};

type Store = {
  autoSave: boolean;
  pros: Item[];
  cons: Item[];
};

type Lists = {
  pros: HTMLOListElement;
  cons: HTMLOListElement;
};

const lists: Lists = {
  cons: document.getElementById("cons") as HTMLOListElement,
  pros: document.getElementById("pros") as HTMLOListElement,
};

const initialState: Readonly<Store> = {
  autoSave: false,
  pros: [],
  cons: [],
};

let store: Store = copy(initialState);

const dataFromStorage = localStorage.getItem("pros-cons");
if (dataFromStorage) {
  store = JSON.parse(dataFromStorage);
}

document
  .querySelector('[name="auto-save"]')
  ?.addEventListener("change", (event) => {
    event.preventDefault();

    store.autoSave = (event.target as HTMLInputElement).checked;

    attemptSync();
  });

document.getElementById("save")?.addEventListener("click", (event) => {
  event.preventDefault();

  syncWithStorage();
});

document.getElementById("factory-reset")?.addEventListener("click", (event) => {
  event.preventDefault();

  if (
    confirm("Do you want to reset your pros/cons list? This cannot be undone.")
  ) {
    store = copy(initialState);
    update(true);
  }
});

function copy(value: any) {
  return JSON.parse(JSON.stringify(value));
}

function syncWithStorage() {
  localStorage.setItem("pros-cons", JSON.stringify(store));
}

function attemptSync(forceSync = false) {
  if (forceSync || store.autoSave) syncWithStorage();
}

function renderItems() {
  const weightTotal = {
    pros: 0,
    cons: 0,
  };
  const keys: Type[] = ["pros", "cons"];
  keys.forEach((type) => {
    const items = store[type];

    lists[type].textContent = "";
    items.forEach((item) => {
      weightTotal[type] += item.weight;
      const li = document.createElement("li");
      li.classList.add("p-2", "flex", "justify-between");
      const span = document.createElement("span");
      span.textContent = item.text;
      li.appendChild(span);

      const controlsDiv = document.createElement("div");
      li.appendChild(controlsDiv);

      const weightInput = document.createElement("input");
      weightInput.setAttribute("aria-label", "Weight");
      weightInput.type = "number";
      weightInput.value = String(item.weight);
      weightInput.addEventListener("input", (event) => {
        event.preventDefault();
        // @ts-ignore
        setWeight(item.id, type, Number(event.target.value));
      });
      controlsDiv.appendChild(weightInput);

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
    // @ts-ignore
    document.getElementById(`${type}-total`).textContent = weightTotal[type];
  });
  let heavier = "";
  if (weightTotal.cons > weightTotal.pros) {
    heavier = "cons";
  } else if (weightTotal.cons < weightTotal.pros) {
    heavier = "pros";
  }
  document.querySelectorAll(".list-container").forEach((node) => {
    if (heavier && node.classList.contains(`--${heavier}`)) {
      node.classList.add("border-green-200");
    } else {
      node.classList.remove("border-green-200");
    }
  });
}

function update(forceSync = false) {
  renderItems();
  attemptSync(forceSync);
}

update();

document.querySelectorAll('form[name="add"]').forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = String(
      new FormData(event.target as HTMLFormElement).get("item")
    );

    if (value) {
      add(value, (form as HTMLElement).dataset.parent as Type);
    }

    (form as HTMLFormElement).reset();
  });
});

function add(text: Item["text"], type: Type) {
  store[type].push({
    id: String(new Date().getTime()).slice(-5),
    text,
    weight: 1,
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

function setWeight(id: string, type: Type, weight: number) {
  store[type] = store[type].map((item) => {
    if (item.id === id) {
      return {
        ...item,
        weight,
      };
    }
    return item;
  });
  update();
}
