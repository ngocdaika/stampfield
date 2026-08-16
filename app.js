/* Stampfield — Camera Đóng Dấu thời gian & vị trí
   Vanilla JS PWA. Implements the 8 screens of "Camera Đóng Dấu - iOS" design.
   Real camera (getUserMedia), GPS (geolocation), heading, reverse geocode (Nominatim),
   optional weather (Open-Meteo), canvas-burned watermark, IndexedDB library, PDF/ZIP export. */
(() => {
"use strict";

/* ============================================================ i18n */
const STR = {
  vi: {
    obTitle: "Cấp quyền để bắt đầu đóng dấu",
    obSub: "Mỗi ảnh chụp bằng app sẽ mang thời gian, tọa độ và dự án — đủ dùng làm bằng chứng hiện trường.",
    permCamT: "Camera", permCamD: "Chụp ảnh và quay video có watermark.",
    permLocT: "Vị trí", permLocD: "Lấy tọa độ, độ cao, địa chỉ tại thời điểm chụp.",
    permLibT: "Thư viện ảnh", permLibD: "Tự lưu bản đã đóng dấu vào Ảnh của iPhone.",
    granted: "ĐÃ CẤP", optional: "TÙY CHỌN", pending: "CHƯA CẤP", denied: "TỪ CHỐI",
    locAlways: "Luôn cho phép", locWhile: "Khi dùng app",
    obCta: "Cho phép & mở camera",
    obFoot: "iOS chỉ hỏi một lần nếu bạn đặt Camera / Vị trí = “Cho phép” trong Cài đặt trang web của Safari — chạm để xem cách làm. Không có quyền vị trí, ảnh vẫn chụp được nhưng không đủ giá trị hồ sơ.",
    modePhoto: "ẢNH", modeVideo: "VIDEO", modeBurst: "LIÊN TỤC",
    back: "Camera", save: "Lưu", edTitle: "Mẫu watermark", newTpl: "Mẫu mới",
    fields: "Trường hiển thị", appearance: "Hiển thị",
    fDate: "Ngày giờ", fCoord: "Vĩ độ – Kinh độ", fAddr: "Địa chỉ đầy đủ",
    fProject: "Dự án / hạng mục", fAlt: "Độ cao · hướng", fWeather: "Thời tiết – nhiệt độ", fLogo: "Logo đơn vị", fQr: "Mã xác thực",
    aSize: "Cỡ chữ", aOpacity: "Độ mờ nền", aColor: "Màu chữ", aPos: "Vị trí", aLogo: "Ảnh logo", pick: "Chọn…",
    mProject: "Dự án", mCoord: "Tọa độ", mAcc: "Độ chính xác", note: "Ghi chú", notePh: "Ví dụ: Đổ bê tông dầm ngang D12, mẻ 3",
    saveTo: "Lưu vào dự án",
    libTitle: "Thư viện", select: "Chọn", cancel: "Hủy", picked: "Đã chọn {n} ảnh",
    tabProject: "Dự án", tabDate: "Ngày", tabMap: "Bản đồ",
    mTime: "Thời gian", mAlt: "Độ cao · Hướng", mAuthor: "Người chụp", mFile: "Tệp",
    share: "Chia sẻ", export: "Xuất PDF",
    prTitle: "Dự án", done: "Xong", active: "ĐANG CHỤP", newProject: "Tạo dự án mới",
    stTitle: "Cài đặt", grpFormat: "Định dạng", grpStorage: "Lưu trữ", grpLang: "Ngôn ngữ", grpAppearance: "Giao diện", grpAbout: "Về app",
    sDate: "Định dạng ngày giờ", sCoord: "Đơn vị tọa độ", sQuality: "Chất lượng ảnh",
    sAutoSave: "Lưu vào Ảnh iOS sau mỗi lần chụp", sAutoSaveD: "Mở bảng Chia sẻ → Lưu ảnh (web app không ghi thẳng vào Ảnh)", sCloud: "Đồng bộ cloud", sAuthor: "Người chụp", sReset: "Xóa toàn bộ dữ liệu app", mSystem: "Theo hệ thống",
    sCompass: "La bàn — hướng máy ảnh", sCompassD: "iOS hỏi quyền chuyển động mỗi lần mở app; tắt = dùng hướng GPS khi di chuyển",
    sPerm: "Không hỏi quyền mỗi lần mở", sPermD: "Cách đặt Camera / Vị trí thành “Cho phép” vĩnh viễn",
    permHelpT: "Chỉ cấp quyền một lần", permHelp: "iOS mặc định đặt quyền của trang web là “Hỏi” nên hỏi lại mỗi phiên. Đổi sang “Cho phép” một lần:\n\n1. Mở địa chỉ app bằng Safari (không phải icon trên màn hình chính).\n2. Chạm nút “AA” ở thanh địa chỉ → “Cài đặt trang web”.\n3. Đặt Camera = Cho phép, Vị trí = Cho phép → Xong.\n4. Nếu đã cài icon: xóa icon, thêm lại từ Safari (Chia sẻ → Thêm vào MH chính).\n\nCách khác cho toàn bộ trang: Cài đặt iOS → Ứng dụng → Safari → Camera / Vị trí → Cho phép.\n\nAndroid/Chrome: nhớ quyền sau lần đầu chọn “Cho phép”.", gotIt: "Đã hiểu",
    photos: "ảnh", items: "hạng mục", empty: "Chưa có ảnh nào.\nChụp ảnh đầu tiên từ màn Camera.",
    gpsLocating: "Đang định vị…", gpsLost: "Mất tín hiệu GPS", gpsOff: "GPS: không xác định", gpsSat: "GPS ±{a}m",
    noLocT: "Chưa có quyền vị trí", noLocD: "Ảnh sẽ không có tọa độ — không dùng được cho biên bản nghiệm thu.", openSet: "Cấp quyền vị trí",
    noCamT: "Không mở được camera", noCamD: "Kiểm tra quyền camera trong Cài đặt iOS → Safari, hoặc thiết bị không có camera.", retry: "Thử lại",
    lowStoT: "Còn {mb} MB trống", lowStoD: "Nên xuất và dọn bớt ảnh cũ trước khi tiếp tục chụp.",
    saved: "Đã lưu vào {p}", savedPhotos: "Đã lưu {n} ảnh", deleted: "Đã xóa", noSel: "Chưa chọn ảnh",
    videoSaved: "Đã lưu video", recStart: "Đang quay…", cloudSoon: "Đồng bộ cloud sẽ có trong bản sau",
    exporting: "Đang xuất…", exportOk: "Đã tạo tệp", shareFail: "Thiết bị không hỗ trợ chia sẻ tệp — đã tải xuống",
    confirmDel: "Xóa {n} ảnh?", confirmDelD: "Ảnh đã đóng dấu sẽ bị xóa khỏi thư viện app (không ảnh hưởng ảnh đã lưu vào Ảnh iOS).", del: "Xóa",
    resetT: "Xóa toàn bộ dữ liệu?", resetD: "Ảnh, dự án, mẫu và cài đặt sẽ bị xóa khỏi thiết bị này.",
    prNew: "Dự án mới", prName: "Tên dự án", prItem: "Hạng mục", prEdit: "Sửa dự án", prDel: "Xóa dự án", prDelD: "Ảnh trong dự án vẫn được giữ, chuyển sang 'Chưa phân loại'.", unsorted: "Chưa phân loại",
    tplNew: "Mẫu mới", tplName: "Tên mẫu", authorPh: "Họ tên người chụp",
    optDate: "Định dạng ngày giờ", optCoord: "Đơn vị tọa độ", optQuality: "Chất lượng ảnh",
    qHigh: "Cao · 100%", qStd: "Chuẩn · 92%", qEco: "Tiết kiệm · 80%",
    day: "Hôm nay", yesterday: "Hôm qua", noAddr: "Địa chỉ chưa xác định", nogps: "KHÔNG GPS",
    dpScreens: "Màn hình", dpOnboard: "Quyền", dpEditor: "Mẫu", dpPreview: "Xem trước", dpLibrary: "Thư viện", dpDetail: "Chi tiết", dpProjects: "Dự án", dpSettings: "Cài đặt",
    dpModeLang: "Chế độ & ngôn ngữ", dpWm: "Vị trí watermark", dpWmNote: "Trên màn Camera, giữ và kéo thẻ watermark — thả ra sẽ hít vào vùng gần nhất trong 5 vùng neo.", dpAnchor: "neo hiện tại: ",
    mapEmpty: "Chưa có ảnh có tọa độ để hiển thị.", allProjects: "Tất cả dự án", pdfTitle: "BẢNG ẢNH HIỆN TRƯỜNG", pdfBy: "Người chụp"
  },
  en: {
    obTitle: "Grant access to start stamping",
    obSub: "Every shot carries its time, coordinates and project — evidence-grade out of the camera.",
    permCamT: "Camera", permCamD: "Take stamped photos and video.",
    permLocT: "Location", permLocD: "Read coordinates, altitude and address at capture time.",
    permLibT: "Photo library", permLibD: "Auto-save the stamped copy to iPhone Photos.",
    granted: "GRANTED", optional: "OPTIONAL", pending: "PENDING", denied: "DENIED",
    locAlways: "Always allow", locWhile: "While using",
    obCta: "Allow & open camera",
    obFoot: "iOS asks only once if you set Camera / Location = “Allow” in Safari's Website Settings — tap to see how. Without location, photos still work but carry no evidentiary value.",
    modePhoto: "PHOTO", modeVideo: "VIDEO", modeBurst: "BURST",
    back: "Camera", save: "Save", edTitle: "Watermark template", newTpl: "New",
    fields: "Visible fields", appearance: "Appearance",
    fDate: "Date & time", fCoord: "Latitude – Longitude", fAddr: "Full address",
    fProject: "Project / item", fAlt: "Altitude · heading", fWeather: "Weather – temp", fLogo: "Company logo", fQr: "Verification code",
    aSize: "Type size", aOpacity: "Backdrop opacity", aColor: "Text color", aPos: "Position", aLogo: "Logo image", pick: "Choose…",
    mProject: "Project", mCoord: "Coordinates", mAcc: "Accuracy", note: "Note", notePh: "e.g. Pouring cross beam D12, batch 3",
    saveTo: "Save to project",
    libTitle: "Library", select: "Select", cancel: "Cancel", picked: "{n} selected",
    tabProject: "Project", tabDate: "Date", tabMap: "Map",
    mTime: "Timestamp", mAlt: "Altitude · Heading", mAuthor: "Captured by", mFile: "File",
    share: "Share", export: "Export PDF",
    prTitle: "Projects", done: "Done", active: "SHOOTING", newProject: "New project",
    stTitle: "Settings", grpFormat: "Format", grpStorage: "Storage", grpLang: "Language", grpAppearance: "Appearance", grpAbout: "About",
    sDate: "Date format", sCoord: "Coordinate unit", sQuality: "Photo quality",
    sAutoSave: "Save to iOS Photos after each shot", sAutoSaveD: "Opens the Share sheet → Save Image (web apps can't write to Photos directly)", sCloud: "Cloud sync", sAuthor: "Photographer", sReset: "Erase all app data", mSystem: "System",
    sCompass: "Compass — camera heading", sCompassD: "iOS asks for motion access on every launch; off = GPS course while moving",
    sPerm: "Stop asking for permissions", sPermD: "How to set Camera / Location to “Allow” permanently",
    permHelpT: "Grant permissions once", permHelp: "iOS defaults website permissions to “Ask”, so it asks every session. Switch to “Allow” once:\n\n1. Open the app URL in Safari (not the Home Screen icon).\n2. Tap “AA” in the address bar → “Website Settings”.\n3. Set Camera = Allow, Location = Allow → Done.\n4. If the icon is already installed: remove it and add it again from Safari (Share → Add to Home Screen).\n\nAlternatively for all sites: iOS Settings → Apps → Safari → Camera / Location → Allow.\n\nAndroid/Chrome remembers after the first “Allow”.", gotIt: "Got it",
    photos: "photos", items: "items", empty: "No photos yet.\nTake your first shot from the Camera.",
    gpsLocating: "Locating…", gpsLost: "GPS signal lost", gpsOff: "GPS: unknown", gpsSat: "GPS ±{a}m",
    noLocT: "Location not granted", noLocD: "Photos will carry no coordinates — unusable for acceptance records.", openSet: "Grant location",
    noCamT: "Camera unavailable", noCamD: "Check camera permission in iOS Settings → Safari, or the device has no camera.", retry: "Retry",
    lowStoT: "{mb} MB free", lowStoD: "Export and clear older photos before shooting more.",
    saved: "Saved to {p}", savedPhotos: "Saved {n} photos", deleted: "Deleted", noSel: "Nothing selected",
    videoSaved: "Video saved", recStart: "Recording…", cloudSoon: "Cloud sync coming in a later release",
    exporting: "Exporting…", exportOk: "File created", shareFail: "File sharing unsupported — downloaded instead",
    confirmDel: "Delete {n} photos?", confirmDelD: "Stamped photos are removed from the app library (copies saved to iOS Photos are unaffected).", del: "Delete",
    resetT: "Erase all data?", resetD: "Photos, projects, templates and settings will be removed from this device.",
    prNew: "New project", prName: "Project name", prItem: "Item / work package", prEdit: "Edit project", prDel: "Delete project", prDelD: "Photos are kept and moved to 'Unsorted'.", unsorted: "Unsorted",
    tplNew: "New template", tplName: "Template name", authorPh: "Photographer name",
    optDate: "Date format", optCoord: "Coordinate unit", optQuality: "Photo quality",
    qHigh: "High · 100%", qStd: "Standard · 92%", qEco: "Economy · 80%",
    day: "Today", yesterday: "Yesterday", noAddr: "Address unknown", nogps: "NO GPS",
    dpScreens: "Screens", dpOnboard: "Permissions", dpEditor: "Template", dpPreview: "Preview", dpLibrary: "Library", dpDetail: "Detail", dpProjects: "Projects", dpSettings: "Settings",
    dpModeLang: "Mode & language", dpWm: "Watermark position", dpWmNote: "On the Camera screen, hold and drag the watermark card — it snaps to the nearest of 5 anchor zones.", dpAnchor: "current anchor: ",
    mapEmpty: "No geotagged photos to show yet.", allProjects: "All projects", pdfTitle: "SITE PHOTO SHEET", pdfBy: "Captured by"
  }
};
const t = (k, vars) => {
  let s = (STR[S.lang] && STR[S.lang][k]) ?? STR.vi[k] ?? k;
  if (vars) for (const v in vars) s = s.replace(`{${v}}`, vars[v]);
  return s;
};

/* ============================================================ helpers */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const pad2 = (n) => String(n).padStart(2, "0");
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const canShareFiles = () => !!(navigator.canShare && navigator.share);
const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const DATE_FMTS = ["dd/MM/yyyy HH:mm:ss", "dd/MM/yyyy HH:mm", "yyyy-MM-dd HH:mm:ss", "HH:mm:ss dd/MM/yyyy"];
function fmtDate(d, fmt = S.dateFmt) {
  const map = { dd: pad2(d.getDate()), MM: pad2(d.getMonth() + 1), yyyy: d.getFullYear(), HH: pad2(d.getHours()), mm: pad2(d.getMinutes()), ss: pad2(d.getSeconds()) };
  return fmt.replace(/dd|MM|yyyy|HH|mm|ss/g, (m) => map[m]);
}
/* watermark time line: "14:32:07 · 17/08/2026" — order/seconds follow the chosen date format */
function fmtStampTime(d, fmt = S.dateFmt) {
  const parts = fmt.split(" ");
  const datePart = parts.find((p) => /y/.test(p)) || "dd/MM/yyyy";
  const timePart = parts.find((p) => /H/.test(p)) || "HH:mm:ss";
  const timeFirst = fmt.indexOf(timePart) < fmt.indexOf(datePart);
  const a = fmtDate(d, timePart), b = fmtDate(d, datePart);
  return timeFirst ? `${a} · ${b}` : `${a} · ${b}`;
}
function toDMS(v, pos, neg) {
  const a = Math.abs(v), deg = Math.floor(a), minF = (a - deg) * 60, min = Math.floor(minF), sec = ((minF - min) * 60).toFixed(1);
  return `${deg}°${pad2(min)}'${sec.padStart(4, "0")}"${v >= 0 ? pos : neg}`;
}
function fmtCoord(lat, lng, unit = S.coordFmt) {
  if (lat == null || lng == null) return null;
  return unit === "dms" ? `${toDMS(lat, "N", "S")} ${toDMS(lng, "E", "W")}` : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}
const fmtDec = (lat, lng) => lat == null ? "—" : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
function headingName(h) {
  if (h == null || isNaN(h)) return "";
  const names = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return names[Math.round(h / 22.5) % 16];
}
function fmtBytes(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.round(b / 1024) + " KB"; }
function dayKey(ts) { const d = new Date(ts); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function dayLabel(key) {
  const today = dayKey(Date.now()), yest = dayKey(Date.now() - 864e5);
  if (key === today) return t("day");
  if (key === yest) return t("yesterday");
  const [y, m, d] = key.split("-");
  return S.lang === "en" ? `${d}/${m}/${y}` : `${d}/${m}/${y}`;
}
function hash32(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* ============================================================ storage (IndexedDB + localStorage) */
const DB_NAME = "stampfield", DB_VER = 1;
let db;
function openDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, DB_VER);
    r.onupgradeneeded = () => {
      const d = r.result;
      const ph = d.createObjectStore("photos", { keyPath: "id" });
      ph.createIndex("ts", "ts"); ph.createIndex("projectId", "projectId");
      d.createObjectStore("projects", { keyPath: "id" });
      d.createObjectStore("templates", { keyPath: "id" });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
const tx = (store, mode, fn) => new Promise((res, rej) => {
  const trx = db.transaction(store, mode), st = trx.objectStore(store);
  const out = fn(st);
  trx.oncomplete = () => res(out && out.result !== undefined ? out.result : out);
  trx.onerror = () => rej(trx.error);
});
const dbAll = (store) => new Promise((res, rej) => { const r = db.transaction(store).objectStore(store).getAll(); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const dbGet = (store, id) => new Promise((res, rej) => { const r = db.transaction(store).objectStore(store).get(id); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const dbPut = (store, v) => tx(store, "readwrite", (st) => st.put(v));
const dbDel = (store, id) => tx(store, "readwrite", (st) => st.delete(id));
const dbClear = (store) => tx(store, "readwrite", (st) => st.clear());

const SETTINGS_KEY = "stampfield.settings";
const DEFAULT_TEMPLATE = () => ({
  id: "tpl-nghiemthu", name: "Nghiệm thu",
  fields: { date: true, coord: true, addr: true, project: true, alt: false, weather: false, logo: true, qr: true },
  scale: 1, opacity: 0.62, color: "#ffffff", pos: "bl", logo: null
});
const S = {
  lang: "vi", mode: "dark", dateFmt: DATE_FMTS[0], coordFmt: "dms", quality: 0.92,
  autoSave: false, compass: false, cloud: false, author: "", onboarded: false,
  activeProjectId: null, templateId: "tpl-nghiemthu", ratio: "4:3", facing: "environment", flash: false, camMode: "photo"
};
function loadSettings() { try { Object.assign(S, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}")); } catch (e) { /* ignore */ } }
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(S)); }

/* runtime state */
const R = {
  screen: "camera", projects: [], templates: [], tpl: null, photos: [],
  stream: null, track: null, torchOk: false,
  geo: { lat: null, lng: null, acc: null, alt: null, heading: null, ts: 0, status: "off", addr: null, addrAt: null, weather: null },
  wmLive: null, dragging: false, pending: null /* capture awaiting preview */, detailId: null,
  libTab: "project", libSelect: false, selected: new Set(), recorder: null, recChunks: [], recStart: 0, recTimer: null, editorDraft: null,
  camPerm: "pending", locPerm: "pending"
};

/* ============================================================ theming / i18n apply */
function applyMode() {
  const sys = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = S.mode === "dark" || (S.mode === "system" && sys);
  document.documentElement.dataset.mode = dark ? "dark" : "light";
  $('meta[name="theme-color"]').setAttribute("content", dark ? "#131517" : "#f2f2f3");
}
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyMode);
function applyLang() {
  document.documentElement.lang = S.lang;
  $$("[data-t]").forEach((el) => { el.textContent = t(el.dataset.t); });
  $$("[data-ph]").forEach((el) => { el.placeholder = t(el.dataset.ph); });
  $("#dp-anchor").textContent = t("dpAnchor") + (R.tpl ? R.tpl.pos : "bl");
}

/* ============================================================ router */
const SCREENS = ["onboard", "camera", "editor", "preview", "library", "detail", "projects", "settings"];
function show(name) {
  if (!SCREENS.includes(name)) return;
  const prev = R.screen; R.screen = name;
  SCREENS.forEach((s) => $("#s-" + s).classList.toggle("active", s === name));
  const darkChrome = name === "camera" || name === "preview" || name === "detail";
  $("#app").classList.toggle("dark-chrome", darkChrome);
  $$("#dp-screens button").forEach((b) => b.classList.toggle("on", b.dataset.nav === name));
  if (name === "camera") { startCamera(); renderWm(); }
  else if (prev === "camera" && name !== "preview") { /* keep stream warm for quick return */ }
  if (name === "editor") openEditor();
  if (name === "library") renderLibrary();
  if (name === "projects") renderProjects();
  if (name === "settings") renderSettings();
  if (name === "detail" && !R.detailId && R.photos.length) R.detailId = R.photos[0].id;
  if (name === "detail") renderDetail();
  if (name === "preview" && !R.pending && !R.previewing) { demoPreviewFromLast(); return; }
  if (name !== "preview") R.previewing = false;
  history.replaceState(null, "", "#" + name);
}

/* ============================================================ camera */
async function startCamera() {
  // reuse the granted stream whenever possible — a new getUserMedia() is what triggers a fresh permission prompt on iOS
  if (R.stream && R.stream.active && R.track && R.track.readyState === "live") { $("#video").play().catch(() => {}); return; }
  $("#vf-placeholder").textContent = "live camera preview";
  try {
    const constraints = { audio: false, video: { facingMode: { ideal: S.facing }, width: { ideal: 4032 }, height: { ideal: 3024 } } };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    R.stream = stream; R.track = stream.getVideoTracks()[0];
    const v = $("#video"); v.srcObject = stream; await v.play().catch(() => {});
    v.classList.toggle("mirror", S.facing === "user");
    $("#vf-placeholder").classList.add("hidden");
    R.camPerm = "granted";
    const caps = R.track.getCapabilities ? R.track.getCapabilities() : {};
    R.torchOk = !!caps.torch;
    if (S.flash && R.torchOk) R.track.applyConstraints({ advanced: [{ torch: true }] }).catch(() => {});
    renderCamBanner();
  } catch (e) {
    R.camPerm = e && e.name === "NotAllowedError" ? "denied" : "error";
    $("#vf-placeholder").classList.remove("hidden");
    $("#vf-placeholder").textContent = "camera unavailable";
    renderCamBanner();
  }
  updatePermPills();
}
function stopCamera() {
  if (R.stream) R.stream.getTracks().forEach((tr) => tr.stop());
  R.stream = null; R.track = null; $("#video").srcObject = null;
}
async function flipCamera() {
  S.facing = S.facing === "user" ? "environment" : "user"; saveSettings();
  stopCamera(); await startCamera();
}
function toggleFlash() {
  S.flash = !S.flash; saveSettings();
  $("#btn-flash").classList.toggle("flash-on", S.flash);
  if (R.track && R.torchOk) R.track.applyConstraints({ advanced: [{ torch: S.flash }] }).catch(() => {});
}
const RATIOS = ["4:3", "16:9", "1:1"];
function cycleRatio() {
  S.ratio = RATIOS[(RATIOS.indexOf(S.ratio) + 1) % RATIOS.length]; saveSettings();
  $("#ratio-btn").textContent = S.ratio;
}
function ratioValue() { const [a, b] = S.ratio.split(":").map(Number); return a / b; }

/* ============================================================ geolocation, heading, geocode, weather */
let geoWatch = null;
function startGeo() {
  if (!("geolocation" in navigator)) { R.geo.status = "off"; renderGps(); return; }
  if (geoWatch != null) return;
  R.geo.status = "locating"; renderGps();
  geoWatch = navigator.geolocation.watchPosition((p) => {
    const c = p.coords;
    Object.assign(R.geo, { lat: c.latitude, lng: c.longitude, acc: c.accuracy, alt: c.altitude, ts: p.timestamp, status: c.accuracy > 60 ? "weak" : "ok" });
    if (c.heading != null && !isNaN(c.heading) && R.geo.headingSrc !== "compass") R.geo.heading = c.heading;
    R.locPerm = "granted"; updatePermPills();
    renderGps(); renderCamBanner(); renderWm(); maybeGeocode(); maybeWeather();
    clearTimeout(R.geoLostT); R.geoLostT = setTimeout(() => { R.geo.status = "lost"; renderGps(); renderWm(); }, 30000);
  }, (err) => {
    R.geo.status = err.code === 1 ? "denied" : "lost";
    if (err.code === 1) { R.locPerm = "denied"; updatePermPills(); }
    renderGps(); renderCamBanner(); renderWm();
  }, { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 });
}
/* Compass heading is opt-in (S.compass): iOS never remembers the motion permission and would prompt on every
   launch, so it is only requested from a user gesture after the user turns it on. GPS course is used otherwise. */
let headingOn = false;
function startHeading(fromGesture) {
  if (!S.compass || headingOn) return;
  const handler = (e) => {
    let h = null;
    if (e.webkitCompassHeading != null) h = e.webkitCompassHeading;
    else if (e.absolute && e.alpha != null) h = (360 - e.alpha) % 360;
    if (h != null) { R.geo.heading = h; R.geo.headingSrc = "compass"; }
  };
  const attach = () => { headingOn = true; window.addEventListener("deviceorientationabsolute", handler, true); window.addEventListener("deviceorientation", handler, true); };
  if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
    if (!fromGesture) return; // iOS: must be inside a tap
    DeviceOrientationEvent.requestPermission().then((s) => { if (s === "granted") attach(); }).catch(() => {});
  } else attach();
}
let geocodeBusy = false;
async function maybeGeocode(force) {
  const g = R.geo; if (g.lat == null || geocodeBusy) return;
  if (!force && g.addrAt && Date.now() - g.addrAt.t < 60000 && dist(g.lat, g.lng, g.addrAt.lat, g.addrAt.lng) < 40) return;
  geocodeBusy = true;
  try {
    const u = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${g.lat}&lon=${g.lng}&zoom=17&accept-language=${S.lang}`;
    const r = await fetch(u, { headers: { Accept: "application/json" } });
    if (r.ok) {
      const j = await r.json(); const a = j.address || {};
      const parts = [a.road || a.hamlet || a.neighbourhood || a.industrial, a.suburb || a.village || a.quarter, a.town || a.city_district || a.district || a.county, a.city || a.state]
        .filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i);
      g.addr = parts.join(", ") || j.display_name || null;
      g.addrAt = { lat: g.lat, lng: g.lng, t: Date.now() };
      renderWm();
    }
  } catch (e) { /* offline — keep last address */ }
  geocodeBusy = false;
}
async function maybeWeather() {
  const g = R.geo; if (!R.tpl || !R.tpl.fields.weather || g.lat == null) return;
  if (g.weather && Date.now() - g.weather.t < 600000) return;
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${g.lat}&longitude=${g.lng}&current=temperature_2m,weather_code,wind_speed_10m`);
    if (r.ok) { const j = await r.json(); g.weather = { t: Date.now(), temp: j.current.temperature_2m, code: j.current.weather_code, wind: j.current.wind_speed_10m }; renderWm(); }
  } catch (e) { /* ignore */ }
}
function weatherText(w) {
  if (!w) return null;
  const c = w.code; let s = S.lang === "en" ? "Clear" : "Nắng";
  if (c >= 1 && c <= 3) s = S.lang === "en" ? "Cloudy" : "Nhiều mây";
  else if (c >= 45 && c <= 48) s = S.lang === "en" ? "Fog" : "Sương mù";
  else if (c >= 51 && c <= 67) s = S.lang === "en" ? "Rain" : "Mưa";
  else if (c >= 80 && c <= 82) s = S.lang === "en" ? "Showers" : "Mưa rào";
  else if (c >= 95) s = S.lang === "en" ? "Storm" : "Dông";
  return `${s} ${Math.round(w.temp)}°C`;
}
function dist(a1, o1, a2, o2) { const R0 = 6371000, dA = (a2 - a1) * Math.PI / 180, dO = (o2 - o1) * Math.PI / 180; const x = Math.sin(dA / 2) ** 2 + Math.cos(a1 * Math.PI / 180) * Math.cos(a2 * Math.PI / 180) * Math.sin(dO / 2) ** 2; return 2 * R0 * Math.asin(Math.sqrt(x)); }
function renderGps() {
  const chip = $("#gps-chip"), txt = $("#gps-text"), g = R.geo;
  chip.classList.remove("warn", "err");
  const use = chip.querySelector("use");
  if (g.status === "ok") { txt.textContent = t("gpsSat", { a: Math.round(g.acc) }); use.setAttribute("href", "#i-pin-s"); }
  else if (g.status === "weak") { txt.textContent = t("gpsSat", { a: Math.round(g.acc) }); chip.classList.add("warn"); use.setAttribute("href", "#i-pin-s"); }
  else if (g.status === "locating") { txt.textContent = t("gpsLocating") + (g.acc ? ` ±${Math.round(g.acc)}m` : ""); chip.classList.add("warn"); use.setAttribute("href", "#i-pin-s"); }
  else if (g.status === "lost") { txt.textContent = t("gpsLost"); chip.classList.add("err"); use.setAttribute("href", "#i-pin-off"); }
  else { txt.textContent = t("gpsOff"); chip.classList.add("err"); use.setAttribute("href", "#i-pin-off"); }
}
function renderCamBanner() {
  const host = $("#cam-banner"); host.innerHTML = "";
  if (R.camPerm === "denied" || R.camPerm === "error") {
    host.innerHTML = `<div class="banner"><div class="ic err"><svg width="18" height="18"><use href="#i-warn"/></svg></div><div style="flex:1"><div class="t">${t("noCamT")}</div><div class="d">${t("noCamD")}</div><button class="cta" id="cam-retry">${t("retry")}</button></div></div>`;
    $("#cam-retry").onclick = () => { R.camPerm = "pending"; startCamera(); };
    return;
  }
  if (R.geo.status === "denied") {
    host.innerHTML = `<div class="banner"><div class="ic err"><svg width="18" height="18"><use href="#i-warn"/></svg></div><div style="flex:1"><div class="t">${t("noLocT")}</div><div class="d">${t("noLocD")}</div><button class="cta" id="loc-retry">${t("openSet")}</button></div></div>`;
    $("#loc-retry").onclick = () => { if (geoWatch != null) navigator.geolocation.clearWatch(geoWatch); geoWatch = null; startGeo(); };
    return;
  }
  if (R.storageLow) {
    host.innerHTML = `<div class="banner"><div class="ic warn"><svg width="18" height="18"><use href="#i-warn"/></svg></div><div style="flex:1"><div class="t">${t("lowStoT", { mb: R.storageLow })}</div><div class="d">${t("lowStoD")}</div></div></div>`;
  }
}
async function checkStorage() {
  if (!navigator.storage || !navigator.storage.estimate) return;
  try {
    const e = await navigator.storage.estimate(); const free = (e.quota - e.usage) / 1048576;
    R.storageLow = free < 500 ? Math.round(free) : null; R.storageInfo = e;
    renderCamBanner();
  } catch (err) { /* ignore */ }
}

/* ============================================================ watermark model + renderers */
function stampData(now = new Date(), geo = R.geo) {
  const tpl = R.tpl, f = tpl.fields, proj = activeProject();
  const d = { time: null, coord: null, alt: null, addr: null, proj: null, logo: f.logo, qr: f.qr, color: tpl.color, opacity: tpl.opacity, scale: tpl.scale, logoSrc: tpl.logo };
  if (f.date) d.time = fmtStampTime(now);
  if (f.coord) {
    if (geo.lat != null) d.coord = fmtCoord(geo.lat, geo.lng) + (geo.acc != null ? ` ±${Math.round(geo.acc)}m` : "") + (geo.status === "lost" ? " ~" : "");
    else d.coord = t("gpsOff");
  }
  if (f.alt || f.weather) {
    const parts = [];
    if (f.alt && geo.alt != null) parts.push(`ALT ${geo.alt.toFixed(1)}m`);
    if (f.alt && geo.heading != null) parts.push(`${Math.round(geo.heading)}° ${headingName(geo.heading)}`);
    if (f.weather && geo.weather) parts.push(weatherText(geo.weather));
    if (parts.length) d.alt = parts.join(" · ");
  }
  if (f.addr) d.addr = geo.addr || (geo.lat != null ? t("noAddr") : null);
  if (f.project && proj) d.proj = proj.item ? `${proj.name} · ${proj.item}` : proj.name;
  d.hashSeed = `${d.time}|${geo.lat}|${geo.lng}|${proj && proj.id}`;
  return d;
}
function fillWmDom(root, d) {
  const q = (c) => root.querySelector(c);
  q(".l-time").textContent = d.time || ""; q(".l-coord").textContent = d.coord || ""; q(".l-alt").textContent = d.alt || "";
  q(".l-addr").textContent = d.addr || ""; q(".l-proj").textContent = d.proj || "";
  const plate = q(".wm-plate"); plate.style.background = `rgba(10,12,14,${d.opacity})`; plate.style.color = d.color;
  q(".body").style.color = d.color;
  q(".l-coord").style.color = q(".l-alt").style.color = q(".l-addr").style.color = d.color === "#ffffff" ? "" : d.color;
  const side = q(".side"); side.classList.toggle("hidden", !d.logo && !d.qr);
  q(".logo").classList.toggle("hidden", !d.logo); q(".qr").classList.toggle("hidden", !d.qr);
  const logo = q(".logo");
  if (d.logoSrc) { if (!logo.querySelector("img")) logo.innerHTML = `<img alt="">`; logo.querySelector("img").src = d.logoSrc; } else logo.textContent = "LOGO";
  const qr = q(".qr"); qr.style.background = `url(${hashPatternDataUrl(d.hashSeed)}) center/cover`;
  root.style.transformOrigin = "bottom left";
}
const hashCache = new Map();
function hashPatternDataUrl(seed) {
  if (hashCache.has(seed)) return hashCache.get(seed);
  const c = document.createElement("canvas"); c.width = c.height = 34; drawHashPattern(c.getContext("2d"), 0, 0, 34, seed);
  const u = c.toDataURL(); if (hashCache.size > 50) hashCache.clear(); hashCache.set(seed, u); return u;
}
function drawHashPattern(ctx, x, y, size, seed) {
  const n = 7, cell = size / n; let h = hash32(seed || "x");
  ctx.fillStyle = "#e6edf3"; ctx.fillRect(x, y, size, size);
  ctx.fillStyle = "#1d2d3d";
  for (let i = 0; i < n * n; i++) { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; if ((h & 3) === 0 || i < n || i % n === 0) { ctx.fillRect(x + (i % n) * cell, y + Math.floor(i / n) * cell, cell, cell); } }
  ctx.fillStyle = "#e6edf3"; ctx.fillRect(x + cell * 1, y + cell * 1, cell, cell);
}
/* safe insets for the floating watermark on the viewfinder: below the GPS chip, above the control row */
const safeTopPx = () => parseFloat(getComputedStyle($("#app")).paddingTop) || 0;
const safeBottomPx = () => parseFloat(getComputedStyle($("#app")).getPropertyValue("--safe-bottom")) || 0;
const WM_TOP = () => 52 + safeTopPx();
const WM_BOTTOM = () => 208 + safeBottomPx();
function wmAnchor(pos) {
  const top = WM_TOP() + "px", bottom = WM_BOTTOM() + "px";
  return { tl: { top, left: "12px" }, tr: { top, right: "12px" }, bl: { bottom, left: "12px" }, br: { bottom, right: "12px" }, bc: { bottom, left: "50%", transform: "translateX(-50%)" } }[pos] || { bottom, left: "12px" };
}
function renderWm() {
  if (!R.tpl) return;
  const el = $("#wm"), d = stampData(); fillWmDom(el, d);
  el.style.transform = ""; el.style.top = el.style.left = el.style.right = el.style.bottom = "";
  if (R.wmLive) { el.classList.add("live"); el.style.left = R.wmLive.x + "px"; el.style.top = R.wmLive.y + "px"; }
  else { el.classList.remove("live"); const a = wmAnchor(R.tpl.pos); for (const k in a) el.style[k] = a[k]; }
  el.style.width = Math.round(292 * d.scale) + "px";
  el.style.zoom = "";
  $("#dp-anchor").textContent = t("dpAnchor") + R.tpl.pos;
  $$("#desk-panel [data-setpos]").forEach((b) => b.classList.toggle("on", b.dataset.setpos === R.tpl.pos));
  const dz = $("#dropzones"); const inset = { top: WM_TOP(), bottom: WM_BOTTOM() };
  dz.querySelector(".tl").style.cssText = `top:${inset.top}px;left:12px`; dz.querySelector(".tr").style.cssText = `top:${inset.top}px;right:12px`;
  dz.querySelector(".bl").style.cssText = `bottom:${inset.bottom}px;left:12px`; dz.querySelector(".br").style.cssText = `bottom:${inset.bottom}px;right:12px`;
  dz.querySelector(".bc").style.cssText = `bottom:${inset.bottom}px;left:50%;transform:translateX(-50%)`;
}
/* drag → snap to nearest of 5 anchor zones (mirrors onWmDown in the design) */
function onWmDown(e) {
  if (R.screen !== "camera") return;
  const el = $("#wm"), stage = $("#viewfinder"); e.preventDefault();
  const sr = stage.getBoundingClientRect(), er = el.getBoundingClientRect();
  const w = er.width, h = er.height, grabX = e.clientX - er.left, grabY = e.clientY - er.top;
  const k = sr.width / $("#viewfinder").offsetWidth || 1; // desktop frame is scaled by --fit
  const at = (ev) => ({ x: clamp((ev.clientX - sr.left - grabX) / k, 12, sr.width / k - w / k - 12), y: clamp((ev.clientY - sr.top - grabY) / k, WM_TOP(), sr.height / k - WM_BOTTOM() - h / k) });
  const move = (ev) => { R.wmLive = at(ev); renderWm(); };
  const up = (ev) => {
    window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
    const p = at(ev), cx = p.x + w / k / 2, cy = p.y + h / k / 2, W = sr.width / k, H = sr.height / k;
    let pos;
    if (cy < H * 0.47) pos = cx < W / 2 ? "tl" : "tr";
    else if (cx > W / 3 && cx < W * 2 / 3) pos = "bc";
    else pos = cx < W / 2 ? "bl" : "br";
    R.wmLive = null; R.dragging = false; $("#dropzones").classList.remove("show");
    R.tpl.pos = pos; saveTemplate(); renderWm();
  };
  R.wmLive = at(e); R.dragging = true; $("#dropzones").classList.add("show"); renderWm();
  window.addEventListener("pointermove", move); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
}

/* canvas renderer — same layout as the DOM card, scaled by k = W/393 */
function drawWatermark(ctx, W, H, d, pos, logoImg) {
  const k = W / 393 * (d.scale || 1);
  const SYS = "-apple-system, 'SF Pro Text', 'Helvetica Neue', system-ui, Roboto, sans-serif", MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace";
  const hasSide = d.logo || d.qr, sideW = hasSide ? 34 * k : 0, gap = hasSide ? 9 * k : 0;
  const cardW = 292 * k, padX = 11 * k, padY = 9 * k, bodyW = cardW - padX * 2 - sideW - gap;
  const lines = [];
  if (d.time) lines.push({ txt: d.time, font: `700 ${15.5 * k}px ${SYS}`, lh: 15.5 * k * 1.15, mb: 3 * k, color: d.color });
  if (d.coord) lines.push({ txt: d.coord, font: `500 ${10.5 * k}px ${MONO}`, lh: 10.5 * k * 1.5, color: alpha(d.color, .9) });
  if (d.alt) lines.push({ txt: d.alt, font: `400 ${10.5 * k}px ${MONO}`, lh: 10.5 * k * 1.5, color: alpha(d.color, .78) });
  if (d.addr) lines.push({ txt: d.addr, font: `400 ${11 * k}px ${SYS}`, lh: 11 * k * 1.45, mt: 2 * k, color: alpha(d.color, .86), wrap: 2 });
  if (d.proj) lines.push({ txt: d.proj, font: `600 ${11 * k}px ${SYS}`, lh: 11 * k * 1.45, color: d.color === "#ffffff" ? "#b5d9fd" : d.color, wrap: 2 });
  // measure with wrapping
  const rows = [];
  for (const L of lines) {
    ctx.font = L.font;
    const parts = L.wrap ? wrapText(ctx, L.txt, bodyW, L.wrap) : [L.txt];
    parts.forEach((p, i) => rows.push({ ...L, txt: p, mt: i === 0 ? L.mt : 0, mb: i === parts.length - 1 ? L.mb : 0 }));
  }
  const bodyH = rows.reduce((s, r) => s + r.lh + (r.mt || 0) + (r.mb || 0), 0);
  const sideH = hasSide ? (d.logo ? 34 * k : 0) + (d.qr ? 34 * k : 0) + (d.logo && d.qr ? 5 * k : 0) : 0;
  const cardH = Math.max(bodyH, sideH) + padY * 2;
  const m = Math.round(W * 0.03);
  let x = m, y = H - m - cardH;
  if (pos === "tl") { x = m; y = m; } else if (pos === "tr") { x = W - m - cardW; y = m; } else if (pos === "br") { x = W - m - cardW; } else if (pos === "bc") { x = (W - cardW) / 2; }
  // plate
  ctx.save();
  roundRect(ctx, x, y, cardW, cardH, 8 * k); ctx.fillStyle = `rgba(10,12,14,${d.opacity})`; ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.1)"; ctx.lineWidth = Math.max(1, k); ctx.stroke();
  // text
  ctx.textBaseline = "alphabetic"; let cy = y + padY;
  for (const r of rows) { cy += r.mt || 0; ctx.font = r.font; ctx.fillStyle = r.color; ctx.fillText(r.txt, x + padX, cy + r.lh * 0.78); cy += r.lh + (r.mb || 0); }
  // side column
  if (hasSide) {
    let sx = x + cardW - padX - sideW, sy = y + padY;
    if (d.logo) {
      roundRect(ctx, sx, sy, sideW, sideW, 5 * k); ctx.save(); ctx.clip();
      if (logoImg) ctx.drawImage(logoImg, sx, sy, sideW, sideW);
      else { ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = k; ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.font = `600 ${9 * k}px 'Barlow Condensed', ${SYS}`; ctx.textAlign = "center"; ctx.fillText("LOGO", sx + sideW / 2, sy + sideW / 2 + 3 * k); ctx.textAlign = "left"; }
      ctx.restore(); sy += sideW + 5 * k;
    }
    if (d.qr) { ctx.save(); roundRect(ctx, sx, sy, sideW, sideW, 5 * k); ctx.clip(); drawHashPattern(ctx, sx, sy, sideW, d.hashSeed); ctx.restore(); }
  }
  ctx.restore();
}
function alpha(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }
function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function wrapText(ctx, text, maxW, maxLines) {
  const words = String(text).split(/\s+/), out = []; let cur = "";
  for (const w of words) { const test = cur ? cur + " " + w : w; if (ctx.measureText(test).width > maxW && cur) { out.push(cur); cur = w; } else cur = test; }
  if (cur) out.push(cur);
  if (out.length > maxLines) { const keep = out.slice(0, maxLines); let last = keep[maxLines - 1]; while (ctx.measureText(last + "…").width > maxW && last.length > 1) last = last.slice(0, -1); keep[maxLines - 1] = last + "…"; return keep; }
  return out;
}
let logoImgCache = { src: null, img: null };
function loadLogoImg(src) {
  if (!src) return Promise.resolve(null);
  if (logoImgCache.src === src) return Promise.resolve(logoImgCache.img);
  return new Promise((res) => { const im = new Image(); im.onload = () => { logoImgCache = { src, img: im }; res(im); }; im.onerror = () => res(null); im.src = src; });
}

/* ============================================================ capture */
function grabFrame() {
  const v = $("#video"); if (!v.videoWidth) throw new Error("no-video");
  const vw = v.videoWidth, vh = v.videoHeight, target = ratioValue();
  // portrait phone: sensor is landscape-oriented in the stream? use as-is orientation, crop to ratio (portrait if vh>vw)
  let cw, ch; const portrait = vh > vw; const r = portrait ? 1 / target : target;
  if (vw / vh > r) { ch = vh; cw = Math.round(vh * r); } else { cw = vw; ch = Math.round(vw / r); }
  const sx = Math.round((vw - cw) / 2), sy = Math.round((vh - ch) / 2);
  const c = $("#work"); c.width = cw; c.height = ch; const ctx = c.getContext("2d");
  if (S.facing === "user") { ctx.translate(cw, 0); ctx.scale(-1, 1); }
  ctx.drawImage(v, sx, sy, cw, ch, 0, 0, cw, ch);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return { c, ctx, w: cw, h: ch };
}
async function stampFrame(frame, geoSnap, when) {
  const d = stampData(when, geoSnap);
  const logo = await loadLogoImg(R.tpl.logo);
  drawWatermark(frame.ctx, frame.w, frame.h, d, R.tpl.pos, logo);
  const blob = await new Promise((res) => frame.c.toBlob(res, "image/jpeg", S.quality));
  const thumb = makeThumb(frame.c, 240);
  return { blob, thumb, d };
}
function makeThumb(src, size) {
  const c = document.createElement("canvas"); const s = Math.min(src.width, src.height);
  c.width = c.height = size; c.getContext("2d").drawImage(src, (src.width - s) / 2, (src.height - s) / 2, s, s, 0, 0, size, size);
  return c.toDataURL("image/jpeg", 0.7);
}
let seq = parseInt(localStorage.getItem("stampfield.seq") || "2400", 10);
function nextName(prefix = "IMG") { seq++; localStorage.setItem("stampfield.seq", seq); return `${prefix}_${seq}`; }
function makeRecord(type, blob, thumb, w, h, geo, when, extra = {}) {
  const proj = activeProject();
  return {
    id: uid(), type, projectId: proj ? proj.id : null, ts: when.getTime(), lat: geo.lat, lng: geo.lng, acc: geo.acc, alt: geo.alt, heading: geo.heading,
    addr: geo.addr, note: "", w, h, blob, thumb, name: nextName(type === "video" ? "VID" : "IMG"), size: blob.size, author: S.author, gpsStatus: geo.status, ...extra
  };
}
async function capturePhoto(silentToast) {
  if (R.camPerm !== "granted") { toast(t("noCamT")); return; }
  const fx = $("#flash-fx"); fx.classList.remove("go"); void fx.offsetWidth; fx.classList.add("go");
  const when = new Date(), geo = { ...R.geo };
  let frame; try { frame = grabFrame(); } catch (e) { toast(t("noCamT")); return; }
  const { blob, thumb } = await stampFrame(frame, geo, when);
  const rec = makeRecord("photo", blob, thumb, frame.w, frame.h, geo, when);
  if (S.autoSave || silentToast) {
    await savePhoto(rec, !silentToast);
    if (S.autoSave && !silentToast) exportToPhotos(rec).catch(() => {});
  } else {
    R.pending = rec; openPreview(rec);
  }
}
async function captureBurst() {
  for (let i = 0; i < 3; i++) { await capturePhoto(true); await sleep(380); }
  toast(t("savedPhotos", { n: 3 }));
}
async function savePhoto(rec, showToast = true) {
  await dbPut("photos", rec); R.photos.unshift(rec);
  await bumpProject(rec.projectId);
  renderThumb();
  if (showToast) toast(t("saved", { p: activeProject() ? activeProject().name : t("unsorted") }));
  checkStorage();
}
async function bumpProject(id) { const p = R.projects.find((x) => x.id === id); if (p) { p.updated = Date.now(); await dbPut("projects", p); } }
function renderThumb() {
  const th = $("#thumb"), last = R.photos[0];
  th.querySelector("img")?.remove();
  if (last) { const im = document.createElement("img"); im.src = last.thumb; th.prepend(im); th.querySelector(".ts").textContent = fmtDate(new Date(last.ts), "HH:mm:ss"); }
  else th.querySelector(".ts").textContent = "";
}
async function exportToPhotos(rec) {
  const file = new File([rec.blob], rec.name + (rec.type === "video" ? ".mp4" : ".jpg"), { type: rec.blob.type || "image/jpeg" });
  if (canShareFiles() && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: rec.name }); return true; } catch (e) { if (e.name === "AbortError") return false; } }
  downloadBlob(rec.blob, file.name); return true;
}
function downloadBlob(blob, name) { const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(u); }, 4000); }

