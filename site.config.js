/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  SITE.CONFIG.JS — CẤU HÌNH NỘI DUNG WEBSITE                  ║
 * ║  Giao diện "Thiệp Mời" — mỗi phần là một tấm thiệp in nổi,   ║
 * ║  tấm sau trượt lên chồng lên tấm trước khi cuộn trang.       ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  Toàn bộ chữ, ảnh, video, link của website nằm trong file    ║
 * ║  này. Sửa xong chỉ cần chạy `npm run build` (hoặc để         ║
 * ║  `npm run dev` tự build lại). KHÔNG cần mở HTML/CSS/JS.      ║
 * ║                                                              ║
 * ║  CÁCH SỬA:                                                   ║
 * ║  - Chỉ sửa phần chữ nằm GIỮA hai dấu ngoặc kép "..."         ║
 * ║  - Thay các giá trị [IN_HOA] bằng thông tin thật             ║
 * ║    VD: "[SO_DIEN_THOAI]"  →  "0901 234 567"                  ║
 * ║  - Ảnh đặt trong thư mục public/images/<khu-vuc>/, ghi       ║
 * ║    đường dẫn dạng "public/images/..." (KHÔNG có / ở đầu)     ║
 * ║  - Ảnh ưu tiên .webp, tên kebab-case có số: service-01.webp; ║
 * ║    bản riêng cho điện thoại thêm đuôi -m: service-01-m.webp  ║
 * ║    (có file -m nằm cạnh là điện thoại tự dùng, không cần     ║
 * ║    khai báo thêm)                                            ║
 * ║  - Kích thước ảnh ghi ở comment từng mục: ĐIỆN THOẠI trước,  ║
 * ║    MÁY TÍNH sau                                              ║
 * ║  - Ảnh chưa có → trang tự hiện khung giấy kẻ chéo đúng tỉ lệ ║
 * ║  - Link còn [IN_HOA] → nút tự trỏ về Phiếu hồi âm (#contact) ║
 * ║  - Danh sách (dịch vụ, video, ảnh...): muốn thêm thì copy    ║
 * ║    nguyên một khối { ... }, rồi dán ngay sau nó; muốn bớt    ║
 * ║    thì xóa cả khối { ... }, kể cả dấu phẩy phía sau          ║
 * ║  - Số mục hiện sẵn trên điện thoại: key `mobileVisible` ở    ║
 * ║    từng khu vực (phần còn lại nằm sau nút "Xem thêm (N)");   ║
 * ║    từ 1024px trở lên luôn hiện đủ                            ║
 * ║  - Các key ghi (MỚI) được thêm cho giao diện này. Xóa đi     ║
 * ║    trang vẫn chạy (dùng chữ mặc định)                        ║
 * ║                                                              ║
 * ║  LỖI HAY GẶP (build báo lỗi đỏ):                             ║
 * ║  - Thiếu dấu phẩy , ở cuối dòng / cuối khối { ... }          ║
 * ║  - Thiếu một dấu ngoặc kép "  (mở " thì phải có đóng ")      ║
 * ║  - Xóa nhầm dấu } hoặc ] — số dấu mở và đóng phải bằng nhau  ║
 * ║  - Trong chữ cần dấu ngoặc kép → dùng “ ” hoặc \"            ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

