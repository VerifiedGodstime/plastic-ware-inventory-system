const API_BASE_URL = "http://localhost:5000/api";

let authToken = localStorage.getItem("token");
let currentUser = null;


// API HELPER

async function apiRequest(endpoint, options = {}) {
    const headers = {
        "Content-Type": "application/json"
    };

    if (authToken) {
        headers.Authorization = "Bearer " + authToken;
    }

    try {
        const response = await fetch(API_BASE_URL + endpoint, {
            ...options,
            headers: headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}


// LOGIN

async function loginUser(email, password) {
    const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (data.data && data.data.token) {
        authToken = data.data.token;
        currentUser = data.data.user || null;
    } else if (data.token) {
        authToken = data.token;
        currentUser = data.user || null;
    } else {
        throw new Error("Login succeeded but no token was returned.");
    }

    localStorage.setItem("token", authToken);

    return data;
}


// LOGOUT

function logoutUser() {
    localStorage.removeItem("token");

    authToken = null;
    currentUser = null;

    showLoginPage();
}


// PAGE CONTROL

function showLoginPage() {
    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");

    if (loginPage) {
        loginPage.classList.remove("hidden");
    }

    if (dashboardPage) {
        dashboardPage.classList.add("hidden");
    }
}


function showDashboard() {
    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");

    if (loginPage) {
        loginPage.classList.add("hidden");
    }

    if (dashboardPage) {
        dashboardPage.classList.remove("hidden");
    }
}


// DASHBOARD

async function loadDashboard() {
    try {
        const products = await apiRequest("/products");
        const categories = await apiRequest("/categories");
        const suppliers = await apiRequest("/suppliers");
        const lowStock = await apiRequest("/inventory/low-stock");

        updateDashboardStats({
            products: products,
            categories: categories,
            suppliers: suppliers,
            lowStock: lowStock
        });

    } catch (error) {
        console.error("Dashboard loading error:", error);
    }
}


function updateDashboardStats(data) {
    const productCount = document.getElementById("totalProducts");
    const categoryCount = document.getElementById("totalCategories");
    const supplierCount = document.getElementById("totalSuppliers");
    const lowStockCount = document.getElementById("lowStockCount");

    if (productCount) {
        productCount.textContent =
            data.products && data.products.data
                ? data.products.data.length
                : 0;
    }

    if (categoryCount) {
        categoryCount.textContent =
            data.categories && data.categories.data
                ? data.categories.data.length
                : 0;
    }

    if (supplierCount) {
        supplierCount.textContent =
            data.suppliers && data.suppliers.data
                ? data.suppliers.data.length
                : 0;
    }

    if (lowStockCount) {
        lowStockCount.textContent =
            data.lowStock && data.lowStock.data
                ? data.lowStock.data.length
                : 0;
    }
}


// DASHBOARD SECTIONS

function showSection(sectionId) {
    const sections = document.querySelectorAll(".content-section");

    sections.forEach(function (section) {
        section.classList.add("hidden");
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.remove("hidden");
    }

    if (sectionId === "productsSection") {
        loadProducts();
    }

    if (sectionId === "categoriesSection") {
        loadCategories();
    }

    if (sectionId === "suppliersSection") {
        loadSuppliers();
    }

    if (sectionId === "inventorySection") {
        loadInventory();
        loadLowStock();
    }
}


// LOGIN FORM

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const emailInput = document.getElementById("loginEmail");
            const passwordInput = document.getElementById("loginPassword");
            const message = document.getElementById("loginMessage");

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                if (message) {
                    message.textContent =
                        "Please enter your email and password.";
                    message.className = "message-error";
                }

                return;
            }

            try {
                if (message) {
                    message.textContent = "Signing you in...";
                    message.className = "";
                }

                await loginUser(email, password);

                if (message) {
                    message.textContent = "";
                }

                showDashboard();
                await loadDashboard();

            } catch (error) {
                if (message) {
                    message.textContent = error.message;
                    message.className = "message-error";
                }
            }
        });
    }


    const logoutButton = document.getElementById("logoutBtn");

    if (logoutButton) {
        logoutButton.addEventListener("click", logoutUser);
    }


    if (authToken) {
        showDashboard();
        loadDashboard();
    } else {
        showLoginPage();
    }
});


// PRODUCT FORM

function openProductForm() {
    const container = document.getElementById("productFormContainer");

    if (container) {
        container.classList.toggle("hidden");
    }
}


