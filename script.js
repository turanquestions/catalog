let products = [
  { title: "HDD Seagate 2TB", price: 200, stock: 20 },
  { title: "ADATA RAM 8GB", price: 120, stock: 50 },
  { title: "ASUS Zenbook", price: 1200, stock: 3 },
  { title: "Acer Predator", price: 1500, stock: 2 }
];

let sortState = {
  column: null,
  ascending: true
};

function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  if (products.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.textContent = "No products available.";
    cell.style.textAlign = "center";
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  products.forEach((product) => {
    const row = document.createElement("tr");

    const titleCell = document.createElement("td");
    titleCell.textContent = product.title;
    row.appendChild(titleCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = product.price;
    row.appendChild(priceCell);

    const stockCell = document.createElement("td");
    if (product.stock > 0) {
      stockCell.textContent = product.stock + " ";
      const btn = document.createElement("button");
      btn.textContent = "-";
      btn.className = "minus-button";
      btn.onclick = () => {
        product.stock--;
        renderTable();
      };
      stockCell.appendChild(btn);
    } else {
      stockCell.textContent = "Not available";
    }
    row.appendChild(stockCell);

    tbody.appendChild(row);
  });

  updateSortArrows();
}

function createProduct() {
  const title = document.getElementById("titleInput").value.trim();
  const priceStr = document.getElementById("priceInput").value;
  const stockStr = document.getElementById("stockInput").value;

  const price = priceStr === "" ? NaN : parseFloat(priceStr);
  const stock = stockStr === "" ? NaN : parseInt(stockStr);

  if (!title) return;

  const existingIndex = products.findIndex(
    (p) => p.title.toLowerCase() === title.toLowerCase()
  );

  if (existingIndex !== -1) {
    if (confirm("Хотите ли вы заменить текущую позицию?")) {
      const existing = products[existingIndex];
      if (!isNaN(price)) existing.price = price;
      if (!isNaN(stock)) {
        existing.stock += stock;
        if (existing.stock < 0) existing.stock = 0;
      }
    } else {
      let uniqueTitle = title;
      let suffix = 1;
      while (products.some((p) => p.title === uniqueTitle)) {
        uniqueTitle = `${title}-${suffix++}`;
      }
      products.push({
        title: uniqueTitle,
        price: isNaN(price) ? 0 : price,
        stock: isNaN(stock) ? 0 : stock,
      });
    }
  } else {
    products.push({
      title,
      price: isNaN(price) ? 0 : price,
      stock: isNaN(stock) ? 0 : stock,
    });
  }

  document.getElementById("titleInput").value = "";
  document.getElementById("priceInput").value = "";
  document.getElementById("stockInput").value = "";

  renderTable();
}

function sortTable(columnIndex) {
  const keys = ["title", "price", "stock"];
  const key = keys[columnIndex];

  if (sortState.column === columnIndex) {
    sortState.ascending = !sortState.ascending;
  } else {
    sortState.column = columnIndex;
    sortState.ascending = true;
  }

  products.sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (typeof valA === "string") {
      return sortState.ascending
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortState.ascending ? valA - valB : valB - valA;
    }
  });

  renderTable();
}

function updateSortArrows() {
  const headers = document.querySelectorAll("#productTable th");
  headers.forEach((th, i) => {
    th.textContent = th.textContent.replace(/[\u25B2\u25BC]/g, "").trim();
    if (sortState.column === i) {
      th.textContent += sortState.ascending ? " ▲" : " ▼";
    }
  });
}

renderTable();
