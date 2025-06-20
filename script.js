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
  const buttons = document.querySelectorAll(".menu-button[data-action]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Önce tüm butonların seçili sınıfını kaldır
      buttons.forEach(b => b.classList.remove("secili"));

      // Şu anki butonu seçili yap
      btn.classList.add("secili");

      // İlgili input formunu göster
      const key = btn.getAttribute("data-action");
      if (hierarchy[key]) {
        renderHierarchicalInput(key); // input ekranını yükle
      }
    });
  });
});

// Sabit tipler dizisi
const SABIT_TIPLER = [
  "void", "short", "int", "long", "float", "double", "char", "string", "nullTerminatedString",
  "uint8", "uint16", "uint32", "uint64", "int8", "int16", "int32", "int64", "bool8", "bool16", "bool32"
];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function secilenlerIptal() {
  const seciliButon = document.querySelector("button.secili");

  if (seciliButon) {
    // Butondaki data-action değerini al
    const actionKey = seciliButon.getAttribute("data-action");

    // Seçimi kaldır
    seciliButon.classList.remove("secili");

    // O butona ait verileri temizle
    if (actionKey && hierarchicalData[actionKey]) {
      if (typeof hierarchicalData[actionKey] === 'object' && !Array.isArray(hierarchicalData[actionKey])) {
        Object.keys(hierarchicalData[actionKey]).forEach(key => {
          hierarchicalData[actionKey][key] = '';
        });
      }

      // Mesaj özel durumu (header, messages, headerparametre)
      if (actionKey === 'mesaj') {
        hierarchicalData.mesaj.header = {};
        hierarchicalData.mesaj.headerparametre = [];
        hierarchicalData.mesaj.messages = [];
      }
    }

    // Giriş ekranı yeniden çizilsin
    renderHierarchicalInput(actionKey);
  }

  // Buton geri bildirimi
  const cancelBtn = document.getElementById("cancelSelectedBtn");
  const originalText = cancelBtn.textContent;
  cancelBtn.textContent = "Seçim Temizlendi";
  setTimeout(() => {
    cancelBtn.textContent = originalText;
  }, 750);
}

// Adım adım input alanları için yapı
const steps = [
  {
    key: 'proje',
    label: 'Proje',
    fields: [
      { key: 'a', label: 'a', type: 'string' },
      { key: 'b', label: 'b', type: 'string' },
      { key: 'c', label: 'c', type: 'string' },
      { key: 'd', label: 'd', type: 'string' },
      { key: 'e', label: 'e', type: 'string' },
      { key: 'f', label: 'f', type: 'string' },
    ]
  },
  {
    key: 'bilesen',
    label: 'Bileşen',
    fields: [
      { key: 'a', label: 'a', type: 'string' }
    ]
  },
  {
    key: 'arayuz',
    label: 'Arayüz',
    fields: [
      { key: 'a', label: 'a', type: 'string' },
      { key: 'b', label: 'b', type: 'string' }
    ]
  },
  {
    key: 'mesaj',
    label: 'Mesajlar',
    header: [
      { key: 'a', label: 'a', type: 'string' },
      { key: 'b', label: 'b', type: 'string' },
      { key: 'c', label: 'c', type: 'boolean' }
    ],
    messageFields: [
      { key: 'a', label: 'a', type: 'string' },
      { key: 'b', label: 'b', type: 'string' },
      { key: 'c', label: 'c', type: 'int' },
      { key: 'd', label: 'd', type: 'boolean' }
    ],
    paramFields: [
      { key: 'a', label: 'a', type: 'string' },
      { key: 'b', label: 'b', type: 'string' },
      { key: 'c', label: 'c', type: 'string' },
      { key: 'd', label: 'd', type: 'string' },
      { key: 'e', label: 'e', type: 'string' }
    ]
  },
  {
    key: 'parametre',
    label: 'Parametre',
    fields: [
      { key: 'a', label: 'a', type: 'string' },
      { key: 'b', label: 'b', type: 'string' },
      { key: 'c', label: 'c', type: 'string' },
      { key: 'd', label: 'd', type: 'string' },
      { key: 'e', label: 'e', type: 'string' }
    ]
  },
  {
    key: 'tipler', // yeni adım
    label: 'Tipler',
    tipFields: [
      { key: 'adi', label: 'Tip Adı', type: 'string' }
    ],
    degerFields: [
      { key: 'adi', label: 'Değer Adı', type: 'string' }
    ]
  },
  {
    key: 'structs',  // structlar için yeni adım
    label: 'Structlar',
    structFields: [
      { key: 'adi', label: 'Struct Adı', type: 'string' },
      { key: 'aciklama', label: 'Açıklama', type: 'string' }
    ],
    alanFields: [
      { key: 'adi', label: 'Alan Adı', type: 'string' },
      { key: 'tip', label: 'Tip', type: 'tiplerComboBox' } // burayı combobox olarak ayarla
    ]
  }
];

let currentStep = 0;
let formData = {
  proje: {},
  bilesen: {},
  arayuz: {},
  mesaj: { header: {}, messages: [] },
  parametre: {},
  tipler: [],    // doğru isim
  structs: []    // structlar için dizi eklendi
};


