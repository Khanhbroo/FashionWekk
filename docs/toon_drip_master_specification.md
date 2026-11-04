# FashionWekk — Gamified Anime Streetwear & Fullstack E-Commerce
## Hồ Sơ Đặc Tả Kỹ Thuật & Bản Master Prompt Khởi Tạo Dự Án

> [!IMPORTANT]
> Dự án chính thức mang tên: **`FashionWekk`**.
> Tích hợp cơ sở dữ liệu thực tế **MongoDB Atlas** với thư viện hiện đại **Mongoose / TypeScript** và script tự động gieo dữ liệu (Database Seeder) cho ~100 sản phẩm.

---

## 1. Bản Master Prompt Hoàn Chỉnh (Copy & Run)

```markdown
/teamwork /goal /boost /browser

Hãy kích hoạt một Đội ngũ Đa Đặc vụ Tự trị (Autonomous Multi-Agent Team) gồm 3 Subagents chuyên trách dưới sự chỉ huy của Lead Orchestrator để xây dựng trọn vẹn dự án: **"FashionWekk — Gamified Anime & Cartoon Streetwear Fullstack E-Commerce"**.

Trình duyệt đã được mở sẵn và kết nối trực tiếp. Các Subagents phải chủ động sử dụng `/browser` xuyên suốt từ khâu nghiên cứu thiết kế cho đến khâu nghiệm thu sản phẩm.

---

### PHẦN 1: CẤU HÌNH CƠ SỞ DỮ LIỆU THỰC TẾ (DATABASE & BACKEND)

* **Cơ sở dữ liệu:** MongoDB Atlas.
* **Chuỗi kết nối (Bảo mật qua `.env`):**
  ```env
  MONGODB_URI=mongodb+srv://Khanhbroo:Khanhbroo%402002@khanhbroo.i0hbh3y.mongodb.net/fashionwekk?retryWrites=true&w=majority
  PORT=5000
  ```
* **Thư viện Backend hiện đại:** Sử dụng **`Mongoose`** kết hợp **`TypeScript`** và **`Express`** (hoặc Next.js Server Actions) với các Schema chuẩn:
  1. `ProductSchema`: `title`, `price`, `originalPrice`, `category`, `description`, `images`, `colors`, `sizes`, `gsm`, `stock`, `isFlashSale`, `tags`.
  2. `OrderSchema`: `customerName`, `customerEmail`, `items`, `subtotal`, `discountAmount`, `totalAmount`, `status` (`pending`, `shipped`, `delivered`), `createdAt`.
  3. `CouponSchema`: `code`, `discountPercent`, `expiryDate`, `isActive`.
* **Database Seeder (`npm run seed`):** Viết script tự động nạp sẵn **~100 sản phẩm thời trang phong cách hoạt hình** vào MongoDB Atlas ngay khi khởi tạo dự án.

---

### PHẦN 2: PHÂN CÔNG ĐỘI NGŨ SUBAGENTS & GẮN SKILL BẮT BUỘC

* 🎨 **SUBAGENT 1: UI/UX & Visual Asset Designer (Có dùng /browser)**
  * **Kỹ năng & Công cụ bắt buộc:** 
    - `mobbin` (áp dụng skill `redesign-screen` & `best-practices`).
    - `figma` (áp dụng skill `figma-implement-motion`).
    - **Sử dụng `/browser`:** Chủ động điều khiển trình duyệt truy cập kho Mobbin / Figma và các website thời trang Awwwards thực tế để soi chi tiết layout giỏ hàng, Bento Grid, và animation curves.
  * **Đầu ra:**
    - Thiết kế Design System: Tone màu hoạt hình sang trọng (Dark Charcoal `#0D0E12`, Bento Box `#16181F`, Accent Lavender `#A78BFA`, Neon Lime `#CCFF00`, Cyber Cyan `#38BDF8`).
    - Tạo bộ dữ liệu ~100 sản phẩm thời trang phong cách hoạt hình (ảnh mockup chất lượng cao, GSM, mã màu, giá cả, danh mục) và bộ tài nguyên đồ họa cho nhân vật Mascot.

