// Admin bilgileri
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

// LocalStorage'dan veri yükle
let data = JSON.parse(localStorage.getItem("menuData")) || {
  title: "Çiğdemce Ev Yemekleri & Meze",
  logo: "",
  bgColor: "#fff8f0",
  textColor: "#333333",
  font: "Arial",
  tabs: { "Günün Menüsü": [] }
};

let currentTab = "Günün Menüsü";
let isAdmin = false;

const siteTitle = document.getElementById("siteTitle");
const menuTabs = document.getElementById("menuTabs");
const menuContent = document.getElementById("menuContent");
const adminPanel = document.getElementById("adminPanel");
const loginPanel = document.getElementById("loginPanel");

// Render
function render() {
  siteTitle.textContent = data.title;

  document.body.style.backgroundColor = data.bgColor;
  document.body.style.color = data.textColor;
  document.body.style.fontFamily = data.font;

  // Logo
  let header = document.querySelector("header");
  header.innerHTML = `<h1 id="siteTitle">${data.title}</h1>`;
  if (data.logo) {
    let img = document.createElement("img");
    img.src = data.logo;
    header.prepend(img);
  }

  // Sekmeler
  menuTabs.innerHTML = "";
  Object.keys(data.tabs).forEach(tab => {
    const btn = document.createElement("button");
    btn.textContent = tab;
    btn.onclick = () => { currentTab = tab; renderContent(); };
    menuTabs.appendChild(btn);
  });

  renderContent();
}

function renderContent() {
  menuContent.innerHTML = "";
  data.tabs[currentTab].forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="">
      <h3>${product.name}</h3>
      <p>${product.desc}</p>
      <p><strong>${product.price || ""}</strong></p>
      ${isAdmin ? `<button onclick="deleteProduct(${index})">Sil</button>` : ""}
    `;
    menuContent.appendChild(card);
  });
}

// Ürün sil
function deleteProduct(index) {
  if (!isAdmin) return;
  data.tabs[currentTab].splice(index, 1);
  save();
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

    // Admin inputlarını doldur
    document.getElementById("siteTitleInput").value = data.title;
    document.getElementById("bgColorInput").value = data.bgColor;
    document.getElementById("textColorInput").value = data.textColor;
    document.getElementById("fontSelect").value = data.font;
  } else {
    alert("Hatalı giriş!");
  }
};

// Genel ayarlar
document.getElementById("siteTitleInput").oninput = e => { data.title = e.target.value; save(); };
document.getElementById("bgColorInput").oninput = e => { data.bgColor = e.target.value; save(); };
document.getElementById("textColorInput").oninput = e => { data.textColor = e.target.value; save(); };
document.getElementById("fontSelect").onchange = e => { data.font = e.target.value; save(); };

document.getElementById("siteLogoInput").onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => { data.logo = ev.target.result; save(); };
  reader.readAsDataURL(file);
};

// Sekme yönetimi
document.getElementById("addTabBtn").onclick = () => {
  const name = document.getElementById("newTabName").value.trim();
  if (name && !data.tabs[name]) {
    data.tabs[name] = [];
    currentTab = name;
    save();
  }
};

document.getElementById("removeTabBtn").onclick = () => {
  if (confirm(`${currentTab} sekmesini silmek istiyor musun?`)) {
    delete data.tabs[currentTab];
    currentTab = Object.keys(data.tabs)[0] || "Günün Menüsü";
    save();
  }
};

document.getElementById("renameTabBtn").onclick = () => {
  const newName = prompt("Yeni sekme adı:", currentTab);
  if (newName && newName !== currentTab) {
    data.tabs[newName] = data.tabs[currentTab];
    delete data.tabs[currentTab];
    currentTab = newName;
    save();
  }
};

// Ürün ekleme
document.getElementById("addProductBtn").onclick = () => {
  const name = document.getElementById("productName").value;
  const desc = document.getElementById("productDesc").value;
  const price = document.getElementById("productPrice").value;
  const file = document.getElementById("productImage").files[0];
  if (!file) return alert("Resim seçiniz");

  const reader = new FileReader();
  reader.onload = e => {
    data.tabs[currentTab].push({ name, desc, price, image: e.target.result });
    save();
    document.getElementById("productName").value = "";
    document.getElementById("productDesc").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productImage").value = "";
  };
  reader.readAsDataURL(file);
};

// Çıkış
document.getElementById("logoutBtn").onclick = () => {
  isAdmin = false;
  adminPanel.classList.add("hidden");
  render();
};

// Kaydet
function save() {
  localStorage.setItem("menuData", JSON.stringify(data));
  render();
}

// İlk yükleme
render();
