const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf2z2_s4j9RH9LOqjc90vxPpGii7VDhcIApoKg1TVIbWIUTWQ/formResponse";

const INSTITUTION_CHOICES = [
  "THE POLYTECHNIC IBADAN",
  "NOUN",
  "UNIVERSITY OF IBADAN/DLC",
];

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, error: "Invalid JSON body" });
    }
  }
  body = body || {};

  const clean = (v) => (typeof v === "string" ? v.trim() : "");
  const name = clean(body.name);
  const phone = clean(body.phone);
  const institution = clean(body.institution);
  const cell = clean(body.cell);
  const firstTimer = clean(body.firstTimer);
  const hear = clean(body.hear);

  if (!name) {
    return res.status(400).json({ ok: false, error: "Name is required" });
  }
  if (phone.replace(/\D/g, "").length < 7) {
    return res
      .status(400)
      .json({ ok: false, error: "Valid phone number is required" });
  }
  if (firstTimer !== "Yes" && firstTimer !== "No") {
    return res
      .status(400)
      .json({ ok: false, error: "First timer answer is required" });
  }

  const form = new URLSearchParams();
  form.set("entry.2141953111", name);
  form.set("entry.1003860607", phone);
  if (institution) {
    if (INSTITUTION_CHOICES.includes(institution)) {
      form.set("entry.1904077028", institution);
    } else {
      form.set("entry.1904077028", "__other_option__");
      form.set("entry.1904077028.other_option_response", institution);
    }
  }
  if (cell) form.set("entry.254235765", cell);
  form.set("entry.1537394519", firstTimer);
  form.set("entry.765764206", firstTimer === "Yes" ? hear : "");

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    const googleRes = await fetch(GOOGLE_FORM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
      redirect: "follow",
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));

    if (!googleRes.ok) {
      console.error("Google Forms responded with", googleRes.status);
      return res.status(502).json({
        ok: false,
        error: "Registration service rejected the submission",
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Google Forms submission failed:", err);
    return res
      .status(502)
      .json({ ok: false, error: "Could not reach the registration service" });
  }
};