function renderStep() {
  const scrollContainer = document.getElementById('output-scroll-container');
  if (!scrollContainer) return;
  scrollContainer.innerHTML = '';
  const step = steps[currentStep];
  if (!step) return;

  const title = document.createElement('div');
  title.className = 'output-title';
  title.textContent = step.label;
  scrollContainer.appendChild(title);

  // Proje, Bileşen, Arayüz, Parametre için inputlar
  if (step.fields) {
    step.fields.forEach(field => {
      const box = document.createElement('div');
      box.className = 'output-box';
      const label = document.createElement('label');
      label.className = 'output-title';
      label.textContent = field.label;
      label.style.display = 'flex';
      label.style.flexDirection = 'column';
      label.style.alignItems = 'center';
      label.style.width = '100%';
      const input = document.createElement('input');
      input.type = 'text';
      input.value = formData[step.key][field.key] || '';
      input.className = 'output-value';
      input.oninput = (e) => {
        formData[step.key][field.key] = e.target.value;
      };
      input.style.margin = '0 auto';
      label.appendChild(input);
      box.appendChild(label);
      scrollContainer.appendChild(box);
    });
  }

  // Mesajlar için özel alan
  if (step.key === 'mesaj') {
    // Header
    const headerBox = document.createElement('div');
    headerBox.className = 'output-box';
    const headerTitle = document.createElement('div');
    headerTitle.className = 'output-title';
    headerTitle.textContent = 'Başlık (Header)';
    headerBox.appendChild(headerTitle);
    step.header.forEach(field => {
      const label = document.createElement('label');
      label.className = 'output-title';
      label.textContent = field.label;
      label.style.display = 'flex';
      label.style.flexDirection = 'column';
      label.style.alignItems = 'center';
      label.style.width = '100%';
      let input;
      if (field.type === 'boolean') {
        input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!formData.mesaj.header[field.key];
        input.onchange = (e) => {
          formData.mesaj.header[field.key] = e.target.checked;
        };
      } else {
        input = document.createElement('input');
        input.type = 'text';
        input.value = formData.mesaj.header[field.key] || '';
        input.oninput = (e) => {
          formData.mesaj.header[field.key] = e.target.value;
        };
      }
      input.style.margin = '0 auto';
      label.appendChild(input);
      headerBox.appendChild(label);
    });
    scrollContainer.appendChild(headerBox);

    // Mesajlar
    const messagesTitle = document.createElement('div');
    messagesTitle.className = 'output-title';
    messagesTitle.textContent = 'Mesajlar';
    scrollContainer.appendChild(messagesTitle);

    formData.mesaj.messages.forEach((msg, idx) => {
      const msgBox = document.createElement('div');
      msgBox.className = 'output-box';
      const msgLabel = document.createElement('div');
      msgLabel.className = 'output-title';
      msgLabel.textContent = `Mesaj #${idx + 1}`;
      msgBox.appendChild(msgLabel);
      step.messageFields.forEach((field, fieldIdx) => {
        const label = document.createElement('label');
        label.className = 'output-title';
        label.textContent = field.label;
        label.style.display = 'flex';
        label.style.flexDirection = 'column';
        label.style.alignItems = 'center';
        label.style.width = '100%';
        // Sadece ilk alan (a) için combobox, diğerleri için input
        if (fieldIdx === 0) {
          const select = document.createElement('select');
          select.style.padding = '4px 8px';
          select.style.borderRadius = '4px';
          select.style.minWidth = '180px';
          // Sabit tipler
          SABIT_TIPLER.forEach((tip, idx) => {
            const option = document.createElement('option');
            option.value = `//@TiplerPaketi/@tipler.${idx}`;
            option.textContent = tip;
            select.appendChild(option);
          });
          // Dinamik tipler
          if (formData.tiplers && formData.tiplers.length > 0) {
            formData.tiplers.forEach((tip, idx) => {
              const option = document.createElement('option');
              option.value = `//@TiplerPaketi/@tipler.${SABIT_TIPLER.length + idx}`;
              option.textContent = tip.adi;
              select.appendChild(option);
            });
          }
          // Seçili değer
          select.value = msg[field.key] || '';
          select.onchange = (e) => {
            msg[field.key] = e.target.value;
          };
          select.style.margin = '0 auto';
          label.appendChild(select);
        } else {
          const input = document.createElement('input');
          if (field.type === 'int') {
            input.type = 'number';
            input.value = msg[field.key] || '';
            input.oninput = (e) => {
              msg[field.key] = parseInt(e.target.value) || 0;
            };
          } else if (field.type === 'boolean') {
            input.type = 'checkbox';
            input.checked = !!msg[field.key];
            input.onchange = (e) => {
              msg[field.key] = e.target.checked;
            };
          } else {
            input.type = 'text';
            input.value = msg[field.key] || '';
            input.oninput = (e) => {
              msg[field.key] = e.target.value;
            };
          }
          input.style.margin = '0 auto';
          label.appendChild(input);
        }
        msgBox.appendChild(label);
      });
      // Parametreler
      const paramTitle = document.createElement('div');
      paramTitle.className = 'output-title';
      paramTitle.textContent = 'Parametre';
      msgBox.appendChild(paramTitle);
      if (!msg.param) msg.param = {};
      step.paramFields.forEach(field => {
        const label = document.createElement('label');
        label.className = 'output-title';
        label.textContent = field.label;
        label.style.display = 'flex';
        label.style.flexDirection = 'column';
        label.style.alignItems = 'center';
        label.style.width = '100%';
        const input = document.createElement('input');
        if (field.type === 'int') {
          input.type = 'number';
          input.value = msg.param[field.key] || '';
          input.oninput = (e) => {
            msg.param[field.key] = parseInt(e.target.value) || 0;
          };
        } else if (field.type === 'boolean') {
          input.type = 'checkbox';
          input.checked = !!msg.param[field.key];
          input.onchange = (e) => {
            msg.param[field.key] = e.target.checked;
          };
        } else {
          input.type = 'text';
          input.value = msg.param[field.key] || '';
          input.oninput = (e) => {
            msg.param[field.key] = e.target.value;
          };
        }
        input.style.margin = '0 auto';
        label.appendChild(input);
        msgBox.appendChild(label);
      });
      // Sil butonu
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Sil';
      removeBtn.onclick = () => {
        formData.mesaj.messages.splice(idx, 1);
        renderStep();
      };
      msgBox.appendChild(removeBtn);
      scrollContainer.appendChild(msgBox);
    });
    // + butonu
    if (formData.mesaj.messages.length < 10) {
      const addBtn = document.createElement('button');
      addBtn.textContent = '+ Mesaj Ekle';
      addBtn.onclick = () => {
        formData.mesaj.messages.push({});
        renderStep();
      };
      scrollContainer.appendChild(addBtn);
    }
  }

  // Adım butonları
  const navBox = document.createElement('div');
  navBox.style.marginTop = '24px';
  navBox.style.display = 'flex';
  navBox.style.gap = '12px';
  if (currentStep > 0) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Geri';
    prevBtn.onclick = () => {
      currentStep--;
      renderStep();
    };
    navBox.appendChild(prevBtn);
  }
  if (currentStep < steps.length - 1) {
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'İleri';
    nextBtn.onclick = () => {
      currentStep++;
      renderStep();
    };
    navBox.appendChild(nextBtn);
  } else {
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Kaydet';
    saveBtn.onclick = () => {
      const xml = generateFullXML();
      scrollContainer.innerHTML = '';
      const xmlBox = document.createElement('div');
      xmlBox.className = 'xml-output';
      xmlBox.textContent = xml;
      scrollContainer.appendChild(xmlBox);
    };
    navBox.appendChild(saveBtn);
  }
  scrollContainer.appendChild(navBox);
}

