function toggleMenu(id, arrowElement) {
  const submenu = document.getElementById(id);
  if (!submenu) return;

  const isOpen = submenu.style.display === 'block';
  submenu.style.display = isOpen ? 'none' : 'block';

  if (arrowElement) {
    arrowElement.textContent = isOpen ? '▶' : '▼';
  }
}

let allMenusOpen = false;
let isActive = false;

function toggleAllMenus() {
  const submenus = document.querySelectorAll('.submenu');
  const toggleBtn = document.getElementById('toggleAllBtn');

  submenus.forEach((menu) => {
    menu.style.display = allMenusOpen ? 'none' : 'block';
  });

  toggleBtn.textContent = allMenusOpen ? 'Tümünü Aç' : 'Tümünü Kapat';
  allMenusOpen = !allMenusOpen;
}

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".menu-item button[data-action]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("secili");
    });
  });
});

// Başlık ve attribute yapılarını tanımla
const attributeMap = {
  proje: [
    { key: 'isim', label: 'İsim', type: 'string', value: 'DemoProje' },
    { key: 'versiyon', label: 'Versiyon', type: 'string', value: '1.0.0' },
    { key: 'buildNo', label: 'Build No', type: 'int', value: 101 }
  ],
  bilesen: [
    { key: 'isim', label: 'İsim', type: 'string', value: 'AnaBilesen' }
  ],
  arayuz: [
    { key: 'isim', label: 'İsim', type: 'string', value: 'KullaniciArayuzu' }
  ],
  servis: [
    { key: 'isim', label: 'İsim', type: 'string', value: 'VeriServisi' },
    { key: 'acikKapali', label: 'Açık/Kapalı', type: 'boolean', value: true }
  ],
  mesaj: [
    { key: 'mesajId', label: 'Mesaj ID', type: 'int', value: 123 },
    { key: 'isim', label: 'İsim', type: 'string', value: 'BilgiMesaji' },
    { key: 'bypass', label: 'Bypass', type: 'boolean', value: false }
  ],
  parametre: [
    { key: 'isim', label: 'İsim', type: 'string', value: 'Param1' },
    { key: 'tip', label: 'Tip', type: 'string', value: 'String' },
    { key: 'koleksiyon', label: 'Koleksiyon', type: 'string', value: 'Liste' }
  ]
};

function generateXML(type, attributes) {
  let xml = `<${capitalize(type)}>`;
  attributes.forEach(attr => {
    xml += `\n  <${capitalize(attr.key)}>${attr.value}</${capitalize(attr.key)}>`;
  });
  xml += `\n</${capitalize(type)}>`;
  return xml;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showOutputForSelected(selectedTypes) {
  const scrollContainer = document.getElementById('output-scroll-container');
  if (!scrollContainer) return;
  scrollContainer.innerHTML = '';
  selectedTypes.forEach(type => {
    const attrs = attributeMap[type];
    if (!attrs) return;
    // Kutucuklar
    attrs.forEach(attr => {
      const box = document.createElement('div');
      box.className = 'output-box';
      box.innerHTML = `<div class='output-title'>${attr.label}</div><div class='output-value'>${attr.value}</div>`;
      scrollContainer.appendChild(box);
    });
    // XML çıktısı
    const xmlStr = generateXML(type, attrs);
    const xmlBox = document.createElement('div');
    xmlBox.className = 'xml-output';
    xmlBox.textContent = xmlStr;
    scrollContainer.appendChild(xmlBox);
  });
}

function uygulaSecilenler() {
  const seciliButonlar = document.querySelectorAll("button.secili");
  const selectedTypes = Array.from(seciliButonlar).map(btn => btn.getAttribute("data-action"));

  // Sağdaki kutucukları ve XML çıktısını göster
  showOutputForSelected(selectedTypes);

  seciliButonlar.forEach((btn) => {
    const actionName = btn.getAttribute("data-action");
    if (typeof window[actionName] === "function") {
      window[actionName]();
    } else {
      //console.warn(`Fonksiyon tanımlı değil: ${actionName}`);
    }
  });

  const applyBtn = document.getElementById('applySelectedBtn');
  applyBtn.textContent = isActive ? 'Seçilenleri Uygula' : 'Seçilenler Çalıştırıldı';
  isActive = !isActive;
}

function secilenlerIptal() {
  const seciliButonlar = document.querySelectorAll("button.secili");

  seciliButonlar.forEach((btn) => {
    btn.classList.remove("secili");
  });

  const cancelBtn = document.getElementById("cancelSelectedBtn");
  const originalText = cancelBtn.textContent;

  cancelBtn.textContent = "Seçilenler Temizlendi";
  setTimeout(() => {
    cancelBtn.textContent = originalText;
  }, 750);

  const applyBtn = document.getElementById("applySelectedBtn");
  applyBtn.textContent = "Seçilenleri Uygula";
  isActive = false;

  // Sağdaki kutucukları temizle
  const scrollContainer = document.getElementById('output-scroll-container');
  if (scrollContainer) scrollContainer.innerHTML = '';
}
