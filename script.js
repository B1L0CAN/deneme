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
        renderForm(key); // input ekranını yükle
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
    if (actionKey && formData[actionKey]) {
      if (typeof formData[actionKey] === 'object' && !Array.isArray(formData[actionKey])) {
        Object.keys(formData[actionKey]).forEach(key => {
          formData[actionKey][key] = '';
        });
      }

      // Mesaj özel durumu (header, messages, headerparametre)
      if (actionKey === 'mesaj') {
        formData.mesaj.header = {};
        formData.mesaj.headerparametre = [];
        formData.mesaj.messages = [];
      }
    }

    // Giriş ekranı yeniden çizilsin
    renderForm(actionKey);
  }

  // Buton geri bildirimi
  const cancelBtn = document.getElementById("cancelSelectedBtn");
  const originalText = cancelBtn.textContent;
  cancelBtn.textContent = "Seçim Temizlendi";
  setTimeout(() => {
    cancelBtn.textContent = originalText;
  }, 750);
}

// Hiyerarşi ve input alanları tanımı
const hierarchy = {
  proje: {
    label: 'Proje',
    fields: [
      { key: 'projeA', label: 'Proje Adı', type: 'string' },
      { key: 'projeB', label: 'Proje Açıklaması', type: 'string' },
      { key: 'projeC', label: 'Proje Kodu', type: 'string' },
      { key: 'projeD', label: 'Proje Versiyonu', type: 'string' },
      { key: 'projeE', label: 'Proje Sahibi', type: 'string' },
      { key: 'projeF', label: 'Proje Tarihi', type: 'string' }
    ],
    child: 'bilesen'
  },
  bilesen: {
    label: 'Bileşen',
    fields: [
      { key: 'bilesenAdi', label: 'Bileşen Adı', type: 'string' }
    ],
    child: 'arayuz'
  },
  arayuz: {
    label: 'Arayüz',
    fields: [
      { key: 'arayuzSira', label: 'Bileşen Sırası', type: 'bilesenSira' },
      { key: 'arayuzAdi', label: 'Arayüz Adı', type: 'string' }
    ],
    child: 'servis'
  },
  servis: {
    label: 'Servis',
    fields: [
      { key: 'servisAdi', label: 'Servis Adı', type: 'string' },
      { key: 'servisAciklama', label: 'Servis Açıklaması', type: 'string' },
      { key: 'servisAktif', label: 'Aktif mi?', type: 'boolean' },
      { key: 'servisLog', label: 'Log Tutulsun mu?', type: 'boolean' }
    ],
    child: 'mesaj'
  },
  mesaj: {
    label: 'Mesajlar',
    header: [
      { key: 'mesajBaslik', label: 'Mesaj Başlığı', type: 'string' },
      { key: 'mesajKod', label: 'Mesaj Kodu', type: 'string' },
      { key: 'mesajAktif', label: 'Aktif mi?', type: 'boolean' }
    ],
    headerParamFields: [
      { key: 'headerParamAdi', label: 'Header Parametre Adı', type: 'string' },
      { key: 'headerParamTip', label: 'Header Parametre Tipi', type: 'string' },
      { key: 'headerParamAciklama', label: 'Header Parametre Açıklaması', type: 'string' },
      { key: 'headerParamKod', label: 'Header Parametre Kodu', type: 'string' },
      { key: 'headerParamVarsayilan', label: 'Header Parametre Varsayılan', type: 'string' }
    ],
    messageFields: [
      { key: 'mesajTip', label: 'Mesaj Tipi', type: 'string' },
      { key: 'mesajIcerik', label: 'Mesaj İçeriği', type: 'string' },
      { key: 'mesajSayi', label: 'Mesaj Sayısı', type: 'int' },
      { key: 'mesajAktif2', label: 'Aktif mi? (2)', type: 'boolean' }
    ],
    paramFields: [
      { key: 'paramAdi', label: 'Parametre Adı', type: 'string' },
      { key: 'paramTip', label: 'Parametre Tipi', type: 'string' },
      { key: 'paramAciklama', label: 'Parametre Açıklaması', type: 'string' },
      { key: 'paramKod', label: 'Parametre Kodu', type: 'string' },
      { key: 'paramVarsayilan', label: 'Parametre Varsayılan', type: 'string' }
    ],
    child: null
  },
};

