(() => {
  const cfg = window.SITE_CONFIG;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const money = value => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const escapeHTML = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const priceHTML = (price) => {
    const [whole, cents] = price.toFixed(2).split(".");
    return `<span>R$</span><strong>${whole}</strong><sup>,${cents}</sup>`;
  };

  // ---------------- PLANOS ----------------

  $("#pcPlans").innerHTML = cfg.pcPlans.map(plan => `
    <article class="plan-card reveal ${plan.featured ? "featured" : ""}">
      <span class="plan-badge">${plan.badge}</span>
      <h3>${plan.name}</h3>

      <ul class="feature-list">
        ${plan.features.map(f => `<li>${escapeHTML(f)}</li>`).join("")}
      </ul>

      <div class="plan-bottom">
        ${plan.oldPrice ? `<div class="old">DE <s>${money(plan.oldPrice)}</s> POR:</div>` : ""}
        <div class="price">${priceHTML(plan.price)}</div>
        <button class="btn ${plan.featured ? "btn-primary" : "btn-outline"}" data-service="${plan.id}">
          QUERO ESTE PLANO
        </button>
      </div>
    </article>
  `).join("");

  $("#extraServices").innerHTML = cfg.extraServices.map(service => `
    <article class="extra-card reveal">
      <div class="extra-icon">${service.icon}</div>
      <div class="extra-name">
        <h3>${escapeHTML(service.name)}</h3>
        <b>(${escapeHTML(service.subtitle)})</b>
      </div>
      <ul class="extra-features">
        ${service.features.map(f => `<li>${escapeHTML(f)}</li>`).join("")}
      </ul>
      <div class="extra-price">
        <div><span>R$</span><strong>${service.price.toFixed(0)}</strong></div>
        <button class="btn btn-primary" data-service="${service.id}">AGENDAR</button>
      </div>
    </article>
  `).join("");

  function renderMobile(target, plans) {
    $(target).innerHTML = plans.map(plan => `
      <article class="mobile-plan">
        <div>
          <h4>${escapeHTML(plan.name)}</h4>
          <ul>${plan.features.map(f => `<li>${escapeHTML(f)}</li>`).join("")}</ul>
        </div>
        <div class="mobile-price">
          <strong>${money(plan.price)}</strong>
          <button class="btn btn-outline" data-service="${plan.id}">QUERO</button>
        </div>
      </article>
    `).join("");
  }

  renderMobile("#androidPlans", cfg.mobile.android);
  renderMobile("#iosPlans", cfg.mobile.ios);

  // ---------------- FEEDBACKS ----------------

  const makeBg = src => src ? `style="background-image:url('${src.replaceAll("'", "\\'")}')"` : "";

  $("#featuredFeedbackGrid").innerHTML = cfg.featuredFeedbacks.map(item => `
    <button class="featured-feedback-card reveal" type="button" data-feedback-type="featured" data-feedback-id="${item.id}">
      <div class="featured-shot" ${makeBg(item.screenshot)}></div>

      <div class="featured-info">
        <span class="verified-line">${escapeHTML(item.source)} • DESTAQUE</span>
        <h3>${escapeHTML(item.name)}</h3>
        <p>${escapeHTML(item.role)} • ${escapeHTML(item.game)}</p>
        <small>${escapeHTML(item.service)}</small>
      </div>

      <div class="feedback-open">VER FEEDBACK →</div>
    </button>
  `).join("");

  function renderCommunity(filter = "ALL") {
    const items = filter === "ALL"
      ? cfg.communityFeedbacks
      : cfg.communityFeedbacks.filter(x => x.source === filter);

    $("#communityFeedbackGrid").innerHTML = items.map(item => `
      <button class="community-feedback-card reveal visible" type="button" data-feedback-type="community" data-feedback-id="${item.id}">
        <div class="community-shot" ${makeBg(item.screenshot)}></div>

        <div class="community-body">
          <div class="community-card-top">
            <span class="source-badge ${item.source.toLowerCase()}">${escapeHTML(item.source)}</span>
            <span class="service-tag">${escapeHTML(item.service || "")}</span>
          </div>

          <p>${escapeHTML(item.text)}</p>
          <small>${escapeHTML(item.name)}</small>
        </div>
      </button>
    `).join("");
  }

  renderCommunity();

  $$(".feedback-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".feedback-filter-btn").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      renderCommunity(btn.dataset.feedbackFilter);
      bindFeedbackCards();
    });
  });

  const feedbackModal = $("#feedbackModal");
  const feedbackGalleryModal = $("#feedbackGalleryModal");

  function getFeedback(type, id) {
    return type === "featured"
      ? cfg.featuredFeedbacks.find(x => x.id === id)
      : cfg.communityFeedbacks.find(x => x.id === id);
  }

  function openFeedback(type, id) {
    const item = getFeedback(type, id);
    if (!item) return;

    const source = type === "featured" ? `${item.source} • DESTAQUE` : item.source;
    $("#feedbackModalSource").textContent = source;

    if (type === "featured") {
      $("#feedbackModalProfile").innerHTML = `
        <div class="feedback-modal-avatar" ${makeBg(item.screenshot)}></div>
        <div>
          <h3>${escapeHTML(item.name)}</h3>
          <p>${escapeHTML(item.role)} • ${escapeHTML(item.game)}</p>
          <small>${escapeHTML(item.service)}</small>
        </div>
      `;
      $("#feedbackModalText").textContent = item.quote;
      applyScreenshot(item.screenshot);
    } else {
      $("#feedbackModalProfile").innerHTML = `
        <div class="feedback-modal-avatar feedback-modal-badge"><span>${escapeHTML(item.source.slice(0,1))}</span></div>
        <div>
          <h3>${escapeHTML(item.name)}</h3>
          <p>${escapeHTML(item.source)}</p>
          <small>${escapeHTML(item.service || "")}</small>
        </div>
      `;
      $("#feedbackModalText").textContent = item.text;
      applyScreenshot(item.screenshot);
    }

    feedbackModal.classList.add("show");
    feedbackModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("lock");
  }

  function applyScreenshot(src) {
    const box = $("#feedbackScreenshot");
    if (src) {
      box.classList.add("has-image");
      box.style.backgroundImage = `url("${src}")`;
    } else {
      box.classList.remove("has-image");
      box.style.backgroundImage = "";
    }
  }

  function closeFeedback() {
    feedbackModal.classList.remove("show");
    feedbackModal.setAttribute("aria-hidden", "true");

    if (
      !feedbackGalleryModal.classList.contains("show") &&
      !$("#contactModal").classList.contains("show") &&
      !$("#blueAlert").classList.contains("show")
    ) {
      document.body.classList.remove("lock");
    }
  }

  function openFeedbackGallery() {
    feedbackGalleryModal.classList.add("show");
    feedbackGalleryModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("lock");
  }

  function closeFeedbackGallery() {
    feedbackGalleryModal.classList.remove("show");
    feedbackGalleryModal.setAttribute("aria-hidden", "true");

    if (
      !feedbackModal.classList.contains("show") &&
      !$("#contactModal").classList.contains("show") &&
      !$("#blueAlert").classList.contains("show")
    ) {
      document.body.classList.remove("lock");
    }
  }

  function bindFeedbackCards() {
    $$("[data-feedback-id]").forEach(card => {
      if (card.dataset.bound === "1") return;
      card.dataset.bound = "1";
      card.addEventListener("click", () => openFeedback(card.dataset.feedbackType, card.dataset.feedbackId));
    });
  }

  bindFeedbackCards();
  $$("[data-close-feedback]").forEach(el => el.addEventListener("click", closeFeedback));

  $$("[data-open-feedback-gallery]").forEach(el => {
    el.addEventListener("click", openFeedbackGallery);
  });

  $$("[data-close-feedback-gallery]").forEach(el => {
    el.addEventListener("click", closeFeedbackGallery);
  });

  // ---------------- FAQ ----------------

  $("#faqList").innerHTML = cfg.faq.map(item => `
    <article class="faq-item reveal">
      <button class="faq-q" type="button">
        <span>${escapeHTML(item.q)}</span><i>+</i>
      </button>
      <div class="faq-a"><p>${escapeHTML(item.a)}</p></div>
    </article>
  `).join("");

  $$(".faq-q").forEach(btn => btn.addEventListener("click", () => {
    btn.closest(".faq-item").classList.toggle("open");
  }));

  // ---------------- CONTATO ----------------

  const allServices = [
    ...cfg.pcPlans,
    ...cfg.extraServices,
    ...cfg.mobile.android,
    ...cfg.mobile.ios
  ];

  const modal = $("#contactModal");
  const blueAlert = $("#blueAlert");
  const choiceView = $("#contactChoiceView");
  const whatsappView = $("#whatsappView");
  const discordView = $("#discordView");
  let currentService = cfg.pcPlans.find(x => x.featured) || cfg.pcPlans[0];

  function showContactView(view) {
    [choiceView, whatsappView, discordView].forEach(v => v.classList.remove("active"));
    view.classList.add("active");

    // Mobile: the card itself is the scroll container.
    // Always open each step from the top without affecting desktop layout.
    const card = modal.querySelector(".contact-card");
    if (card) card.scrollTop = 0;
  }

  function setupValue(formData, key, unknown) {
    if (unknown && ["cpu", "gpu", "motherboard", "ram"].includes(key)) {
      return "Não sei informar";
    }
    const value = (formData.get(key) || "").trim();
    return value || "Não informado";
  }

  function buildSetupMessage() {
    const form = $("#setupForm");
    const fd = new FormData(form);
    const unknown = $("#dontKnowSetup").checked;

    return [
      `Olá! Vim pelo site da USANTOOSFPS.`,
      ``,
      `Serviço: ${currentService.name} — ${money(currentService.price)}`,
      ``,
      `CONFIGURAÇÃO DO SETUP`,
      `Processador: ${setupValue(fd, "cpu", unknown)}`,
      `Placa de vídeo: ${setupValue(fd, "gpu", unknown)}`,
      `Placa-mãe: ${setupValue(fd, "motherboard", unknown)}`,
      `Memória RAM: ${setupValue(fd, "ram", unknown)}`,
      ``,
      `Jogo principal: ${setupValue(fd, "game", false)}`,
      `Problema / objetivo: ${setupValue(fd, "problem", false)}`,
      ``,
      unknown ? `Obs.: não sei informar minha configuração completa.` : `Obs.: configuração informada pelo cliente.`,
      ``,
      `Gostaria de consultar os horários disponíveis.`
    ].join("\n");
  }

  function updateMessagePreview() {
    $("#setupMessagePreview").textContent = buildSetupMessage();
  }

  function openContact(service = currentService) {
    currentService = service || currentService;
    $("#selectedService").textContent = `${currentService.name} — ${money(currentService.price)}`;
    showContactView(choiceView);
    updateMessagePreview();

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("lock");
  }

  function closeContact() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    showContactView(choiceView);

    if (!blueAlert.classList.contains("show") && !feedbackModal.classList.contains("show")) {
      document.body.classList.remove("lock");
    }
  }

  $$("[data-service]").forEach(btn => btn.addEventListener("click", () => {
    const service = allServices.find(x => x.id === btn.dataset.service);
    if (service) openContact(service);
  }));

  $$("[data-open-contact]").forEach(btn => btn.addEventListener("click", () => openContact()));
  $$("[data-close-contact]").forEach(el => el.addEventListener("click", closeContact));

  $("#whatsappChoice").addEventListener("click", () => {
    showContactView(whatsappView);
    updateMessagePreview();
  });

  $("#discordChoice").addEventListener("click", () => {
    showContactView(discordView);
  });

  $$("[data-contact-back]").forEach(btn => btn.addEventListener("click", () => {
    showContactView(choiceView);
  }));

  $("#discordGuideTitle").textContent = cfg.discordGuide.title;
  $("#discordGuideNote").textContent = cfg.discordGuide.note;
  $("#discordFinalBtn").href = cfg.contact.discordInvite;
  $("#discordGuideSteps").innerHTML = cfg.discordGuide.steps.map((step, i) => `
    <article class="discord-step">
      <span>${String(i + 1).padStart(2, "0")}</span>
      <div>
        <h3>${escapeHTML(step.title)}</h3>
        <p>${escapeHTML(step.text)}</p>
      </div>
    </article>
  `).join("");

  const setupFields = $$("input", $("#setupForm"));
  setupFields.forEach(el => {
    if (el.type !== "checkbox") el.addEventListener("input", updateMessagePreview);
  });

  $("#dontKnowSetup").addEventListener("change", () => {
    const unknown = $("#dontKnowSetup").checked;
    ["cpu", "gpu", "motherboard", "ram"].forEach(name => {
      const input = $(`[name="${name}"]`, $("#setupForm"));
      input.disabled = unknown;
      input.classList.toggle("disabled-field", unknown);
    });
    updateMessagePreview();
  });

  $("#setupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = buildSetupMessage();
    const number = (cfg.contact.whatsappNumber || "").replace(/\D/g, "");

    if (number) {
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
      $("#whatsappHelper").textContent = "O WhatsApp foi aberto com sua configuração preenchida.";
      return;
    }

    let copied = false;
    try {
      await navigator.clipboard.writeText(message);
      copied = true;
    } catch {}

    $("#whatsappHelper").textContent = copied
      ? "Configuração copiada ✓ Agora cole a mensagem na conversa do WhatsApp."
      : "O navegador não permitiu copiar automaticamente. Copie o texto da prévia e cole no WhatsApp.";

    window.open(cfg.contact.whatsappShortLink, "_blank", "noopener");
  });

  // ---------------- NÃO CLIQUE ----------------

  $("#dontClick").addEventListener("click", () => {
    blueAlert.classList.add("show");
    blueAlert.setAttribute("aria-hidden", "false");
    document.body.classList.add("lock");
  });

  $("#blueRisk").addEventListener("click", () => {
    blueAlert.classList.remove("show");
    blueAlert.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lock");
  });

  $("#blueSchedule").addEventListener("click", () => {
    blueAlert.classList.remove("show");
    blueAlert.setAttribute("aria-hidden", "true");
    const recommended = cfg.pcPlans.find(x => x.id === "advanced-fps") || cfg.pcPlans[0];
    openContact(recommended);
  });

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;

    if (feedbackModal.classList.contains("show")) {
      closeFeedback();
    } else if (feedbackGalleryModal.classList.contains("show")) {
      closeFeedbackGallery();
    } else if (blueAlert.classList.contains("show")) {
      blueAlert.classList.remove("show");
      blueAlert.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lock");
    } else {
      closeContact();
    }
  });

  // ---------------- MENU / ANIMAÇÃO ----------------

  const menuToggle = $(".menu-toggle");
  const menu = $(".menu");
  menuToggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  $$(".menu a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });

  $$(".reveal").forEach(el => observer.observe(el));
  $("#year").textContent = new Date().getFullYear();

  if (cfg.contact.whatsappNumber) {
    $("#whatsappHelper").textContent = "O WhatsApp abrirá com sua configuração preenchida automaticamente.";
  }

  updateMessagePreview();
})();