function generateFullXML() {
  // Proje
  let xml = '<arayuz:Proje';
  Object.entries(formData.proje).forEach(([k, v]) => {
    if (v) xml += ` ${k}="${typeof v === 'boolean' ? v : (v || '')}"`;
  });
  xml += '/>\n';
  // Bileşen
  xml += '<Bilesen';
  Object.entries(formData.bilesen).forEach(([k, v]) => {
    if (v) xml += ` ${k}="${typeof v === 'boolean' ? v : (v || '')}"`;
  });
  xml += '/>\n';
  // Arayüz
  xml += '<Arayuz';
  Object.entries(formData.arayuz).forEach(([k, v]) => {
    if (v) xml += ` ${k}="${typeof v === 'boolean' ? v : (v || '')}"`;
  });
  xml += '/>\n';
  // Mesajlar
  xml += '<Mesajlar>\n';
  // Header
  xml += '  <Header';
  Object.entries(formData.mesaj.header).forEach(([k, v]) => {
    if (v !== undefined && v !== '') xml += ` ${k}="${typeof v === 'boolean' ? v : (v || '')}"`;
  });
  xml += '/>\n';
  // Mesajlar
  formData.mesaj.messages.forEach(msg => {
    xml += '  <Mesaj';
    steps[3].messageFields.forEach(field => {
      if (msg[field.key]) xml += ` ${field.key}="${typeof msg[field.key] === 'boolean' ? msg[field.key] : (msg[field.key] || '')}"`;
    });
    xml += '>'; // Mesaj başı
    // Parametre
    if (msg.param) {
      xml += '\n    <Parametre';
      steps[3].paramFields.forEach(field => {
        if (msg.param[field.key]) xml += ` ${field.key}="${typeof msg.param[field.key] === 'boolean' ? msg.param[field.key] : (msg.param[field.key] || '')}"`;
      });
      xml += '/>\n  ';
    }
    xml += '</Mesaj>\n';
  });
  xml += '</Mesajlar>\n';
  // Parametre
  xml += '<Parametre';
  Object.entries(formData.parametre).forEach(([k, v]) => {
    if (v) xml += ` ${k}="${typeof v === 'boolean' ? v : (v || '')}"`;
  });
  xml += '/>';
  // Tipler
  if ((formData.tiplers && formData.tiplers.length > 0) || SABIT_TIPLER.length > 0) {
    xml += `\n  <TiplerPaketi>\n`;
    SABIT_TIPLER.forEach((tip, idx) => {
      xml += `    <tipler isim="${typeof tip === 'boolean' ? tip : (tip || '')}"/>\n`;
    });
    if (formData.tiplers && formData.tiplers.length > 0) {
      formData.tiplers.forEach((tip, idx) => {
        xml += `    <tipler adi="arayuz:${typeof tip.adi === 'boolean' ? tip.adi : (tip.adi || '')}" aciklama="${typeof tip.aciklama === 'boolean' ? tip.aciklama : (tip.aciklama || '')}" kod="${typeof tip.kod === 'boolean' ? tip.kod : (tip.kod || '')}">\n`;
        tip.degerler.forEach((deger, i) => {
          xml += `      <degerler nodeList="${typeof deger.nodeList === 'boolean' ? deger.nodeList : (deger.nodeList || '')}" intValue="${i+1}"/>\n`;
        });
        xml += `    </tipler>\n`;
      });
    }
    xml += `  </TiplerPaketi>\n`;
  }
  // Kapanış tagları
  xml += `</arayuz:Proje>\n`;

  return xml;
}

// Sayfa yüklendiğinde ilk adımı göster
window.addEventListener('DOMContentLoaded', () => {
  renderStep();
});

// --- YENİ HİYERARŞİK INPUT & XML SİSTEMİ ---

// Hiyerarşi ve input alanları tanımı
const hierarchy = {
  proje: {
    label: 'Proje',
    fields: [
      { key: 'a', label: 'a', type: 'string' },
      { key: 'b', label: 'b', type: 'string' },
      { key: 'c', label: 'c', type: 'string' },
      { key: 'd', label: 'd', type: 'string' },
      { key: 'e', label: 'e', type: 'string' },
      { key: 'f', label: 'f', type: 'string' }
    ],
    child: 'bilesen'
  },
  bilesen: {
    label: 'Bileşen',
    fields: [
      { key: 'a', label: 'a', type: 'string' }
    ],
    child: 'arayuz'
  },
  arayuz: {
    label: 'Arayüz',
    fields: [
      { key: 'a', label: 'Bileşen Sırası', type: 'bilesenSira' },
      { key: 'b', label: 'b', type: 'string' }
    ],
    child: 'servis'
  },
  servis: {
    label: 'Servis',
    fields: [
      { key: 'a', label: 'a', type: 'string' },
      { key: 'b', label: 'b', type: 'string' },
      { key: 'c', label: 'c', type: 'boolean' },
      { key: 'd', label: 'd', type: 'boolean' }
    ],
    child: 'mesaj'
  },
  mesaj: {
    label: 'Mesajlar',
    header: [
      { key: 'a', label: 'a', type: 'string' },
      { key: 'b', label: 'b', type: 'string' },
      { key: 'c', label: 'c', type: 'boolean' }
    ],
    headerParamFields: [
      { key: 'a', label: 'a', type: 'string' },
      { key: 'b', label: 'b', type: 'string' },
      { key: 'c', label: 'c', type: 'string' },
      { key: 'd', label: 'd', type: 'string' },
      { key: 'e', label: 'e', type: 'string' }
    ],
    messageFields: [
      { key: 'a', label: 'a', type: 'string' },
      { key: 'b', label: 'b', type: 'string' },
      { key: 'c', label: 'c', type: 'int' },
      { key: 'd', label: 'd', type: 'boolean' }
    ],
    paramFields: [
      { key: 'a', label: 'a', type: 'string' },
      { key: 'b', label: 'b', type: 'string' },
      { key: 'c', label: 'c', type: 'string' },
      { key: 'd', label: 'd', type: 'string' },
      { key: 'e', label: 'e', type: 'string' }
    ],
    child: null
  },
};

let currentKey = 'proje';
let hierarchicalData = {
  proje: { a: "", b: "", c: "", d: "", e: "", f: "" },
  bilesen: { a: "" },
  arayuz: { a: "", b: "" },
  servis: { a: "", b: "", c: "", d: "" },
  mesaj: {
    header: { a: "", b: "", c: "" },
    headerparametre: [],   // parametreler array, boş olabilir
    messages: []           // mesajlar array, boş olabilir
  }
};


