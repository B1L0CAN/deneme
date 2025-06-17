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
  // İşlev kaldırıldı.
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
  }
];

let currentStep = 0;
let formData = {
  proje: {},
  bilesen: {},
  arayuz: {},
  mesaj: { header: {}, messages: [] },
  parametre: {}
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
  // Dinamik girinti fonksiyonu
  function indent(level) { return ' '.repeat(level); }
  let xml = '';
  xml += `<Proje`;
  Object.entries(hierarchicalData.proje).forEach(([k, v]) => { if (v) xml += ` ${k}="${v}"`; });
  xml += '>';
  xml += `\n${indent(2)}<Bilesen`;
  Object.entries(hierarchicalData.bilesen).forEach(([k, v]) => { if (v) xml += ` ${k}="${v}"`; });
  xml += '>';
  xml += `\n${indent(4)}<Arayuz`;
  Object.entries(hierarchicalData.arayuz).forEach(([k, v]) => { if (v) xml += ` ${k}="${v}"`; });
  xml += '>';
  xml += `\n${indent(6)}<Servis`;
  Object.entries(hierarchicalData.servis).forEach(([k, v]) => { if (v) xml += ` ${k}="${v}"`; });
  xml += '>';

  // Header (varsa)
  const headerFilled = Object.values(hierarchicalData.mesaj.header).some(v => v !== undefined && v !== '');
  if (headerFilled) {
    xml += `\n${indent(8)}<Header`;
    Object.entries(hierarchicalData.mesaj.header).forEach(([k, v]) => { if (v !== undefined && v !== '') xml += ` ${k}="${v}"`; });
    xml += '/>';
  }

  // HeaderParametre (çoklu, varsa)
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

  // Her Mesaj ve hemen altında birden fazla Parametre (varsa)
  if (hierarchicalData.mesaj.messages.length > 0) {
    hierarchicalData.mesaj.messages.forEach(msg => {
      const msgFilled = Object.values(msg).some(v => v !== undefined && v !== '' && v !== null && typeof v !== 'object');
      if (msgFilled) {
        xml += `\n${indent(8)}<Mesaj`;
        hierarchy.mesaj.messageFields.forEach(field => {
          if (msg[field.key]) xml += ` ${field.key}="${msg[field.key]}"`;
        });
        xml += '/>';
      }
      // Parametreler (çoklu)
      if (Array.isArray(msg.param)) {
        msg.param.forEach(param => {
          if (param && Object.values(param).some(v => v !== undefined && v !== '')) {
            xml += `\n${indent(10)}<Parametre`;
            hierarchy.mesaj.paramFields.forEach(field => {
              if (param[field.key]) xml += ` ${field.key}="${param[field.key]}"`;
            });
            xml += '/>';
          }
        });
      }
    });
  }

  xml += `\n${indent(6)}</Servis>`;
  xml += `\n${indent(4)}</Arayuz>`;
  xml += `\n${indent(2)}</Bilesen>`;
  xml += `\n</Proje>`;
  return xml;
}

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
