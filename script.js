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
  // İşlev kaldırıldı.
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
      { key: 'c', label: 'c', type: 'string' },
      { key: 'd', label: 'd', type: 'string' }
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
  }
];

let currentStep = 0;
let formData = {
  proje: {},
  bilesen: {},
  arayuz: {},
  mesaj: { header: {}, messages: [] },
  parametre: {},
  tiplers: []  
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
      const input = document.createElement('input');
      input.type = 'text';
      input.value = formData[step.key][field.key] || '';
      input.className = 'output-value';
      input.oninput = (e) => {
        formData[step.key][field.key] = e.target.value;
      };
      box.appendChild(label);
      box.appendChild(input);
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
      step.messageFields.forEach(field => {
        const label = document.createElement('label');
        label.className = 'output-title';
        label.textContent = field.label;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = msg[field.key] || '';
        input.oninput = (e) => {
          msg[field.key] = e.target.value;
        };
        label.appendChild(input);
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
        const input = document.createElement('input');
        input.type = 'text';
        input.value = msg.param[field.key] || '';
        input.oninput = (e) => {
          msg.param[field.key] = e.target.value;
        };
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
  let xml = '<Proje';
  Object.entries(formData.proje).forEach(([k, v]) => {
    if (v) xml += ` ${k}="${v}"`;
  });
  xml += '/>\n';
  // Bileşen
  xml += '<Bilesen';
  Object.entries(formData.bilesen).forEach(([k, v]) => {
    if (v) xml += ` ${k}="${v}"`;
  });
  xml += '/>\n';
  // Arayüz
  xml += '<Arayuz';
  Object.entries(formData.arayuz).forEach(([k, v]) => {
    if (v) xml += ` ${k}="${v}"`;
  });
  xml += '/>\n';
  // Mesajlar
  xml += '<Mesajlar>\n';
  // Header
  xml += '  <Header';
  Object.entries(formData.mesaj.header).forEach(([k, v]) => {
    if (v !== undefined && v !== '') xml += ` ${k}="${v}"`;
  });
  xml += '/>\n';
  // Mesajlar
  formData.mesaj.messages.forEach(msg => {
    xml += '  <Mesaj';
    steps[3].messageFields.forEach(field => {
      if (msg[field.key]) xml += ` ${field.key}="${msg[field.key]}"`;
    });
    xml += '>'; // Mesaj başı
    // Parametre
    if (msg.param) {
      xml += '\n    <Parametre';
      steps[3].paramFields.forEach(field => {
        if (msg.param[field.key]) xml += ` ${field.key}="${msg.param[field.key]}"`;
      });
      xml += '/>\n  ';
    }
    xml += '</Mesaj>\n';
  });
  xml += '</Mesajlar>\n';
  // Parametre
  xml += '<Parametre';
  Object.entries(formData.parametre).forEach(([k, v]) => {
    if (v) xml += ` ${k}="${v}"`;
  });
  xml += '/>';
  // Tipler
  if (formData.tiplers && formData.tiplers.length > 0) {
    xml += `\n  <TiplerPaketi>\n`;
    formData.tiplers.forEach(tip => {
      xml += `    <tiplers adi="${tip.adi}" aciklama="${tip.aciklama}" kod="${tip.kod}">\n`;
      tip.degerler.forEach((deger, i) => {
        xml += `      <degerler nodeList="${deger.nodeList}" intValue="${i+1}"/>\n`;
      });
      xml += `    </tiplers>\n`;
    });
    xml += `  </TiplerPaketi>\n`;
  }
  // Kapanış tagları
  xml += `\n</Proje>\n`;

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
      { key: 'a', label: 'a', type: 'string' },
      { key: 'b', label: 'b', type: 'string' }
    ],
    child: 'servis'
  },
  servis: {
    label: 'Servis',
    fields: [
      { key: 'a', label: 'a', type: 'string' }
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
      { key: 'c', label: 'c', type: 'string' },
      { key: 'd', label: 'd', type: 'string' }
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
  proje: {},
  bilesen: {},
  arayuz: {},
  servis: {},
  mesaj: { header: {}, headerparametre: [], messages: [] }
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
    node.fields.forEach(field => {
      const box = document.createElement('div');
      box.className = 'output-box';
      const label = document.createElement('label');
      label.className = 'output-title';
      label.textContent = field.label;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = hierarchicalData[key][field.key] || '';
      input.className = 'output-value';
      input.oninput = (e) => {
        hierarchicalData[key][field.key] = e.target.value;
      };
      box.appendChild(label);
      box.appendChild(input);
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
      node.messageFields.forEach(field => {
        const label = document.createElement('label');
        label.className = 'output-title';
        label.textContent = field.label;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = msg[field.key] || '';
        input.oninput = (e) => {
          msg[field.key] = e.target.value;
        };
        label.appendChild(input);
        msgBox.appendChild(label);
      });
      // Parametreler (çoklu)
      if (!Array.isArray(msg.param)) msg.param = [];
      msg.param.forEach((param, pidx) => {
        const paramBox = document.createElement('div');
        paramBox.className = 'output-box';
        const paramTitle = document.createElement('div');
        paramTitle.className = 'output-title';
        paramTitle.textContent = `Parametre #${pidx + 1}`;
        paramBox.appendChild(paramTitle);
        node.paramFields.forEach(field => {
          const label = document.createElement('label');
          label.className = 'output-title';
          label.textContent = field.label;
          const input = document.createElement('input');
          input.type = 'text';
          input.value = param[field.key] || '';
          input.oninput = (e) => {
            param[field.key] = e.target.value;
          };
          label.appendChild(input);
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
  // Girinti için fonksiyon
  function indent(level) { return ' '.repeat(level); }

  let xml = '';
  // Proje açılışı
  xml += `<Proje`;
  Object.entries(hierarchicalData.proje).forEach(([k, v]) => { if (v) xml += ` ${k}="${v}"`; });
  xml += '>';

  // Bilesen açılışı
  xml += `\n${indent(2)}<Bilesen`;
  Object.entries(hierarchicalData.bilesen).forEach(([k, v]) => { if (v) xml += ` ${k}="${v}"`; });
  xml += '>';

  // Arayuz açılışı
  xml += `\n${indent(4)}<Arayuz`;
  Object.entries(hierarchicalData.arayuz).forEach(([k, v]) => { if (v) xml += ` ${k}="${v}"`; });
  xml += '>';

  // Servis açılışı
  xml += `\n${indent(6)}<Servis`;
  Object.entries(hierarchicalData.servis).forEach(([k, v]) => { if (v) xml += ` ${k}="${v}"`; });
  xml += '>';

  // Mesajlar + Parametreler
  if (hierarchicalData.mesaj.messages.length > 0) {
    hierarchicalData.mesaj.messages.forEach(msg => {
      const msgFilled = Object.values(msg).some(v => v !== undefined && v !== '' && v !== null && typeof v !== 'object');
      if (msgFilled) {
        xml += `\n${indent(8)}<Mesaj`;
        hierarchy.mesaj.messageFields.forEach(field => {
          if (msg[field.key]) xml += ` ${field.key}="${msg[field.key]}"`;
        });

        // Parametre var mı kontrolü
        const hasParam = Array.isArray(msg.param) && msg.param.some(param => Object.values(param).some(v => v !== undefined && v !== ''));
        if (hasParam) {
          xml += '>'; // Açılış kapanıyor, parametreler altına yazılacak

          msg.param.forEach(param => {
            if (param && Object.values(param).some(v => v !== undefined && v !== '')) {
              xml += `\n${indent(10)}<Parametre`;
              hierarchy.mesaj.paramFields.forEach(field => {
                if (param[field.key]) xml += ` ${field.key}="${param[field.key]}"`;
              });
              xml += '/>';
            }
          });

          xml += `\n${indent(8)}</Mesaj>`; // Mesaj kapanışı
        } else {
          // Parametre yok, tek satırda kapanış
          xml += '> </Mesaj>';
        }
      }
    });
  }

  // Header
  const headerFilled = Object.values(hierarchicalData.mesaj.header).some(v => v !== undefined && v !== '');
  if (headerFilled) {
    xml += `\n${indent(8)}<Header`;
    Object.entries(hierarchicalData.mesaj.header).forEach(([k, v]) => { if (v !== undefined && v !== '') xml += ` ${k}="${v}"`; });
    xml += '>';

    // HeaderParametreler
    if (Array.isArray(hierarchicalData.mesaj.headerparametre) && hierarchicalData.mesaj.headerparametre.length > 0) {
      hierarchicalData.mesaj.headerparametre.forEach(param => {
        const filled = Object.values(param).some(v => v !== undefined && v !== '');
        if (filled) {
          xml += `\n${indent(10)}<HeaderParametre`;
          hierarchy.mesaj.headerParamFields.forEach(field => {
            if (param[field.key]) xml += ` ${field.key}="${param[field.key]}"`;
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
  if (formData.tiplers && formData.tiplers.length > 0) {
    xml += `\n${indent(2)}<TiplerPaketi>\n`;
    formData.tiplers.forEach(tip => {
      xml += `${indent(4)}<tiplers adi="${tip.adi}" aciklama="${tip.aciklama}" kod="${tip.kod}">\n`;
      tip.degerler.forEach((deger, i) => {
        xml += `${indent(6)}<degerler nodeList="${deger.nodeList}" intValue="${i+1}"/>\n`;
      });
      xml += `${indent(4)}</tiplers>\n`;
    });
    xml += `${indent(2)}</TiplerPaketi>\n`;
  }

  // Kapanış tagları
  xml += `\n</Proje>\n`;

  return xml;
}

function tipEkleEkraniOlustur() {
  const outputContainer = document.getElementById('output-scroll-container');
  outputContainer.innerHTML = '';

  // Ana kutu
  const tipBox = document.createElement('div');
  tipBox.style.border = '2px solid #222';
  tipBox.style.borderRadius = '12px';
  tipBox.style.padding = '24px';
  tipBox.style.margin = '24px 0';
  tipBox.style.background = '#fff';
  tipBox.style.maxWidth = '500px';
  tipBox.style.marginLeft = 'auto';
  tipBox.style.marginRight = 'auto';

  // Başlık
  const title = document.createElement('div');
  title.textContent = 'Yeni Tip Ekle';
  title.style.textAlign = 'center';
  title.style.fontWeight = 'bold';
  title.style.fontSize = '1.5em';
  title.style.color = 'red';
  title.style.marginBottom = '16px';
  tipBox.appendChild(title);

  // 3 string input
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

  // Değerler başlığı
  const degerlerTitle = document.createElement('div');
  degerlerTitle.textContent = 'Değerler';
  degerlerTitle.style = 'text-align:center;font-weight:bold;color:red;margin:16px 0 8px 0;';
  tipBox.appendChild(degerlerTitle);

  // Değerler kutusu
  const degerlerContainer = document.createElement('div');
  degerlerContainer.id = 'degerlerContainer';
  degerlerContainer.style = 'margin-bottom:12px;';
  tipBox.appendChild(degerlerContainer);

  // Değer ekle butonu
  const degerEkleBtn = document.createElement('button');
  degerEkleBtn.id = 'degerEkleBtn';
  degerEkleBtn.textContent = '+ Değer Ekle';
  degerEkleBtn.style = 'background:red;color:white;padding:8px 18px;border:none;border-radius:6px;font-weight:bold;display:block;margin:0 auto 16px auto;';
  tipBox.appendChild(degerEkleBtn);

  // Kaydet/İptal butonları
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
      // nodeList (string) önce
      const nodeListInput = document.createElement('input');
      nodeListInput.type = 'text';
      nodeListInput.value = deger.nodeList || '';
      nodeListInput.placeholder = 'Değer';
      nodeListInput.style = inputStyle + 'width:120px;';
      nodeListInput.oninput = (e) => {
        deger.nodeList = e.target.value;
      };
      // intValue (otomatik artan, değiştirilemez) sonra
      const intValueInput = document.createElement('input');
      intValueInput.type = 'number';
      intValueInput.value = idx + 1;
      intValueInput.disabled = true;
      intValueInput.style = inputStyle + 'width:50px;text-align:center;';
      // Sil butonu
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
    // Alan kontrolü
    if (!adi || !aciklama || !kod) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }
    if (degerler.length === 0 || degerler.some(d => !d.nodeList.trim())) {
      alert('En az bir değer ekleyin ve tüm değer alanlarını doldurun!');
      return;
    }
    // hierarchicalData'daki güncel verileri formData'ya kopyala
    formData.proje = { ...hierarchicalData.proje };
    formData.bilesen = { ...hierarchicalData.bilesen };
    formData.arayuz = { ...hierarchicalData.arayuz };
    formData.mesaj = JSON.parse(JSON.stringify(hierarchicalData.mesaj));
    if (typeof hierarchicalData.parametre !== 'undefined') {
      formData.parametre = { ...hierarchicalData.parametre };
    }
    // Tipi ekle
    if (!formData.tiplers) formData.tiplers = [];
    formData.tiplers.push({
      adi,
      aciklama,
      kod,
      degerler: degerler.map((d, i) => ({ intValue: i+1, nodeList: d.nodeList }))
    });
    // Hiyerarşik XML oluştur
    const xml = generateHierarchicalXML();
    outputContainer.innerHTML = '';
    const xmlBox = document.createElement('div');
    xmlBox.className = 'xml-output';
    xmlBox.style.whiteSpace = 'pre-wrap';
    xmlBox.style.fontFamily = 'monospace';
    xmlBox.style.backgroundColor = '#111';
    xmlBox.style.color = '#fff';
    xmlBox.style.padding = '16px';
    xmlBox.style.border = '1px solid #ccc';
    xmlBox.style.borderRadius = '8px';
    xmlBox.style.overflow = 'auto';
    xmlBox.style.maxHeight = '600px';
    xmlBox.textContent = xml;
    outputContainer.appendChild(xmlBox);
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