function renderHierarchicalInput(key) {
  currentKey = key;
  const scrollContainer = document.getElementById('output-scroll-container');
  if (!scrollContainer) return;
  scrollContainer.innerHTML = '';
  const node = hierarchy[key];
  if (!node) return;

  const title = document.createElement('div');
  title.className = 'output-title';
  title.textContent = node.label;
  scrollContainer.appendChild(title);

  // Normal alanlar
  if (node.fields) {
    node.fields.forEach((field, fieldIdx) => {
      if (key === 'arayuz' && field.key === 'a') {
        // A parametresi için readonly input göster
        const box = document.createElement('div');
        box.className = 'output-box';
        const label = document.createElement('label');
        label.className = 'output-title';
        label.textContent = field.label;
        label.style.display = 'flex';
        label.style.flexDirection = 'column';
        label.style.alignItems = 'center';
        label.style.width = '100%';
        const input = document.createElement('input');
        input.type = 'text';
        input.value = '//@bilesenler.0';
        input.readOnly = true;
        input.className = 'output-value';
        input.style.backgroundColor = '#f0f0f0';
        input.style.textAlign = 'center';
        input.style.margin = '0 auto';
        hierarchicalData[key][field.key] = '//@bilesenler.0';
        label.appendChild(input);
        box.appendChild(label);
        scrollContainer.appendChild(box);
        return;
      }
      const box = document.createElement('div');
      box.className = 'output-box';
      const label = document.createElement('label');
      label.className = 'output-title';
      label.textContent = field.label;
      label.style.display = 'flex';
      label.style.flexDirection = 'column';
      label.style.alignItems = 'center';
      label.style.width = '100%';
      if (key === 'servis' && (field.key === 'c' || field.key === 'd')) {
        // Boolean alanlar için checkbox
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!hierarchicalData[key][field.key];
        input.onchange = (e) => {
          hierarchicalData[key][field.key] = e.target.checked;
        };
        input.style.margin = '0 auto';
        label.appendChild(input);
      } else if (key === 'mesajlar' && field.key === 'c') {
        // Mesajlardaki c alanı için int input
        const input = document.createElement('input');
        input.type = 'number';
        input.value = hierarchicalData[key][field.key] || '';
        input.className = 'output-value';
        input.oninput = (e) => {
          hierarchicalData[key][field.key] = parseInt(e.target.value) || 0;
        };
        input.style.margin = '0 auto';
        label.appendChild(input);
      } else if (key === 'mesajlar' && field.key === 'd') {
        // Mesajlardaki d alanı için boolean checkbox
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!hierarchicalData[key][field.key];
        input.onchange = (e) => {
          hierarchicalData[key][field.key] = e.target.checked;
        };
        input.style.margin = '0 auto';
        label.appendChild(input);
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = hierarchicalData[key][field.key] || '';
        input.className = 'output-value';
        input.oninput = (e) => {
          hierarchicalData[key][field.key] = e.target.value;
        };
        input.style.margin = '0 auto';
        label.appendChild(input);
      }
      box.appendChild(label);
      scrollContainer.appendChild(box);
    });
  }

  // Mesajlar için özel alan
  if (key === 'mesaj') {
    // Header
    const headerBox = document.createElement('div');
    headerBox.className = 'output-box';
    const headerTitle = document.createElement('div');
    headerTitle.className = 'output-title';
    headerTitle.textContent = 'Başlık (Header)';
    headerBox.appendChild(headerTitle);
    node.header.forEach(field => {
      const label = document.createElement('label');
      label.className = 'output-title';
      label.textContent = field.label;
      label.style.display = 'flex';
      label.style.flexDirection = 'column';
      label.style.alignItems = 'center';
      label.style.width = '100%';
      let input;
      if (field.type === 'boolean') {
        input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!hierarchicalData.mesaj.header[field.key];
        input.onchange = (e) => {
          hierarchicalData.mesaj.header[field.key] = e.target.checked;
        };
      } else {
        input = document.createElement('input');
        input.type = 'text';
        input.value = hierarchicalData.mesaj.header[field.key] || '';
        input.oninput = (e) => {
          hierarchicalData.mesaj.header[field.key] = e.target.value;
        };
      }
      input.style.margin = '0 auto';
      label.appendChild(input);
      headerBox.appendChild(label);
    });

    // HeaderParametre (çoklu, varsa) ve ekleme butonu header kutusunun içinde olacak
    if (!Array.isArray(hierarchicalData.mesaj.headerparametre)) hierarchicalData.mesaj.headerparametre = [];
    hierarchicalData.mesaj.headerparametre.forEach((param, idx) => {
      const headerParamBox = document.createElement('div');
      headerParamBox.className = 'output-box';
      const headerParamTitle = document.createElement('div');
      headerParamTitle.className = 'output-title';
      headerParamTitle.textContent = `HeaderParametre #${idx + 1}`;
      headerParamBox.appendChild(headerParamTitle);
      node.headerParamFields.forEach(field => {
        const label = document.createElement('label');
        label.className = 'output-title';
        label.textContent = field.label;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = param[field.key] || '';
        input.oninput = (e) => {
          param[field.key] = e.target.value;
        };
        input.style.margin = '0 auto';
        label.appendChild(input);
        headerParamBox.appendChild(label);
      });
      // Sil butonu
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Sil';
      removeBtn.onclick = () => {
        hierarchicalData.mesaj.headerparametre.splice(idx, 1);
        renderHierarchicalInput('mesaj');
      };
      headerParamBox.appendChild(removeBtn);
      headerBox.appendChild(headerParamBox);
    });
    // + HeaderParametre Ekle butonu (header kutusunun en altında)
    if (hierarchicalData.mesaj.headerparametre.length < 10) {
      const addHeaderParamBtn = document.createElement('button');
      addHeaderParamBtn.textContent = '+ HeaderParametre Ekle';
      addHeaderParamBtn.onclick = () => {
        hierarchicalData.mesaj.headerparametre.push({});
        renderHierarchicalInput('mesaj');
      };
      headerBox.appendChild(addHeaderParamBtn);
    }
    scrollContainer.appendChild(headerBox);

    // Mesajlar
    hierarchicalData.mesaj.messages.forEach((msg, idx) => {
      const msgBox = document.createElement('div');
      msgBox.className = 'output-box';
      const msgLabel = document.createElement('div');
      msgLabel.className = 'output-title';
      msgLabel.textContent = `Mesaj #${idx + 1}`;
      msgBox.appendChild(msgLabel);
      node.messageFields.forEach((field, fieldIdx) => {
        const label = document.createElement('label');
        label.className = 'output-title';
        label.textContent = field.label;
        label.style.display = 'flex';
        label.style.flexDirection = 'column';
        label.style.alignItems = 'center';
        label.style.width = '100%';
        // Sadece ilk alan (a) için combobox, diğerleri için input
        if (fieldIdx === 0) {
          const select = document.createElement('select');
          select.style.padding = '4px 8px';
          select.style.borderRadius = '4px';
          select.style.minWidth = '180px';
          // Sabit tipler
          SABIT_TIPLER.forEach((tip, idx) => {
            const option = document.createElement('option');
            option.value = `//@TiplerPaketi/@tipler.${idx}`;
            option.textContent = tip;
            select.appendChild(option);
          });
          // Dinamik tipler
          if (formData.tiplers && formData.tiplers.length > 0) {
            formData.tiplers.forEach((tip, idx) => {
              const option = document.createElement('option');
              option.value = `//@TiplerPaketi/@tipler.${SABIT_TIPLER.length + idx}`;
              option.textContent = tip.adi;
              select.appendChild(option);
            });
          }
          // Seçili değer
          select.value = msg[field.key] || '';
          select.onchange = (e) => {
            msg[field.key] = e.target.value;
          };
          select.style.margin = '0 auto';
          label.appendChild(select);
        } else {
          const input = document.createElement('input');
          if (field.type === 'int') {
            input.type = 'number';
            input.value = msg[field.key] || '';
            input.oninput = (e) => {
              msg[field.key] = parseInt(e.target.value) || 0;
            };
          } else if (field.type === 'boolean') {
            input.type = 'checkbox';
            input.checked = !!msg[field.key];
            input.onchange = (e) => {
              msg[field.key] = e.target.checked;
            };
          } else {
            input.type = 'text';
            input.value = msg[field.key] || '';
            input.oninput = (e) => {
              msg[field.key] = e.target.value;
            };
          }
          input.style.margin = '0 auto';
          label.appendChild(input);
        }
        msgBox.appendChild(label);
      });
      // Parametreler (çoklu)
      if (!Array.isArray(msg.param)) msg.param = [];
     msg.param.forEach((param, pidx) => {
  const paramBox = document.createElement('div');
  const paramTitle = document.createElement('div');
  paramTitle.className = 'output-title';
  paramTitle.textContent = `Parametre #${pidx + 1}`;
  paramBox.appendChild(paramTitle);

  node.paramFields.forEach((field, fieldIdx) => {
    const label = document.createElement('label');
    label.className = 'output-title';
    label.textContent = field.label;
    label.style.display = 'flex';
    label.style.flexDirection = 'column';
    label.style.alignItems = 'center';
    label.style.width = '100%';

    if (fieldIdx === 0) {
      // İlk alan için combobox
      const select = document.createElement('select');
      select.style.padding = '4px 8px';
      select.style.borderRadius = '4px';
      select.style.minWidth = '180px';

      // SABİT TİPLER
      SABIT_TIPLER.forEach((tip, idx) => {
        const option = document.createElement('option');
        option.value = `//@TiplerPaketi/@tipler.${idx}`;
        option.textContent = tip;
        select.appendChild(option);
      });

      // DİNAMİK TİPLER
      if (formData.tiplers && formData.tiplers.length > 0) {
        formData.tiplers.forEach((tip, idx) => {
          const option = document.createElement('option');
          option.value = `//@TiplerPaketi/@tipler.${SABIT_TIPLER.length + idx}`;
          option.textContent = tip.adi;
          select.appendChild(option);
        });
      }

      // Seçili değer
      select.value = param[field.key] || '';
      select.onchange = (e) => {
        param[field.key] = e.target.value;
      };
      select.style.margin = '0 auto';
      label.appendChild(select);
    } else {
      const input = document.createElement('input');
      if (field.type === 'int') {
        input.type = 'number';
        input.value = param[field.key] || '';
        input.oninput = (e) => {
          param[field.key] = parseInt(e.target.value) || 0;
        };
      } else if (field.type === 'boolean') {
        input.type = 'checkbox';
        input.checked = !!param[field.key];
        input.onchange = (e) => {
          param[field.key] = e.target.checked;
        };
      } else {
        input.type = 'text';
        input.value = param[field.key] || '';
        input.oninput = (e) => {
          param[field.key] = e.target.value;
        };
      }
      input.style.margin = '0 auto';
      label.appendChild(input);
    }

    paramBox.appendChild(label);
  });

  // Sil butonu
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Sil';
  removeBtn.onclick = () => {
    msg.param.splice(pidx, 1);
    renderHierarchicalInput('mesaj');
  };
  paramBox.appendChild(removeBtn);
  msgBox.appendChild(paramBox);
});

      // + Parametre Ekle butonu
      if (msg.param.length < 10) {
        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Parametre Ekle';
        addBtn.onclick = () => {
          msg.param.push({});
          renderHierarchicalInput('mesaj');
        };
        msgBox.appendChild(addBtn);
      }
      // Sil butonu
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Sil';
      removeBtn.onclick = () => {
        hierarchicalData.mesaj.messages.splice(idx, 1);
        renderHierarchicalInput('mesaj');
      };
      msgBox.appendChild(removeBtn);
      scrollContainer.appendChild(msgBox);
    });
    // + butonu
    if (hierarchicalData.mesaj.messages.length < 10) {
      const addBtn = document.createElement('button');
      addBtn.textContent = '+ Mesaj Ekle';
      addBtn.onclick = () => {
        hierarchicalData.mesaj.messages.push({ param: [] });
        renderHierarchicalInput('mesaj');
      };
      scrollContainer.appendChild(addBtn);
    }
  }

  // Butonlar
  const navBox = document.createElement('div');
  navBox.style.marginTop = '24px';
  navBox.style.display = 'flex';
  navBox.style.gap = '12px';

  // İleri butonu (alt başlık varsa)
  if (hierarchy[key].child) {
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'İleri';
    nextBtn.onclick = () => {
      renderHierarchicalInput(hierarchy[key].child);
    };
    navBox.appendChild(nextBtn);
  }
  // Kaydet butonu (her zaman var)
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Kaydet';
  saveBtn.onclick = () => {
    const xml = generateHierarchicalXML();
    scrollContainer.innerHTML = '';
    const xmlBox = document.createElement('div');
    xmlBox.className = 'xml-output';
    xmlBox.textContent = xml;
    scrollContainer.appendChild(xmlBox);
  };
  navBox.appendChild(saveBtn);

  scrollContainer.appendChild(navBox);
}

