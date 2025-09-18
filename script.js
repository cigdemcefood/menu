const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

let data = JSON.parse(localStorage.getItem("menuData")) || {
  title: "Çiğdemce Ev Yemekleri & Meze",
  logo: "",
  headerMsg: "",
  headerMsgActive: false,
  bgColor: "#fff8f0",
  textColor: "#333",
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
const whatsappLink = document.getElementById("whatsappLink");
const instagramLink = document.getElementById("instagramLink");
const locationLink = document.getElementById("locationLink");

// Render
function render() {
  siteTitle.textContent = data.title;
  document.body.style.backgroundColor = data.bgColor;
  document.body.style.color = data.textColor;
  document.body.style.fontFamily = data.font;

  if(data.logo){ siteLogo.src = data.logo; siteLogo.classList.remove("hidden"); }
  else siteLogo.classList.add("hidden");

  if(data.headerMsgActive && data.headerMsg){
    headerMsg.textContent = data.headerMsg;
    headerMsg.classList.remove("hidden");
  } else headerMsg.classList.add("hidden");

  menuTabs.innerHTML = "";
  Object.keys(data.tabs).forEach(tab => {
    const btn = document.createElement("button");
    btn.textContent = tab;
    btn.onclick = () => { currentTab = tab; renderContent(); };
    menuTabs.appendChild(btn);
  });

  renderContent();

  whatsappLink.href = data.footerLinks.whatsapp;
  instagramLink.href = data.footerLinks.instagram;
  locationLink.href = data.footerLinks.location;
}

function renderContent() {
  menuContent.innerHTML = "";
  data.tabs[currentTab].forEach((product,index) => {
    const maxLength = 50;
    let shortDesc = product.desc.length>maxLength?product.desc.substr(0,maxLength)+"...":product.desc;

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <h3>${product.name}</h3>
      <img src="${product.image}" alt="">
      <p class="desc">${shortDesc}</p>
      ${product.desc.length>maxLength?'<button class="showMoreBtn">Daha fazla</button>':""}
      <p><strong>${product.price||""}</strong></p>
      ${isAdmin?`<button onclick="deleteProduct(${index})">Sil</button>`:""}
    `;
    menuContent.appendChild(card);

    card.querySelector(".showMoreBtn")?.addEventListener("click",()=>alert(product.desc));
  });
}

// Admin login
document.getElementById("secretLoginArea").onclick = () => loginPanel.classList.remove("hidden");
document.getElementById("cancelLogin").onclick = () => loginPanel.classList.add("hidden");
document.getElementById("loginBtn").onclick = () => {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if(u===ADMIN_USER && p===ADMIN_PASS){
    isAdmin=true;
    loginPanel.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    fillAdminInputs();
  } else alert("Hatalı giriş!");
};

function fillAdminInputs(){
  document.getElementById("siteTitleInput").value=data.title;
  document.getElementById("headerMsgInput").value=data.headerMsg;
  document.getElementById("headerMsgActive").checked=data.headerMsgActive;
  document.getElementById("bgColorInput").value=data.bgColor;
  document.getElementById("textColorInput").value=data.textColor;
  document.getElementById("fontSelect").value=data.font;
  document.getElementById("whatsappInput").value=data.footerLinks.whatsapp;
  document.getElementById("instagramInput").value=data.footerLinks.instagram;
  document.getElementById("locationInput").value=data.footerLinks.location;
}

// Genel ayarlar
document.getElementById("siteTitleInput").oninput=e=>{data.title=e.target.value;save();}
document.getElementById("headerMsgInput").oninput=e=>{data.headerMsg=e.target.value;save();}
document.getElementById("headerMsgActive").onchange=e=>{data.headerMsgActive=e.target.checked;save();}
document.getElementById("bgColorInput").oninput=e=>{data.bgColor=e.target.value;save();}
document.getElementById("textColorInput").oninput=e=>{data.textColor=e.target.value;save();}
document.getElementById("fontSelect").onchange=e=>{data.font=e.target.value;save();}

// Logo yükleme
document.getElementById("siteLogoFile").onchange = e => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    data.logo = evt.target.result;
    save();
  };
  reader.readAsDataURL(file);
};

// Sekme yönetimi
document.getElementById("addTabBtn").onclick=()=>{const name=document.getElementById("newTabName").value.trim();if(name&&!data.tabs[name]){data.tabs[name]=[];currentTab=name;save();}};
document.getElementById("removeTabBtn").onclick=()=>{if(confirm(`${currentTab} sekmesini silmek istiyor musun?`)){delete data.tabs[currentTab];currentTab=Object.keys(data.tabs)[0]||"Günün Menüsü";save();}};
document.getElementById("renameTabBtn").onclick=()=>{const newName=prompt("Yeni sekme adı:",currentTab);if(newName&&newName!==currentTab){data.tabs[newName]=data.tabs[currentTab];delete data.tabs[currentTab];currentTab=newName;save();}};

// Ürün ekleme
document.getElementById("addProductBtn").onclick = () => {
  const name = document.getElementById("productName").value.trim();
  const desc = document.getElementById("productDesc").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const file = document.getElementById("productImageFile").files[0];

  if(!file){ alert("Lütfen bir resim seçin!"); return; }
  if(!name){ alert("Ürün adı girin!"); return; }

  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const maxW = 600, maxH = 400;
      const ratio = Math.min(maxW/img.width, maxH/img.height,1);
      const canvas = document.createElement("canvas");
      canvas.width = img.width*ratio;
      canvas.height = img.height*ratio;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const finalUrl = canvas.toDataURL("image/jpeg",0.9);
      data.tabs[currentTab].push({name,desc,price,image:finalUrl});
      save();
      document.getElementById("productName").value="";
      document.getElementById("productDesc").value="";
      document.getElementById("productPrice").value="";
      document.getElementById("productImageFile").value="";
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Footer linkleri
document.getElementById("whatsappInput").oninput=e=>{data.footerLinks.whatsapp=e.target.value;save();}
document.getElementById("instagramInput").oninput=e=>{data.footerLinks.instagram=e.target.value;save();}
document.getElementById("locationInput").oninput=e=>{data.footerLinks.location=e.target.value;save();}

// Ürün sil
function deleteProduct(index){if(!isAdmin)return;data.tabs[currentTab].splice(index,1);save();}

// Çıkış
document.getElementById("logoutBtn").onclick=()=>{isAdmin=false;adminPanel.classList.add("hidden");render();}

// Kaydet
function save(){localStorage.setItem("menuData",JSON.stringify(data));render();}

// İlk render
render();
