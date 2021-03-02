(function main() {
  // Code goes here
  const lists = {
    cons: document.getElementById("cons"),
    pros: document.getElementById("pros"),
  };

  const cache = {
    pros: [],
    cons: [],
  };

  function updateCache() {
    cache.pros = JSON.parse(localStorage.getItem("pros") || "[]");
    cache.cons = JSON.parse(localStorage.getItem("cons") || "[]");
    // Fire event?
  }

  function renderItems() {
    Object.entries(cache).forEach(([type, items]) => {
      lists[type].textContent = "";
      items.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("p-2", "flex", "justify-between")
        const span = document.createElement("span");
        span.textContent = item.item;
        li.appendChild(span);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", (event) => {
          event.preventDefault();
          remove(item.id, type);
        });
        li.appendChild(deleteButton);
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

      const item = new FormData(event.target).get("item");

      if (item) {
        add(item, form.dataset.parent);
      }

      form.reset();
    });
  });

  function add(item, type) {
    const store = JSON.parse(localStorage.getItem(type) || "[]");
    store.push({
      id: String(new Date().getTime()).slice(-5),
      item,
    });
    localStorage.setItem(type, JSON.stringify(store));
    refreshUi();
  }

  function remove(id, type) {
    const store = JSON.parse(localStorage.getItem(type) || "[]");
    localStorage.setItem(
      type,
      JSON.stringify(store.filter((item) => item.id !== id))
    );
    refreshUi();
  }
})();
