/**
 * ═══════════════════════════════════════════════════════════
 *  MAIN.JS — JS phía trình duyệt cho giao diện "Thiệp Mời"
 *  Không thư viện ngoài. Trang vẫn đọc được đầy đủ khi tắt JS
 *  (khi đó các tấm thiệp xếp dọc bình thường, mọi nội dung hiện sẵn).
 * ═══════════════════════════════════════════════════════════
 */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const isPhone = window.matchMedia("(max-width: 767px)");
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  // ─── CHIỀU CAO MÀN HÌNH ỔN ĐỊNH (svh) ───────────────────
  // Dùng 100svh thay cho innerHeight để thiệp không "giật" khi thanh địa chỉ điện thoại co/giãn.
  const probe = document.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none";
  document.body.appendChild(probe);
  let vh = window.innerHeight; // đo lại bằng probe trong layoutCards (không ép layout lúc vừa tải)

  // ═══ 1. CHỒNG THIỆP ═════════════════════════════════════
  // Mỗi thiệp dính (sticky). Thiệp ngắn dính gần đầu màn hình, lệch nhau vài px để lộ mép như một xấp thiệp;
  // thiệp dài hơn màn hình dính khi đáy chạm đáy màn hình. Thiệp sau trượt lên phủ thiệp trước,
  // thiệp trước thu nhỏ + tối dần.
  // Chỉ ghi thẳng top / transform / opacity khi giá trị đổi (không dùng biến CSS kế thừa → nhẹ cho điện thoại)
  const cards = $$(".stack > .card");
  const fab = $("[data-seal-fab]");
  const contact = $("#contact");
  let ticking = false;

  cards.forEach((card) => {
    const shade = document.createElement("span");
    shade.className = "card__shade";
    shade.setAttribute("aria-hidden", "true");
    card.appendChild(shade);
    card._shade = shade;
  });

  function layoutCards() {
    // Đọc hết rồi mới ghi — tránh bắt trình duyệt tính layout lại sau mỗi tấm thiệp
    vh = probe.offsetHeight || window.innerHeight;
    const peek = isPhone.matches ? 6 : 10;
    const heights = cards.map((card) => card.offsetHeight);
    cards.forEach((card, i) => {
      const top = Math.round(Math.min(8 + i * peek, vh - heights[i] - 8));
      if (card._stick === top) return;
      card._stick = top;
      card.style.top = `${top}px`;
      // Thu nhỏ về phía mép trên đang nhìn thấy của thiệp
      card.style.transformOrigin = `50% ${Math.max(0, -top)}px`;
    });
    updateCards();
  }

  function updateCards() {
    ticking = false;
    // Đọc: vị trí mọi tấm thiệp trong một lượt
    const tops = cards.map((c) => c.getBoundingClientRect().top);
    const contactTop = contact ? contact.getBoundingClientRect().top : Infinity;
    let heroCover = 0;

    // Ghi
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      let p = 0;
      if (i + 1 < cards.length) {
        const end = cards[i + 1]._stick ?? 0;
        p = clamp((vh - tops[i + 1]) / Math.max(1, vh - end), 0, 1);
      }
      if (i === 0) heroCover = p;
      p = Math.round(p * 200) / 200;
      if (card._p !== p) {
        card._p = p;
        card._shade.style.opacity = String(p * 0.5);
        card.style.transform = p > 0 && !reduceMotion.matches ? `scale(${1 - p * 0.045})` : "";
      }
      // Thiệp đã nằm dưới 2 lớp thiệp khác → ẩn hẳn để trình duyệt khỏi vẽ (nhẹ cho điện thoại)
      const buried = i + 2 < cards.length && tops[i + 2] <= (cards[i + 2]._stick ?? 0) + 1;
      if (card._buried !== buried) {
        card._buried = buried;
        card.style.visibility = buried ? "hidden" : "";
      }
    }

    // Con dấu sáp: hiện khi phong bì đã bị phủ gần hết, ẩn khi Phiếu hồi âm đang trên màn hình
    if (fab) fab.classList.toggle("is-on", heroCover > 0.55 && contactTop >= vh * 0.85);
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateCards);
    }
  }

  if (cards.length) {
    window.addEventListener("scroll", requestUpdate, { passive: true });
    // Thiệp đổi chiều cao (mở "Xem thêm", font tải xong, xoay màn hình) → tính lại chỗ dính.
    // Gộp nhiều yêu cầu trong cùng một khung hình thành một lần tính.
    let lastWidth = window.innerWidth;
    let pending = false;
    const relayout = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        layoutCards();
      });
    };
    // Bắt đầu sau lần vẽ đầu tiên (lúc mới mở trang chưa thiệp nào dính) → không làm chậm hiển thị
    requestAnimationFrame(() =>
      setTimeout(() => {
        relayout();
        if ("ResizeObserver" in window) {
          const ro = new ResizeObserver(relayout);
          cards.forEach((c) => ro.observe(c));
        }
      }, 0)
    );
    window.addEventListener("resize", () => {
      // Chỉ tính lại khi đổi chiều ngang (bỏ qua thanh địa chỉ co giãn trên điện thoại)
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        relayout();
      }
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  }

  // ═══ 2. CUỘN TỚI MỤC (link #...) ════════════════════════
  // Thiệp đang dính có vị trí "giả" → tạm bỏ sticky để đo vị trí thật trong trang rồi mới cuộn.
  function flowTop(el) {
    // Thiệp chưa dựng (content-visibility) chỉ có chiều cao ước lượng → dựng thật hết một lần trước khi đo
    document.documentElement.classList.add("is-measuring");
    const card = el.closest(".card");
    let restore = null;
    if (card) {
      restore = [card.style.position, card.style.transform];
      card.style.position = "static";
      card.style.transform = "none";
    }
    const y = el.getBoundingClientRect().top + window.scrollY;
    if (card) [card.style.position, card.style.transform] = restore;
    document.documentElement.classList.remove("is-measuring");
    return y;
  }

  function goTo(target) {
    const top = target.id === "hero" ? 0 : Math.max(0, flowTop(target) - 12);
    window.scrollTo({ top, behavior: reduceMotion.matches ? "auto" : "smooth" });
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    const id = decodeURIComponent(a.getAttribute("href").slice(1));
    const target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const dlg = a.closest("dialog[open]");
    if (dlg) dlg.close();
    goTo(target);
    if (history.pushState) history.pushState(null, "", `#${id}`);
  });

  // ═══ 3. HIỆN DẦN KHI CUỘN ═══════════════════════════════
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // ═══ 4. "XEM THÊM (N)" — THU GỌN TRÊN ĐIỆN THOẠI ════════
  $$("[data-more]").forEach((btn) => {
    const target = document.getElementById(btn.getAttribute("aria-controls"));
    const text = $("[data-more-text]", btn);
    if (!target) return;
    btn.addEventListener("click", () => {
      const open = !target.classList.contains("is-open");
      const before = btn.getBoundingClientRect().top;
      target.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      if (text) text.textContent = open ? btn.dataset.labelLess : btn.dataset.labelMore;
      // Thu gọn: giữ nút ở nguyên chỗ trên màn hình, không bị "nhảy" mất khỏi tầm mắt
      if (!open) window.scrollBy(0, btn.getBoundingClientRect().top - before);
      // Mục mới hiện ra: hiện luôn, không chờ hiệu ứng
      $$(".is-extra", target).forEach((el) => el.classList.add("is-in"));
    });
  });

  // ═══ 5. LỌC ẢNH ═════════════════════════════════════════
  const galleryList = $("#gallery-list");
  const filterBtns = $$("[data-filter]");
  const galleryMore = $('[data-more][aria-controls="gallery-list"]');
  filterBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filterBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      $$(".photo", galleryList).forEach((li) => {
        li.hidden = f !== "*" && li.dataset.category !== f;
        if (!li.hidden) li.classList.add("is-in");
      });
      // Đang lọc → hiện đủ ảnh của loại đó; về "Tất cả" → trả lại trạng thái thu gọn trước đó
      const userOpen = galleryMore ? galleryMore.getAttribute("aria-expanded") === "true" : true;
      galleryList.classList.toggle("is-open", f !== "*" || userOpen);
      if (galleryMore) galleryMore.hidden = f !== "*";
    })
  );

  // ─── Tiện ích hộp thoại: khóa cuộn nền, trả focus về nút đã mở ──
  function setupDialog(dlg, onClose) {
    let opener = null;
    dlg.addEventListener("close", () => {
      document.body.classList.remove("is-locked");
      if (onClose) onClose();
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    });
    // Bấm vào vùng nền trống → đóng
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
    $$("[data-close]", dlg).forEach((b) => b.addEventListener("click", () => dlg.close()));
    return function open(from) {
      opener = from;
      if (typeof dlg.showModal === "function") dlg.showModal();
      else dlg.setAttribute("open", "");
      document.body.classList.add("is-locked");
      const first = $("[data-close]", dlg);
      if (first) first.focus({ preventScroll: true });
    };
  }

  // ═══ 6. XEM ẢNH (LIGHTBOX) ══════════════════════════════
  const lightbox = $("#lightbox");
  if (lightbox && galleryList) {
    const img = $("[data-img]", lightbox);
    const caption = $("[data-caption]", lightbox);
    const count = $("[data-count]", lightbox);
    let list = [];
    let index = 0;

    function show(i) {
      index = (i + list.length) % list.length;
      const btn = list[index];
      const src = (isPhone.matches && btn.dataset.lightboxM) || btn.dataset.lightbox;
      img.style.opacity = "0";
      img.onload = () => (img.style.opacity = "1");
      img.onerror = () => {
        img.style.opacity = "0";
        caption.textContent = "Ảnh đang được cập nhật.";
      };
      img.src = src;
      img.alt = btn.dataset.alt || "";
      caption.textContent = btn.dataset.alt || "";
      count.textContent = `${index + 1} / ${list.length}`;
    }

    const open = setupDialog(lightbox, () => {
      img.removeAttribute("src");
    });

    galleryList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-lightbox]");
      if (!btn) return;
      list = $$("[data-lightbox]", galleryList).filter((b) => !b.closest(".photo").hidden);
      open(btn);
      show(list.indexOf(btn));
    });

    $("[data-prev]", lightbox).addEventListener("click", () => show(index - 1));
    $("[data-next]", lightbox).addEventListener("click", () => show(index + 1));
    lightbox.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });

    // Vuốt trái/phải để chuyển ảnh
    const stage = $("[data-stage]", lightbox);
    let x0 = null;
    let y0 = null;
    stage.addEventListener("touchstart", (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
    img.style.transition = "opacity .25s ease";
  }

  // ═══ 7. PHÁT VIDEO (chỉ tải khi bấm) ════════════════════
  const player = $("#player");
  if (player) {
    const screen = $("[data-player]", player);
    const note = $("[data-missing-note]", player);
    const title = $("[data-video-title]", player);

    /** Link YouTube → link nhúng (youtube-nocookie); file .mp4/.webm → null (dùng thẻ <video>) */
    function toEmbed(url) {
      try {
        const u = new URL(url, location.href);
        let id = "";
        if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
        else if (u.hostname.includes("youtube")) {
          id = u.searchParams.get("v") || u.pathname.split("/").filter(Boolean).pop();
        }
        if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`;
      } catch {
        /* link lỗi → coi như file video */
      }
      return null;
    }

    const open = setupDialog(player, () => {
      screen.innerHTML = ""; // dừng video
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-video], [data-video-missing]");
      if (!btn) return;
      const url = btn.dataset.video;
      title.textContent = btn.dataset.title || "";
      screen.innerHTML = "";
      note.hidden = Boolean(url);
      if (url) {
        const embed = toEmbed(url);
        if (embed) {
          const f = document.createElement("iframe");
          f.src = embed;
          f.title = btn.dataset.title || "Video";
          f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
          f.allowFullscreen = true;
          screen.appendChild(f);
        } else {
          const v = document.createElement("video");
          v.src = url;
          v.controls = true;
          v.autoplay = true;
          v.playsInline = true;
          screen.appendChild(v);
        }
      }
      open(btn);
    });
  }

  // ═══ 8. PHIẾU HỒI ÂM (form → ứng dụng email) ════════════
  const form = $("#contact-form");
  if (form) {
    const status = $("[data-form-status]", form);
    const nameEl = form.elements.name;
    const phoneEl = form.elements.phone;
    [nameEl, phoneEl].forEach((el) => el && el.addEventListener("input", () => el.removeAttribute("aria-invalid")));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const badName = !name;
      const badPhone = !phone || !phoneEl.checkValidity();
      [[nameEl, badName], [phoneEl, badPhone]].forEach(([el, bad]) =>
        bad ? el.setAttribute("aria-invalid", "true") : el.removeAttribute("aria-invalid")
      );

      if (badName || badPhone) {
        status.textContent = "Vui lòng nhập họ tên và số điện thoại hợp lệ.";
        (badName ? nameEl : phoneEl).focus();
        return;
      }

      const email = form.dataset.email;
      if (!email) {
        status.textContent = "Kênh email đang được cập nhật — vui lòng gọi điện hoặc nhắn Zalo giúp mình nhé!";
        return;
      }

      const body = [
        `Họ tên: ${name}`,
        `Điện thoại: ${phone}`,
        `Loại sự kiện: ${data.get("eventType") || ""}`,
        `Ngày dự kiến: ${data.get("date") || ""}`,
        "",
        String(data.get("message") || ""),
      ].join("\n");
      const subject = `Yêu cầu báo giá MC — ${name}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Đang mở ứng dụng email của bạn...";
    });
  }
})();
