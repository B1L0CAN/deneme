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

function uygulaSecilenler() {
  const seciliButonlar = document.querySelectorAll("button.secili");

  seciliButonlar.forEach((btn) => {
    const actionName = btn.getAttribute("data-action");
    if (typeof window[actionName] === "function") {
      window[actionName]();
    } else {
      console.warn(`Fonksiyon tanımlı değil: ${actionName}`);
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
}
