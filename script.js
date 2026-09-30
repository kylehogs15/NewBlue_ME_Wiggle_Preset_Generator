const $ = (id) => document.getElementById(id);

const fields = ["rate", "strength", "drift", "crop", "edges", "orientation", "presetName"];

function numberValue(id) {
  const n = Number($(id).value);
  return Number.isFinite(n) ? n : 0;
}

function six(n) {
  return Number(n).toFixed(6);
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function makeXML() {
  const name = $("presetName").value.trim() || "My Wiggle Preset";

  const rate = six(numberValue("rate"));
  const strength = six(numberValue("strength"));
  const drift = six(numberValue("drift"));
  const crop = six(numberValue("crop"));

  const edges = Number.parseInt($("edges").value, 10);
  const orientation = Number.parseInt($("orientation").value, 10);

  return `<?xml version="1.0" standalone="no" ?>
<!-- Effect's Preset File -->
<Preset Name="${xmlEscape(name)}" LibraryName="NewBlue Motion Effects" EffectName="Wiggle">
    <parameter type="2" value="${rate}" />
    <parameter type="2" value="${strength}" />
    <parameter type="2" value="${drift}" />
    <parameter type="2" value="${crop}" />
    <parameter type="1" value="${Number.isFinite(edges) ? edges : 0}" />
    <parameter type="1" value="${Number.isFinite(orientation) ? orientation : 0}" />
</Preset>`;
}

function update() {
  $("xmlPreview").textContent = makeXML();
  $("status").textContent = "Updated";
}

function downloadPreset() {
  const xml = makeXML();
  const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeName = ($("presetName").value.trim() || "My Wiggle Preset")
    .replace(/[<>:"/\\|?*]+/g, "_")
    .replace(/\s+/g, "_");

  a.href = url;
  a.download = `${safeName}.fxpmtef`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  $("status").textContent = "Downloaded";
}

async function copyXML() {
  const xml = makeXML();
  try {
    await navigator.clipboard.writeText(xml);
    $("status").textContent = "XML copied";
  } catch {
    $("status").textContent = "Copy unavailable";
  }
}

function resetForm() {
  $("rate").value = "0.000000";
  $("strength").value = "0.000000";
  $("drift").value = "0.000000";
  $("crop").value = "0.000000";
  $("edges").value = "0";
  $("orientation").value = "0";
  $("presetName").value = "My Wiggle Preset";
  update();
  $("status").textContent = "Reset";
}

fields.forEach((id) => $(id).addEventListener("input", update));
fields.forEach((id) => $(id).addEventListener("change", update));

$("downloadBtn").addEventListener("click", downloadPreset);
$("copyBtn").addEventListener("click", copyXML);
$("resetBtn").addEventListener("click", resetForm);

update();