/* video recording with burned-in watermark (canvas.captureStream + MediaRecorder) */
async function toggleRecord() {
  if (R.recorder) { stopRecord(); return; }
  if (R.camPerm !== "granted" || !window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) { toast("MediaRecorder unsupported"); return; }
  const v = $("#video"); const c = document.createElement("canvas");
  const scale = Math.min(1, 1280 / Math.max(v.videoWidth, v.videoHeight)); c.width = Math.round(v.videoWidth * scale); c.height = Math.round(v.videoHeight * scale);
  const ctx = c.getContext("2d"); const logo = await loadLogoImg(R.tpl.logo); const startGeo0 = { ...R.geo }; const when = new Date();
  const loop = () => { if (!R.recorder) return; ctx.drawImage(v, 0, 0, c.width, c.height); drawWatermark(ctx, c.width, c.height, stampData(new Date(), R.geo), R.tpl.pos, logo); R.recRaf = requestAnimationFrame(loop); };
  const stream = c.captureStream(30);
  const mime = ["video/mp4", "video/webm;codecs=vp9", "video/webm"].find((m) => MediaRecorder.isTypeSupported(m)) || "";
  const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 6e6 } : undefined);
  R.recChunks = []; rec.ondataavailable = (e) => { if (e.data.size) R.recChunks.push(e.data); };
  rec.onstop = async () => {
    cancelAnimationFrame(R.recRaf); const blob = new Blob(R.recChunks, { type: rec.mimeType || "video/mp4" });
    const thumb = makeThumb(c, 240); const r = makeRecord("video", blob, thumb, c.width, c.height, startGeo0, when, { duration: Math.round((Date.now() - R.recStart) / 1000) });
    R.recorder = null; $("#shutter").classList.remove("rec"); $("#rec-timer").classList.add("hidden"); clearInterval(R.recTimer);
    await savePhoto(r, false); toast(t("videoSaved"));
  };
  R.recorder = rec; R.recStart = Date.now(); rec.start(500); loop();
  $("#shutter").classList.add("rec"); $("#rec-timer").classList.remove("hidden");
  R.recTimer = setInterval(() => { const s = Math.round((Date.now() - R.recStart) / 1000); $("#rec-timer").textContent = `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`; }, 500);
  toast(t("recStart"));
}
function stopRecord() { if (R.recorder && R.recorder.state !== "inactive") R.recorder.stop(); }