function generateHierarchicalXML() {
  function indent(level) { return ' '.repeat(level); }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';

  // Proje açılışı
  xml += `<arayuz:Proje`;
  hierarchy.proje.fields.forEach(field => {
    const v = hierarchicalData.proje[field.key];
    xml += ` ${field.key}="${field.type === 'boolean' ? (v === true ? 'true' : 'false') : (v || '')}"`;
  });
  xml += '>';

  // Bilesen açılışı
  xml += `\n${indent(2)}<Bilesen`;
  hierarchy.bilesen.fields.forEach(field => {
    const v = hierarchicalData.bilesen[field.key];
    xml += ` ${field.key}="${field.type === 'boolean' ? (v === true ? 'true' : 'false') : (v || '')}"`;
  });
  xml += '>';

  // Arayuz açılışı
  xml += `\n${indent(4)}<Arayuz`;
  hierarchy.arayuz.fields.forEach(field => {
    const v = hierarchicalData.arayuz[field.key];
    xml += ` ${field.key}="${field.type === 'boolean' ? (v === true ? 'true' : 'false') : (v || '')}"`;
  });
  xml += '>';

  // Servis açılışı
  xml += `\n${indent(6)}<Servis`;
  hierarchy.servis.fields.forEach(field => {
    const v = hierarchicalData.servis[field.key];
    xml += ` ${field.key}="${field.type === 'boolean' ? (v === true ? 'true' : 'false') : (v || '')}"`;
  });
  xml += '>';

  // Mesajlar + Parametreler (Aynı)

  if (hierarchicalData.mesaj.messages.length > 0) {
    hierarchicalData.mesaj.messages.forEach(msg => {
      const msgFilled = Object.values(msg).some(v => v !== undefined && v !== '' && v !== null && typeof v !== 'object');
      if (msgFilled) {
        xml += `\n${indent(8)}<Mesaj`;
        hierarchy.mesaj.messageFields.forEach(field => {
          const v = msg[field.key];
          xml += ` ${field.key}="${field.type === 'boolean' ? (v === true ? 'true' : 'false') : (v || '')}"`;
        });

        const hasParam = Array.isArray(msg.param) && msg.param.some(param => Object.values(param).some(v => v !== undefined && v !== ''));
        if (hasParam) {
          xml += '>';
          msg.param.forEach(param => {
            if (param && Object.values(param).some(v => v !== undefined && v !== '')) {
              xml += `\n${indent(10)}<Parametre`;
              hierarchy.mesaj.paramFields.forEach(field => {
                const v = param[field.key];
                xml += ` ${field.key}="${field.type === 'boolean' ? (v === true ? 'true' : 'false') : (v || '')}"`;
              });
              xml += '/>';
            }
          });
          xml += `\n${indent(8)}</Mesaj>`;
        } else {
          xml += '> </Mesaj>';
        }
      }
    });
  }

  const headerFilled = Object.values(hierarchicalData.mesaj.header).some(v => v !== undefined && v !== '');
  if (headerFilled) {
    xml += `\n${indent(8)}<Header`;
    hierarchy.mesaj.header.forEach(field => {
      const v = hierarchicalData.mesaj.header[field.key];
      xml += ` ${field.key}="${field.type === 'boolean' ? (v === true ? 'true' : 'false') : (v || '')}"`;
    });
    xml += '>';

    if (Array.isArray(hierarchicalData.mesaj.headerparametre) && hierarchicalData.mesaj.headerparametre.length > 0) {
      hierarchicalData.mesaj.headerparametre.forEach(param => {
        const filled = Object.values(param).some(v => v !== undefined && v !== '');
        if (filled) {
          xml += `\n${indent(10)}<HeaderParametre`;
          hierarchy.mesaj.headerParamFields.forEach(field => {
            const v = param[field.key];
            xml += ` ${field.key}="${field.type === 'boolean' ? (v === true ? 'true' : 'false') : (v || '')}"`;
          });
          xml += '/>';
        }
      });
    }
    xml += `\n${indent(8)}</Header>`;
  }

  xml += `\n${indent(6)}</Servis>`;
  xml += `\n${indent(4)}</Arayuz>`;
  xml += `\n${indent(2)}</Bilesen>`;

  // TIPLER bölümü eklendi
if ((formData.tiplers && formData.tiplers.length > 0) || SABIT_TIPLER.length > 0) {
  xml += `\n${indent(2)}<TiplerPaketi>\n`;

  // SABİT TİPLER
  SABIT_TIPLER.forEach((tip) => {
    xml += `${indent(4)}<tipler isim="${typeof tip === 'boolean' ? tip : (tip || '')}"/>\n`;
  });

  // DİNAMİK TİPLER
  if (formData.tiplers && formData.tiplers.length > 0) {
    formData.tiplers.forEach((tip) => {
      xml += `${indent(4)}<tipler adi="arayuz:${tip.adi || ''}" aciklama="${tip.aciklama || ''}" kod="${tip.kod || ''}">\n`;  // Kod burada
      tip.degerler.forEach((deger, i) => {
        xml += `${indent(6)}<degerler nodeList="${deger.nodeList || ''}" intValue="${i + 1}"/>\n`;
      });
      xml += `${indent(4)}</tipler>\n`;
    });
  }

  // STRUKTÜR
  if (formData.structs && formData.structs.length > 0) {
    formData.structs.forEach((struct) => {
      xml += `${indent(4)}<tipler adi="arayuz:${struct.adi || ''}" aciklama="${struct.aciklama || ''}" kod="${struct.kod || ''}">\n`;  // Kod burada da ekleniyor
      struct.alanlar.forEach((alan) => {
        xml += `${indent(6)}<deger adi="${alan.adi || ''}" tip="${alan.tip || ''}"/>\n`;
      });
      xml += `${indent(4)}</tipler>\n`;
    });
  }

  xml += `${indent(2)}</TiplerPaketi>\n`;
}

  xml += `</arayuz:Proje>\n`;

  return xml;
}