export const SITE_CONFIG = {

  // ─── 0. CHỮ GIAO DIỆN DÙNG CHUNG (MỚI) ─────────────────────
  // Chữ trên các nút thu gọn/mở rộng, nút đóng, nhãn trợ năng
  ui: {
    showMore: "Xem thêm",                            // nút sẽ hiện "Xem thêm (N)"
    showLess: "Thu gọn",
    skipLink: "Bỏ qua đến nội dung chính",
    closeLabel: "Đóng",
    prevLabel: "Ảnh trước",
    nextLabel: "Ảnh sau",
    videoMissing: "Video đang được cập nhật — liên hệ để xem trọn bộ showreel.",
  },

  // ─── 1. SEO & META ─────────────────────────────────────────
  // Hiện khi chia sẻ link lên Zalo/Facebook và trên Google
  seo: {
    title: "MC [TEN_MC] — MC Sự Kiện Chuyên Nghiệp",
    description: "MC dẫn chương trình sự kiện chuyên nghiệp tại TP.HCM và toàn quốc. Hơn [SO_NAM_KINH_NGHIEM] năm kinh nghiệm, [SO_SU_KIEN]+ sự kiện thành công.",
    keywords: "MC sự kiện, MC đám cưới, MC doanh nghiệp, dẫn chương trình, [TEN_MC]",
    ogImage: "public/images/og/og-cover.jpg",        // Điện thoại & Máy tính: 1200×630px, JPG (Facebook/Zalo chưa đọc tốt WebP)
    ogImageAlt: "MC [TEN_MC] — Dẫn chương trình sự kiện",
    url: "[WEBSITE_URL]",                            // VD: https://ten-ban.github.io/mc-portfolio/
    locale: "vi_VN",
    themeColor: "#22352A",                           // màu thanh trình duyệt trên điện thoại — trùng nền xanh rêu sau các tấm thiệp
  },

  // ─── 2. THÔNG TIN CÁ NHÂN / THƯƠNG HIỆU ──────────────────
  // Tên hiện ở đầu trang, trên thiệp mời (chữ viết tay), chữ ký và chân trang
  brand: {
    name: "[TEN_MC]",
    tagline: "MC Sự Kiện Chuyên Nghiệp",
    logo: "public/icons/favicon.svg",                // SVG logo, hiển thị 36×36px ở đầu trang
    logoAlt: "Logo [TEN_MC]",
  },

  // ─── 3. HEADER ─────────────────────────────────────────────
  // Giao diện này KHÔNG có thanh menu: đầu trang chỉ có logo + tên + nút ctaButton.
  // menuItems hiện thành "Mục lục thiệp" ở chân trang.
  header: {
    menuItems: [
      { label: "Trang chủ", href: "#hero" },
      { label: "Giới thiệu", href: "#about" },
      { label: "Dịch vụ", href: "#services" },
      { label: "Video", href: "#videos" },
      { label: "Gallery", href: "#gallery" },
      { label: "Cảm nhận", href: "#testimonials" },
      { label: "Liên hệ", href: "#contact" },
    ],
    ctaButton: {
      label: "Đặt Lịch Ngay",
      href: "[ZALO_LINK]",                           // Link Zalo hoặc #contact
    },
  },

  // ─── 4. HERO (TẤM THIỆP MỜI ĐẦU TRANG) ─────────────────────
  // Phong bì mở nắp, tấm thiệp có ảnh MC (khung vòm) rút lên. Nút đặt lịch nằm trên mặt phong bì.
  // Ảnh trong khung vòm: Điện thoại 600×750px (dọc 4:5) — Máy tính 900×1200px (dọc 3:4)
  hero: {
    heading: "Khoảnh Khắc Đáng Nhớ\nBắt Đầu Từ Sân Khấu",
    subheading: "MC dẫn chương trình chuyên nghiệp cho đám cưới, sự kiện doanh nghiệp và các chương trình nghệ thuật trên toàn quốc.",
    backgroundDesktop: "public/images/hero/hero.jpg",   // ảnh dự phòng khi hero.image để trống — Máy tính 900×1200px
    backgroundMobile: "public/images/hero/hero_minh.jpg", // ảnh dự phòng — Điện thoại 600×750px
    backgroundAlt: "MC [TEN_MC] cầm micro dẫn tiệc cưới",
    ctaPrimary: {
      label: "Đặt Lịch Qua Zalo",
      href: "[ZALO_LINK]",
    },
    ctaSecondary: {
      label: "Xem Showreel",
      href: "#videos",
    },
    scrollIndicator: true,                           // true = hiện dòng "Mở thiệp" nhỏ dưới phong bì

    // (MỚI) Ảnh đã tối ưu cho khung vòm. Để "" thì dùng backgroundMobile / backgroundDesktop ở trên.
    image: {
      mobile: "public/images/hero/hero-01-m.webp",   // 600×750px (dọc 4:5), nên ≤ 80KB
      desktop: "public/images/hero/hero-01.webp",    // 900×1200px (dọc 3:4), nên ≤ 150KB
    },
    // (MỚI) Điểm lấy nét của ảnh (CSS object-position) — đặt vào khuôn mặt MC
    imagePosition: {
      mobile: "50% 22%",
      desktop: "50% 25%",
    },
    // (MỚI) Dòng chữ nhỏ phía trên ảnh, như lời mở đầu thiệp mời
    invitation: "Trân trọng kính mời",
    // (MỚI) Dòng "ngày giờ" cuối thiệp. Để "" thì ẩn.
    availability: "Đang nhận lịch mùa cưới & YEP 2026",
  },

  // ─── 5. GIỚI THIỆU (THƯ NGỎ) ──────────────────────────────
  // Một lá thư: "Thân gửi bạn," + tóm tắt + ảnh chân dung khung oval + 4 số liệu + chữ ký.
  // Điện thoại: hiện `summary`, phần `story` nằm sau nút `storyToggleLabel`.
  // Ảnh chân dung: Điện thoại 400×500px (4:5) — Máy tính 600×800px (3:4)
  about: {
    sectionLabel: "Về Tôi",
    heading: "Đồng Hành Cùng\nKhoảnh Khắc Của Bạn",
    portrait: "public/images/about/portrait.webp",        // Máy tính 600×800px
    portraitMobile: "public/images/about/portrait-mobile.webp", // Điện thoại 400×500px
    portraitAlt: "MC [TEN_MC] cầm micro bên bục phát biểu",
    story: "Với hơn [SO_NAM_KINH_NGHIEM] năm kinh nghiệm trong lĩnh vực dẫn chương trình, tôi đã có vinh dự đồng hành cùng hàng trăm sự kiện — từ những đám cưới ấm cúng đến những gala doanh nghiệp quy mô lớn.\n\nTriết lý của tôi: mỗi sự kiện là duy nhất, và người MC phải là cầu nối cảm xúc giữa chương trình và khán giả. Tôi luôn chuẩn bị kỹ lưỡng, lắng nghe mong muốn của khách hàng, và mang đến năng lượng tích cực cho từng khoảnh khắc trên sân khấu.",
    // (MỚI) Tóm tắt 1–2 câu, luôn hiển thị
    summary: "Hơn [SO_NAM_KINH_NGHIEM] năm cầm mic, [SO_SU_KIEN]+ sân khấu — từ tiệc cưới ấm cúng đến gala nghìn khách. Kịch bản riêng cho từng chương trình, nhịp cảm xúc giữ trọn từ lời chào đến phút khép lại.",
    // (MỚI) Chữ trên nút mở phần câu chuyện đầy đủ (story)
    storyToggleLabel: "Đọc trọn lá thư",
    // (MỚI) Lời chào đầu thư (chữ viết tay)
    greeting: "Thân gửi bạn,",
    stats: [
      { number: "[SO_NAM_KINH_NGHIEM]+", label: "Năm Kinh Nghiệm" },
      { number: "[SO_SU_KIEN]+", label: "Sự Kiện Thành Công" },
      { number: "50+", label: "Đối Tác Doanh Nghiệp" },
      { number: "100%", label: "Khách Hàng Hài Lòng" },
    ],
  },

  // ─── 6. DỊCH VỤ (THỰC ĐƠN) ────────────────────────────────
  // Trình bày như thực đơn tiệc: số La Mã, ảnh khung oval, tên chữ nghiêng, mô tả.
  // Ảnh dịch vụ: Điện thoại & Máy tính dùng chung 640×640px (vuông) — khung oval tự cắt
  // icon có sẵn: wedding, corporate, event, ceremony, award, bilingual (hiện khi chưa có ảnh)
  services: {
    sectionLabel: "Dịch Vụ",
    heading: "Dịch Vụ Của Tôi",
    subheading: "Mỗi loại hình sự kiện đều được chuẩn bị kịch bản riêng, phù hợp với phong cách và mong muốn của bạn.",
    mobileVisible: 3,                                // (MỚI) số món hiện sẵn trên điện thoại; ≥ 1024px hiện đủ
    items: [
      {
        icon: "wedding",
        title: "MC Đám Cưới",
        description: "Dẫn dắt tiệc cưới ấm cúng, lãng mạn với kịch bản cá nhân hóa cho từng cặp đôi.",
        image: "public/images/services/service-01.webp",  // 640×640px
      },
      {
        icon: "corporate",
        title: "MC Doanh Nghiệp",
        description: "Gala dinner, hội nghị khách hàng, lễ kỷ niệm — chuyên nghiệp và đẳng cấp.",
        image: "public/images/services/service-02.webp",
      },
      {
        icon: "event",
        title: "MC Sự Kiện",
        description: "Festival, concert, gameshow — tạo không khí sôi động và kết nối khán giả.",
        image: "public/images/services/service-03.webp",
      },
      {
        icon: "ceremony",
        title: "MC Lễ Khai Trương",
        description: "Lễ khai trương, động thổ, khánh thành — trang trọng và chuyên nghiệp.",
        image: "public/images/services/service-04.webp",
      },
      {
        icon: "award",
        title: "MC Lễ Trao Giải",
        description: "Vinh danh, trao giải thưởng — tạo cảm xúc và khoảnh khắc đáng nhớ.",
        image: "public/images/services/service-05.webp",
      },
      {
        icon: "bilingual",
        title: "MC Song Ngữ",
        description: "Dẫn chương trình Việt — Anh cho sự kiện quốc tế và đa văn hóa.",
        image: "public/images/services/service-06.webp",
      },
    ],
  },

  // ─── 6b. ALBUM (MỚI) ─────────────────────────────────────
  // Giao diện này GỘP Video (mục 7) và Gallery (mục 8) vào một tấm thiệp "Album".
  // Đây là tiêu đề chung của tấm thiệp đó. Xóa cả khối → dùng chữ mặc định.
  album: {
    sectionLabel: "Album",
    heading: "Thước Phim & Ảnh Lưu Niệm",
    subheading: "Vài trang trong cuốn album những sân khấu tôi đã đứng.",
  },

  // ─── 7. VIDEO ──────────────────────────────────────────────
  // Nửa trên của tấm thiệp Album: showreel trong khung lớn + các video nhỏ.
  // Poster: showreel Điện thoại & Máy tính 1280×720px, video nhỏ 640×360px (16:9)
  // videoUrl: link YouTube (https://youtu.be/... hoặc https://www.youtube.com/watch?v=...)
  //           hoặc file tự host "public/videos/ten-video.mp4". Video chỉ tải khi người xem bấm.
  videos: {
    sectionLabel: "Video",
    heading: "Khoảnh Khắc Trên Sân Khấu",
    subheading: "Xem những highlight từ các sự kiện tôi đã dẫn chương trình.",
    mobileVisible: 4,                                // (MỚI) số video nhỏ hiện sẵn trên điện thoại; ≥ 1024px hiện đủ
    featured: {
      title: "Showreel 2025",
      thumbnail: "public/images/videos/showreel-thumb.webp",  // 1280×720px
      videoUrl: "[YOUTUBE_SHOWREEL_URL]",
      duration: "3:45",
    },
    items: [
      {
        title: "Highlight Đám Cưới",
        thumbnail: "public/images/videos/video-01.webp",       // 640×360px
        videoUrl: "[YOUTUBE_VIDEO_01]",
        duration: "2:30",
      },
      {
        title: "Gala Doanh Nghiệp ABC",
        thumbnail: "public/images/videos/video-02.webp",
        videoUrl: "[YOUTUBE_VIDEO_02]",
        duration: "4:15",
      },
      {
        title: "Festival Âm Nhạc 2025",
        thumbnail: "public/images/videos/video-03.webp",
        videoUrl: "[YOUTUBE_VIDEO_03]",
        duration: "3:00",
      },
      {
        title: "Lễ Kỷ Niệm 20 Năm Cty XYZ",
        thumbnail: "public/images/videos/video-04.webp",
        videoUrl: "[YOUTUBE_VIDEO_04]",
        duration: "5:20",
      },
    ],
  },

  // ─── 8. GALLERY ────────────────────────────────────────────
  // Nửa dưới của tấm thiệp Album: ảnh dán góc trong khung giấy, xếp so le 2 cột (điện thoại) / 3 cột (máy tính).
  // Khung tự theo tỉ lệ thật của ảnh (ảnh ngang hay ảnh dọc đều được). Bấm ảnh để phóng to, vuốt để chuyển ảnh.
  // Ảnh: Điện thoại & Máy tính dùng chung — ảnh ngang 1200×900px (4:3) hoặc ảnh dọc 900×1200px (3:4)
  // "category" phải trùng 1 mục trong categories. Nút lọc chỉ hiện những loại có ảnh.
  gallery: {
    sectionLabel: "Hình Ảnh",
    heading: "Khoảnh Khắc Đáng Nhớ",
    subheading: "Những khoảnh khắc thực tế từ các sự kiện tôi đã đồng hành.",
    mobileVisible: 4,                                // (MỚI) số ảnh hiện sẵn trên điện thoại; ≥ 1024px hiện đủ
    categories: ["Tất cả", "Đám cưới", "Doanh nghiệp", "Sự kiện", "Hậu trường"],
    items: [
      {
        src: "public/images/gallery/gallery-01.webp",    // 1200×900px
        alt: "MC dẫn chương trình trên sân khấu trang trí hoa trắng",
        category: "Đám cưới",
      },
      {
        src: "public/images/gallery/gallery-02.webp",
        alt: "Ba MC cùng dẫn tiệc Year End Party của doanh nghiệp",
        category: "Doanh nghiệp",
      },
      {
        src: "public/images/gallery/gallery-03.webp",
        alt: "MC khuấy động không khí, khách mời giơ tay hưởng ứng",
        category: "Sự kiện",
      },
      {
        src: "public/images/gallery/gallery-04.webp",    // ảnh dọc 900×1200px
        alt: "MC cúi chào khán giả trên sân khấu tiệc",
        category: "Đám cưới",
      },
      {
        src: "public/images/gallery/gallery-05.webp",
        alt: "MC cùng đại diện doanh nghiệp trên sân khấu Year End 2025",
        category: "Doanh nghiệp",
      },
      {
        src: "public/images/gallery/gallery-06.webp",    // ảnh dọc
        alt: "MC dẫn talkshow, khán giả ngồi phía trước sân khấu",
        category: "Sự kiện",
      },
      {
        src: "public/images/gallery/gallery-07.webp",
        alt: "Toàn cảnh tiệc Chúc Mừng Năm Mới 2026 với MC trên sân khấu",
        category: "Doanh nghiệp",
      },
      {
        src: "public/images/gallery/gallery-08.webp",
        alt: "MC giao lưu cùng hai khách mời tại Year End Party",
        category: "Sự kiện",
      },
    ],
  },

  // ─── 9. KHÁCH HÀNG / ĐỐI TÁC ─────────────────────────────
  // Tấm thiệp nhỏ "danh sách khách mời": tên/logo đối tác căn giữa, tĩnh (không chạy ngang).
  // Logo: Điện thoại & Máy tính dùng chung 200×80px, nền trong suốt (SVG/WebP/PNG)
  // Chưa có logo → hiện tên công ty bằng chữ in nghiêng
  partners: {
    sectionLabel: "Đối Tác",
    heading: "Tin Tưởng Bởi",
    items: [
      { name: "Công ty A", logo: "public/images/partners/partner-01.webp" },
      { name: "Công ty B", logo: "public/images/partners/partner-02.webp" },
      { name: "Công ty C", logo: "public/images/partners/partner-03.webp" },
      { name: "Công ty D", logo: "public/images/partners/partner-04.webp" },
      { name: "Công ty E", logo: "public/images/partners/partner-05.webp" },
      { name: "Công ty F", logo: "public/images/partners/partner-06.webp" },
    ],
  },

  // ─── 10. CẢM NHẬN KHÁCH HÀNG (SỔ LƯU BÚT) ─────────────────
  // Trang giấy kẻ dòng màu hồng phấn, mỗi lời chúc có chữ ký viết tay. Máy tính: hai trang sổ mở.
  // Avatar: Điện thoại & Máy tính dùng chung 100×100px vuông (hiển thị tròn) — chưa có ảnh → hiện chữ cái đầu
  testimonials: {
    sectionLabel: "Cảm Nhận",
    heading: "Khách Hàng Nói Gì",
    subheading: "Niềm tin của khách hàng là động lực lớn nhất để tôi không ngừng hoàn thiện.",
    mobileVisible: 2,                                // (MỚI) số lời chúc hiện sẵn trên điện thoại; ≥ 1024px hiện đủ
    items: [
      {
        name: "Anh Trần Văn Hùng",
        role: "Giám đốc, Công ty ABC",
        avatar: "public/images/testimonials/avatar-01.webp",  // 100×100px
        content: "Anh [TEN_MC] dẫn gala cuối năm cho công ty tôi rất chuyên nghiệp. Chương trình được dẫn dắt mạch lạc, không khí sôi động. Chắc chắn sẽ tiếp tục hợp tác!",
        rating: 5,
      },
      {
        name: "Chị Nguyễn Thị Mai",
        role: "Cô dâu",
        avatar: "public/images/testimonials/avatar-02.webp",
        content: "Cảm ơn anh [TEN_MC] đã làm đám cưới của vợ chồng em thêm trọn vẹn. Anh rất tâm lý, chuẩn bị kỹ lưỡng và tạo được nhiều khoảnh khắc xúc động.",
        rating: 5,
      },
      {
        name: "Anh Lê Minh Đức",
        role: "Trưởng phòng Marketing, Tập đoàn XYZ",
        avatar: "public/images/testimonials/avatar-03.webp",
        content: "Đã làm việc với nhiều MC nhưng anh [TEN_MC] luôn là lựa chọn hàng đầu cho các sự kiện quan trọng. Phong cách chuyên nghiệp, linh hoạt và rất có duyên.",
        rating: 5,
      },
      {
        name: "Chị Phạm Hồng Nhung",
        role: "Wedding Planner",
        avatar: "public/images/testimonials/avatar-04.webp",
        content: "Tôi thường xuyên giới thiệu anh [TEN_MC] cho các cặp đôi. Anh luôn mang đến sự chuyên nghiệp và cảm xúc đúng mực cho mỗi lễ cưới.",
        rating: 5,
      },
    ],
  },

  // ─── 10b. CÂU HỎI THƯỜNG GẶP (MỚI) ────────────────────────
  // Tấm thiệp "Điều cần biết", in như mặt sau thiệp mời: câu hỏi và câu trả lời hiện sẵn.
  // `subheading` là dòng kết, kèm nút nhắn Zalo. Mảng items rỗng → ẩn cả tấm thiệp.
  faq: {
    sectionLabel: "Hỏi Đáp",
    heading: "Câu Hỏi Thường Gặp",
    subheading: "Chưa thấy câu trả lời? Nhắn Zalo, tôi phản hồi trong ngày.",
    mobileVisible: 3,                                // số câu hỏi hiện sẵn trên điện thoại; ≥ 1024px hiện đủ
    items: [
      {
        question: "Nên đặt lịch trước bao lâu?",
        answer: "Mùa cưới và cuối năm (tháng 9 – tháng 1) nên đặt trước 1–3 tháng. Các tháng còn lại thường chỉ cần 2–4 tuần. Lịch được giữ khi hai bên xác nhận và đặt cọc.",
      },
      {
        question: "Chi phí dẫn chương trình được tính thế nào?",
        answer: "Chi phí phụ thuộc loại sự kiện, thời lượng, địa điểm và yêu cầu song ngữ. Gửi thông tin qua form hoặc Zalo để nhận báo giá chi tiết trong 24 giờ.",
      },
      {
        question: "Có nhận dẫn sự kiện ngoài TP.HCM không?",
        answer: "Có. Tôi nhận sự kiện trên toàn quốc; chi phí di chuyển và lưu trú (nếu có) được báo rõ trong báo giá.",
      },
      {
        question: "Kịch bản do ai chuẩn bị?",
        answer: "Tôi soạn kịch bản dẫn riêng dựa trên buổi trao đổi với bạn hoặc agency, gửi duyệt trước sự kiện và chỉnh sửa đến khi bạn hài lòng.",
      },
      {
        question: "Có tham gia tổng duyệt không?",
        answer: "Có. Tôi có mặt tổng duyệt (nếu chương trình có) và đến sớm trước giờ diễn để phối hợp cùng ekip âm thanh, ánh sáng.",
      },
    ],
  },

  // ─── 11. LIÊN HỆ (PHIẾU HỒI ÂM) ────────────────────────────
  // Tấm thiệp cuối có mép răng cưa: nút Gọi / Zalo, các kênh khác, và form báo giá.
  contact: {
    sectionLabel: "Liên Hệ",
    heading: "Hãy Kết Nối Với Tôi",
    subheading: "Bạn đang lên kế hoạch cho sự kiện? Liên hệ ngay để được tư vấn miễn phí!",
    phone: "[SO_DIEN_THOAI]",                        // VD: "0901 234 567" — tự tạo link tel:
    zalo: "[ZALO_LINK]",                             // https://zalo.me/<số điện thoại>
    email: "[EMAIL]",
    facebook: "[FACEBOOK_LINK]",
    youtube: "[YOUTUBE_LINK]",
    address: "[DIA_CHI]",                            // còn [DIA_CHI] thì dòng Khu vực tự ẩn
    workingHours: "Thứ 2 — Chủ nhật: 8:00 — 21:00",
    // Form báo giá: bấm gửi sẽ mở ứng dụng email với nội dung đã điền (không cần máy chủ)
    // eventTypes hiện thành các ô vuông để đánh dấu, như phiếu hồi âm thiệp cưới (chọn 1 loại)
    form: {
      heading: "Gửi Yêu Cầu Báo Giá",
      note: "Để lại thông tin, tôi sẽ liên hệ lại trong vòng 24 giờ.",
      submitLabel: "Gửi Yêu Cầu",
      eventTypes: ["Đám cưới", "Sự kiện doanh nghiệp", "Khai trương / Khánh thành", "Lễ trao giải", "Sự kiện song ngữ", "Khác"],
    },
  },

  // ─── 12. FLOATING BUTTON ──────────────────────────────────
  // "Con dấu sáp" nổi góc phải dưới (mọi kích thước), hiện khi đã cuộn qua phong bì đầu trang
  // và tự ẩn khi đang xem Phiếu hồi âm.
  floatingButton: {
    enabled: true,
    type: "zalo",
    label: "Chat Zalo",
    href: "[ZALO_LINK]",                             // VD: https://zalo.me/0901234567
    sealText: "Hồi âm",                              // (MỚI) chữ nhỏ trên dải ruy băng dưới con dấu
  },

  // ─── 13. FOOTER ────────────────────────────────────────────
  // Mặt sau phong bì: con dấu, tên viết tay, mục lục thiệp (lấy từ header.menuItems), bản quyền
  footer: {
    copyright: "© 2026 [TEN_MC]. All rights reserved.",
    madeWith: "MC sự kiện tại TP.HCM & toàn quốc",
    backToTop: true,                                 // true = hiện nút "Về đầu thiệp"
  },
};
