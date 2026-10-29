/**
 * ═══════════════════════════════════════════════════════════
 *  TEMPLATES.JS — Bộ render: config → HTML
 *  Giao diện "Thiệp Mời": mỗi phần là một tấm thiệp giấy in nổi (.card),
 *  xếp chồng lên nhau khi cuộn. Hero là phong bì mở nắp, Video + Gallery gộp thành "Album".
 * ═══════════════════════════════════════════════════════════
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Thư mục gốc của dự án (để kiểm tra file ảnh có thật hay không)
const ROOT = fileURLToPath(new URL("..", import.meta.url));

// ─── ICONS (SVG inline) ─────────────────────────────────
const ICONS = {
  wedding: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="14" r="5.5"/><circle cx="15" cy="14" r="5.5"/><path d="M10.5 4.5 12 3l1.5 1.5L12 6z"/></svg>`,
  corporate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="1.5"/><path d="M8.5 7V5a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 5v2M3 12.5h18"/></svg>`,
  event: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="2.5"/></svg>`,
  ceremony: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V9l8-5 8 5v12M9 21v-6h6v6M3 21h18"/></svg>`,
  award: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7"/></svg>`,
  bilingual: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="1.5"/><path d="m3 6 9 7 9-7"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  zalo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor"><path d="M12.5 6C9.46 6 7 8.46 7 11.5v25C7 39.54 9.46 42 12.5 42h23c3.04 0 5.5-2.46 5.5-5.5v-25C41 8.46 38.54 6 35.5 6h-23zm2.14 11h18.72c.87 0 1.34 1.01.78 1.67L22.97 31.5h8.87c.74 0 1.16.83.71 1.39-.15.18-.37.29-.61.29H13.36c-.87 0-1.34-1.01-.78-1.67L23.75 18.7h-9.1a.82.82 0 0 1-.72-.43.81.81 0 0 1 .71-1.27z"/></svg>`,
  play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18 9 12l6-6"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  arrowUp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
  arrowDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  location: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.8"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 6.5V12l3.5 2"/></svg>`,
  send: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>`,
  scissors: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/></svg>`,
  image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="1.5"/><circle cx="9" cy="10" r="1.8"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>`,
  // Hoa văn ngăn cách kiểu thiệp in
  ornament: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 20" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"><path d="M4 10h48M108 10h48"/><path d="M52 10c6 0 9-6 15-6 4 0 6 3 6 6s-2 5-4 5-3-2-2-3.5M108 10c-6 0-9-6-15-6-4 0-6 3-6 6s2 5 4 5 3-2 2-3.5"/><path d="M80 4.5 85 10l-5 5.5-5-5.5z" fill="currentColor" stroke="none"/></svg>`,
};

// ─── TIỆN ÍCH ──────────────────────────────────────────

/** Escape HTML để chống XSS */
export function esc(str) {
  if (typeof str !== "string") return String(str ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Kiểm tra giá trị có phải placeholder [IN_HOA] không */
export function isPlaceholder(val) {
  if (typeof val !== "string") return false;
  return /\[[A-Z0-9_]+\]/.test(val);
}

/** Trả SVG icon inline (trang trí → aria-hidden) */
export function icon(name, cls = "") {
  const svg = ICONS[name];
  if (!svg) return `<!-- icon "${name}" không tìm thấy -->`;
  const clsAttr = cls ? ` class="${esc(cls)}"` : "";
  return svg.replace("<svg ", `<svg${clsAttr} aria-hidden="true" focusable="false" `);
}

/**
 * Tạo thẻ ảnh: <picture> khi có ảnh mobile riêng, lazy-load, width/height, alt.
 * Ảnh lỗi sẽ tự ẩn (onerror) để lộ khung thay thế .ph ngay sau nó.
 */
export function media({ src, alt = "", cls = "", width, height, lazy = true, priority = false, mobileSrc, mobileWidth, mobileHeight }) {
  const loadAttr = priority ? ` fetchpriority="high"` : lazy ? ` loading="lazy"` : "";
  const imgCls = cls ? ` class="${esc(cls)}"` : "";
  const size = (w, h) => `${w ? ` width="${w}"` : ""}${h ? ` height="${h}"` : ""}`;
  const img = `<img src="${esc(src)}" alt="${esc(alt)}"${imgCls}${size(width, height)}${loadAttr} decoding="async" onerror="this.hidden=true">`;

  if (!mobileSrc) return img;
  return `<picture class="contents">
  <source media="(max-width: 767px)" srcset="${esc(mobileSrc)}"${size(mobileWidth, mobileHeight)}>
  ${img}
</picture>`;
}

/** File (đường dẫn dạng public/...) có thật trong dự án không. Link http(s) coi như có. */
function fileExists(src) {
  if (!src || typeof src !== "string") return false;
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return true;
  try {
    return existsSync(join(ROOT, src));
  } catch {
    return false;
  }
}

/** Bản ảnh cho điện thoại cùng tên, thêm đuôi -m: service-01.webp → service-01-m.webp */
function mobileVariant(src) {
  return typeof src === "string" ? src.replace(/(\.[a-z0-9]+)$/i, "-m$1") : "";
}

/**
 * Đọc kích thước thật của ảnh (WebP / JPEG / PNG) lúc build, để khung ảnh đúng tỉ lệ.
 * Không đọc được → null (dùng tỉ lệ mặc định).
 */
function imageSize(src) {
  if (!src || /^(https?:)?\/\//.test(src) || !fileExists(src)) return null;
  try {
    const b = readFileSync(join(ROOT, src));
    // PNG
    if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    // WebP
    if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
      const chunk = b.toString("ascii", 12, 16);
      if (chunk === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
      if (chunk === "VP8L") {
        const bits = b.readUInt32LE(21);
        return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
      }
      if (chunk === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    }
    // JPEG: tìm khối SOF chứa kích thước
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const marker = b[i + 1];
        const len = b.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
        }
        i += 2 + len;
      }
    }
  } catch {
    /* bỏ qua — dùng tỉ lệ mặc định */
  }
  return null;
}

/**
 * Khung thay thế khi chưa có ảnh: nền giấy kẻ chéo + hoa văn + nhãn.
 * `missing` = đường dẫn ảnh chưa có → khung hiện luôn, và build vẫn liệt kê được file thiếu.
 */
function placeholder(label, cls = "", missing = "", iconName = "image") {
  const on = missing ? " ph--on" : "";
  const data = missing ? ` data-missing="${esc(missing)}"` : "";
  return `<span class="ph ${cls}${on}"${data} aria-hidden="true">${icon(iconName, "ph__icon")}${label ? `<span class="ph__label">${esc(label)}</span>` : ""}</span>`;
}

/**
 * Ảnh + khung thay thế: chỉ chèn <img> khi file thật sự tồn tại (tránh lỗi 404).
 * Không khai báo mobileSrc mà có sẵn file "-m" bên cạnh → điện thoại tự dùng bản nhẹ đó.
 */
function pic(opts, label = "", phCls = "", iconName = "image") {
  if (opts.mobileSrc === undefined && fileExists(mobileVariant(opts.src))) {
    opts = { ...opts, mobileSrc: mobileVariant(opts.src) };
  }
  const hasMain = fileExists(opts.src);
  const hasMobile = fileExists(opts.mobileSrc);
  if (!hasMain && !hasMobile) {
    return placeholder(label, phCls, [opts.src, opts.mobileSrc].filter(Boolean).join(" "), iconName);
  }
  const src = hasMain ? opts.src : opts.mobileSrc;
  const mobileSrc = hasMain && hasMobile && opts.mobileSrc !== opts.src ? opts.mobileSrc : "";
  return media({ ...opts, src, mobileSrc }) + placeholder(label, phCls, "", iconName);
}

/** Thuộc tính href (+ target/rel nếu là link ngoài) */
function linkAttrs(href) {
  const external = /^https?:\/\//.test(href);
  return `href="${esc(href)}"${external ? ` target="_blank" rel="noopener noreferrer"` : ""}`;
}

/** Xuống dòng \n trong config → <br> */
function lines(text) {
  return esc(text || "").replace(/\n/g, "<br>");
}

/** Số mục hiện sẵn trên điện thoại (mobileVisible), mặc định `fallback` */
function visibleCount(n, fallback) {
  const v = Number(n);
  return Number.isFinite(v) && v >= 1 ? Math.floor(v) : fallback;
}

/** Số La Mã cho thực đơn dịch vụ: 1 → I, 4 → IV */
function roman(n) {
  const map = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let out = "";
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out;
}

/** Chữ lồng (monogram) cho con dấu sáp: "Nguyễn Minh Tuấn" → "NT"; còn placeholder → "MC" */
function monogram(name) {
  if (!name || isPlaceholder(name)) return "MC";
  const words = name.trim().split(/\s+/);
  const first = words[0].charAt(0);
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

/**
 * Con dấu sáp (SVG): viền lượn sóng như sáp chảy, vòng ép bên trong, chữ hoặc icon ở giữa.
 * `inner` là chữ (monogram) hoặc tên icon (khi `asIcon` = true).
 */
function seal(inner, cls = "", asIcon = false) {
  const points = [];
  const n = 15;
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n;
    const r = i % 2 ? 29.2 : 31.6;
    points.push(`${(32 + r * Math.cos(a)).toFixed(2)},${(32 + r * Math.sin(a)).toFixed(2)}`);
  }
  // Icon ở giữa: giữ thuộc tính fill/stroke của thẻ <svg> gốc, đặt lên <g> (24 đơn vị, zalo 48 → thu nửa)
  const src = ICONS[inner] || "";
  const rootAttrs = (src.match(/^<svg([^>]*)>/)?.[1] || "").replace(/\s(xmlns|viewBox)="[^"]*"/g, "");
  const center = asIcon
    ? `<g transform="translate(20 20) scale(${/viewBox="0 0 48/.test(src) ? 0.5 : 1})" color="#F2EFE6"${rootAttrs}>${src.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g>`
    : `<text x="32" y="38.5" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="17" font-weight="600" fill="#F2EFE6" letter-spacing=".5">${esc(inner)}</text>`;
  return `<svg class="${esc(cls)}" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><polygon points="${points.join(" ")}" fill="#8E3B2A" stroke="#8E3B2A" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="32" r="22.5" fill="none" stroke="#6E2A1C" stroke-width="2"/><circle cx="32" cy="32" r="20" fill="none" stroke="#B4614A" stroke-width=".8" opacity=".7"/><ellipse cx="24" cy="20" rx="9" ry="4.5" fill="#fff" opacity=".12" transform="rotate(-28 24 20)"/>${center}</svg>`;
}

/** Hoa văn ngăn cách */
function ornament(cls = "") {
  return `<span class="ornament ${cls}" aria-hidden="true">${icon("ornament")}</span>`;
}

// ─── HELPERS ────────────────────────────────────────────

/** Tạo các link tel/zalo/mailto/mạng xã hội — nếu còn placeholder thì trỏ về #contact */
export function createHelpers(config) {
  const c = config.contact || {};

  function safeLink(value, prefix = "") {
    if (!value || isPlaceholder(value)) return "#contact";
    if (prefix === "tel:") return `tel:${value.replace(/[^\d+]/g, "")}`;
    if (prefix === "mailto:") return `mailto:${value}`;
    if (prefix === "zalo:") return /^https?:\/\//.test(value) ? value : `https://zalo.me/${value.replace(/[^\d]/g, "")}`;
    return value;
  }

  const hasPhone = c.phone && !isPlaceholder(c.phone);
  const hasEmail = c.email && !isPlaceholder(c.email);

  return {
    phoneLink: safeLink(c.phone, "tel:"),
    phoneDisplay: hasPhone ? c.phone : "Đang cập nhật",
    hasPhone,
    zaloLink: safeLink(c.zalo, "zalo:"),
    emailLink: safeLink(c.email, "mailto:"),
    emailDisplay: hasEmail ? c.email : "Đang cập nhật",
    emailRaw: hasEmail ? c.email : "",
    facebookLink: safeLink(c.facebook),
    youtubeLink: safeLink(c.youtube),
    ctaLink: safeLink(config.header?.ctaButton?.href || c.zalo, "zalo:"),
    heroCtaLink: safeLink(config.hero?.ctaPrimary?.href || c.zalo, "zalo:"),
    floatingLink: safeLink(config.floatingButton?.href || c.zalo, "zalo:"),
  };
}

// ─── RENDERERS ──────────────────────────────────────────

export function createRenderers(config) {
  const h = createHelpers(config);
  const ui = {
    showMore: "Xem thêm",
    showLess: "Thu gọn",
    skipLink: "Bỏ qua đến nội dung chính",
    closeLabel: "Đóng",
    prevLabel: "Ảnh trước",
    nextLabel: "Ảnh sau",
    videoMissing: "Video đang được cập nhật — liên hệ để xem trọn bộ showreel.",
    ...(config.ui || {}),
  };
  const brandName = config.brand?.name || "";

  /** Đầu mỗi tấm thiệp: nhãn nhỏ, tiêu đề in nổi, hoa văn, lời dẫn */
  function cardHead(sec, fallbackLabel, id, fallbackHeading = "") {
    return `<header class="card-head reveal">
          <p class="eyebrow">${esc(sec.sectionLabel || fallbackLabel)}</p>
          <h2 id="${id}-title" class="title">${lines(sec.heading || fallbackHeading)}</h2>
          ${ornament()}
          ${sec.subheading ? `<p class="lede">${esc(sec.subheading)}</p>` : ""}
        </header>`;
  }

  /** Nút "Xem thêm (N)" cho danh sách thu gọn trên điện thoại (ẩn khi không có JS và từ 1024px) */
  function moreButton(listId, extra) {
    if (extra <= 0) return "";
    const more = `${ui.showMore} (${extra})`;
    return `<button type="button" class="more" data-more aria-controls="${listId}" aria-expanded="false" data-label-more="${esc(more)}" data-label-less="${esc(ui.showLess)}">
            <span data-more-text>${esc(more)}</span>${icon("arrowDown", "more__icon")}
          </button>`;
  }

  /** Thuộc tính mở video: chưa có link → hộp thoại báo "đang cập nhật" thay vì phát rỗng */
  function videoAttrs(url, title) {
    const data = url && !isPlaceholder(url) ? `data-video="${esc(url)}"` : `data-video-missing`;
    return `${data} data-title="${esc(title || "")}" aria-haspopup="dialog" aria-controls="player"`;
  }

  return {
    // ─── SEO HEAD ─────────────────────────────────────
    seoHead() {
      const seo = config.seo || {};
      const siteUrl = seo.url && !isPlaceholder(seo.url) ? seo.url.replace(/\/?$/, "/") : "";
      // og:image cần URL tuyệt đối — chỉ ghép được khi đã có seo.url
      const ogImage = siteUrl ? siteUrl + (seo.ogImage || "") : seo.ogImage || "";
      return `<title>${esc(seo.title || "MC Portfolio")}</title>
    <meta name="description" content="${esc(seo.description || "")}">
    <meta name="keywords" content="${esc(seo.keywords || "")}">
    ${siteUrl ? `<link rel="canonical" href="${esc(siteUrl)}">\n    <meta property="og:url" content="${esc(siteUrl)}">` : ""}
    <meta property="og:type" content="website">
    <meta property="og:locale" content="${esc(seo.locale || "vi_VN")}">
    <meta property="og:site_name" content="${esc(brandName)}">
    <meta property="og:title" content="${esc(seo.title || "")}">
    <meta property="og:description" content="${esc(seo.description || "")}">
    <meta property="og:image" content="${esc(ogImage)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${esc(seo.ogImageAlt || "")}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(seo.title || "")}">
    <meta name="twitter:description" content="${esc(seo.description || "")}">
    <meta name="twitter:image" content="${esc(ogImage)}">
    <meta name="theme-color" content="${esc(seo.themeColor || "#22352A")}">
    <link rel="icon" type="image/svg+xml" href="public/icons/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="public/icons/favicon-32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="public/icons/apple-touch-icon.png">`;
    },

    // ─── CHỮ NHÃN TRỢ NĂNG ────────────────────────────
    skipLink() {
      return esc(ui.skipLink);
    },

    // ─── ĐẦU TRANG (không menu: logo + tên + nút đặt lịch) ──
    masthead() {
      const cta = config.header?.ctaButton || {};
      return `<header class="masthead">
    <a href="#hero" class="masthead__brand">
      ${seal(monogram(brandName), "masthead__seal")}
      <span class="masthead__name">${esc(brandName)}</span>
    </a>
    <a ${linkAttrs(h.ctaLink)} class="masthead__cta">${esc(cta.label || "Đặt lịch")}</a>
  </header>`;
    },

    // ─── HERO: PHONG BÌ + THIỆP MỜI ──────────────────
    heroSection() {
      const hero = config.hero || {};
      const img = hero.image || {};
      const pos = hero.imagePosition || {};
      const desktop = img.desktop || hero.backgroundDesktop || "";
      const mobile = img.mobile || hero.backgroundMobile || "";
      const posStyle = `--pos-m:${esc(pos.mobile || "50% 25%")};--pos-d:${esc(pos.desktop || pos.mobile || "50% 25%")}`;

      return `<section id="hero" class="card card--hero" aria-labelledby="hero-title">
      <div class="envelope">
        <span class="envelope__back" aria-hidden="true"></span>
        <span class="envelope__flap" aria-hidden="true"></span>

        <div class="invite">
          <p class="invite__eyebrow">${esc(hero.invitation ?? "Trân trọng kính mời")}</p>
          <figure class="arch" style="${posStyle}">
            ${pic(
              {
                src: desktop,
                mobileSrc: mobile && mobile !== desktop ? mobile : undefined,
                alt: hero.backgroundAlt || brandName,
                cls: "arch__img",
                width: 900,
                height: 1200,
                mobileWidth: 600,
                mobileHeight: 750,
                lazy: false,
                priority: true,
              },
              "Ảnh MC",
              "arch__ph"
            )}
          </figure>
          <div class="invite__text">
            <p class="invite__name">${esc(brandName)}</p>
            <p class="invite__role">${esc(config.brand?.tagline || "")}</p>
            <h1 id="hero-title" class="invite__title">${lines(hero.heading)}</h1>
            ${hero.availability ? `<p class="invite__date">${esc(hero.availability)}</p>` : ""}
          </div>
        </div>

        <div class="envelope__pocket">
          <div class="hero-cta">
            <a ${linkAttrs(h.heroCtaLink)} class="btn btn--moss" data-hero-cta>
              ${icon("zalo", "btn__icon")}<span>${esc(hero.ctaPrimary?.label || "Đặt lịch")}</span>
            </a>
            <a href="${esc(hero.ctaSecondary?.href || "#videos")}" class="btn btn--line">
              ${icon("play", "btn__icon")}<span>${esc(hero.ctaSecondary?.label || "Xem video")}</span>
            </a>
          </div>
          ${hero.subheading ? `<p class="hero-sub">${esc(hero.subheading)}</p>` : ""}
        </div>
      </div>
      ${hero.scrollIndicator ? `<p class="hero-hint" aria-hidden="true">Mở thiệp ${icon("arrowDown", "hero-hint__icon")}</p>` : ""}
    </section>`;
    },

    // ─── GIỚI THIỆU: LÁ THƯ NGỎ ──────────────────────
    aboutSection() {
      const about = config.about || {};
      const paragraphs = (about.story || "")
        .split(/\n\s*\n/)
        .filter((p) => p.trim())
        .map((p) => `<p>${lines(p.trim())}</p>`)
        .join("\n              ");
      // Có tóm tắt → câu chuyện đầy đủ thu gọn trên điện thoại; không có → hiện luôn
      const collapsible = Boolean(about.summary && paragraphs);

      const stats = (about.stats || [])
        .map(
          (s) => `<div class="details__item">
              <dt class="details__label">${esc(s.label)}</dt>
              <dd class="details__num${isPlaceholder(s.number) ? " details__num--ph" : ""}">${esc(s.number)}</dd>
            </div>`
        )
        .join("\n            ");

      return `<section id="about" class="card" aria-labelledby="about-title">
      <div class="letter">
        ${cardHead(about, "Về Tôi", "about")}
        <figure class="oval reveal">
          ${pic(
            {
              src: about.portrait || "",
              mobileSrc: about.portraitMobile || undefined,
              alt: about.portraitAlt || "Ảnh chân dung",
              cls: "oval__img",
              width: 600,
              height: 800,
              mobileWidth: 400,
              mobileHeight: 500,
            },
            "Chân dung",
            "oval__ph"
          )}
        </figure>
        <div class="letter__body reveal">
          ${about.greeting !== "" ? `<p class="letter__greeting">${esc(about.greeting || "Thân gửi bạn,")}</p>` : ""}
          ${about.summary ? `<p class="letter__summary">${esc(about.summary)}</p>` : ""}
          ${paragraphs ? `<div id="about-story" class="letter__story${collapsible ? " is-collapsible" : ""}">
              ${paragraphs}
          </div>` : ""}
          ${collapsible ? `<button type="button" class="more more--text" data-more aria-controls="about-story" aria-expanded="false" data-label-more="${esc(about.storyToggleLabel || "Đọc tiếp")}" data-label-less="${esc(ui.showLess)}">
            <span data-more-text>${esc(about.storyToggleLabel || "Đọc tiếp")}</span>${icon("arrowDown", "more__icon")}
          </button>` : ""}
          <p class="letter__sign"><span class="sr-only">Ký tên: </span>${esc(brandName)}</p>
        </div>
        ${stats ? `<dl class="details reveal">
            ${stats}
        </dl>` : ""}
      </div>
    </section>`;
    },

    // ─── DỊCH VỤ: THỰC ĐƠN ───────────────────────────
    servicesSection() {
      const svc = config.services || {};
      const items = svc.items || [];
      if (!items.length) return "";
      const shown = visibleCount(svc.mobileVisible, 3);

      const list = items
        .map(
          (item, i) => `<li class="dish reveal${i >= shown ? " is-extra" : ""}">
            <figure class="dish__img">
              ${pic({ src: item.image || "", alt: item.imageAlt || item.title || "", cls: "dish__photo", width: 640, height: 640 }, "", "dish__ph", item.icon || "event")}
            </figure>
            <div class="dish__text">
              <p class="dish__no" aria-hidden="true">${roman(i + 1)}</p>
              <h3 class="dish__title">${esc(item.title)}</h3>
              <p class="dish__desc">${esc(item.description)}</p>
            </div>
          </li>`
        )
        .join("\n          ");

      return `<section id="services" class="card" aria-labelledby="services-title">
      ${cardHead(svc, "Dịch Vụ", "services")}
      <ol id="services-list" class="menu" data-collapsible>
          ${list}
      </ol>
      ${moreButton("services-list", items.length - shown)}
      <p class="menu__foot reveal"><a href="#contact" class="link-ink">Hỏi lịch &amp; nhận báo giá ${icon("arrowRight", "link-ink__icon")}</a></p>
    </section>`;
    },

    // ─── ALBUM: VIDEO + GALLERY GỘP MỘT TẤM THIỆP ────
    albumSection() {
      const album = config.album || {};
      const vid = config.videos || {};
      const gal = config.gallery || {};
      const featured = vid.featured || {};
      const vItems = vid.items || [];
      const gItems = gal.items || [];
      const hasFeatured = Boolean(featured.title || featured.thumbnail || featured.videoUrl);
      if (!hasFeatured && !vItems.length && !gItems.length) return "";

      // ── Phần video
      const vShown = visibleCount(vid.mobileVisible, 4);
      const films = vItems
        .map(
          (v, i) => `<li class="film reveal${i >= vShown ? " is-extra" : ""}">
              <button type="button" class="film__btn" ${videoAttrs(v.videoUrl, v.title)}>
                <span class="mat mat--film">
                  ${pic({ src: v.thumbnail || "", alt: "", cls: "mat__img", width: 640, height: 360 }, "", "mat__ph", "play")}
                  <span class="film__play">${icon("play", "film__play-icon")}</span>
                </span>
                <span class="film__title">${esc(v.title)}</span>
                ${v.duration ? `<span class="film__time"><span class="sr-only">Thời lượng </span>${esc(v.duration)}</span>` : ""}
              </button>
            </li>`
        )
        .join("\n            ");

      const videoPart = hasFeatured || vItems.length
        ? `<div id="videos" class="album-part" tabindex="-1">
          <div class="part-head reveal">
            <p class="part-head__label">${esc(vid.sectionLabel || "Video")}</p>
            <h3 class="part-head__title">${lines(vid.heading || "Video")}</h3>
            ${vid.subheading ? `<p class="part-head__sub">${esc(vid.subheading)}</p>` : ""}
          </div>
          ${hasFeatured ? `<div class="reel reveal">
            <button type="button" class="reel__btn" ${videoAttrs(featured.videoUrl, featured.title)}>
              <span class="mat mat--reel">
                ${pic({ src: featured.thumbnail || "", alt: "", cls: "mat__img", width: 1280, height: 720 }, "Showreel", "mat__ph", "play")}
                <span class="corners" aria-hidden="true"></span>
                ${seal("play", "reel__seal", true)}
              </span>
              <span class="reel__cap"><span class="reel__title">${esc(featured.title || "Showreel")}</span>${featured.duration ? ` <span class="reel__time">· ${esc(featured.duration)}</span>` : ""}</span>
            </button>
          </div>` : ""}
          ${films ? `<ul id="videos-list" class="films" data-collapsible>
            ${films}
          </ul>
          ${moreButton("videos-list", vItems.length - vShown)}` : ""}
        </div>`
        : "";

      // ── Phần ảnh: nút lọc chỉ hiện các loại có ảnh
      const gShown = visibleCount(gal.mobileVisible, 4);
      const used = new Set(gItems.map((g) => g.category).filter(Boolean));
      const cats = (gal.categories || []).filter((c, i) => i === 0 || used.has(c));
      const filters =
        cats.length > 2
          ? `<div class="filters reveal" role="group" aria-label="Lọc ảnh theo loại sự kiện">
            ${cats
              .map(
                (cat, i) =>
                  `<button type="button" class="filters__btn" data-filter="${i === 0 ? "*" : esc(cat)}" aria-pressed="${i === 0}" aria-controls="gallery-list">${esc(cat)}</button>`
              )
              .join("\n            ")}
          </div>`
          : "";

      const photos = gItems
        .map((g, i) => {
          const size = imageSize(g.src) || { w: 4, h: 3 };
          const mSrc = fileExists(mobileVariant(g.src)) ? mobileVariant(g.src) : "";
          return `<li class="photo reveal${i >= gShown ? " is-extra" : ""}" data-category="${esc(g.category || "")}">
              <button type="button" class="photo__btn" data-lightbox="${esc(g.src || "")}"${mSrc ? ` data-lightbox-m="${esc(mSrc)}"` : ""} data-alt="${esc(g.alt || "")}" aria-haspopup="dialog" aria-controls="lightbox" aria-label="Phóng to ảnh: ${esc(g.alt || g.category || "ảnh sự kiện")}">
                <span class="mat mat--photo" style="aspect-ratio:${size.w} / ${size.h}">
                  ${pic({ src: g.src || "", alt: g.alt || "", cls: "mat__img", width: size.w > 4 ? size.w : 1200, height: size.h > 3 ? size.h : 900 }, g.category || "Ảnh", "mat__ph")}
                  <span class="corners" aria-hidden="true"></span>
                </span>
              </button>
            </li>`;
        })
        .join("\n            ");

      const galleryPart = gItems.length
        ? `<div id="gallery" class="album-part" tabindex="-1">
          <div class="part-head reveal">
            <p class="part-head__label">${esc(gal.sectionLabel || "Hình Ảnh")}</p>
            <h3 class="part-head__title">${lines(gal.heading || "Hình ảnh")}</h3>
            ${gal.subheading ? `<p class="part-head__sub">${esc(gal.subheading)}</p>` : ""}
          </div>
          ${filters}
          <ul id="gallery-list" class="photos" data-collapsible>
            ${photos}
          </ul>
          ${moreButton("gallery-list", gItems.length - gShown)}
        </div>`
        : "";

      return `<section id="album" class="card card--album" aria-labelledby="album-title">
      ${cardHead(album, "Album", "album", "Thước Phim & Ảnh Lưu Niệm")}
      ${videoPart}
      ${videoPart && galleryPart ? ornament("ornament--wide") : ""}
      ${galleryPart}
    </section>`;
    },

    // ─── ĐỐI TÁC: DANH SÁCH KHÁCH MỜI ────────────────
    partnersSection() {
      const par = config.partners || {};
      const items = par.items || [];
      if (!items.length) return "";

      const guests = items
        .map((p) =>
          fileExists(p.logo)
            ? `<li class="guests__item guests__item--logo">${media({ src: p.logo, alt: p.name || "Đối tác", cls: "guests__logo", width: 200, height: 80 })}</li>`
            : `<li class="guests__item"><span class="guests__name" data-missing="${esc(p.logo || "")}">${esc(p.name)}</span></li>`
        )
        .join("\n          ");

      return `<section id="partners" class="card card--short" aria-labelledby="partners-title">
      <header class="card-head reveal">
        <p class="eyebrow">${esc(par.sectionLabel || "Đối Tác")}</p>
        <h2 id="partners-title" class="title title--sm">${esc(par.heading || "Tin Tưởng Bởi")}</h2>
      </header>
      <ul class="guests reveal">
          ${guests}
      </ul>
    </section>`;
    },

    // ─── CẢM NHẬN: SỔ LƯU BÚT ────────────────────────
    testimonialsSection() {
      const test = config.testimonials || {};
      const items = test.items || [];
      if (!items.length) return "";
      const shown = visibleCount(test.mobileVisible, 2);

      const entries = items
        .map((t, i) => {
          const rating = Math.max(0, Math.min(5, Number(t.rating) || 5));
          const stars = Array.from({ length: rating }, () => icon("star", "entry__star")).join("");
          // Chữ ký: bỏ danh xưng "Anh/Chị/Cô/Chú…" ở đầu tên
          const sign = (t.name || "").replace(/^(anh|chị|cô|chú|bác|bạn|ông|bà|em)\s+/i, "");
          const initial = (t.name || "?").trim().split(/\s+/).pop().charAt(0);
          return `<figure class="entry reveal${i >= shown ? " is-extra" : ""}">
            <blockquote class="entry__quote"><p>“${esc(t.content || "")}”</p></blockquote>
            <figcaption class="entry__by">
              <span class="entry__avatar">
                ${fileExists(t.avatar) ? media({ src: t.avatar, alt: "", cls: "entry__avatar-img", width: 100, height: 100 }) : `<span class="entry__initial" data-missing="${esc(t.avatar || "")}" aria-hidden="true">${esc(initial)}</span>`}
              </span>
              <span class="entry__who">
                <span class="entry__sign" aria-hidden="true">${esc(sign)}</span>
                <span class="entry__name">${esc(t.name || "")}</span>
                <span class="entry__role">${esc(t.role || "")}</span>
                <span class="entry__rating" role="img" aria-label="${rating} trên 5 sao">${stars}</span>
              </span>
            </figcaption>
          </figure>`;
        })
        .join("\n          ");

      return `<section id="testimonials" class="card card--blush" aria-labelledby="testimonials-title">
      ${cardHead(test, "Cảm Nhận", "testimonials")}
      <div id="testimonials-list" class="guestbook" data-collapsible>
          ${entries}
      </div>
      ${moreButton("testimonials-list", items.length - shown)}
    </section>`;
    },

    // ─── HỎI ĐÁP: ĐIỀU CẦN BIẾT ──────────────────────
    faqSection() {
      const faq = config.faq || {};
      const items = faq.items || [];
      if (!items.length) return "";
      const shown = visibleCount(faq.mobileVisible, 3);

      const notes = items
        .map(
          (q, i) => `<div class="note reveal${i >= shown ? " is-extra" : ""}">
            <dt class="note__q"><span class="note__no" aria-hidden="true">${roman(i + 1).toLowerCase()}.</span> ${esc(q.question)}</dt>
            <dd class="note__a">${esc(q.answer)}</dd>
          </div>`
        )
        .join("\n          ");

      return `<section id="faq" class="card card--warm" aria-labelledby="faq-title">
      <header class="card-head reveal">
        <p class="eyebrow">${esc(faq.sectionLabel || "Hỏi Đáp")}</p>
        <h2 id="faq-title" class="title">${lines(faq.heading || "Câu Hỏi Thường Gặp")}</h2>
        ${ornament()}
      </header>
      <dl id="faq-list" class="notes" data-collapsible>
          ${notes}
      </dl>
      ${moreButton("faq-list", items.length - shown)}
      ${faq.subheading ? `<p class="notes__end reveal">${esc(faq.subheading)} <a ${linkAttrs(h.zaloLink)} class="link-ink">Nhắn Zalo ${icon("arrowRight", "link-ink__icon")}</a></p>` : ""}
    </section>`;
    },

    // ─── LIÊN HỆ: PHIẾU HỒI ÂM ───────────────────────
    contactSection() {
      const c = config.contact || {};
      const form = c.form || {};

      const line = (href, iconName, label, value) => {
        const inner = `${icon(iconName, "rsvp-line__icon")}<span class="rsvp-line__label">${esc(label)}</span><span class="rsvp-line__value">${esc(value)}</span>`;
        return href
          ? `<li><a ${linkAttrs(href)} class="rsvp-line rsvp-line--link">${inner}</a></li>`
          : `<li><span class="rsvp-line">${inner}</span></li>`;
      };

      const types = (form.eventTypes || [])
        .map(
          (t, i) => `<label class="tick">
                <input type="radio" name="eventType" value="${esc(t)}" class="tick__input"${i === 0 ? " checked" : ""}>
                <span class="tick__box" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 13.5 9.5 19 21 4.5"/></svg></span>
                <span class="tick__label">${esc(t)}</span>
              </label>`
        )
        .join("\n              ");

      return `<section id="contact" class="card card--rsvp" aria-labelledby="contact-title">
      <p class="tear" aria-hidden="true">${icon("scissors", "tear__icon")}<span class="tear__line"></span></p>
      ${cardHead(c, "Liên Hệ", "contact")}

      <div class="rsvp">
        <div class="rsvp__side">
          <div class="rsvp__quick reveal">
            <a ${linkAttrs(h.phoneLink)} class="btn btn--moss">${icon("phone", "btn__icon")}<span>Gọi ${h.hasPhone ? esc(h.phoneDisplay) : "ngay"}</span></a>
            <a ${linkAttrs(h.zaloLink)} class="btn btn--line">${icon("zalo", "btn__icon")}<span>Nhắn Zalo</span></a>
          </div>
          <ul class="rsvp__lines reveal">
            ${line(h.emailLink, "email", "Email", h.emailDisplay)}
            ${line(h.facebookLink, "facebook", "Facebook", "Theo dõi Fanpage")}
            ${line(h.youtubeLink, "youtube", "YouTube", "Xem kênh")}
            ${c.address && !isPlaceholder(c.address) ? line(null, "location", "Khu vực", c.address) : ""}
            ${c.workingHours ? line(null, "clock", "Giờ làm việc", c.workingHours) : ""}
          </ul>
        </div>

        <!-- Form yêu cầu báo giá (gửi qua ứng dụng email, không cần máy chủ) -->
        <form id="contact-form" class="rsvp__form reveal" data-email="${esc(h.emailRaw)}" novalidate>
          <h3 class="rsvp__title">${esc(form.heading || "Gửi Yêu Cầu Báo Giá")}</h3>
          ${form.note ? `<p class="rsvp__note">${esc(form.note)}</p>` : ""}
          <div class="fields">
            <div class="field">
              <label for="cf-name" class="field__label">Họ và tên <span aria-hidden="true">*</span></label>
              <input id="cf-name" name="name" type="text" autocomplete="name" required class="field__input" placeholder="Nguyễn Văn A">
            </div>
            <div class="field">
              <label for="cf-phone" class="field__label">Số điện thoại <span aria-hidden="true">*</span></label>
              <input id="cf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required pattern="[0-9+ .]{9,15}" class="field__input" placeholder="0901 234 567">
            </div>
            ${types ? `<fieldset class="field field--wide ticks">
              <legend class="field__label">Loại sự kiện</legend>
              ${types}
            </fieldset>` : ""}
            <div class="field">
              <label for="cf-date" class="field__label">Ngày dự kiến</label>
              <input id="cf-date" name="date" type="date" class="field__input">
            </div>
            <div class="field field--wide">
              <label for="cf-message" class="field__label">Lời nhắn</label>
              <textarea id="cf-message" name="message" rows="4" class="field__input field__input--lined" placeholder="Địa điểm, số lượng khách, mong muốn của bạn..."></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn--wax">${icon("send", "btn__icon")}<span>${esc(form.submitLabel || "Gửi Yêu Cầu")}</span></button>
          <p class="rsvp__status" data-form-status role="status"></p>
        </form>
      </div>
    </section>`;
    },

    // ─── FOOTER: MẶT SAU PHONG BÌ ────────────────────
    footerSection() {
      const f = config.footer || {};
      const menu = (config.header?.menuItems || [])
        .map((m) => `<li><a href="${esc(m.href)}" class="backside__link">${esc(m.label)}</a></li>`)
        .join("\n          ");
      const social = [
        [h.phoneLink, "phone", "Gọi điện"],
        [h.zaloLink, "zalo", "Zalo"],
        [h.facebookLink, "facebook", "Facebook"],
        [h.youtubeLink, "youtube", "YouTube"],
      ]
        .map(([href, ic, label]) => `<li><a ${linkAttrs(href)} class="backside__social" aria-label="${esc(label)}">${icon(ic, "backside__social-icon")}</a></li>`)
        .join("\n          ");

      return `<footer class="backside">
    ${seal(monogram(brandName), "backside__seal")}
    <p class="backside__name">${esc(brandName)}</p>
    <p class="backside__tag">${esc(config.brand?.tagline || "")}</p>
    ${menu ? `<nav class="backside__nav" aria-label="Mục lục thiệp">
        <ul class="backside__menu">
          ${menu}
        </ul>
      </nav>` : ""}
    <ul class="backside__socials">
          ${social}
    </ul>
    <p class="backside__meta">${esc(f.copyright || "")}<br>${esc(f.madeWith || "")}</p>
    ${f.backToTop ? `<a href="#hero" class="backside__top">${icon("arrowUp", "backside__top-icon")} Về đầu thiệp</a>` : ""}
  </footer>`;
    },

    // ─── CON DẤU SÁP NỔI (liên hệ nhanh) ─────────────
    floatingButton() {
      const fb = config.floatingButton || {};
      if (fb.enabled === false) return "";
      const text = fb.sealText ?? "Hồi âm";
      return `<a ${linkAttrs(h.floatingLink)} class="seal-fab" data-seal-fab aria-label="${esc(fb.label || "Chat Zalo")}">
    ${seal(fb.type === "phone" ? "phone" : "zalo", "seal-fab__seal", true)}
    ${text ? `<span class="seal-fab__ribbon" aria-hidden="true">${esc(text)}</span>` : ""}
  </a>`;
    },

    // ─── HỘP THOẠI: XEM ẢNH + PHÁT VIDEO ─────────────
    dialogs() {
      return `<dialog id="lightbox" class="viewer" aria-label="Xem ảnh">
    <div class="viewer__bar">
      <p class="viewer__count" data-count aria-live="polite"></p>
      <button type="button" class="viewer__btn" data-close aria-label="${esc(ui.closeLabel)}">${icon("close", "viewer__icon")}</button>
    </div>
    <figure class="viewer__stage" data-stage>
      <span class="viewer__mat"><img alt="" class="viewer__img" data-img></span>
      <figcaption class="viewer__cap" data-caption></figcaption>
    </figure>
    <div class="viewer__nav">
      <button type="button" class="viewer__btn" data-prev aria-label="${esc(ui.prevLabel)}">${icon("arrowLeft", "viewer__icon")}</button>
      <button type="button" class="viewer__btn" data-next aria-label="${esc(ui.nextLabel)}">${icon("arrowRight", "viewer__icon")}</button>
    </div>
  </dialog>

  <dialog id="player" class="viewer viewer--video" aria-label="Trình phát video">
    <div class="viewer__bar">
      <p class="viewer__count" data-video-title></p>
      <button type="button" class="viewer__btn" data-close aria-label="${esc(ui.closeLabel)}">${icon("close", "viewer__icon")}</button>
    </div>
    <div class="viewer__screen" data-player></div>
    <div class="viewer__missing" data-missing-note hidden>
      <p>${esc(ui.videoMissing)}</p>
      <a href="#contact" class="btn btn--paper" data-close-link>Liên hệ ngay</a>
    </div>
  </dialog>`;
    },
  };
}

// ─── RENDER PAGE ────────────────────────────────────────

/**
 * Ghép template + config → HTML hoàn chỉnh
 * @param {string} template — Nội dung index.html (file khung)
 * @param {object} config — SITE_CONFIG
 * @returns {{ html: string, missing: string[] }}
 */
export function renderPage(template, config) {
  const renderers = createRenderers(config);
  const missing = [];

  // Xóa comment hướng dẫn ở đầu file
  let html = template.replace(/<!--\s*ĐÂY LÀ FILE KHUNG[\s\S]*?-->\s*\n?/, "");

  // 1) Thay thế renderer blocks: {{{ @tenRenderer }}}
  html = html.replace(/\{\{\{\s*@(\w+)\s*\}\}\}/g, (match, name) => {
    if (typeof renderers[name] === "function") {
      return renderers[name]();
    }
    missing.push(`@${name}`);
    return "";
  });

  // 2) Thay thế giá trị: {{ duong.dan }}
  html = html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, path) => {
    const val = path.split(".").reduce((obj, key) => (obj == null ? undefined : obj[key]), config);
    if (val === undefined || val === null || typeof val === "object") {
      missing.push(path);
      return "";
    }
    return esc(String(val));
  });

  return { html, missing };
}
