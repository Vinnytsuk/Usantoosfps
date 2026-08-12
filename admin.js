(() => {
  const cfg = JSON.parse(JSON.stringify(window.SITE_CONFIG));
  const $ = s => document.querySelector(s);

  $("#wa").value = cfg.contact.whatsappShortLink;
  $("#dc").value = cfg.contact.discordInvite;

  $("#wa").addEventListener("input", e => cfg.contact.whatsappShortLink = e.target.value.trim());
  $("#dc").addEventListener("input", e => cfg.contact.discordInvite = e.target.value.trim());

  const groups = [
    ["PC", cfg.pcPlans],
    ["SERVIÇOS AVULSOS", cfg.extraServices],
    ["ANDROID", cfg.mobile.android],
    ["IOS", cfg.mobile.ios]
  ];

  $("#editors").innerHTML = groups.map(([label, items]) => `
    <h3 style="color:var(--green);font-size:12px;margin-top:18px">${label}</h3>
    ${items.map(item => `
      <div class="admin-row">
        <label>Nome<input data-name="${item.id}" value="${item.name}"></label>
        <label>Preço<input type="number" step="0.01" min="0" data-price="${item.id}" value="${item.price}"></label>
      </div>
    `).join("")}
  `).join("");

  const all = [...cfg.pcPlans, ...cfg.extraServices, ...cfg.mobile.android, ...cfg.mobile.ios];

  document.querySelectorAll("[data-name]").forEach(input => {
    input.addEventListener("input", e => {
      const item = all.find(x => x.id === e.target.dataset.name);
      if (item) item.name = e.target.value;
    });
  });

  document.querySelectorAll("[data-price]").forEach(input => {
    input.addEventListener("input", e => {
      const item = all.find(x => x.id === e.target.dataset.price);
      if (item) item.price = Number(e.target.value || 0);
    });
  });

  function build() {
    const text = "window.SITE_CONFIG = " + JSON.stringify(cfg, null, 2) + ";\n";
    $("#out").value = text;
    return text;
  }

  $("#generate").addEventListener("click", build);
  $("#copy").addEventListener("click", async () => {
    const text = $("#out").value || build();
    try { await navigator.clipboard.writeText(text); } catch {}
  });
  $("#download").addEventListener("click", () => {
    const text = $("#out").value || build();
    const blob = new Blob([text], {type:"text/javascript"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.js";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  build();
})();