* 💻 **SUBAGENT 2: Lead Fullstack Engineer (DeepCoder)**
  * **Kỹ năng bắt buộc áp dụng:** 
    - `codebase-architecture`: Bắt buộc thiết kế theo Clean Architecture (Feature-driven: `features/products`, `features/cart`, `features/mascot`, `features/admin`, `server/db`).
    - `generative_ui`: Dựng các widget tương tác cao: Vòng quay may mắn (Mystery Coupon Wheel), Modal xem nhanh, và thanh tiến độ Freeship.
    - `modern-web-guidance`: Tối ưu Core Web Vitals, Responsive mobile-first, và Accessibility WCAG.
  * **Nhiệm vụ & Đầu ra:**
    1. Khởi tạo mã nguồn: React 19 + TypeScript + Vite + Tailwind CSS v4 + Zustand 5 + Lucide Icons + Canvas Confetti (Frontend) kết hợp Node.js Express/Mongoose API (Backend).
    2. Kết nối và cấu hình an toàn MongoDB Atlas qua file `.env`.
    3. Storefront hoàn chỉnh: Bento Grid, hiệu ứng 3D Tilt xoay theo chuột (`transformPerspective`), bộ lọc đa chiều, tìm kiếm thời gian thực.
    4. **Interactive Avatar Dress-Up:** Linh vật hoạt hình ở trung tâm tự động thay trang phục khi click vào sản phẩm (cơ chế Layered Canvas/SVG).
    5. **Gamified Shopping:** Flash Sale đếm ngược theo thời gian thực, Vòng quay nhận mã coupon.
    6. **Slide-out Cart Drawer:** Giỏ hàng trượt, tính phí, mã giảm giá, đồng bộ với API.
    7. **Admin Portal (`/admin`):** Quản lý sản phẩm (CRUD thực tế vào MongoDB), quản lý đơn hàng, quản lý coupon, biểu đồ doanh thu trực quan.

* 🔍 **SUBAGENT 3: QA, TDD & Self-Healing Auditor (DeepInvestigator + /browser)**
  * **Kỹ năng & Công cụ bắt buộc:** 
    - `tdd`: Viết test trước theo chu trình Red-Green-Refactor (`cart.test.ts`, `api.test.ts`) kiểm thử logic tính tiền, giảm giá và các API CRUD MongoDB.
    - `self-healing`: Tự động rà soát edge-case (mất kết nối DB, giỏ hàng rỗng, tồn kho 0, null/undefined), kiểm tra memory leaks, typecheck (100% type safety, 0 lỗi TypeScript). Tự động vá lỗi nếu phát sinh.
    - **Sử dụng `/browser`:** Khởi chạy dự án và dùng trình duyệt mở thẳng `localhost`. Tự động click test toàn bộ luồng mua hàng, test tính năng thay đồ Avatar, test trang Admin lưu vào MongoDB, và chụp ảnh màn hình làm bằng chứng nghiệm thu.

---

### PHẦN 3: ĐẶC TẢ KỸ THUẬT & LOGIC CỐT LÕI (TECHNICAL CONSTRAINTS)

* 🎨 **Hệ Thống Màu Sắc (Design Tokens chuẩn Zentry/Anime):**
  - **Background chính:** Tối than chì `#0D0E12` | **Bento Card:** `#16181F` (viền mỏng `border-white/10`).
  - **Accents:** Tím Lavender `#A78BFA`, Vàng chanh Neon `#CCFF00`, Xanh điện tử `#38BDF8`.
  - **Màu chữ:** Trắng sáng `#FFFFFF` và xám tro `#94A3B8`.

