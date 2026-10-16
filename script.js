
const form = document.getElementById("shippingForm");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("unitPrice");
const currencyInput = document.getElementById("currency");
const totalValue = document.getElementById("totalValue");
const preview = document.getElementById("preview");
const previewContent = document.getElementById("previewContent");

// Set today's date automatically
document.getElementById("billDate").value =
  new Date().toLocaleDateString("en-CA");

// Format money
function formatMoney(amount, currency) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency
  }).format(amount);
}

// Calculate invoice value
function calculateTotal() {
  const quantity = Number(quantityInput.value) || 0;
  const price = Number(priceInput.value) || 0;
  const currency = currencyInput.value;

  const total = quantity * price;

  totalValue.textContent = formatMoney(total, currency);

  return total;
}

// Update the total when inputs change
quantityInput.addEventListener("input", calculateTotal);
priceInput.addEventListener("input", calculateTotal);
currencyInput.addEventListener("change", calculateTotal);

// Safely display user-entered text in the preview
function addRow(label, value) {
  const row = document.createElement("tr");
  const heading = document.createElement("th");
  const cell = document.createElement("td");

  heading.textContent = label;
  cell.textContent = value;

  row.append(heading, cell);

  return row;
}

// Create the shipping bill draft
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  const iec = document.getElementById("iec").value.trim();

  if (!/^[A-Za-z0-9]{10}$/.test(iec)) {
    alert("Please enter a 10-character IEC number.");
    document.getElementById("iec").focus();
    return;
  }

  const quantity = Number(quantityInput.value);
  const price = Number(priceInput.value);

  if (
    !Number.isFinite(quantity) ||
    !Number.isFinite(price) ||
    quantity <= 0 ||
    price < 0
  ) {
    alert("Enter a valid quantity and unit price.");
    return;
  }

  const packages = Number(document.getElementById("packages").value);

  if (!Number.isInteger(packages) || packages < 1) {
    alert("Enter a valid whole number of packages.");
    return;
  }

  const total = calculateTotal();
  const currency = currencyInput.value;

  const details = [
    ["Shipping Bill Number", "billNo"],
    ["Shipping Bill Date", "billDate"],
    ["Port of Loading", "port"],
    ["Destination Country", "destination"],
    ["Mode of Transport", "transport"],
    ["Exporter Name", "exporter"],
    ["IEC Number", "iec"],
    ["Exporter Address", "address"],
    ["Buyer Name", "buyer"],
    ["Buyer Country", "buyerCountry"],
    ["Product Description", "product"],
    ["HS Code", "hsCode"],
    ["Invoice Number", "invoice"],
    ["Quantity", "quantity"],
    ["Unit Price", "unitPrice"],
    ["Number of Packages", "packages"]
  ];

  const table = document.createElement("table");
  table.className = "preview-table";
  const body = document.createElement("tbody");

  details.forEach(function (item) {
    const label = item[0];
    const id = item[1];
    let value = document.getElementById(id).value.trim();

    if (id === "unitPrice") {
      value = formatMoney(Number(value), currency);
    }

    body.appendChild(addRow(label, value));
  });

  body.appendChild(
    addRow("Invoice Currency", currency)
  );

  body.appendChild(
    addRow("Total Invoice Value", formatMoney(total, currency))
  );

  table.appendChild(body);
  previewContent.replaceChildren(table);

  preview.hidden = false;
  preview.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// Clear form and preview
form.addEventListener("reset", function () {
  setTimeout(function () {
    document.getElementById("billDate").value =
      new Date().toLocaleDateString("en-CA");

    totalValue.textContent = formatMoney(0, "INR");
    preview.hidden = true;
    previewContent.replaceChildren();
  }, 0);
});

// Print the draft
document.getElementById("printBtn").addEventListener("click", function () {
  window.print();
});

calculateTotal();
