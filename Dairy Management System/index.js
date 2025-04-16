const products = [
  {
    id: 1,
    name: "Fresh Cow Milk",
    description: "Pure organic cow milk.",
    price: 45,
    category: "milk-products",
    image: "C:\Users\S61101\Downloads\fresh-cow-milk-500x500.webp"
  },
  {
    id: 2,
    name: "Goat Milk",
    description: "Nutritious goat milk.",
    price: 55,
    category: "milk-products",
    image: "C:\Users\S61101\Downloads\milk-cottage-cheese-sour-cream-260nw-414901216.webp"
  },
  {
    id: 3,
    name: "Buffalo Milk",
    description: "Rich and creamy buffalo milk.",
    price: 68,
    category: "milk-products",
    image: "C:\Users\S61101\Downloads\buffalo-milk-1667795142-6612778.jpeg"
  },
  {
    id: 4,
    name: "Cheddar Cheese",
    description: "Aged cheddar cheese block.",
    price: 80,
    category: "cheese-products",
    image: "C:\Users\S61101\Downloads\chesse.jpg"
  },
  {
    id: 5,
    name: "Paneer",
    description: "Fresh homemade paneer.",
    price: 120,
    category: "cheese-products",
    image: "C:\Users\S61101\Downloads\panner.jpg"
  },
  {
    id: 6,
    name: "Mozzarella Cheese",
    description: "Perfect for pizzas.",
    price: 160,
    category: "cheese-products",
    image: "C:\Users\S61101\Downloads\mozzarella-cheese-making-recipe-cultured-826097.webp"
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser  = null;

// Default credentials for demonstration
const defaultUsername = "user@example.com";
const defaultPassword = "password123";

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").innerText = count;
}

function renderProducts() {
  products.forEach(product => {
    const container = document.querySelector(`#${product.category} .products`);
    const productEl = document.createElement("div");
    productEl.className = "product";
    productEl.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <strong>$${product.price.toFixed(2)}</strong>
      <br><br>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    container.appendChild(productEl);
  });
}

function addToCart(productId) {
  const item = cart.find(p => p.id === productId);
  if (item) {
    item.quantity++;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartCount();
  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = "";
  cart.forEach(item => {
    const itemEl = document.createElement("div");
    itemEl.innerHTML = `
      <p>
        <strong>${item.name}</strong> - $${item.price.toFixed(2)} x 
        <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </p>
    `;
    cartContainer.appendChild(itemEl);
  });
}

function updateQuantity(productId, quantity) {
  const item = cart.find(p => p.id === productId);
  if (item) {
    item.quantity = parseInt(quantity);
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartCount();
      renderCart();
    }
  }
}

function removeFromCart(productId) {
  cart = cart.filter(p => p.id !== productId);
  saveCart();
  updateCartCount();
  renderCart();
}

// User Registration and Login Functions
function showRegistrationForm() {
  document.getElementById("auth-forms").style.display = "block";
  document.getElementById("registration-form").style.display = "block";
  document.getElementById("login-form").style.display = "none";
}

function showLoginForm() {
    document.getElementById("auth-forms").style.display = "block";
    document.getElementById("registration-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  }
  
  function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === "password" ? "text" : "password";
  }
  
  function register() {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
  
    // Check if user already exists
    const existingUser  = users.find(user => user.email === email);
    if (existingUser ) {
      document.getElementById("reg-message").innerText = "User  already exists!";
      return;
    }
  
    // Add new user to the users array
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("reg-message").innerText = "Registration successful! You can now log in.";
    document.getElementById("registration-form").reset();
  }
  
  function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    // Check for default credentials
    if (email === defaultUsername && password === defaultPassword) {
      currentUser  = { name: "Default User", email: defaultUsername };
      handleLoginSuccess();
      return;
    }
  
    // Check if user exists in the registered users
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      currentUser  = user;
      handleLoginSuccess();
    } else {
      document.getElementById("login-message").innerText = "Invalid Username or Password";
    }
  }
  
  function handleLoginSuccess() {
    document.getElementById("auth-forms").style.display = "none";
    document.getElementById("user-info").style.display = "block";
    document.getElementById("welcome-message").innerText = `Welcome, ${currentUser .name}`;
    updateCartCount();
    renderProducts();
  }
  
  function logout() {
    currentUser  = null;
    document.getElementById("user-info").style.display = "none";
    document.getElementById("auth-links").style.display = "block";
    document.getElementById("cart-items").innerHTML = "";
    cart = [];
    saveCart();
    updateCartCount();
  }
  
  // Initialize page
  renderProducts();
  updateCartCount();
  renderCart();