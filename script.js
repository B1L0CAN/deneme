// Menüleri tek tek açıp kapatmak için 
function toggleMenu(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === "block" ? "none" : "block";
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
  const buttons = document.querySelectorAll("button[data-action]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      btn.classList.toggle("secili");
    });
  });
});

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

// ✅ XML veri oluşturup Java sunucuya POST eder
function xmlGonderJavaya() {
  const seciliButonlar = document.querySelectorAll("button.secili");
  //Yeni bir XML belgesi oluşturur. Kök eleman <komutlar> olacak şekilde başlatılır:
  const xmlDoc = document.implementation.createDocument(null, "komutlar");
/* <komutlar>
  <!-- buraya komutlar eklenecek -->
</komutlar>*/

/* 
→ Her bir seçili butonun data-action özelliğini alıyor. Bu örneğin "ayarKaydet" gibi bir komut ismi olur.
<komut> adında yeni bir XML elementi oluşturur, içine butonun action'ını yazar ve bunu <komutlar> kök elemanına ekler.
<komutlar>
  <komut>ayarKaydet</komut>
  <komut>pdfIndir</komut>
</komutlar>

*/ 
  seciliButonlar.forEach((btn) => {
    const actionName = btn.getAttribute("data-action");
    const komut = xmlDoc.createElement("komut");
    komut.textContent = actionName;
    xmlDoc.documentElement.appendChild(komut);
  });

  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(xmlDoc); //XML nesnesini düz bir XML string’ine dönüştürür, örneğin: "<komutlar><komut>ayarKaydet</komut></komutlar>"

  fetch("http://localhost:8080/api/komutlar", {
    method: "POST",
    headers: {
      "Content-Type": "application/xml", // içerik olarak xml gönderiyoz diyoz
    },
    body: xmlString,
  })
    .then((response) => {
      if (response.ok) {
        console.log("XML başarıyla gönderildi.");
      } else {
        console.warn("Sunucudan hata kodu:", response.status);
      }
    })
    .catch((error) => {
      console.error("Bağlantı hatası:", error);
    });
}

// ✅ Sunucudan XML veri alıp console'a yazar
function xmlVeriGetir() {
  fetch("http://localhost:8080/api/komutlar", {
    method: "GET",
    headers: {
      "Accept": "application/xml",
    },
  })
    .then((res) => res.text())
    .then((xmlText) => {
      //parse etmek lazım, bu sayede toplu duran veriyi tekil hale getirip işleyebiliyoruz
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");

      const komutlar = xmlDoc.getElementsByTagName("komut");
      console.log("Java'dan gelen komutlar:");
      //içerikler burada yazdırılacak
      for (let i = 0; i < komutlar.length; i++) {
        console.log(komutlar[i].textContent);
      }
    })
    .catch((error) => {
      console.error("Veri alma hatası:", error);
    });
}

// ✅ Uygulama butonunda çalıştırılacak
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

  // 🔁 XML gönderim burada tetikleniyor
  xmlGonderJavaya();

  const abc = document.getElementById('applySelectedBtn');
  abc.textContent = isActive ? 'Seçilenleri Uygula' : 'Seçilenler Çalıştırıldı';
  isActive = !isActive;
}

// Örnek sahte fonksiyon
function ayarKaydet() {
  console.log("ayarKaydet() fonksiyonu çağrıldı.");
}