function tipEkleEkraniOlustur() {
  const outputContainer = document.getElementById('output-scroll-container');
  outputContainer.innerHTML = '';

  const tipBox = document.createElement('div');
  tipBox.style.border = '2px solid #222';
  tipBox.style.borderRadius = '12px';
  tipBox.style.padding = '24px';
  tipBox.style.margin = '24px 0';
  tipBox.style.background = '#fff';
  tipBox.style.maxWidth = '500px';
  tipBox.style.marginLeft = 'auto';
  tipBox.style.marginRight = 'auto';

  const title = document.createElement('div');
  title.textContent = 'Yeni Tip Ekle';
  title.style.textAlign = 'center';
  title.style.fontWeight = 'bold';
  title.style.fontSize = '1.5em';
  title.style.color = '#b00';
  title.style.marginBottom = '16px';
  tipBox.appendChild(title);

  const labelStyle = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;justify-content:center;font-weight:bold;color:#b00;';
  const inputStyle = 'padding:4px 8px;border-radius:4px;border:1px solid #aaa;min-width:180px;';

  const adiDiv = document.createElement('div');
  adiDiv.style = labelStyle;
  adiDiv.innerHTML = 'Tip Adı: <input type="text" id="tipAdiInput" style="' + inputStyle + '" />';
  tipBox.appendChild(adiDiv);

  const aciklamaDiv = document.createElement('div');
  aciklamaDiv.style = labelStyle;
  aciklamaDiv.innerHTML = 'Açıklama: <input type="text" id="tipAciklamaInput" style="' + inputStyle + '" />';
  tipBox.appendChild(aciklamaDiv);

  const kodDiv = document.createElement('div');
  kodDiv.style = labelStyle;
  kodDiv.innerHTML = 'Kod: <input type="text" id="tipKodInput" style="' + inputStyle + '" />';
  tipBox.appendChild(kodDiv);

  const degerlerTitle = document.createElement('div');
  degerlerTitle.textContent = 'Değerler';
  degerlerTitle.style = 'text-align:center;font-weight:bold;color:#b00;margin:16px 0 8px 0;';
  tipBox.appendChild(degerlerTitle);

  const degerlerContainer = document.createElement('div');
  degerlerContainer.id = 'degerlerContainer';
  degerlerContainer.style = 'margin-bottom:12px;';
  tipBox.appendChild(degerlerContainer);

  const degerEkleBtn = document.createElement('button');
  degerEkleBtn.id = 'degerEkleBtn';
  degerEkleBtn.textContent = '+ Değer Ekle';
  degerEkleBtn.style = 'background:red;color:white;padding:8px 18px;border:none;border-radius:6px;font-weight:bold;display:block;margin:0 auto 16px auto;';
  tipBox.appendChild(degerEkleBtn);

  const btnBox = document.createElement('div');
  btnBox.style = 'display:flex;gap:16px;justify-content:center;margin-top:16px;';
  const kaydetBtn = document.createElement('button');
  kaydetBtn.id = 'tipKaydetBtn';
  kaydetBtn.textContent = 'Kaydet';
  kaydetBtn.style = 'background:red;color:white;padding:8px 24px;border:none;border-radius:6px;font-weight:bold;';
  const iptalBtn = document.createElement('button');
  iptalBtn.id = 'tipIptalBtn';
  iptalBtn.textContent = 'İptal';
  iptalBtn.style = 'background:red;color:white;padding:8px 24px;border:none;border-radius:6px;font-weight:bold;';
  btnBox.appendChild(kaydetBtn);
  btnBox.appendChild(iptalBtn);
  tipBox.appendChild(btnBox);

  outputContainer.appendChild(tipBox);

  let degerler = [];

  function renderDegerler() {
    degerlerContainer.innerHTML = '';
    degerler.forEach((deger, idx) => {
      const degerDiv = document.createElement('div');
      degerDiv.style = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;justify-content:center;';
      const nodeListInput = document.createElement('input');
      nodeListInput.type = 'text';
      nodeListInput.value = deger.nodeList || '';
      nodeListInput.placeholder = 'Değer';
      nodeListInput.style = inputStyle + 'width:120px;';
      nodeListInput.oninput = (e) => {
        deger.nodeList = e.target.value;
      };
      const intValueInput = document.createElement('input');
      intValueInput.type = 'number';
      intValueInput.value = idx + 1;
      intValueInput.disabled = true;
      intValueInput.style = inputStyle + 'width:50px;text-align:center;';
      const silBtn = document.createElement('button');
      silBtn.textContent = 'Sil';
      silBtn.style = 'background:red;color:white;padding:4px 12px;border:none;border-radius:4px;font-weight:bold;';
      silBtn.onclick = () => {
        degerler.splice(idx, 1);
        renderDegerler();
      };
      degerDiv.appendChild(nodeListInput);
      degerDiv.appendChild(intValueInput);
      degerDiv.appendChild(silBtn);
      degerlerContainer.appendChild(degerDiv);
    });
  }

  degerEkleBtn.onclick = () => {
    degerler.push({ nodeList: '' });
    renderDegerler();
  };

  kaydetBtn.onclick = () => {
    const adi = document.getElementById('tipAdiInput').value.trim();
    const aciklama = document.getElementById('tipAciklamaInput').value.trim();
    const kod = document.getElementById('tipKodInput').value.trim();

    if (!adi || !aciklama || !kod) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }
    if (degerler.length === 0 || degerler.some(a => !a.nodeList.trim())) {
      alert('En az bir değer ekleyin ve tüm değerleri doldurun!');
      return;
    }

    if (!formData.tiplers) formData.tiplers = [];
    formData.tiplers.push({
      adi,
      aciklama,
      kod,
      degerler: [...degerler]
    });

    guncelleTiplerMenusu();
    outputContainer.innerHTML = '';
  };

  iptalBtn.onclick = () => {
    outputContainer.innerHTML = '';
  };

  renderDegerler();
}