/* ============================================================ 4 · preview */
let pvUrl = null;
function openPreview(rec) {
  if (pvUrl) URL.revokeObjectURL(pvUrl); pvUrl = URL.createObjectURL(rec.blob);
  $("#pv-img").src = pvUrl; $("#pv-tag").textContent = `${rec.name} · ${rec.w}×${rec.h}`;
  const p = R.projects.find((x) => x.id === rec.projectId);
  $("#pv-proj").textContent = p ? (p.item ? `${p.name} / ${p.item}` : p.name) : t("unsorted");
  $("#pv-coord").textContent = fmtDec(rec.lat, rec.lng);
  $("#pv-acc").textContent = rec.acc != null ? `±${Math.round(rec.acc)} m` + (rec.alt != null ? ` · ALT ${rec.alt.toFixed(1)} m` : "") : "—";
  $("#pv-note").value = rec.note || "";
  R.previewing = true; show("preview");
}
function demoPreviewFromLast() { if (R.photos[0]) { R.pending = null; openPreview({ ...R.photos[0], _existing: true }); } else { toast(t("empty").split("\n")[0]); show("camera"); } }
async function pvSave() {
  const rec = R.pending; const note = $("#pv-note").value.trim();
  if (!rec) { const ex = R.photos[0]; if (ex) { ex.note = note; await dbPut("photos", ex); } show("library"); return; }
  rec.note = note; R.pending = null;
  await savePhoto(rec, true);
  if (S.autoSave) exportToPhotos(rec).catch(() => {});
  show("camera");
}