// CATEGORY FORM

function openCategoryForm() {
    const container = document.getElementById("categoryFormContainer");

    if (container) {
        container.classList.toggle("hidden");
    }
}


// SUPPLIER FORM

function openSupplierForm() {
    const container = document.getElementById("supplierFormContainer");

    if (container) {
        container.classList.toggle("hidden");
    }
}


// INVENTORY FORM

function openInventoryForm() {
    const container = document.getElementById("inventoryFormContainer");

    if (container) {
        container.classList.toggle("hidden");
    }
}



function showSection(sectionId) {
  const sections = document.querySelectorAll(".content-section");

  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  const selectedSection = document.getElementById(sectionId);

  if (selectedSection) {
    selectedSection.classList.remove("hidden");
  }

  if (sectionId === "dashboardSection") {
    loadDashboard();
  }

  if (sectionId === "productsSection") {
    loadProducts();
  }

  if (sectionId === "categoriesSection") {
    loadCategories();
  }

  if (sectionId === "suppliersSection") {
    loadSuppliers();
  }

  if (sectionId === "inventorySection") {
    loadInventory();
  }
}


async function loadProducts() {
  try {
    const response = await apiRequest("/products");
    const products = response.data || [];

    const container = document.getElementById("productsList");

    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = "<p>No products found.</p>";
      return;
    }

    container.innerHTML = products.map((product) => `
  <div class="data-card">
    <h3>${product.name}</h3>
    <p><strong>Product ID:</strong> ${product.id}</p>
    <p><strong>Code:</strong> ${product.product_code}</p>
        <p><strong>Buying Price:</strong> ₦${Number(product.buying_price).toLocaleString()}</p>
        <p><strong>Selling Price:</strong> ₦${Number(product.selling_price).toLocaleString()}</p>
        <p><strong>Reorder Level:</strong> ${product.reorder_level}</p>
        <p>${product.description || ""}</p>
      </div>
    `).join("");

  } catch (error) {
    console.error("Products loading error:", error);
  }
}


async function loadCategories() {
  try {
    const response = await apiRequest("/categories");
    const categories = response.data || [];

    const container = document.getElementById("categoriesList");

    if (!container) return;

    if (categories.length === 0) {
      container.innerHTML = "<p>No categories found.</p>";
      return;
    }

    container.innerHTML = categories.map((category) => `
      <div class="data-card">
        <h3>${category.name}</h3>
        <p>${category.description || "No description"}</p>
      </div>
    `).join("");

  } catch (error) {
    console.error("Categories loading error:", error);
  }
}


async function loadSuppliers() {
  try {
    const response = await apiRequest("/suppliers");
    const suppliers = response.data || [];

    const container = document.getElementById("suppliersList");

    if (!container) return;

    if (suppliers.length === 0) {
      container.innerHTML = "<p>No suppliers found.</p>";
      return;
    }

    container.innerHTML = suppliers.map((supplier) => `
      <div class="data-card">
        <h3>${supplier.name}</h3>
        <p><strong>Contact:</strong> ${supplier.contact_person || "N/A"}</p>
        <p><strong>Phone:</strong> ${supplier.phone || "N/A"}</p>
        <p><strong>Email:</strong> ${supplier.email || "N/A"}</p>
        <p><strong>Address:</strong> ${supplier.address || "N/A"}</p>
      </div>
    `).join("");

  } catch (error) {
    console.error("Suppliers loading error:", error);
  }
}


async function loadInventory() {
  try {
    const [transactionsResponse, lowStockResponse] = await Promise.all([
      apiRequest("/inventory"),
      apiRequest("/inventory/low-stock")
    ]);

    const transactions = transactionsResponse.data || [];
    const lowStock = lowStockResponse.data || [];

    const inventoryContainer = document.getElementById("inventoryList");
    const lowStockContainer = document.getElementById("lowStockList");

    if (inventoryContainer) {
      if (transactions.length === 0) {
        inventoryContainer.innerHTML = "<p>No inventory transactions found.</p>";
      } else {
        inventoryContainer.innerHTML = transactions.map((item) => `
          <div class="data-card">
            <h3>${item.type === "IN" ? "Stock In" : "Stock Out"}</h3>
            <p><strong>Product ID:</strong> ${item.product_id}</p>
            <p><strong>Quantity:</strong> ${item.quantity}</p>
            <p><strong>Reason:</strong> ${item.reason || "N/A"}</p>
          </div>
        `).join("");
      }
    }

    if (lowStockContainer) {
      if (lowStock.length === 0) {
        lowStockContainer.innerHTML = "<p>No low-stock products.</p>";
      } else {
        lowStockContainer.innerHTML = lowStock.map((item) => `
          <div class="data-card">
            <h3>${item.product_name || item.name || "Unknown Product"}</h3>
            <p><strong>Current Stock:</strong> ${item.current_stock}</p>
            <p><strong>Reorder Level:</strong> ${item.reorder_level}</p>
          </div>
        `).join("");
      }
    }

  } catch (error) {
    console.error("Inventory loading error:", error);
  }
}

