// Simple password login (client-side only)
function login() {
  const password = document.getElementById("admin-password").value;
  if (password === "admin123") {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
  } else {
    alert("Incorrect password!");
  }
}

// Tab switching
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(button.dataset.tab).classList.add("active");
    });
  });

  // Product Form Handling
  document.getElementById("product-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("product-name").value;
    const desc = document.getElementById("product-desc").value;
    const images = document.getElementById("product-images").files;

    const list = document.getElementById("product-list");

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${name}</strong><br>
      <small>${desc}</small><br>
      <em>${images.length} image(s) uploaded</em><br>
      <button onclick="this.parentElement.remove()">🗑 Delete</button>
    `;
    list.appendChild(li);

    this.reset();
  });

  // Sample orders
  const orders = [
    { id: 1, status: "pending", customer: "Alice" },
    { id: 2, status: "shipped", customer: "Bob" },
    { id: 3, status: "completed", customer: "Charlie" },
  ];

  const orderList = document.getElementById("order-list");

  function renderOrders(status = "all") {
    orderList.innerHTML = "";
    orders
      .filter((order) => status === "all" || order.status === status)
      .forEach((order) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>Order #${order.id}</strong> from ${order.customer} <br>
          Status: ${order.status} <br>
          <select onchange="updateOrderStatus(${order.id}, this.value)">
            <option value="pending"${order.status === "pending" ? " selected" : ""}>Pending</option>
            <option value="shipped"${order.status === "shipped" ? " selected" : ""}>Shipped</option>
            <option value="cancelled"${order.status === "cancelled" ? " selected" : ""}>Cancelled</option>
            <option value="completed"${order.status === "completed" ? " selected" : ""}>Completed</option>
          </select>
        `;
        orderList.appendChild(li);
      });
  }

  window.updateOrderStatus = function (id, newStatus) {
    const order = orders.find((o) => o.id === id);
    if (order) {
      order.status = newStatus;
      renderOrders(document.getElementById("order-filter").value);
    }
  };

  document.getElementById("order-filter").addEventListener("change", (e) => {
    renderOrders(e.target.value);
  });

  renderOrders(); // Initial render
});