/* ============================================================ 5 · library */
function renderLibrary() {
  const body = $("#lib-body"); body.innerHTML = "";
  $$("#lib-tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === R.libTab));
  $("#s-library").classList.toggle("lib-select", R.libSelect);
  $("#lib-select").textContent = R.libSelect ? t("cancel") : t("select");
  $("#lib-bar").style.display = R.libSelect ? "flex" : "none";
  updatePicked();
  if (!R.photos.length) { body.innerHTML = `<div class="empty">${escapeHtml(t("empty")).replace("\n", "<br>")}</div>`; return; }
  if (R.libTab === "map") { renderMapTab(body); return; }
  const groups = new Map();
  for (const ph of R.photos) {
    const key = R.libTab === "project" ? (ph.projectId || "_") : dayKey(ph.ts);
    if (!groups.has(key)) groups.set(key, []); groups.get(key).push(ph);
  }
  const keys = Array.from(groups.keys());
  if (R.libTab === "date") keys.sort((a, b) => b.localeCompare(a));
  else keys.sort((a, b) => (a === "_") - (b === "_") || (groups.get(b)[0].ts - groups.get(a)[0].ts));
  for (const key of keys) {
    const list = groups.get(key);
    let label = R.libTab === "project" ? (R.projects.find((p) => p.id === key) ? projLabel(R.projects.find((p) => p.id === key)) : t("unsorted")) : dayLabel(key);
    const gh = document.createElement("div"); gh.className = "grp-head"; gh.innerHTML = `<div class="n">${escapeHtml(label)}</div><div class="c">${list.length}</div>`; body.appendChild(gh);
    const grid = document.createElement("div"); grid.className = "grid";
    for (const ph of list) {
      const cell = document.createElement("button"); cell.className = "cell" + (R.selected.has(ph.id) ? " sel" : ""); cell.dataset.id = ph.id;
      cell.innerHTML = `<img src="${ph.thumb}" alt=""><span class="ts">${fmtDate(new Date(ph.ts), "HH:mm:ss")}</span>${ph.type === "video" ? `<span class="tag">VIDEO</span>` : ph.lat == null ? `<span class="tag nogps">${t("nogps")}</span>` : ""}<span class="chk"></span>`;
      cell.onclick = () => { if (R.libSelect) { toggleSel(ph.id, cell); } else { R.detailId = ph.id; show("detail"); } };
      grid.appendChild(cell);
    }
    body.appendChild(grid);
  }
}
const projLabel = (p) => p.item ? `${p.name} · ${p.item}` : p.name;
function toggleSel(id, cell) { if (R.selected.has(id)) R.selected.delete(id); else R.selected.add(id); cell.classList.toggle("sel", R.selected.has(id)); updatePicked(); }
function updatePicked() { $("#lib-picked").textContent = t("picked", { n: R.selected.size }); ["#lib-del", "#lib-pdf", "#lib-zip"].forEach((s) => { $(s).disabled = !R.selected.size; }); }
function renderMapTab(body) {
  const pts = R.photos.filter((p) => p.lat != null);
  if (!pts.length) { body.innerHTML = `<div class="empty">${t("mapEmpty")}</div>`; return; }
  const c = document.createElement("canvas"); c.id = "map-canvas"; body.appendChild(c);
  const W = c.clientWidth || 361, H = Math.round(W * 1.1); const dpr = window.devicePixelRatio || 1; c.width = W * dpr; c.height = H * dpr;
  const ctx = c.getContext("2d"); ctx.scale(dpr, dpr);
  drawMiniMap(ctx, W, H, pts, null, true);
  const legend = document.createElement("div"); legend.className = "grp-head"; legend.style.marginTop = "10px";
  legend.innerHTML = `<div class="n">${t("allProjects")}</div><div class="c">${pts.length} · ${t("photos")}</div>`; body.appendChild(legend);
  const grid = document.createElement("div"); grid.className = "grid";
  pts.slice(0, 9).forEach((ph) => { const cell = document.createElement("button"); cell.className = "cell"; cell.innerHTML = `<img src="${ph.thumb}" alt=""><span class="ts">${fmtDate(new Date(ph.ts), "HH:mm:ss")}</span>`; cell.onclick = () => { R.detailId = ph.id; show("detail"); }; grid.appendChild(cell); });
  body.appendChild(grid);
  c.onclick = (e) => { const r = c.getBoundingClientRect(); const hit = c._hits && c._hits.find((h) => Math.hypot(h.x - (e.clientX - r.left), h.y - (e.clientY - r.top)) < 16); if (hit) { R.detailId = hit.id; show("detail"); } };
}
/* schematic map: light grid + pins, no external tiles (offline-safe) */
function drawMiniMap(ctx, W, H, pts, focusId, labels) {
  const css = getComputedStyle(document.documentElement); const dark = document.documentElement.dataset.mode === "dark";
  ctx.fillStyle = dark ? "#1b2027" : "#e3e9ee"; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = dark ? "rgba(148,188,227,.16)" : "rgba(89,128,166,.22)"; ctx.lineWidth = 1;
  const step = W < 200 ? 13 : 26;
  for (let x = 0.5; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0.5; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  if (!pts.length) return;
  let minLat = Math.min(...pts.map((p) => p.lat)), maxLat = Math.max(...pts.map((p) => p.lat)), minLng = Math.min(...pts.map((p) => p.lng)), maxLng = Math.max(...pts.map((p) => p.lng));
  const padDeg = 0.0006; minLat -= padDeg; maxLat += padDeg; minLng -= padDeg; maxLng += padDeg;
  const cosL = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);
  const spanX = (maxLng - minLng) * cosL, spanY = maxLat - minLat, sc = Math.min((W - 40) / spanX, (H - 40) / spanY);
  const ox = (W - spanX * sc) / 2, oy = (H - spanY * sc) / 2;
  const proj = (p) => ({ x: ox + (p.lng - minLng) * cosL * sc, y: H - (oy + (p.lat - minLat) * sc) });
  const hits = [];
  // scale bar
  const meters = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000].find((m) => (m / 111320) * sc > W * 0.2) || 5000; const barW = (meters / 111320) * sc;
  ctx.fillStyle = dark ? "rgba(245,245,248,.7)" : "#5d5d60"; ctx.fillRect(10, H - 14, barW, 2); ctx.font = `500 ${W < 200 ? 7.5 : 10}px 'JetBrains Mono', monospace`; ctx.fillText(meters >= 1000 ? meters / 1000 + " km" : meters + " m", 10, H - 18);
  for (const p of pts) {
    const q = proj(p); hits.push({ ...q, id: p.id }); const focus = focusId ? p.id === focusId : true; const r = W < 200 ? 5 : 7;
    ctx.save(); ctx.translate(q.x, q.y);
    ctx.fillStyle = focus ? (css.getPropertyValue("--acs").trim() || "#5980a6") : "rgba(89,128,166,.45)";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, -r * 1.6, r, Math.PI * 0.75, Math.PI * 2.25); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = W < 200 ? 1.5 : 2; ctx.stroke();
    ctx.restore();
  }
  ctx.canvas._hits = hits;
  if (labels) { ctx.fillStyle = dark ? "rgba(245,245,248,.55)" : "#5d5d60"; ctx.font = "500 10px 'JetBrains Mono', monospace"; ctx.fillText(`${pts[0].lat.toFixed(4)}, ${pts[0].lng.toFixed(4)}`, W - 130, 16); }
}
async function libDelete() { const ids = Array.from(R.selected); if (!ids.length) return; confirmSheet(t("confirmDel", { n: ids.length }), t("confirmDelD"), t("del"), async () => { for (const id of ids) await deletePhoto(id); R.selected.clear(); R.libSelect = false; renderLibrary(); toast(t("deleted")); }); }
async function deletePhoto(id) { await dbDel("photos", id); R.photos = R.photos.filter((p) => p.id !== id); renderThumb(); }