const categoryForm = document.getElementById("categoryForm");

if (categoryForm) {
  categoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("categoryName").value.trim();
    const description = document.getElementById("categoryDescription").value.trim();
    const message = document.getElementById("categoryMessage");

    try {
      const response = await apiRequest("/categories", {
        method: "POST",
        body: JSON.stringify({
          name,
          description
        })
      });

      if (message) {
        message.textContent = response.message || "Category created successfully.";
        message.className = "message-success";
      }

      categoryForm.reset();

      await loadCategories();
      await loadDashboard();

    } catch (error) {
      if (message) {
        message.textContent = error.message;
        message.className = "message-error";
      }
    }
  });
}

const supplierForm = document.getElementById("supplierForm");

if (supplierForm) {
  supplierForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("supplierName").value.trim();
    const contact_person = document.getElementById("contactPerson").value.trim();
    const phone = document.getElementById("supplierPhone").value.trim();
    const email = document.getElementById("supplierEmail").value.trim();
    const address = document.getElementById("supplierAddress").value.trim();
    const message = document.getElementById("supplierMessage");

    try {
      const response = await apiRequest("/suppliers", {
        method: "POST",
        body: JSON.stringify({
          name,
          contact_person,
          phone,
          email,
          address
        })
      });

      if (message) {
        message.textContent =
          response.message || "Supplier created successfully.";
        message.className = "message-success";
      }

      supplierForm.reset();

      await loadSuppliers();
      await loadDashboard();

    } catch (error) {
      if (message) {
        message.textContent = error.message;
        message.className = "message-error";
      }
    }
  });
}

const productForm = document.getElementById("productForm");

if (productForm) {
  productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const product_code = document.getElementById("productCode").value.trim();
    const category_id = Number(document.getElementById("categoryId").value);
    const supplier_id = Number(document.getElementById("supplierId").value);
    const buying_price = Number(document.getElementById("buyingPrice").value);
    const selling_price = Number(document.getElementById("sellingPrice").value);
    const reorder_level = Number(document.getElementById("reorderLevel").value);
    const description = document.getElementById("productDescription").value.trim();
    const message = document.getElementById("productMessage");

    try {
      const response = await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify({
          name,
          product_code,
          category_id,
          supplier_id,
          buying_price,
          selling_price,
          reorder_level,
          description
        })
      });

      if (message) {
        message.textContent =
          response.message || "Product created successfully.";
        message.className = "message-success";
      }

      productForm.reset();

      document.getElementById("reorderLevel").value = 10;

      await loadProducts();
      await loadDashboard();

    } catch (error) {
      console.error("Product creation error:", error);

      if (message) {
        message.textContent = error.message;
        message.className = "message-error";
      }
    }
  });
}

const inventoryForm = document.getElementById("inventoryForm");

if (inventoryForm) {
  inventoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const product_id = Number(
      document.getElementById("inventoryProductId").value
    );

    const type = document.getElementById("inventoryType").value;

    const quantity = Number(
      document.getElementById("inventoryQuantity").value
    );

    const reason = document.getElementById("inventoryReason").value.trim();

    const message = document.getElementById("inventoryMessage");

    try {
      const response = await apiRequest("/inventory", {
        method: "POST",
        body: JSON.stringify({
          product_id,
          type,
          quantity,
          reason
        })
      });

      if (message) {
        message.textContent =
          response.message || "Inventory transaction recorded successfully.";
        message.className = "message-success";
      }

      inventoryForm.reset();

      await loadInventory();
      await loadDashboard();

    } catch (error) {
      console.error("Inventory transaction error:", error);

      if (message) {
        message.textContent = error.message;
        message.className = "message-error";
      }
    }
  });
}