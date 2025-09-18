const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

let data = JSON.parse(localStorage.getItem("menuData")) || {
  title: "Çiğdemce Ev Yemekleri & Meze",
  logo: "",
  headerMsg: "",
  headerMsgActive: false,
  bgColor: "#fff8f0",
  textColor: "#333333",
  font: "Arial",
  tabs: { "Günün Menüsü": [] },
  footerLinks: { whatsapp: "#", instagram: "#", location: "#" }
};

let currentTab = Object.keys(data.tabs)[0];
let isAdmin = false;

const siteTitle = document.getElementById("siteTitle");
const siteLogo = document.getElementById("siteLogo");
const headerMsg = document.getElementById("headerMsg");
const menuTabs = document.getElementById("menuTabs");
const menuContent = document.getElementById("menuContent");
const adminPanel = document.getElementById("adminPanel");
const loginPanel = document.getElementById("loginPanel");

// Footer links
const whatsappLink = document.getElementById("whatsappLink");
const instagramLink = document.getElementById("instagramLink");
const locationLink = document.getElementById("locationLink");

// Render
function render() {
  siteTitle.textContent = data.title;

  document.body.style.backgroundColor = data.bgColor;
  document.body.style.color = data.textColor;
  document.body.style.fontFamily = data.font;

  if(data.logo){
    siteLogo.src = data.logo;
    siteLogo.classList.remove("hidden");
  } else {
    siteLogo.classList.add("hidden");
  }

  if(data.headerMsgActive && data.headerMsg){
    headerMsg.textContent = data.headerMsg;
    headerMsg.classList.remove("hidden");
  } else {
    headerMsg.classList.add("hidden");
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

  // Footer
  whatsappLink.href = data.footerLinks.whatsapp;
  instagramLink.href = data.footerLinks.instagram;
  locationLink.href = data.footerLinks.location;
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

// Admin işlemleri
document.getElementById("secretLoginArea").onclick = () => loginPanel.classList.remove("hidden");
document.getElementById("cancelLogin").onclick = () => loginPanel.classList.add("hidden");
document.getElementById("loginBtn").onclick = () => {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if(u === ADMIN_USER && p === ADMIN_PASS){
    isAdmin = true;
    loginPanel.classList.add("hidden");
    adminPanel.classList.remove("hidden");

    // admin input doldur
    document.getElementById("siteTitleInput").value = data.title;
    document.getElementById("siteLogoInput").value = data.logo;
    document.getElementById("headerMsgInput").value = data.headerMsg;
    document.getElementById("headerMsgActive").checked = data.headerMsgActive;
    document.getElementById("bgColorInput").value = data.bgColor;
    document.getElementById("textColorInput").value = data.textColor;
    document.getElementById("fontSelect").value = data.font;
    document.getElementById("whatsappInput").value = data.footerLinks.whatsapp;
    document.getElementById("instagramInput").value = data.footerLinks.instagram;
    document.getElementById("locationInput").value = data.footerLinks.location;
  } else {
    alert("Hatalı giriş!");
  }
};

// Genel ayarlar
document.getElementById("siteTitleInput").oninput = e => { data.title = e.target.value; save(); };
document.getElementById("siteLogoInput").oninput = e => { data.logo = e.target.value; save(); };
document.getElementById("headerMsgInput").oninput = e => { data.headerMsg = e.target.value; save(); };
document.getElementById("headerMsgActive").onchange = e => { data.headerMsgActive = e.target.checked; save(); };
document.getElementById("bgColorInput").oninput = e => { data.bgColor = e.target.value; save(); };
document.getElementById("textColorInput").oninput = e => { data.textColor = e.target.value; save(); };
document.getElementById("fontSelect").onchange = e => { data.font = e.target.value; save(); };

// Sekme yönetimi
document.getElementById("addTabBtn").onclick = () => {
  const name = document.getElementById("newTabName").value.trim();
  if(name && !data.tabs[name]){
    data.tabs[name] = [];
    currentTab = name;
    save();
  }
};
document.getElementById("removeTabBtn").onclick = () => {
  if(confirm(`${currentTab} sekmesini silmek istiyor musun?`)){
    delete data.tabs[currentTab];
    currentTab = Object.keys(data.tabs)[0] || "Günün Menüsü";
    save();
  }
};
document.getElementById("renameTabBtn").onclick = () => {
  const newName = prompt("Yeni sekme adı:", currentTab);
  if(newName && newName!==currentTab){
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
  const img = document.getElementById("productImage").value.trim();
  if(!img) return alert("Resim URL giriniz");

  data.tabs[currentTab].push({name, desc, price, image: img});
  save();

  document.getElementById("productName").value="";
  document.getElementById("productDesc").value="";
  document.getElementById("productPrice").value="";
  document.getElementById("productImage").value="";
};

// Footer linkleri
document.getElementById("whatsappInput").oninput = e => { data.footerLinks.whatsapp = e.target.value; save(); };
document.getElementById("instagramInput").oninput = e => { data.footerLinks.instagram = e.target.value; save(); };
document.getElementById("locationInput").oninput = e => { data.footerLinks.location = e.target.value; save(); };

// Ürün sil
function deleteProduct(index){
  if(!isAdmin) return;
  data.tabs[currentTab].splice(index,1);
  save();
}

// Çıkış
document.getElementById("logoutBtn").onclick = () => {
  isAdmin = false;
  adminPanel.classList.add("hidden");
  render();
};

// Kaydet
function save(){
  localStorage.setItem("menuData", JSON.stringify(data));
  render();
}

// İlk render
render();