// Tek veri yapısı
let formData = {
  proje: { projeA: "", projeB: "", projeC: "", projeD: "", projeE: "", projeF: "" },
  bilesen: { bilesenAdi: "" },
  arayuz: { arayuzSira: "", arayuzAdi: "" },
  servis: { servisAdi: "", servisAciklama: "", servisAktif: "", servisLog: "" },
  mesaj: {
    header: { mesajBaslik: "", mesajKod: "", mesajAktif: "" },
    headerparametre: [],
    messages: []
  },
  tiplerListesi: []
};


// Tek form render sistemi
function renderForm(key) {
  const scrollContainer = document.getElementById('output-scroll-container');
  if (!scrollContainer) return;
  scrollContainer.innerHTML = '';
  const node = hierarchy[key];
  if (!node) return;

  const title = document.createElement('div');
  title.className = 'output-title';
  title.textContent = node.label;
  title.style.color = '#0066cc';
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
        formData[key][field.key] = '//@bilesenler.0';
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
        input.checked = !!formData[key][field.key];
        input.onchange = (e) => {
          formData[key][field.key] = e.target.checked;
        };
        input.style.margin = '0 auto';
        label.appendChild(input);
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = formData[key][field.key] || '';
        input.placeholder = `${field.label} giriniz`;
        input.className = 'output-value';
        input.oninput = (e) => {
          formData[key][field.key] = e.target.value;
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
    headerTitle.style.color = '#0066cc';
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
        input.checked = !!formData.mesaj.header[field.key];
        input.onchange = (e) => {
          formData.mesaj.header[field.key] = e.target.checked;
        };
      } else {
        input = document.createElement('input');
        input.type = 'text';
        input.value = formData.mesaj.header[field.key] || '';
        input.placeholder = `${field.label} giriniz`;
        input.oninput = (e) => {
          formData.mesaj.header[field.key] = e.target.value;
        };
      }
      input.style.margin = '0 auto';
      label.appendChild(input);
      headerBox.appendChild(label);
    });

    // HeaderParametre (çoklu, varsa) ve ekleme butonu header kutusunun içinde olacak
    if (!Array.isArray(formData.mesaj.headerparametre)) formData.mesaj.headerparametre = [];
    formData.mesaj.headerparametre.forEach((param, idx) => {
      const headerParamBox = document.createElement('div');
      headerParamBox.className = 'output-box';
      headerParamBox.style.marginTop = '10px';

      const headerParamTitle = document.createElement('div');
      headerParamTitle.className = 'output-title';
      headerParamTitle.textContent = `HeaderParametre #${idx + 1}`;
      headerParamTitle.style.color = '#0066cc';
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
      removeBtn.style.display = 'block';
      removeBtn.style.margin = '10px auto 0';
      removeBtn.onclick = () => {
        formData.mesaj.headerparametre.splice(idx, 1);
        renderForm('mesaj');
      };
      headerParamBox.appendChild(removeBtn);
      headerBox.appendChild(headerParamBox);
    });
    // + HeaderParametre Ekle butonu (header kutusunun en altında)
    const addHeaderParamBtn = document.createElement('button');
    addHeaderParamBtn.textContent = '+ HeaderParametre Ekle';
    addHeaderParamBtn.onclick = () => {
      formData.mesaj.headerparametre.push({});
      renderForm('mesaj');
    };
    headerBox.appendChild(addHeaderParamBtn);
    scrollContainer.appendChild(headerBox);

    // Mesajlar
    const messagesTitle = document.createElement('div');
    messagesTitle.className = 'output-title';
    messagesTitle.textContent = 'Mesajlar';
    messagesTitle.style.color = '#0066cc';
    scrollContainer.appendChild(messagesTitle);

    formData.mesaj.messages.forEach((msg, idx) => {
      const msgBox = document.createElement('div');
      msgBox.className = 'output-box';
      const msgLabel = document.createElement('div');
      msgLabel.className = 'output-title';
      msgLabel.textContent = `Mesaj #${idx + 1}`;
      msgLabel.style.color = '#0066cc';
      msgBox.appendChild(msgLabel);

      node.messageFields.forEach((field, fieldIdx) => {
        const label = document.createElement('label');
        label.className = 'output-title';
        label.textContent = field.label;
        label.style.display = 'flex';
        label.style.flexDirection = 'column';
        label.style.alignItems = 'center';
        label.style.width = '100%';

        if (fieldIdx === 0) {
          // İlk alan için tip seçimi (combobox)
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

          // DİNAMİK TİPLER ve STRUCTLAR
          if (formData.tiplerListesi && formData.tiplerListesi.length > 0) {
            formData.tiplerListesi.forEach((item, idx) => {
              const option = document.createElement('option');
              option.value = `//@TiplerPaketi/@tipler.${SABIT_TIPLER.length + idx}`;
              option.textContent = item.data.adi;
              option.dataset.type = item.type;
              select.appendChild(option);
            });
          }

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
            input.placeholder = `${field.label} giriniz`;
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
        paramBox.className = 'output-box';
        paramBox.style.marginTop = '10px';

        const paramTitle = document.createElement('div');
        paramTitle.className = 'output-title';
        paramTitle.textContent = `Parametre #${pidx + 1}`;
        paramTitle.style.color = '#0066cc';
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

            // DİNAMİK TİPLER ve STRUCTLAR
            if (formData.tiplerListesi && formData.tiplerListesi.length > 0) {
              formData.tiplerListesi.forEach((item, idx) => {
                const option = document.createElement('option');
                option.value = `//@TiplerPaketi/@tipler.${SABIT_TIPLER.length + idx}`;
                option.textContent = item.data.adi;
                option.dataset.type = item.type;
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
              input.placeholder = `${field.label} giriniz`;
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
        removeBtn.style.display = 'block';
        removeBtn.style.margin = '10px auto 0';
        removeBtn.onclick = () => {
          msg.param.splice(pidx, 1);
          renderForm('mesaj');
        };
        paramBox.appendChild(removeBtn);
        msgBox.appendChild(paramBox);
      });

      // + Parametre Ekle butonu
      const addBtn = document.createElement('button');
      addBtn.textContent = '+ Parametre Ekle';
      addBtn.style.display = 'block';
      addBtn.style.margin = '10px auto';
      addBtn.onclick = () => {
        msg.param.push({});
        renderForm('mesaj');
      };
      msgBox.appendChild(addBtn);

      // Sil butonu
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Sil';
      removeBtn.style.display = 'block';
      removeBtn.style.margin = '10px auto 0';
      removeBtn.onclick = () => {
        formData.mesaj.messages.splice(idx, 1);
        renderForm('mesaj');
      };
      msgBox.appendChild(removeBtn);
      scrollContainer.appendChild(msgBox);
    });

    // Mesaj ekle butonu
    if (formData.mesaj.messages.length < 10) {
      const addBtn = document.createElement('button');
      addBtn.textContent = '+ Mesaj Ekle';
      addBtn.onclick = () => {
        formData.mesaj.messages.push({ param: [] });
        renderForm('mesaj');
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
      renderForm(hierarchy[key].child);
    };
    navBox.appendChild(nextBtn);
  }
  
  // Kaydet butonu (her zaman var)
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Kaydet';
  saveBtn.onclick = () => {
    const xml = generateXML();
    scrollContainer.innerHTML = '';
    const xmlBox = document.createElement('div');
    xmlBox.className = 'xml-output';
    xmlBox.textContent = xml;
    scrollContainer.appendChild(xmlBox);
  };
  navBox.appendChild(saveBtn);

  scrollContainer.appendChild(navBox);
}

// Tek XML üretim sistemi
function generateXML() {
  function indent(level) { return ' '.repeat(level); }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';

  // Proje açılışı
  xml += `<arayuz:Proje`;
  hierarchy.proje.fields.forEach(field => {
    const v = formData.proje[field.key];
    xml += ` ${field.key}="${field.type === 'boolean' ? (v === true ? 'true' : 'false') : (v || '')}"`;
  });
  xml += '>';

  // Bilesen açılışı
  xml += `\n${indent(2)}<Bilesen`;
  hierarchy.bilesen.fields.forEach(field => {
    const v = formData.bilesen[field.key];
    xml += ` ${field.key}="${field.type === 'boolean' ? (v === true ? 'true' : 'false') : (v || '')}"`;
  });
  xml += '>';

  // Arayuz açılışı
  xml += `\n${indent(4)}<Arayuz`;
  hierarchy.arayuz.fields.forEach(field => {
    const v = formData.arayuz[field.key];
    xml += ` ${field.key}="${field.type === 'boolean' ? (v === true ? 'true' : 'false') : (v || '')}"`;
  });
  xml += '>';

  // Servis açılışı
  xml += `\n${indent(6)}<Servis`;
  hierarchy.servis.fields.forEach(field => {
    const v = formData.servis[field.key];
    xml += ` ${field.key}="${field.type === 'boolean' ? (v === true ? 'true' : 'false') : (v || '')}"`;
  });
  xml += '>';

  // Mesajlar + Parametreler
  if (formData.mesaj.messages.length > 0) {
    formData.mesaj.messages.forEach(msg => {
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

  const headerFilled = Object.values(formData.mesaj.header).some(v => v !== undefined && v !== '');
  if (headerFilled) {
    xml += `\n${indent(8)}<Header`;
    hierarchy.mesaj.header.forEach(field => {
      const v = formData.mesaj.header[field.key];
      xml += ` ${field.key}="${field.type === 'boolean' ? (v === true ? 'true' : 'false') : (v || '')}"`;
    });
    xml += '>';

    if (Array.isArray(formData.mesaj.headerparametre) && formData.mesaj.headerparametre.length > 0) {
      formData.mesaj.headerparametre.forEach(param => {
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

  // TIPLER bölümü
  if ((formData.tiplerListesi && formData.tiplerListesi.length > 0) || SABIT_TIPLER.length > 0) {
    xml += `\n${indent(2)}<TiplerPaketi>\n`;

    // SABİT TİPLER
    SABIT_TIPLER.forEach((tip) => {
      xml += `${indent(4)}<tipler isim="${tip}"/>\n`;
    });

    // DİNAMİK TİPLER ve STRUCTLAR
    if (formData.tiplerListesi && formData.tiplerListesi.length > 0) {
      formData.tiplerListesi.forEach((item) => {
        if (item.type === 'tip') {
          xml += `${indent(4)}<tipler adi="arayuz:${item.data.adi || ''}" aciklama="${item.data.aciklama || ''}" kod="${item.data.kod || ''}">\n`;
          item.data.degerler.forEach((deger, i) => {
            xml += `${indent(6)}<degerler nodeList="${deger.nodeList || ''}" intValue="${i + 1}"/>\n`;
          });
          xml += `${indent(4)}</tipler>\n`;
        } else if (item.type === 'struct') {
          xml += `${indent(4)}<tipler adi="arayuz:${item.data.adi || ''}" aciklama="${item.data.aciklama || ''}" kod="${item.data.kod || ''}">\n`;
          item.data.alanlar.forEach((alan) => {
            xml += `${indent(6)}<deger tip="${alan.tip || ''}" degeri="${alan.adi || ''}"/>\n`;
          });
          xml += `${indent(4)}</tipler>\n`;
        }
      });
    }

    xml += `${indent(2)}</TiplerPaketi>\n`;
  }

  xml += `</arayuz:Proje>\n`;

  return xml;
}

// Sayfa yüklendiğinde ilk formu göster
window.addEventListener('DOMContentLoaded', () => {
  renderForm('proje');
});

// Menü butonlarına tıklama ile input ekranı açılması
function setupMenuClicks() {
  const buttons = document.querySelectorAll('.menu-button[data-action]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-action');
      if (hierarchy[key]) {
        renderForm(key);
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setupMenuClicks();
  renderForm('proje');
});

// Tip ekleme ekranı
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

  const formGrid = document.createElement('div');
  formGrid.style.display = 'grid';
  formGrid.style.gridTemplateColumns = 'auto 1fr';
  formGrid.style.gap = '8px 12px';
  formGrid.style.alignItems = 'center';
  formGrid.style.marginBottom = '16px';

  const labelStyle = 'text-align: right; font-weight: bold; color: #b00;';
  const inputStyle = 'padding:4px 8px; border-radius:4px; border:1px solid #aaa; min-width:180px;';

  // Tip Adı
  const adiLabel = document.createElement('label');
  adiLabel.textContent = 'Tip Adı:';
  adiLabel.style = labelStyle;
  const adiInput = document.createElement('input');
  adiInput.type = 'text';
  adiInput.id = 'tipAdiInput';
  adiInput.style = inputStyle;
  formGrid.appendChild(adiLabel);
  formGrid.appendChild(adiInput);

  // Açıklama
  const aciklamaLabel = document.createElement('label');
  aciklamaLabel.textContent = 'Açıklama:';
  aciklamaLabel.style = labelStyle;
  const aciklamaInput = document.createElement('input');
  aciklamaInput.type = 'text';
  aciklamaInput.id = 'tipAciklamaInput';
  aciklamaInput.style = inputStyle;
  formGrid.appendChild(aciklamaLabel);
  formGrid.appendChild(aciklamaInput);

  // Kod
  const kodLabel = document.createElement('label');
  kodLabel.textContent = 'Kod:';
  kodLabel.style = labelStyle;
  const kodInput = document.createElement('input');
  kodInput.type = 'text';
  kodInput.id = 'tipKodInput';
  kodInput.style = inputStyle;
  formGrid.appendChild(kodLabel);
  formGrid.appendChild(kodInput);

  tipBox.appendChild(formGrid);

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

    if (!formData.tiplerListesi) formData.tiplerListesi = [];
    formData.tiplerListesi.push({
      type: 'tip',
      data: {
        adi,
        aciklama,
        kod,
        degerler: [...degerler]
      }
    });

    guncelleTiplerMenusu();
    outputContainer.innerHTML = '';
  };

  iptalBtn.onclick = () => {
    outputContainer.innerHTML = '';
  };

  renderDegerler();
}

// Struct ekleme ekranı
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
  title.style.color = '#b00';
  title.style.marginBottom = '16px';
  structBox.appendChild(title);

  const formGrid = document.createElement('div');
  formGrid.style.display = 'grid';
  formGrid.style.gridTemplateColumns = 'auto 1fr';
  formGrid.style.gap = '8px 12px';
  formGrid.style.alignItems = 'center';
  formGrid.style.marginBottom = '16px';

  const labelStyle = 'text-align: right; font-weight: bold; color: #b00;';
  const inputStyle = 'padding:4px 8px;border-radius:4px;border:1px solid #aaa;min-width:180px;';

  // Struct Adı
  const adiLabel = document.createElement('label');
  adiLabel.textContent = 'Struct Adı:';
  adiLabel.style = labelStyle;
  const adiInput = document.createElement('input');
  adiInput.type = 'text';
  adiInput.id = 'structAdiInput';
  adiInput.style = inputStyle;
  formGrid.appendChild(adiLabel);
  formGrid.appendChild(adiInput);

  // Açıklama
  const aciklamaLabel = document.createElement('label');
  aciklamaLabel.textContent = 'Açıklama:';
  aciklamaLabel.style = labelStyle;
  const aciklamaInput = document.createElement('input');
  aciklamaInput.type = 'text';
  aciklamaInput.id = 'structAciklamaInput';
  aciklamaInput.style = inputStyle;
  formGrid.appendChild(aciklamaLabel);
  formGrid.appendChild(aciklamaInput);

  // Kod
  const kodLabel = document.createElement('label');
  kodLabel.textContent = 'Kod:';
  kodLabel.style = labelStyle;
  const kodInput = document.createElement('input');
  kodInput.type = 'text';
  kodInput.id = 'kodInput';
  kodInput.style = inputStyle;
  formGrid.appendChild(kodLabel);
  formGrid.appendChild(kodInput);
  
  structBox.appendChild(formGrid);

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

      // === Tip (select) ===
      const tipSelect = document.createElement('select');
      tipSelect.style = inputStyle + 'width:180px;';

      // SABİT TİPLER
      SABIT_TIPLER.forEach((tip, idx) => {
        const option = document.createElement('option');
        option.value = `//@TiplerPaketi/@tipler.${idx}`;
        option.textContent = tip;
        tipSelect.appendChild(option);
      });

      // DİNAMİK TİPLER ve STRUCTLAR
      if (formData.tiplerListesi && formData.tiplerListesi.length > 0) {
        formData.tiplerListesi.forEach((item, idx) => {
          const option = document.createElement('option');
          option.value = `//@TiplerPaketi/@tipler.${SABIT_TIPLER.length + idx}`;
          option.textContent = item.data.adi;
          option.dataset.type = item.type;
          tipSelect.appendChild(option);
        });
      }

      // Seçili değer
      tipSelect.value = alan.tip || '';
      tipSelect.onchange = (e) => {
        alan.tip = e.target.value;
      };

      // === Alan Adı (text) ===
      const alanInput = document.createElement('input');
      alanInput.type = 'text';
      alanInput.value = alan.adi || '';
      alanInput.placeholder = 'Değeri';
      alanInput.style = inputStyle + 'width:120px;';
      alanInput.oninput = (e) => {
        alan.adi = e.target.value;
      };

      // === Sil Butonu ===
      const silBtn = document.createElement('button');
      silBtn.textContent = 'Sil';
      silBtn.style = 'background:red;color:white;padding:4px 12px;border:none;border-radius:4px;font-weight:bold;';
      silBtn.onclick = () => {
        alanlar.splice(idx, 1);
        renderAlanlar();
      };

      // Sırayla ekle
      alanDiv.appendChild(tipSelect);
      alanDiv.appendChild(alanInput);
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
    const kod = document.getElementById('kodInput').value.trim();

    // Kontrolleri yap
    if (!adi || !aciklama || !kod) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }
    if (alanlar.length === 0 || alanlar.some(a => !a.adi.trim() || !a.tip.trim())) {
      alert('En az bir alan ekleyin ve tüm alanları doldurun!');
      return;
    }

    // Struct ekleme işlemi
    if (!formData.tiplerListesi) formData.tiplerListesi = [];
    formData.tiplerListesi.push({
      type: 'struct',
      data: {
        adi,
        aciklama,
        kod,
        alanlar: alanlar.map((a) => ({ adi: a.adi, tip: a.tip }))
      }
    });

    guncelleTiplerMenusu();
    
    // Aktif input ekranını yeniden render et
    const seciliButon = document.querySelector("button.secili");
    if (seciliButon) {
      const actionKey = seciliButon.getAttribute("data-action");
      if (actionKey && hierarchy[actionKey]) {
        renderForm(actionKey);
      }
    }
    
    outputContainer.innerHTML = '';
  };

  iptalBtn.onclick = () => {
    outputContainer.innerHTML = '';
  };

  renderAlanlar();
}

// Menüde tipler ve structlar listesi güncelleme
function guncelleTiplerMenusu() {
  // Tipler sütunu
  const tiplerTd = document.getElementById('tiplerListesi');
  tiplerTd.innerHTML = '';
  if (formData.tiplerListesi && formData.tiplerListesi.length > 0) {
    const ul = document.createElement('ul');
    formData.tiplerListesi.forEach(item => {
      if (item.type === 'tip') {
        const li = document.createElement('li');
        li.textContent = item.data.adi;
        ul.insertBefore(li, ul.firstChild);
      }
    });
    tiplerTd.appendChild(ul);
  }

  // Structlar sütunu
  const structlarTd = document.getElementById('structlarListesi');
  structlarTd.innerHTML = '';
  if (formData.tiplerListesi && formData.tiplerListesi.length > 0) {
    const ul = document.createElement('ul');
    formData.tiplerListesi.forEach(item => {
      if (item.type === 'struct') {
        const li = document.createElement('li');
        li.textContent = item.data.adi;
        ul.insertBefore(li, ul.firstChild);
      }
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
      ul.insertBefore(li, ul.firstChild);
    });
    listelerTd.appendChild(ul);
  }
}

// Menü butonlarına tıklama olayları
window.addEventListener('DOMContentLoaded', () => {
  const btnTipEkle = document.querySelector('.menu-button[data-action="tipEkle"]');
  if (btnTipEkle) {
    btnTipEkle.addEventListener('click', tipEkleEkraniOlustur);
  }

  const btnStructEkle = document.querySelector('.menu-button[data-action="structEkle"]');
  if (btnStructEkle) {
    btnStructEkle.addEventListener('click', structEkleEkraniOlustur);
  }

  // Menüyü güncelle
  guncelleTiplerMenusu();
});