// Menüdeki Tip Ekle butonuna tıklanınca bu ekranı aç
window.addEventListener('DOMContentLoaded', () => {
  const btnTipEkle = document.querySelector('.menu-button[data-action="tipEkle"]');
  if (btnTipEkle) {
    btnTipEkle.addEventListener('click', tipEkleEkraniOlustur);
  }
});

// Menü butonlarına tıklama ile input ekranı açılması
function setupMenuClicks() {
  const buttons = document.querySelectorAll('.menu-button[data-action]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-action');
      if (hierarchy[key]) {
        renderHierarchicalInput(key);
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setupMenuClicks();
  renderHierarchicalInput('proje');
});

function structEkleEkraniOlustur() {
  const outputContainer = document.getElementById('output-scroll-container');
  outputContainer.innerHTML = '';

  const structBox = document.createElement('div');
  structBox.style.border = '2px solid #222';
  structBox.style.borderRadius = '12px';
  structBox.style.padding = '24px';
  structBox.style.margin = '24px 0';
  structBox.style.background = '#fff';
  structBox.style.maxWidth = '500px';
  structBox.style.marginLeft = 'auto';
  structBox.style.marginRight = 'auto';

  // Başlık
  const title = document.createElement('div');
  title.textContent = 'Yeni Struct Ekle';
  title.style.textAlign = 'center';
  title.style.fontWeight = 'bold';
  title.style.fontSize = '1.5em';
  title.style.color = '#b00';   title.style.marginBottom = '16px';
  structBox.appendChild(title);

  const labelStyle = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;justify-content:center;font-weight:bold;color:#b00;';
  const inputStyle = 'padding:4px 8px;border-radius:4px;border:1px solid #aaa;min-width:180px;';

  // Struct Adı
  const adiDiv = document.createElement('div');
  adiDiv.style = labelStyle;
  adiDiv.innerHTML = 'Struct Adı: <input type="text" id="structAdiInput" style="' + inputStyle + '" />';
  structBox.appendChild(adiDiv);

  // Açıklama
  const aciklamaDiv = document.createElement('div');
  aciklamaDiv.style = labelStyle;
  aciklamaDiv.innerHTML = 'Açıklama: <input type="text" id="structAciklamaInput" style="' + inputStyle + '" />';
  structBox.appendChild(aciklamaDiv);

// Kodu
  const kodDiv = document.createElement('div');
  kodDiv.style = labelStyle;
  kodDiv.innerHTML = 'Kod: <input type="text" id="kodInput" style="' + inputStyle + '" />';
  structBox.appendChild(kodDiv);

  // Alanlar başlığı
  const alanlarTitle = document.createElement('div');
  alanlarTitle.textContent = 'Alanlar';
  alanlarTitle.style = 'text-align:center;font-weight:bold;color:#b00;margin:16px 0 8px 0;';
  structBox.appendChild(alanlarTitle);

  // Alanlar container
  const alanlarContainer = document.createElement('div');
  alanlarContainer.id = 'alanlarContainer';
  alanlarContainer.style = 'margin-bottom:12px;';
  structBox.appendChild(alanlarContainer);

  // Alan ekle butonu
  const alanEkleBtn = document.createElement('button');
  alanEkleBtn.id = 'alanEkleBtn';
  alanEkleBtn.textContent = '+ Alan Ekle';
  alanEkleBtn.style = 'background:red;color:white;padding:8px 18px;border:none;border-radius:6px;font-weight:bold;display:block;margin:0 auto 16px auto;';
  structBox.appendChild(alanEkleBtn);

  // Kaydet/İptal butonları
  const btnBox = document.createElement('div');
  btnBox.style = 'display:flex;gap:16px;justify-content:center;margin-top:16px;';
  const kaydetBtn = document.createElement('button');
  kaydetBtn.id = 'structKaydetBtn';
  kaydetBtn.textContent = 'Kaydet';
  kaydetBtn.style = 'background:red;color:white;padding:8px 24px;border:none;border-radius:6px;font-weight:bold;';
  const iptalBtn = document.createElement('button');
  iptalBtn.id = 'structIptalBtn';
  iptalBtn.textContent = 'İptal';
  iptalBtn.style = 'background:red;color:white;padding:8px 24px;border:none;border-radius:6px;font-weight:bold;';
  btnBox.appendChild(kaydetBtn);
  btnBox.appendChild(iptalBtn);
  structBox.appendChild(btnBox);

  outputContainer.appendChild(structBox);

  let alanlar = [];

  function renderAlanlar() {
    alanlarContainer.innerHTML = '';
    alanlar.forEach((alan, idx) => {
      const alanDiv = document.createElement('div');
      alanDiv.style = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;justify-content:center;';
      const alanInput = document.createElement('input');
      alanInput.type = 'text';
      alanInput.value = alan.adi || '';
      alanInput.placeholder = 'Alan Adı';
      alanInput.style = inputStyle + 'width:180px;';
      alanInput.oninput = (e) => {
        alan.adi = e.target.value;
      };

      const tipInput = document.createElement('input');
      tipInput.type = 'text';
      tipInput.value = alan.tip || '';
      tipInput.placeholder = 'Tipi';
      tipInput.style = inputStyle + 'width:120px;';
      tipInput.oninput = (e) => {
        alan.tip = e.target.value;
      };

      const silBtn = document.createElement('button');
      silBtn.textContent = 'Sil';
      silBtn.style = 'background:red;color:white;padding:4px 12px;border:none;border-radius:4px;font-weight:bold;';
      silBtn.onclick = () => {
        alanlar.splice(idx, 1);
        renderAlanlar();
      };

      alanDiv.appendChild(alanInput);
      alanDiv.appendChild(tipInput);
      alanDiv.appendChild(silBtn);
      alanlarContainer.appendChild(alanDiv);
    });
  }

  alanEkleBtn.onclick = () => {
    alanlar.push({ adi: '', tip: '' });
    renderAlanlar();
  };

  kaydetBtn.onclick = () => {
  const adi = document.getElementById('structAdiInput').value.trim();
  const aciklama = document.getElementById('structAciklamaInput').value.trim();
  const kod = document.getElementById('kodInput').value.trim();  // Kod inputunu buradan alıyoruz

  // Kontrolleri yap
  if (!adi || !aciklama || !kod) {
    alert('Lütfen tüm alanları doldurun!');
    return;
  }
  if (alanlar.length === 0 || alanlar.some(a => !a.adi.trim() || !a.tip.trim())) {
    alert('En az bir alan ekleyin ve tüm alanları doldurun!');
    return;
  }

  // Veri kopyalama
  formData.proje = { ...hierarchicalData.proje };
  formData.bilesen = { ...hierarchicalData.bilesen };
  formData.arayuz = { ...hierarchicalData.arayuz };
  formData.mesaj = JSON.parse(JSON.stringify(hierarchicalData.mesaj));
  if (typeof hierarchicalData.parametre !== 'undefined') {
    formData.parametre = { ...hierarchicalData.parametre };
  }

  // Struct ve tipleri ekle
  if (!formData.structs) formData.structs = [];
  if (!formData.tipler) formData.tipler = [];

  // Struct ekleme işlemi
  formData.structs.push({
    adi,
    aciklama,
    kod,  // Kod bilgisi buraya eklendi
    alanlar: alanlar.map((a) => ({ adi: a.adi, tip: a.tip }))
  });

  guncelleTiplerMenusu();
  outputContainer.innerHTML = '';
};



  iptalBtn.onclick = () => {
    outputContainer.innerHTML = '';
  };

  renderAlanlar();
}