/* ============================================================ 6 · detail */
let dtUrl = null;
function renderDetail() {
  const ph = R.photos.find((p) => p.id === R.detailId); if (!ph) { show("library"); return; }
  if (dtUrl) URL.revokeObjectURL(dtUrl); dtUrl = URL.createObjectURL(ph.blob);
  const img = $("#dt-img"); img.src = ph.type === "video" ? ph.thumb : dtUrl;
  const p = R.projects.find((x) => x.id === ph.projectId);
  $("#dt-title").textContent = (p ? (p.item || p.name) : t("unsorted")) + (ph.note ? ` · ${ph.note}` : "");
  $("#dt-addr").textContent = ph.addr || (ph.lat != null ? t("noAddr") : t("gpsOff"));
  $("#dt-gps").textContent = ph.lat != null ? `GPS ±${Math.round(ph.acc || 0)}m` : t("nogps");
  $("#dt-time").textContent = fmtDate(new Date(ph.ts), "dd/MM/yyyy HH:mm:ss") + " GMT" + tzStr();
  $("#dt-coord").textContent = fmtDec(ph.lat, ph.lng);
  $("#dt-alt").textContent = [ph.alt != null ? `${ph.alt.toFixed(1)} m` : null, ph.heading != null ? `${Math.round(ph.heading)}° ${headingName(ph.heading)}` : null].filter(Boolean).join(" · ") || "—";
  $("#dt-author").textContent = ph.author || S.author || "—";
  $("#dt-note").textContent = ph.note || "—";
  $("#dt-file").textContent = `${ph.name} · ${fmtBytes(ph.size)}` + (ph.type === "video" ? ` · ${ph.duration || 0}s` : "");
  const c = $("#dt-map"); const ctx = c.getContext("2d"); ctx.setTransform(2, 0, 0, 2, 0, 0);
  const near = ph.lat != null ? R.photos.filter((x) => x.lat != null && dist(x.lat, x.lng, ph.lat, ph.lng) < 400) : [];
  drawMiniMap(ctx, 96, 96, ph.lat != null ? [ph, ...near.filter((x) => x.id !== ph.id)] : [], ph.id, false);
  if (ph.lat == null) { ctx.fillStyle = "#98989b"; ctx.font = "500 7.5px 'JetBrains Mono', monospace"; ctx.fillText(t("nogps"), 6, 90); }
}
function tzStr() { const o = -new Date().getTimezoneOffset() / 60; return (o >= 0 ? "+" : "") + o; }