* 🕹️ **Cơ Chế Thay Đồ Cho Linh Vật (Mascot Dress-Up Architecture):**
  - Xây dựng theo **cơ chế xếp lớp (Layered SVG/Canvas/PNG)**:
    - Layer 1: Khung cơ thể gốc (`base_body`).
    - Layer 2: Trang phục dưới (`layer_bottom` - quần ống rộng/cargo).
    - Layer 3: Trang phục trên (`layer_top` - áo hoodie/tee).
    - Layer 4: Phụ kiện đầu (`layer_head` - mũ beanie/kính).
  - Khi click vào sản phẩm, State Zustand cập nhật ID trang phục và kích hoạt hiệu ứng scale nhẹ (nảy hoạt hình) cho món đồ đó.

* 🛒 **Logic Giỏ Hàng & LocalStorage:**
  - Sử dụng Zustand middleware `persist`: Giỏ hàng tự động lưu vào `localStorage` (không bị mất khi F5).
  - Tính năng Coupon: Nhập mã `TOON10` (giảm 10%), `FREESHIP` (miễn phí ship).
  - Thanh tiến độ Freeship: Hiển thị thanh chạy *"Mua thêm $... để được Freeship"*.

* 📏 **Quy Chuẩn Code Sạch (Clean Code Rules):**
  - **Giới hạn độ dài file:** Không có component nào vượt quá 200 dòng code. Bóc tách thành các sub-components nhỏ.
  - **Custom Hooks:** Toàn bộ logic giỏ hàng, âm thanh, thay đồ phải đưa vào custom hooks riêng (`useCart`, `useMascot`, `useSoundFx`).

---

### PHẦN 4: QUY TRÌNH PHỐI HỢP LIÊN TỤC (WORKFLOW PROTOCOL)
1. **Bước 1:** Lead Orchestrator tạo file `implementation_plan.md` làm Artifact tổng thể.
2. **Bước 2:** Subagent 1 dùng `/browser` mở Mobbin/Figma nghiên cứu, chốt UI/UX và chuẩn bị 100 sản phẩm.
3. **Bước 3:** Subagent 2 cài đặt Mongoose/MongoDB, chạy script seed 100 sản phẩm vào DB, code hoàn thiện toàn bộ Storefront + Gamified Features + Admin Portal.
4. **Bước 4:** Subagent 3 dùng `tdd` viết test, chạy `self-healing` dọn sạch lỗi, và dùng `/browser` mở web nghiệm thu trực tiếp.
5. **Bước 5:** Bàn giao sản phẩm hoàn hảo 100% kèm ảnh chụp nghiệm thu và lệnh chạy.
```

---

## 2. Cấu Trúc Thư Mục Dự Án FashionWekk Chuẩn Fullstack

```text
FashionWekk/
├── server/                  # Backend Node.js / Express API
│   ├── config/              # db.ts (MongoDB connection via Mongoose)
│   ├── models/              # Product.ts, Order.ts, Coupon.ts
│   ├── controllers/         # productController.ts, orderController.ts
│   ├── routes/              # productRoutes.ts, orderRoutes.ts, couponRoutes.ts
│   └── seeder.ts            # Script nạp 100 sản phẩm hoạt hình vào MongoDB
├── src/                     # Frontend React 19 + TypeScript
│   ├── assets/              # Icons, sounds, mascot base layers
│   ├── components/
│   │   ├── common/          # Button, Modal, Card, 3D Tilt container
│   │   └── layout/          # Navbar, Footer, BentoGrid
│   ├── features/
│   │   ├── products/        # ProductCard, ProductList, ProductFilter
│   │   ├── mascot/          # MascotAvatar, LayerViewer, MascotControls
│   │   ├── cart/            # CartDrawer, CartItem, FreeshipProgress, CouponInput
│   │   ├── gamification/    # MysteryWheel, FlashSaleCountdown
│   │   └── admin/           # AdminDashboard, ProductCRUD, OrdersManager, Analytics
│   ├── hooks/               # useCart, useMascot, useSoundFx, useCoupon
│   ├── stores/              # cartStore.ts, mascotStore.ts (Zustand + Persist)
│   ├── types/               # product.ts, cart.ts, mascot.ts, order.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.example             # Template biến môi trường
├── .env                     # MONGODB_URI (Bảo mật, đã gitignore)
├── package.json
└── tsconfig.json
```
