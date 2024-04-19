let tableData = [];
let finalData = [];
let currentPage = 1;
let itemsPerPage = 10; // Default page size
let sortColumnIndex = null;
let sortDirection = "asc";

//Common date format
function formatDate(dateString) {
  return moment(dateString).format("DD/MM/YYYY");
}

//Remove "$" and "." value from string
function removeSpecialSign(noString) {
  const integerValue = noString.replace(/[$.]/g, "");
  const finalValue = integerValue.split(".")[0];
  return finalValue;
}
// Fetch data from API
async function fetchData() {
  try {
    const response = await fetch(
      "https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole"
    );
    const jsonData = await response.json();
    tableData = jsonData.map((item) => [
      item.first + " " + item.last,
      item.email,
      item.address,
      removeSpecialSign(item.balance),
      formatDate(item.created)
    ]);
    finalData = tableData;
    renderTable();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Render table with current page data
function renderTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = tableData.slice(startIndex, endIndex);

  paginatedData.forEach((rowData, index) => {
    const row = document.createElement("tr");

    // Create the cell with the toggle icon and full name
    const toggleIconCell = document.createElement("td");
    const rowId = `row_${startIndex + index}`;
    row.setAttribute("id", rowId);

    toggleIconCell.className = "toggle-icon-cell";

    const toggleIcon = document.createElement("i");
    toggleIcon.className = "fas fa-plus toggle-icon"; // Using Font Awesome chevron-down icon
    toggleIcon.onclick = function () {
      toggleChildRow(this.parentNode.parentNode);
    };

    const fullNameSpan = document.createElement("span");
    fullNameSpan.textContent = rowData[0]; // Assuming the full name is in the first column of rowData

    toggleIconCell.appendChild(toggleIcon);
    toggleIconCell.appendChild(fullNameSpan);

    row.appendChild(toggleIconCell);

    // Create and append the remaining cells for other data
    for (let i = 1; i < rowData.length; i++) {
      const cell = document.createElement("td");
      cell.textContent = rowData[i];
      row.appendChild(cell);
    }

    tableBody.appendChild(row);

    // Create and append an empty child row
    const childRow = document.createElement("tr");
    childRow.className = "child-row";
    childRow.style.display = "none"; // Initially hide the child row
    childRow.setAttribute("data-parent", rowId);
    const childCell = document.createElement("td");
    childCell.setAttribute("colspan", "5"); // Span across all columns
    childRow.appendChild(childCell);
    tableBody.appendChild(childRow);
  });

  renderPagination();
}

// Render pagination links
function renderPagination() {
  let totalPages = Math.ceil(tableData.length / itemsPerPage);
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    let li = document.createElement("li");
    li.classList.add("page-item");
    if (i === currentPage) {
      li.classList.add("active");
    }
    let a = document.createElement("a");
    a.classList.add("page-link");
    a.href = "#";
    a.textContent = i;
    a.addEventListener("click", () => {
      currentPage = i;
      renderTable();
    });
    li.appendChild(a);
    pagination.appendChild(li);
  }
}

// Sort table by column index
function sortTable(columnIndex) {
  if (sortColumnIndex === columnIndex) {
    // If already sorted by this column, toggle the direction
    sortDirection = sortDirection === "asc" ? "desc" : "asc";
  } else {
    // If sorting a new column, set the direction to asc
    sortColumnIndex = columnIndex;
    sortDirection = "asc";
  }

  // Reset sort icons
  resetSortIcons();
  // Set sort icon for the clicked column
  const sortIcon = document.getElementById(`sortIcon${columnIndex}`);
  sortIcon.classList.add(sortDirection === "asc" ? "asc" : "desc");

  tableData.sort((a, b) => {
    const comparison = a[sortColumnIndex].localeCompare(b[sortColumnIndex]);
    return sortDirection === "asc" ? comparison : -comparison;
  });

  renderTable();
}

// Reset sort icons
function resetSortIcons() {
  const sortIcons = document.querySelectorAll(".sort-icon");
  sortIcons.forEach((icon) => {
    icon.classList.remove("asc", "desc");
  });
}

// Handle change in page size
document
  .getElementById("pageSizeSelect")
  .addEventListener("change", function () {
    itemsPerPage = parseInt(this.value, 10);
    currentPage = 1; // Reset to first page when changing page size
    renderTable();
  });

// Filter table rows
document.getElementById("searchInput").addEventListener("input", function () {
  const searchTerm = this.value.trim().toLowerCase();
  let filteredData = finalData;

  if (searchTerm !== "") {
    filteredData = finalData.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(searchTerm))
    );
  }
  currentPage = 1;
  tableData = filteredData;
  renderTable();
});