/* ============================================================ 7 · projects */
function activeProject() { return R.projects.find((p) => p.id === S.activeProjectId) || null; }
function renderProjects() {
  const host = $("#pr-list"); host.innerHTML = "";
  const sorted = [...R.projects].sort((a, b) => (b.id === S.activeProjectId) - (a.id === S.activeProjectId) || (b.updated || 0) - (a.updated || 0));
  for (const p of sorted) {
    const n = R.photos.filter((x) => x.projectId === p.id).length;
    const items = new Set(R.photos.filter((x) => x.projectId === p.id && x.note).map((x) => x.note)).size || (p.item ? 1 : 0);
    const el = document.createElement("button"); el.className = "proj" + (p.id === S.activeProjectId ? " on" : "");
    el.innerHTML = `<div class="av">${escapeHtml(initials(p.name))}</div><div style="flex:1;min-width:0"><div class="n">${escapeHtml(p.name)}</div><div class="m">${n} ${t("photos")} · ${items} ${t("items")} · ${p.updated ? fmtDate(new Date(p.updated), "dd/MM") : "—"}</div></div>` +
      (p.id === S.activeProjectId ? `<span class="badge">${t("active")}</span>` : `<svg width="17" height="17" class="chev"><use href="#i-chev-r"/></svg>`);
    el.onclick = () => { S.activeProjectId = p.id; saveSettings(); renderProjects(); renderProjChip(); renderWm(); };
    let pressT; el.onpointerdown = () => { pressT = setTimeout(() => editProjectSheet(p), 550); }; el.onpointerup = el.onpointerleave = el.onpointercancel = () => clearTimeout(pressT);
    el.oncontextmenu = (e) => { e.preventDefault(); editProjectSheet(p); };
    host.appendChild(el);
  }
  const add = document.createElement("button"); add.className = "dash-btn"; add.style.marginTop = "2px";
  add.innerHTML = `<svg width="18" height="18"><use href="#i-plus"/></svg>${t("newProject")}`; add.onclick = () => editProjectSheet(null); host.appendChild(add);
  const hint = document.createElement("div"); hint.className = "empty"; hint.style.padding = "16px 10px"; hint.textContent = S.lang === "en" ? "Tap to make active · long-press to edit" : "Chạm để chọn · giữ lâu để sửa"; host.appendChild(hint);
}
function initials(n) { return n.split(/\s+/).filter(Boolean).filter((w) => /^[A-ZĐ0-9]/i.test(w)).slice(-2).map((w) => w[0].toUpperCase()).join("") || "PJ"; }
function renderProjChip() { const p = activeProject(); $("#proj-chip .name").textContent = p ? (p.item ? `${shortName(p.name)} · ${p.item}` : p.name) : t("unsorted"); }
function shortName(n) { return n.replace(/^(Cảng tổng hợp|Cảng|Bến|Khảo sát|Dự án)\s+/i, (m) => m.split(" ")[0] + " "); }
function editProjectSheet(p) {
  sheet(`<h3>${p ? t("prEdit") : t("prNew")}</h3>
    <div class="field"><label>${t("prName")}</label><input id="f-name" value="${escapeHtml(p ? p.name : "")}" placeholder="Cảng tổng hợp Phú Mỹ"></div>
    <div class="field"><label>${t("prItem")}</label><input id="f-item" value="${escapeHtml(p ? p.item || "" : "")}" placeholder="Cầu tàu B2"></div>
    <div class="btns">${p ? `<button class="b1" id="f-del" style="color:var(--err)">${t("prDel")}</button>` : `<button class="b1" id="f-cancel">${t("cancel")}</button>`}<button class="b2" id="f-ok">${t("save")}</button></div>`);
  $("#f-ok").onclick = async () => {
    const name = $("#f-name").value.trim(); if (!name) return;
    const rec = p || { id: uid(), created: Date.now() }; rec.name = name; rec.item = $("#f-item").value.trim(); rec.updated = Date.now();
    await dbPut("projects", rec); if (!p) { R.projects.push(rec); S.activeProjectId = rec.id; saveSettings(); }
    closeSheet(); renderProjects(); renderProjChip(); renderWm();
  };
  if ($("#f-cancel")) $("#f-cancel").onclick = closeSheet;
  if ($("#f-del")) $("#f-del").onclick = () => confirmSheet(t("prDel") + "?", t("prDelD"), t("del"), async () => {
    await dbDel("projects", p.id); R.projects = R.projects.filter((x) => x.id !== p.id);
    for (const ph of R.photos.filter((x) => x.projectId === p.id)) { ph.projectId = null; await dbPut("photos", ph); }
    if (S.activeProjectId === p.id) { S.activeProjectId = R.projects[0] ? R.projects[0].id : null; saveSettings(); }
    renderProjects(); renderProjChip(); renderWm();
  });
  setTimeout(() => $("#f-name").focus(), 50);
}

/* ============================================================ 3 · template editor */
function openEditor() {
  R.editorDraft = JSON.parse(JSON.stringify(R.tpl));
  renderEditor();
}
function renderEditor() {
  const d = R.editorDraft; if (!d) return;
  const list = $("#tpl-list"); list.innerHTML = "";
  for (const tp of R.templates) {
    const b = document.createElement("button"); b.className = "tpl" + (tp.id === d.id ? " on" : "");
    b.innerHTML = `<span class="n">${escapeHtml(tp.name)}</span><b></b><b></b>`; b.onclick = () => { R.editorDraft = JSON.parse(JSON.stringify(tp)); renderEditor(); };
    let pressT; b.onpointerdown = () => { pressT = setTimeout(() => renameTplSheet(tp), 550); }; b.onpointerup = b.onpointerleave = b.onpointercancel = () => clearTimeout(pressT);
    list.appendChild(b);
  }
  const nb = document.createElement("button"); nb.className = "tpl new"; nb.innerHTML = `<svg width="17" height="17"><use href="#i-plus"/></svg><span>${t("newTpl")}</span>`;
  nb.onclick = () => renameTplSheet(null); list.appendChild(nb);
  $$("#field-list .toggle").forEach((tg) => tg.classList.toggle("on", !!d.fields[tg.dataset.field]));
  $$("#field-list .row").forEach((row) => { const tg = row.querySelector(".toggle"); row.classList.toggle("muted", tg && !tg.classList.contains("on")); });
  $$("[data-coord]").forEach((b) => b.classList.toggle("on", b.dataset.coord === S.coordFmt));
  $("#ed-datefmt").textContent = S.dateFmt;
  $("#ed-scale").value = d.scale; $("#ed-opacity").value = d.opacity;
  $$("#ed-colors button").forEach((b) => b.classList.toggle("on", b.dataset.color === d.color));
  $$("#ed-anchor button").forEach((b) => b.classList.toggle("on", b.dataset.pos === d.pos));
  // preview
  const saved = R.tpl; R.tpl = d; const data = stampData(new Date(), R.geo.lat != null ? R.geo : demoGeo()); R.tpl = saved;
  const wm = $("#tpl-preview .wm"); fillWmDom(wm, data);
  wm.style.width = "auto"; wm.style.left = wm.style.right = "9px"; wm.style.bottom = "9px"; wm.style.top = "auto"; wm.style.transform = "";
  if (d.pos === "tl" || d.pos === "tr") { wm.style.top = "24px"; wm.style.bottom = "auto"; }
  wm.querySelector(".wm-plate").style.transform = `scale(${d.scale})`; wm.querySelector(".wm-plate").style.transformOrigin = d.pos.endsWith("r") ? "top right" : d.pos === "bc" ? "top center" : "top left";
}
function demoGeo() { return { lat: 10.759, lng: 106.70519, acc: 4, alt: 12.4, heading: 187, status: "ok", addr: "KCN Phú Mỹ 3, TX. Phú Mỹ, Bà Rịa – Vũng Tàu", weather: { temp: 31, code: 1, t: Date.now() } }; }
function renameTplSheet(tp) {
  sheet(`<h3>${tp ? t("edTitle") : t("tplNew")}</h3><div class="field"><label>${t("tplName")}</label><input id="f-tname" value="${escapeHtml(tp ? tp.name : "")}" placeholder="Khảo sát"></div>
    <div class="btns">${tp && R.templates.length > 1 ? `<button class="b1" id="f-tdel" style="color:var(--err)">${t("del")}</button>` : `<button class="b1" id="f-tcancel">${t("cancel")}</button>`}<button class="b2" id="f-tok">${t("save")}</button></div>`);
  $("#f-tok").onclick = async () => {
    const name = $("#f-tname").value.trim(); if (!name) return;
    if (tp) { tp.name = name; await dbPut("templates", tp); if (R.editorDraft.id === tp.id) R.editorDraft.name = name; }
    else { const n = { ...JSON.parse(JSON.stringify(R.editorDraft)), id: uid(), name }; await dbPut("templates", n); R.templates.push(n); R.editorDraft = JSON.parse(JSON.stringify(n)); }
    closeSheet(); renderEditor();
  };
  if ($("#f-tcancel")) $("#f-tcancel").onclick = closeSheet;
  if ($("#f-tdel")) $("#f-tdel").onclick = async () => { await dbDel("templates", tp.id); R.templates = R.templates.filter((x) => x.id !== tp.id); if (R.tpl.id === tp.id) { R.tpl = R.templates[0]; S.templateId = R.tpl.id; saveSettings(); } R.editorDraft = JSON.parse(JSON.stringify(R.tpl)); closeSheet(); renderEditor(); };
  setTimeout(() => $("#f-tname").focus(), 50);
}
async function saveTemplate() { await dbPut("templates", R.tpl); }
async function edSave() {
  const d = R.editorDraft; const idx = R.templates.findIndex((x) => x.id === d.id);
  if (idx >= 0) R.templates[idx] = d; else R.templates.push(d);
  R.tpl = d; S.templateId = d.id; saveSettings(); await dbPut("templates", d);
  show("camera");
}