// --- Menüde Tipler Listesi ---
function guncelleTiplerMenusu() {
  // Tipler sütunu
  const tiplerTd = document.getElementById('tiplerListesi');
  tiplerTd.innerHTML = '';
  if (formData.tiplers && formData.tiplers.length > 0) {
    const ul = document.createElement('ul');
    formData.tiplers.forEach(tip => {
      const li = document.createElement('li');
      li.textContent = tip.adi;
      // En başa ekle
      ul.insertBefore(li, ul.firstChild);
    });
    tiplerTd.appendChild(ul);
  }

  // Structlar sütunu
  const structlarTd = document.getElementById('structlarListesi');
  structlarTd.innerHTML = '';
  if (formData.structs && formData.structs.length > 0) {
    const ul = document.createElement('ul');
    formData.structs.forEach(struct => {
      const li = document.createElement('li');
      li.textContent = struct.adi;
      // En başa ekle
      ul.insertBefore(li, ul.firstChild);
    });
    structlarTd.appendChild(ul);
  }

  // Listeler sütunu
  const listelerTd = document.getElementById('listelerListesi');
  listelerTd.innerHTML = '';
  if (formData.lists && formData.lists.length > 0) {
    const ul = document.createElement('ul');
    formData.lists.forEach(list => {
      const li = document.createElement('li');
      li.textContent = list.adi;
      // En başa ekle
      ul.insertBefore(li, ul.firstChild);
    });
    listelerTd.appendChild(ul);
  }
}




// Tip eklendiğinde veya sayfa yüklendiğinde bu fonksiyonu çağır
// tipEkleEkraniOlustur ve ilgili yerlere guncelleTiplerMenusu() ekle
// Ayrıca sayfa yüklenince de çağır
window.addEventListener('DOMContentLoaded', guncelleTiplerMenusu);

window.addEventListener('DOMContentLoaded', () => {
  const btnStructEkle = document.querySelector('.menu-button[data-action="structEkle"]');
  if (btnStructEkle) {
    btnStructEkle.addEventListener('click', structEkleEkraniOlustur);
  }
});
