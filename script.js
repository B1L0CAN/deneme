// Menüleri tek tek açıp kapatmak için 
function toggleMenu(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === "block" ? "none" : "block";
}

// Menüleri topluca aç/kapat durumu için durum değişkeni
let allMenusOpen = false;

// "Seçilenleri Uygula" butonunun durumunu tutmak için değişken
let isActive = false;

// Tüm menüleri açar veya kapatır
function toggleAllMenus() {
  const submenus = document.querySelectorAll('.submenu');
  const toggleBtn = document.getElementById('toggleAllBtn');

  submenus.forEach((menu) => {
    menu.style.display = allMenusOpen ? 'none' : 'block';
  });

  toggleBtn.textContent = allMenusOpen ? 'Tümünü Aç' : 'Tümünü Kapat';
  allMenusOpen = !allMenusOpen;
}

// Sayfa yüklendiğinde her butona tıklama olayını eklemek için
// "data-action" olan butonlara tıklanınca "secili" sınıfı eklenir/çıkarılır
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button[data-action]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); // Form göndermeyi engeller (gerekirse)
      btn.classList.toggle("secili");
    });
  });
});

// Seçili butonları çalıştır (data-action ile tanımlanan fonksiyonları çağırır)
function uygulaSecilenler() {
  const seciliButonlar = document.querySelectorAll("button.secili");

  seciliButonlar.forEach((btn) => {
    const actionName = btn.getAttribute("data-action");
    if (typeof window[actionName] === "function") {
      window[actionName](); // Fonksiyonu çalıştır
    } else {
      console.warn(`Fonksiyon tanımlı değil: ${actionName}`);
    }
  });

  // Buton metnini değiştir (toggle gibi davranır)
  const abc = document.getElementById('applySelectedBtn');
  abc.textContent = isActive ? 'Seçilenleri Uygula' : 'Seçilenler Çalıştırıldı';
  isActive = !isActive;
}

// Seçilen butonları temizler, buton metinlerini geçici olarak değiştirir
function secilenlerIptal() {
  const seciliButonlar = document.querySelectorAll("button.secili");

  // Seçili sınıfını kaldır
  seciliButonlar.forEach((btn) => {
    btn.classList.remove("secili");
  });

  // "Temizle" butonunun metnini geçici olarak değiştir
  const cancelBtn = document.getElementById("cancelSelectedBtn");
  const originalText = cancelBtn.textContent;

  cancelBtn.textContent = "Seçilenler Temizlendi";

  // 0.75 saniye sonra eski haline döndür
  setTimeout(() => {
    cancelBtn.textContent = originalText;
  }, 750);

  // Uygula butonunu da eski haline getir
  const applyBtn = document.getElementById("applySelectedBtn");
  applyBtn.textContent = "Seçilenleri Uygula";
  isActive = false;
}

// Örnek fonksiyonlar: uygulamada tanımlı olması gereken eylemler
function ayarKaydet(){
  alert("deneme 1 2 3");
}
