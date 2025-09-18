// Admin bilgileri
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

// LocalStorage'dan veri yükle
let data = JSON.parse(localStorage.getItem("menuData")) || {
  title: "Çiğdemce Ev Yemekleri & Meze",
  color: "#c0392b",
  tabs: {
    "Günün Menüsü": []
  }
};

let currentTab = "Günün Menüsü";
let isAdmin = false;

const siteTitle = document.getElementById("siteTitle");
const menuTabs = document.getElementById("menuTabs");
const menuContent = document.getElementById("menuContent");
const adminPanel = document.getElementById("adminPanel");
const loginPanel = document.getElementById("loginPanel");

// Sayfayı çiz
function render() {
  siteTitle.textContent = data.title;
  document.querySelector("header").style.background = data.color;

  // Sekmeler
  menuTabs.innerHTML = "";
  Object.keys(data.tabs).forEach(tab => {
    const btn = document.createElement("button");
    btn.textContent = tab;
    btn.onclick = () => {
      currentTab = tab;
      renderContent();
    };
    menuTabs.appendChild(btn);
  });

  renderContent();
}

function renderContent() {
  menuContent.innerHTML = "";
  data.tabs[currentTab].forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="">
      <h3>${product.name}</h3>
      <p>${product.desc}</p>
    `;
    menuContent.appendChild(card);
  });
}

// Gizli alan → login paneli aç
document.getElementById("secretLoginArea").onclick = () => {
  loginPanel.classList.remove("hidden");
};

// Login paneli
document.getElementById("cancelLogin").onclick = () => loginPanel.classList.add("hidden");
document.getElementById("loginBtn").onclick = () => {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    isAdmin = true;
    loginPanel.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    document.getElementById("siteTitleInput").value = data.title;
    document.getElementById("siteColorInput").value = data.color;
  } else {
    alert("Hatalı giriş!");
  }
};

// Çıkış
document.getElementById("logoutBtn").onclick = () => {
  isAdmin = false;
  adminPanel.classList.add("hidden");
};

// Admin panel işlemleri
document.getElementById("siteTitleInput").oninput = (e) => {
  data.title = e.target.value;
  save();
};
document.getElementById("siteColorInput").oninput = (e) => {
  data.color = e.target.value;
  save();
};

document.getElementById("addTabBtn").onclick = () => {
  const name = document.getElementById("newTabName").value.trim();
  if (name && !data.tabs[name]) {
    data.tabs[name] = [];
    document.getElementById("newTabName").value = "";
    save();
  }
};

document.getElementById("addProductBtn").onclick = () => {
  const name = document.getElementById("productName").value;
  const desc = document.getElementById("productDesc").value;
  const fileInput = document.getElementById("productImage");
  if (!fileInput.files[0]) return alert("Resim seçiniz");

  const reader = new FileReader();
  reader.onload = (e) => {
    data.tabs[currentTab].push({
      name,
      desc,
      image: e.target.result
    });
    save();
    document.getElementById("productName").value = "";
    document.getElementById("productDesc").value = "";
    fileInput.value = "";
  };
  reader.readAsDataURL(fileInput.files[0]);
};

// Kaydet
function save() {
  localStorage.setItem("menuData", JSON.stringify(data));
  render();
}

// İlk açılış
render();