/* ============================================================ 8 · settings */
function renderSettings() {
  $("#st-date-v").textContent = S.dateFmt.split(" ")[0].replace(/ HH.*/, "");
  $("#st-coord-v").textContent = S.coordFmt.toUpperCase();
  $("#st-quality-v").textContent = S.quality >= 1 ? "12 MP · 100%" : S.quality >= 0.9 ? "12 MP · 92%" : "12 MP · 80%";
  $("#st-autosave").classList.toggle("on", !!S.autoSave); $("#st-cloud").classList.toggle("on", !!S.cloud); $("#st-compass").classList.toggle("on", !!S.compass);
  $("#st-author-v").textContent = S.author || "—";
  $$("#st-mode .row").forEach((b) => b.querySelector(".ck").style.opacity = b.dataset.mode === S.mode ? 1 : 0);
  $$("#st-lang .row").forEach((b) => b.querySelector(".ck").style.opacity = b.dataset.lang === S.lang ? 1 : 0);
  const info = R.storageInfo; const used = R.photos.reduce((s, p) => s + (p.size || 0), 0);
  $("#st-storage-sub").textContent = `${R.photos.length} ${t("photos")} · ${fmtBytes(used)}` + (info ? ` · ${(info.quota / 1073741824).toFixed(1)} GB` : "");
}
function optionSheet(title, opts, cur, onPick) {
  sheet(`<h3>${title}</h3>` + opts.map((o) => `<button class="opt" data-v="${escapeHtml(o.v)}"><span class="grow">${escapeHtml(o.l)}</span><span class="ck" style="opacity:${o.v === cur ? 1 : 0}">✓</span></button>`).join(""));
  $$("#sheet .opt").forEach((b) => b.onclick = () => { onPick(b.dataset.v); closeSheet(); });
}

function showPermHelp() {
  sheet(`<h3>${escapeHtml(t("permHelpT"))}</h3><p style="white-space:pre-line">${escapeHtml(t("permHelp"))}</p><div class="btns"><button class="b2" id="ph-ok">${t("gotIt")}</button></div>`);
  $("#ph-ok").onclick = closeSheet;
}

/* ============================================================ sheets / toast / busy */
function sheet(html) { $("#sheet").innerHTML = `<div class="grab"></div>` + html; $("#sheet-veil").classList.add("show"); }
function closeSheet() { $("#sheet-veil").classList.remove("show"); }
function confirmSheet(title, desc, okLabel, onOk) {
  sheet(`<h3>${escapeHtml(title)}</h3><p>${escapeHtml(desc)}</p><div class="btns"><button class="b1" id="c-no">${t("cancel")}</button><button class="b2 danger" id="c-ok">${escapeHtml(okLabel)}</button></div>`);
  $("#c-no").onclick = closeSheet; $("#c-ok").onclick = async () => { closeSheet(); await onOk(); };
}
let toastT; function toast(msg) { $("#toast-text").textContent = msg; $("#toast").classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => $("#toast").classList.remove("show"), 2200); }
function busy(on, msg) { $("#busy").classList.toggle("show", !!on); $("#busy-text").textContent = msg || ""; }

