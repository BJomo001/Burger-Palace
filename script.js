document.addEventListener("DOMContentLoaded", () => {
  // MOBILE NAVIGATION
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });

  // SHOPPING CART
  const cart = new Map();
  const orderItems = document.getElementById("order-items");
  const orderTotal = document.getElementById("order-total");
  const orderNotice = document.getElementById("order-notice");

  const formatPrice = (amount) =>
    "KSh " + amount.toLocaleString("en-KE");

  function renderCart() {
    let total = 0;
    const lines = [];

    cart.forEach((item) => {
      total += item.price * item.quantity;
      lines.push(
        `${item.name} × ${item.quantity} — ${formatPrice(
          item.price * item.quantity
        )}`
      );
    });

    orderItems.textContent = lines.length
      ? lines.join(" | ")
      : "No items added yet.";

    orderTotal.textContent = formatPrice(total);
  }

  // BURGER QUANTITY CONTROLS
  document.querySelectorAll(".menu-card").forEach((card) => {
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    const quantityDisplay = card.querySelector(".qty");
    const minusButton = card.querySelector(".minus");
    const plusButton = card.querySelector(".plus");
    const addButton = card.querySelector(".add-btn");

    let quantity = 0;

    plusButton.addEventListener("click", () => {
      quantity += 1;
      quantityDisplay.textContent = quantity;
      orderNotice.textContent = "";
    });

    minusButton.addEventListener("click", () => {
      if (quantity > 0) {
        quantity -= 1;
        quantityDisplay.textContent = quantity;
      }
    });

    addButton.addEventListener("click", () => {
      if (quantity === 0) {
        orderNotice.textContent =
          "Please select a quantity before adding this item.";
        return;
      }

      const existing = cart.get(name);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.set(name, {
          name,
          price,
          quantity
        });
      }

      quantity = 0;
      quantityDisplay.textContent = "0";

      renderCart();
      orderNotice.textContent = `${name} added to your order.`;
    });
  });

  // PLACE ORDER
  document.getElementById("checkout").addEventListener("click", () => {
    if (cart.size === 0) {
      orderNotice.textContent =
        "Your order is empty. Please add a burger first.";
      return;
    }

    let message = "Your order:\n\n";
    let total = 0;

    cart.forEach((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      message += `${item.name} × ${item.quantity}: ${formatPrice(subtotal)}\n`;
    });

    message += `\nTotal: ${formatPrice(total)}`;
    message +=
      "\n\nYour oder has been recieved.";

    window.alert(message);
  });

  // NEWSLETTER FORM
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterMessage = document.getElementById(
    "newsletter-message"
  );

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (!email) {
      newsletterMessage.textContent =
        "Please enter a valid email address.";
      return;
    }

    newsletterMessage.textContent =
      "Thank you for your interest! Newsletter registration is a demo.";

    newsletterForm.reset();
  });

  // AUTOMATIC COPYRIGHT YEAR
  document.getElementById("year").textContent =
    new Date().getFullYear();

  renderCart();
});