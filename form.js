/* ---------- form options ---------- */
function chips(id, name, items, other) {
  document.getElementById(id).innerHTML = items
    .concat(other ? ["Other"] : [])
    .map(
      (t) =>
        `<label class="chip"><input type="radio" name="${name}" value="${
          t === "Other" && other ? "__other" : t
        }"><span>${t}</span></label>`,
    )
    .join("");
}

chips(
  "inst",
  "institution",
  ["THE POLYTECHNIC IBADAN", "NOUN", "UNIVERSITY OF IBADAN/DLC"],
  true,
);
chips("cell", "cell", [
  "Bethel",
  "Blossom",
  "Dominion",
  "Eagle",
  "Grace Family",
  "Marvellous",
  "None",
]);
chips("first", "firstTimer", ["Yes", "No"]);
chips("hear", "hear", [
  "I was invited",
  "Via the announcements made in church",
  "Via the e-fliers",
]);

document.querySelectorAll("input[name=institution]").forEach((r) => {
  r.onchange = () => {
    const o =
      document.querySelector("input[name=institution]:checked").value ===
      "__other";
    const otherEl = document.getElementById("institutionOther");
    otherEl.classList.toggle("hidden", !o);
    if (o) {
      otherEl.focus();
    }
  };
});

document.querySelectorAll("input[name=firstTimer]").forEach((r) => {
  r.onchange = () => {
    const isYes =
      document.querySelector("input[name=firstTimer]:checked").value === "Yes";
    document.getElementById("hearCard").classList.toggle("hidden", !isYes);
  };
});

const form = document.getElementById("f");

let toastTimer;
let toastAction = null;

function hideToast() {
  const t = document.querySelector(".toast");
  if (t) t.classList.remove("show");
  clearTimeout(toastTimer);
}

function toast(msg, actionLabel, onAction) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "alert");
    t.innerHTML =
      '<span class="toast-msg"></span><button type="button" class="toast-act"></button>';
    document.body.appendChild(t);
    t.querySelector(".toast-act").onclick = () => {
      hideToast();
      if (toastAction) toastAction();
    };
  }
  t.querySelector(".toast-msg").textContent = msg;

  const act = t.querySelector(".toast-act");
  if (actionLabel && onAction) {
    act.textContent = actionLabel;
    act.style.display = "";
    toastAction = onAction;
  } else {
    act.style.display = "none";
    toastAction = null;
  }

  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 6000);
}

if (form) {
  form.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const g = (k) => (fd.get(k) || "").toString().trim();
    const err = document.getElementById("err");
    let m = "";
    let target = null;

    if (!g("name")) {
      m = "Please enter your name.";
      target = document.getElementById("name");
    } else if (g("phone").replace(/\D/g, "").length < 7) {
      m = "Please enter a valid phone number.";
      target = document.getElementById("phone");
    } else if (!g("firstTimer")) {
      m = "Please tell us if you are a first timer.";
      target = document.getElementById("first");
    } else if (g("firstTimer") === "Yes" && !g("hear")) {
      m = "Please tell us how you heard about the programme.";
      target = document.getElementById("hear");
    } else if (!user) {
      m = "Please add your photo.";
      target = document.getElementById("drop");
    }

    if (m && target) {
      err.textContent = m;
      err.style.display = "block";
      if (target.id === "drop") {
        target.insertAdjacentElement("afterend", err);
      } else {
        const field = target.closest(".field") || target.parentNode;
        field.appendChild(err);
      }
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      if (target.focus) target.focus();
      return;
    }
    err.style.display = "none";

    doSubmit();
  };
}

async function doSubmit() {
  const fd = new FormData(form);
  const g = (k) => (fd.get(k) || "").toString().trim();

  const payload = {
    name: g("name"),
    phone: g("phone"),
    institution:
      g("institution") === "__other" ? g("institutionOther") : g("institution"),
    cell: g("cell"),
    firstTimer: g("firstTimer"),
    hear: g("firstTimer") === "Yes" ? g("hear") : "",
  };

  const btn = document.querySelector('button[form="f"]');
  const btnHTML = btn ? btn.innerHTML : "";
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Submitting...";
  }

  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Submission failed.");
    }
  } catch (e) {
    console.error("Submission failed:", e);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = btnHTML;
    }
    toast("An error occurred.", "Try again", doSubmit);
    return;
  }

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = btnHTML;
  }

  const url = c.toDataURL("image/png");
  document.getElementById("out").src = url;
  const a = document.getElementById("dl");
  a.href = url;
  const r = document.getElementById("result");
  r.classList.remove("hidden");
  r.style.display = "block";
  r.scrollIntoView({ behavior: "smooth" });
}
