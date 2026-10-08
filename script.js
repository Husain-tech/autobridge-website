(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (!header || !toggle) return;

  function setOpen(open) {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setOpen(!header.classList.contains("nav-open"));
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header.classList.contains("nav-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia("(min-width: 861px)").addEventListener("change", function (mq) {
    if (mq.matches) setOpen(false);
  });
})();

(function () {
  var form = document.querySelector(".contact-form");
  if (!form || !window.fetch) return;
  var button = form.querySelector('button[type="submit"]');
  var status = form.querySelector(".form-status");

  function showStatus(type, html) {
    status.hidden = false;
    status.className = "form-status is-" + type;
    status.innerHTML = html;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.querySelector('[name="_honey"]').value) return;

    button.disabled = true;
    button.textContent = "Sender …";
    status.hidden = true;

    fetch(form.getAttribute("data-ajax"), {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (r) {
        if (r.ok && String(r.data.success) === "true") {
          form.reset();
          showStatus("success", "Tak for din besked. Vi kontakter dig efterfølgende med den videre proces.");
        } else {
          throw new Error(r.data && r.data.message);
        }
      })
      .catch(function () {
        showStatus("error", 'Beskeden kunne ikke sendes. Prøv igen, eller skriv direkte til <a href="mailto:Auto.bridge@outlook.com">Auto.bridge@outlook.com</a>.');
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = "Send besked";
      });
  });
})();