// Initial data fetch and render
fetchData();
document.getElementById("firstName").addEventListener("input", function () {
  clearInputMessage("firstName");
});
document.getElementById("lastName").addEventListener("input", function () {
  clearInputMessage("lastName");
});
document.getElementById("balance").addEventListener("input", function () {
  clearInputMessage("balance");
});
document.getElementById("startDate").addEventListener("input", function () {
  clearInputMessage("startDate");
});
document.getElementById("emailID").addEventListener("input", function () {
  clearInputMessage("emailID");
});
document.getElementById("address").addEventListener("input", function () {
  clearInputMessage("address");
});

document.getElementById("submitBtn").addEventListener("click", function () {
  clearErrorMessages();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const balance = document.getElementById("balance").value.trim();
  const startDate = document.getElementById("startDate").value.trim();
  const emailID = document.getElementById("emailID").value.trim();
  const address = document.getElementById("address").value.trim();

  // Validation flag
  let isValid = true;

  // Check if any input field is empty
  if (firstName === "") {
    displayErrorMessage("firstName", "Please enter First Name.");
    isValid = false;
  }
  if (lastName === "") {
    displayErrorMessage("lastName", "Please enter Last Name.");
    isValid = false;
  }
  if (balance === "") {
    displayErrorMessage("balance", "Please enter Balance.");
    isValid = false;
  }
  if (startDate === "") {
    displayErrorMessage("startDate", "Please select Start Date.");
    isValid = false;
  }
  if (emailID === "") {
    displayErrorMessage("emailID", "Please enter Email ID.");
    isValid = false;
  }
  if (address === "") {
    displayErrorMessage("address", "Please enter Address.");
    isValid = false;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailID)) {
    displayErrorMessage("emailID", "Please enter a valid email address.");
    isValid = false;
  }

  // Validate balance format
  const balanceRegex = /^\d+(\.\d{1,2})?$/;
  if (!balanceRegex.test(balance)) {
    displayErrorMessage(
      "balance",
      "Please enter a valid balance (numeric value with up to 2 decimal places)."
    );
    isValid = false;
  }

  // If validation fails, stop form submission
  if (!isValid) {
    return;
  }

  tableData.unshift([
    firstName + " " + lastName,
    emailID,
    address,
    balance,
    formatDate(startDate)
  ]);
  renderTable();
  $("#addNewModal").modal("hide");
  clearForm();
});

function displayErrorMessage(inputId, message) {
  const inputElement = document.getElementById(inputId);
  if (!inputElement) {
    console.error("Input element not found for ID:", inputId);
    return;
  }
  const errorMessage = document.createElement("div");
  errorMessage.className = "invalid-feedback";
  errorMessage.textContent = message;
  inputElement.classList.add("is-invalid");
  inputElement.parentNode.appendChild(errorMessage);
}

function clearErrorMessages() {
  const errorMessage = document.querySelectorAll(".invalid-feedback");
  errorMessage.forEach((errorMessage) => {
    errorMessage.remove();
  });
  const invalidInputs = document.querySelectorAll(".is-invalid");
  invalidInputs.forEach((input) => {
    input.classList.remove("is-invalid");
  });
}
function clearInputMessage(inputId) {
  const inputElement = document.getElementById(inputId);
  inputElement.classList.remove("is-invalid");
  const errorMessage =
    inputElement.parentNode.querySelector(".invalid-feedback");
  if (errorMessage) {
    errorMessage.remove();
  }
}
document.getElementById("closeModalBtn").addEventListener("click", function () {
  clearErrorMessages();
});

function clearForm() {
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("balance").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("emailID").value = "";
  document.getElementById("address").value = "";
}

function toggleChildRow(row) {
  const parentRowId = row.id.substring(4); // Remove "row_" prefix
  if (parentRowId) {
    const childRow = row.nextSibling;
    if (childRow && childRow.classList.contains("child-row")) {
      childRow.style.display =
        childRow.style.display === "none" ? "table-row" : "none";
      const toggleIcon = row.querySelector(".toggle-icon");
      toggleIcon.className =
        childRow.style.display === "none"
          ? "fas fa-plus toggle-icon"
          : "fas fa-minus toggle-icon";
      if (childRow.style.display !== "none") {
        let rowIndex = parseInt(parentRowId); // Extract index from rowId
        let rowData = tableData[rowIndex];
        let balance = rowData[3];
        let balanceCell = childRow.querySelector("td");
        balanceCell.textContent = "Balance: $" + balance;
      }
    }
  }
}