/* ============================================================ export: PDF (canvas pages → JPEG → PDF) & ZIP (store) */
async function exportPDF(photos) {
  busy(true, t("exporting"));
  try {
    const pages = [];
    const PW = 1240, PH = 1754; // A4 @150dpi portrait
    for (let i = 0; i < photos.length; i += 2) {
      const c = document.createElement("canvas"); c.width = PW; c.height = PH; const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, PW, PH);
      ctx.fillStyle = "#1d1f20"; ctx.font = "700 34px 'Barlow Condensed', 'Arial Narrow', sans-serif"; ctx.fillText(t("pdfTitle"), 70, 90);
      ctx.font = "500 16px 'JetBrains Mono', monospace"; ctx.fillStyle = "#5d5d60";
      const proj = R.projects.find((p) => p.id === photos[i].projectId);
      ctx.fillText(`${proj ? projLabel(proj) : t("unsorted")}  ·  ${fmtDate(new Date(), "dd/MM/yyyy HH:mm")}  ·  ${i / 2 + 1}/${Math.ceil(photos.length / 2)}`, 70, 118);
      ctx.fillStyle = "#5980a6"; ctx.fillRect(70, 132, PW - 140, 2);
      for (let j = 0; j < 2 && i + j < photos.length; j++) {
        const ph = photos[i + j]; const top = 160 + j * 780;
        const img = await blobToImage(ph.type === "video" ? dataURLtoBlob(ph.thumb) : ph.blob);
        const boxW = 700, boxH = 620; const s = Math.min(boxW / img.width, boxH / img.height); const w = img.width * s, h = img.height * s;
        ctx.fillStyle = "#e7e7ea"; ctx.fillRect(70, top, boxW, boxH); ctx.drawImage(img, 70 + (boxW - w) / 2, top + (boxH - h) / 2, w, h);
        const kx = 800; let ky = top + 24; ctx.fillStyle = "#1d1f20"; ctx.font = "700 22px 'Barlow Condensed', 'Arial Narrow', sans-serif"; ctx.fillText(ph.name, kx, ky); ky += 34;
        const rows = [[t("mTime"), fmtDate(new Date(ph.ts), "dd/MM/yyyy HH:mm:ss")], [t("mCoord"), fmtDec(ph.lat, ph.lng)], [t("mAcc"), ph.acc != null ? `±${Math.round(ph.acc)} m` : "—"], [t("mAlt"), ph.alt != null ? `${ph.alt.toFixed(1)} m` : "—"], [t("mProject"), proj ? projLabel(proj) : t("unsorted")], [t("pdfBy"), ph.author || "—"]];
        for (const [k, v] of rows) { ctx.font = "500 13px 'Barlow Condensed', sans-serif"; ctx.fillStyle = "#7a7a7d"; ctx.fillText(k.toUpperCase(), kx, ky); ky += 18; ctx.font = "500 15px 'JetBrains Mono', monospace"; ctx.fillStyle = "#1d1f20"; ctx.fillText(v, kx, ky); ky += 30; }
        ctx.font = "400 14px system-ui, sans-serif"; ctx.fillStyle = "#424244"; wrapText(ctx, ph.addr || t("noAddr"), 360, 3).forEach((l) => { ctx.fillText(l, kx, ky); ky += 20; });
        if (ph.note) { ky += 8; ctx.font = "600 15px system-ui, sans-serif"; wrapText(ctx, ph.note, 360, 3).forEach((l) => { ctx.fillText(l, kx, ky); ky += 21; }); }
        ctx.fillStyle = "#e0e0e3"; ctx.fillRect(70, top + boxH + 40, PW - 140, 1);
      }
      ctx.font = "500 11px 'JetBrains Mono', monospace"; ctx.fillStyle = "#98989b"; ctx.fillText("Stampfield · time & location stamped photos", 70, PH - 40);
      const jpg = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.85)); pages.push({ buf: new Uint8Array(await jpg.arrayBuffer()), w: PW, h: PH });
    }
    const pdf = buildPDF(pages); const name = `Stampfield_${fmtDate(new Date(), "yyyyMMdd_HHmm").replace(/[: ]/g, "")}.pdf`;
    await shareOrDownload(pdf, name, "application/pdf");
  } finally { busy(false); }
}
function buildPDF(pages) {
  const enc = new TextEncoder(); const parts = []; const offsets = []; let len = 0;
  const push = (s) => { const b = typeof s === "string" ? enc.encode(s) : s; parts.push(b); len += b.length; };
  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  const objs = []; // {id, body(fn)}
  const n = pages.length; const catalogId = 1, pagesId = 2; let nextId = 3; const pageIds = [], imgIds = [], contIds = [];
  for (let i = 0; i < n; i++) { pageIds.push(nextId++); contIds.push(nextId++); imgIds.push(nextId++); }
  const total = nextId - 1; const off = new Array(total + 1);
  const writeObj = (id, head, stream) => { off[id] = len; push(`${id} 0 obj\n${head}`); if (stream) { push("stream\n"); push(stream); push("\nendstream\n"); } push("endobj\n"); };
  writeObj(catalogId, `<< /Type /Catalog /Pages ${pagesId} 0 R >>\n`);
  writeObj(pagesId, `<< /Type /Pages /Kids [${pageIds.map((id) => id + " 0 R").join(" ")}] /Count ${n} >>\n`);
  pages.forEach((p, i) => {
    const pw = 595.28, ph = 841.89;
    writeObj(pageIds[i], `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im${i} ${imgIds[i]} 0 R >> >> /Contents ${contIds[i]} 0 R >>\n`);
    const content = `q ${pw} 0 0 ${ph} 0 0 cm /Im${i} Do Q`;
    writeObj(contIds[i], `<< /Length ${content.length} >>\n`, content);
    writeObj(imgIds[i], `<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.buf.length} >>\n`, p.buf);
  });
  const xref = len; push(`xref\n0 ${total + 1}\n0000000000 65535 f \n`);
  for (let i = 1; i <= total; i++) push(String(off[i]).padStart(10, "0") + " 00000 n \n");
  push(`trailer\n<< /Size ${total + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(parts, { type: "application/pdf" });
}
async function exportZIP(photos) {
  busy(true, t("exporting"));
  try {
    const files = [];
    for (const ph of photos) files.push({ name: `${ph.name}${ph.type === "video" ? ".mp4" : ".jpg"}`, data: new Uint8Array(await ph.blob.arrayBuffer()), ts: ph.ts });
    const csv = ["name,timestamp,lat,lng,accuracy_m,altitude_m,heading_deg,project,address,note,author", ...photos.map((p) => { const pr = R.projects.find((x) => x.id === p.projectId); return [p.name, new Date(p.ts).toISOString(), p.lat ?? "", p.lng ?? "", p.acc != null ? Math.round(p.acc) : "", p.alt != null ? p.alt.toFixed(1) : "", p.heading != null ? Math.round(p.heading) : "", pr ? projLabel(pr) : "", p.addr || "", p.note || "", p.author || ""].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","); })].join("\n");
    files.push({ name: "metadata.csv", data: new TextEncoder().encode("﻿" + csv), ts: Date.now() });
    const zip = buildZip(files); await shareOrDownload(zip, `Stampfield_${fmtDate(new Date(), "yyyyMMdd_HHmm")}.zip`, "application/zip");
  } finally { busy(false); }
}
const CRC_T = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(u8) { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = CRC_T[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function buildZip(files) {
  const enc = new TextEncoder(); const parts = []; const central = []; let offset = 0;
  const dosTime = (ts) => { const d = new Date(ts); return { t: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), d: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate() }; };
  const u16 = (v) => [v & 255, (v >> 8) & 255], u32 = (v) => [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255];
  for (const f of files) {
    const name = enc.encode(f.name), crc = crc32(f.data), { t: tm, d: dt } = dosTime(f.ts);
    const local = new Uint8Array([0x50, 0x4b, 3, 4, ...u16(20), ...u16(0x800), ...u16(0), ...u16(tm), ...u16(dt), ...u32(crc), ...u32(f.data.length), ...u32(f.data.length), ...u16(name.length), ...u16(0), ...name]);
    parts.push(local, f.data);
    central.push(new Uint8Array([0x50, 0x4b, 1, 2, ...u16(20), ...u16(20), ...u16(0x800), ...u16(0), ...u16(tm), ...u16(dt), ...u32(crc), ...u32(f.data.length), ...u32(f.data.length), ...u16(name.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset), ...name]));
    offset += local.length + f.data.length;
  }
  const cdSize = central.reduce((s, c) => s + c.length, 0);
  const end = new Uint8Array([0x50, 0x4b, 5, 6, ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length), ...u32(cdSize), ...u32(offset), ...u16(0)]);
  return new Blob([...parts, ...central, end], { type: "application/zip" });
}
async function shareOrDownload(blob, name, type) {
  const file = new File([blob], name, { type });
  if (canShareFiles() && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: name }); return; } catch (e) { if (e.name === "AbortError") return; } }
  downloadBlob(blob, name); toast(t("exportOk"));
}
async function sharePhotos(photos) {
  const files = photos.map((p) => new File([p.blob], `${p.name}${p.type === "video" ? ".mp4" : ".jpg"}`, { type: p.blob.type || "image/jpeg" }));
  if (canShareFiles() && navigator.canShare({ files })) { try { await navigator.share({ files }); return; } catch (e) { if (e.name === "AbortError") return; } }
  photos.forEach((p, i) => setTimeout(() => downloadBlob(p.blob, `${p.name}.jpg`), i * 300)); toast(t("shareFail"));
}
function blobToImage(blob) { return new Promise((res, rej) => { const u = URL.createObjectURL(blob); const im = new Image(); im.onload = () => { URL.revokeObjectURL(u); res(im); }; im.onerror = rej; im.src = u; }); }
function dataURLtoBlob(u) { const [h, b] = u.split(","); const bin = atob(b); const arr = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i); return new Blob([arr], { type: h.match(/:(.*?);/)[1] }); }

/* ============================================================ onboarding */
function updatePermPills() {
  const set = (el, st) => { el.textContent = t(st); el.className = "state pill " + (st === "granted" ? "tint" : "line"); };
  set($("#perm-cam"), R.camPerm === "granted" ? "granted" : R.camPerm === "denied" ? "denied" : "pending");
  set($("#perm-loc"), R.locPerm === "granted" ? "granted" : R.locPerm === "denied" ? "denied" : "pending");
}
async function onboardCta() {
  await startCamera(); startGeo();
  S.onboarded = true; saveSettings(); show("camera");
}

/* ============================================================ wiring */
function wire() {
  $$("[data-nav]").forEach((b) => b.addEventListener("click", () => show(b.dataset.nav)));
  $("#ob-cta").onclick = onboardCta;
  $("#s-onboard .ob-foot").style.cursor = "pointer"; $("#s-onboard .ob-foot").onclick = showPermHelp;
  $$("#s-onboard .opts button").forEach((b) => b.onclick = () => { $$("#s-onboard .opts button").forEach((x) => x.classList.remove("on")); b.classList.add("on"); });
  // camera
  $("#shutter").onclick = () => { if (S.camMode === "video") toggleRecord(); else if (S.camMode === "burst") captureBurst(); else capturePhoto(false); };
  $("#flip").onclick = flipCamera; $("#btn-flash").onclick = toggleFlash; $("#ratio-btn").onclick = cycleRatio;
  $("#btn-editor").onclick = () => show("editor"); $("#proj-chip").onclick = () => show("projects"); $("#thumb").onclick = () => show("library");
  $$("#modes button").forEach((b) => b.onclick = () => { if (R.recorder) return; S.camMode = b.dataset.mode; saveSettings(); $$("#modes button").forEach((x) => x.classList.toggle("on", x === b)); });
  $("#wm").addEventListener("pointerdown", onWmDown);
  // editor
  $$("#field-list .toggle").forEach((tg) => tg.onclick = () => { R.editorDraft.fields[tg.dataset.field] = !R.editorDraft.fields[tg.dataset.field]; if (tg.dataset.field === "weather" && R.editorDraft.fields.weather) { const s = R.tpl; R.tpl = R.editorDraft; maybeWeather(); R.tpl = s; } renderEditor(); });
  $$("[data-coord]").forEach((b) => b.onclick = () => { S.coordFmt = b.dataset.coord; saveSettings(); renderEditor(); });
  $("#ed-datefmt").onclick = () => optionSheet(t("optDate"), DATE_FMTS.map((f) => ({ v: f, l: fmtDate(new Date(), f) + "  ·  " + f })), S.dateFmt, (v) => { S.dateFmt = v; saveSettings(); renderEditor(); });
  $("#ed-scale").oninput = (e) => { R.editorDraft.scale = parseFloat(e.target.value); renderEditor(); };
  $("#ed-opacity").oninput = (e) => { R.editorDraft.opacity = parseFloat(e.target.value); renderEditor(); };
  $$("#ed-colors button").forEach((b) => b.onclick = () => { R.editorDraft.color = b.dataset.color; renderEditor(); });
  $$("#ed-anchor button").forEach((b) => b.onclick = () => { R.editorDraft.pos = b.dataset.pos; renderEditor(); });
  $("#ed-logo").onchange = async (e) => { const f = e.target.files[0]; if (!f) return; const url = await fileToDataURL(f, 128); R.editorDraft.logo = url; R.editorDraft.fields.logo = true; renderEditor(); e.target.value = ""; };
  $("#ed-save").onclick = edSave;
  // preview
  $("#pv-close").onclick = () => { R.pending = null; show("camera"); };
  $("#pv-retake").onclick = () => { R.pending = null; show("camera"); };
  $("#pv-share").onclick = () => { const r = R.pending || R.photos[0]; if (r) sharePhotos([r]); };
  $("#pv-save").onclick = pvSave;
  // library
  $$("#lib-tabs button").forEach((b) => b.onclick = () => { R.libTab = b.dataset.tab; renderLibrary(); });
  $("#lib-select").onclick = () => { R.libSelect = !R.libSelect; if (!R.libSelect) R.selected.clear(); renderLibrary(); };
  $("#lib-del").onclick = libDelete;
  $("#lib-pdf").onclick = () => exportPDF(R.photos.filter((p) => R.selected.has(p.id)));
  $("#lib-zip").onclick = () => exportZIP(R.photos.filter((p) => R.selected.has(p.id)));
  // detail
  $("#dt-back").onclick = () => show("library");
  $("#dt-share").onclick = () => { const p = R.photos.find((x) => x.id === R.detailId); if (p) sharePhotos([p]); };
  $("#dt-pdf").onclick = () => { const p = R.photos.find((x) => x.id === R.detailId); if (p) exportPDF([p]); };
  $("#dt-del").onclick = () => confirmSheet(t("confirmDel", { n: 1 }), t("confirmDelD"), t("del"), async () => { await deletePhoto(R.detailId); R.detailId = null; toast(t("deleted")); show("library"); });
  // projects
  $("#pr-settings").onclick = () => show("settings");
  // settings
  $("#st-date").onclick = () => optionSheet(t("optDate"), DATE_FMTS.map((f) => ({ v: f, l: fmtDate(new Date(), f) + "  ·  " + f })), S.dateFmt, (v) => { S.dateFmt = v; saveSettings(); renderSettings(); });
  $("#st-coord").onclick = () => optionSheet(t("optCoord"), [{ v: "dms", l: `DMS · ${toDMS(10.759, "N", "S")}` }, { v: "dec", l: "DEC · 10.75900" }], S.coordFmt, (v) => { S.coordFmt = v; saveSettings(); renderSettings(); });
  $("#st-quality").onclick = () => optionSheet(t("optQuality"), [{ v: "1", l: t("qHigh") }, { v: "0.92", l: t("qStd") }, { v: "0.8", l: t("qEco") }], String(S.quality), (v) => { S.quality = parseFloat(v); saveSettings(); renderSettings(); });
  $("#st-autosave").onclick = () => { S.autoSave = !S.autoSave; saveSettings(); renderSettings(); };
  $("#st-cloud").onclick = () => { S.cloud = !S.cloud; saveSettings(); renderSettings(); if (S.cloud) toast(t("cloudSoon")); };
  $("#st-compass").onclick = () => { S.compass = !S.compass; saveSettings(); renderSettings(); if (S.compass) startHeading(true); };
  $("#st-perm").onclick = showPermHelp;
  $("#st-author").onclick = () => { sheet(`<h3>${t("sAuthor")}</h3><div class="field"><label>${t("sAuthor")}</label><input id="f-author" value="${escapeHtml(S.author)}" placeholder="${t("authorPh")}"></div><div class="btns"><button class="b1" id="f-c">${t("cancel")}</button><button class="b2" id="f-o">${t("save")}</button></div>`); $("#f-c").onclick = closeSheet; $("#f-o").onclick = () => { S.author = $("#f-author").value.trim(); saveSettings(); closeSheet(); renderSettings(); }; setTimeout(() => $("#f-author").focus(), 50); };
  $$("#st-mode .row").forEach((b) => b.onclick = () => { S.mode = b.dataset.mode; saveSettings(); applyMode(); renderSettings(); });
  $$("#st-lang .row").forEach((b) => b.onclick = () => setLang(b.dataset.lang));
  $("#st-reset").onclick = () => confirmSheet(t("resetT"), t("resetD"), t("del"), async () => { await dbClear("photos"); await dbClear("projects"); await dbClear("templates"); localStorage.removeItem(SETTINGS_KEY); location.reload(); });
  // sheet veil
  $("#sheet-veil").addEventListener("click", (e) => { if (e.target === $("#sheet-veil")) closeSheet(); });
  // desktop panel
  $$("#desk-panel [data-setmode]").forEach((b) => b.onclick = () => { S.mode = b.dataset.setmode; saveSettings(); applyMode(); syncDesk(); });
  $$("#desk-panel [data-setlang]").forEach((b) => b.onclick = () => setLang(b.dataset.setlang));
  $$("#desk-panel [data-setpos]").forEach((b) => b.onclick = () => { R.tpl.pos = b.dataset.setpos; saveTemplate(); renderWm(); if (R.editorDraft) { R.editorDraft.pos = R.tpl.pos; renderEditor(); } });
  // desktop: scale the phone frame to fit short viewports
  const fit = () => { document.documentElement.style.setProperty("--fit", String(Math.min(1, (innerHeight - 32) / 880, (innerWidth - 32) / 700))); }; fit(); window.addEventListener("resize", fit);
  // clock in the desktop status bar
  const tick = () => { const d = new Date(); $("#sb-time").textContent = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; }; tick(); setInterval(tick, 10000);
  // watermark clock refresh (1 s) on camera
  setInterval(() => { if (R.screen === "camera" && !R.dragging) renderWm(); }, 1000);
  document.addEventListener("visibilitychange", () => { if (document.hidden) { if (R.recorder) stopRecord(); } else if (R.screen === "camera") startCamera(); });
  window.addEventListener("hashchange", () => { const s = location.hash.slice(1); if (SCREENS.includes(s) && s !== R.screen) show(s); });
}
function setLang(l) { S.lang = l; saveSettings(); applyLang(); syncDesk(); renderProjChip(); renderGps(); renderCamBanner(); if (R.screen === "library") renderLibrary(); if (R.screen === "settings") renderSettings(); if (R.screen === "projects") renderProjects(); if (R.screen === "editor") renderEditor(); if (R.screen === "detail") renderDetail(); renderWm(); }
function syncDesk() { $$("#desk-panel [data-setmode]").forEach((b) => b.classList.toggle("on", b.dataset.setmode === S.mode)); $$("#desk-panel [data-setlang]").forEach((b) => b.classList.toggle("on", b.dataset.setlang === S.lang)); }
function fileToDataURL(file, max) {
  return new Promise((res) => { const im = new Image(); const u = URL.createObjectURL(file); im.onload = () => { const s = Math.min(1, max / Math.max(im.width, im.height)); const c = document.createElement("canvas"); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); res(c.toDataURL("image/png")); }; im.src = u; });
}

/* ============================================================ boot */
async function boot() {
  loadSettings(); applyMode();
  db = await openDB();
  R.projects = await dbAll("projects");
  if (!R.projects.length) {
    R.projects = [
      { id: "pj-phumy", name: "Cảng tổng hợp Phú Mỹ", item: "Cầu tàu B2", created: Date.now(), updated: Date.now() },
      { id: "pj-soairap", name: "Khảo sát luồng Soài Rạp", item: "", created: Date.now(), updated: Date.now() - 5 * 864e5 },
      { id: "pj-catlo", name: "Bến CL Cát Lở – GĐ2", item: "", created: Date.now(), updated: Date.now() - 15 * 864e5 }
    ];
    for (const p of R.projects) await dbPut("projects", p);
  }
  if (!S.activeProjectId || !R.projects.find((p) => p.id === S.activeProjectId)) S.activeProjectId = [...R.projects].sort((a, b) => (b.updated || 0) - (a.updated || 0))[0].id;
  R.templates = await dbAll("templates");
  if (!R.templates.length) { const d = DEFAULT_TEMPLATE(); const k = { ...DEFAULT_TEMPLATE(), id: "tpl-khaosat", name: "Khảo sát", fields: { ...d.fields, addr: false, alt: true, qr: false } }; R.templates = [d, k]; await dbPut("templates", d); await dbPut("templates", k); }
  R.tpl = R.templates.find((x) => x.id === S.templateId) || R.templates[0];
  R.photos = (await dbAll("photos")).sort((a, b) => b.ts - a.ts);
  applyLang(); wire(); syncDesk(); renderProjChip(); renderThumb(); renderGps();
  $("#ratio-btn").textContent = S.ratio; $("#btn-flash").classList.toggle("flash-on", S.flash);
  $$("#modes button").forEach((x) => x.classList.toggle("on", x.dataset.mode === S.camMode));
  updatePermPills(); checkStorage();
  const h = location.hash.slice(1);
  if (!S.onboarded) show("onboard");
  else { startGeo(); startHeading(false); show(SCREENS.includes(h) && h !== "onboard" ? h : "camera"); }
  // iOS: compass permission can only be requested inside a tap — do it on the first tap if the user enabled it
  document.addEventListener("pointerdown", () => startHeading(true), { once: true, capture: true });
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
}
boot();
})();
