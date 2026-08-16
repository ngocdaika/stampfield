# Stampfield — Camera Đóng Dấu thời gian & vị trí

Bản cài đặt (PWA) của thiết kế **“Camera Đóng Dấu - iOS”** (Claude Design). Chạy trực tiếp trong Safari iPhone
(thêm vào Màn hình chính để mở toàn màn), không cần App Store. Toàn bộ 8 màn của thiết kế được hiện thực:

| # | Màn | Ghi chú |
|---|-----|--------|
| 1 | Onboarding / quyền | Xin quyền camera + vị trí thật; trạng thái ĐÃ CẤP / TỪ CHỐI |
| 2 | Camera | `getUserMedia`, GPS `watchPosition`, la bàn, chip GPS đổi màu (ok / yếu / mất / từ chối), watermark **kéo – thả hít vào 5 neo** (TL/TR/BL/BR/BC), chế độ ẢNH / VIDEO / LIÊN TỤC, flash (torch), 4:3 / 16:9 / 1:1, đổi camera |
| 3 | Mẫu watermark | Nhiều mẫu, bật/tắt trường, DMS/DEC, cỡ chữ, độ mờ nền, màu, vị trí, logo đơn vị, mã xác thực (hash) |
| 4 | Xem trước & lưu | Ảnh đã đóng dấu, metadata, ghi chú, chia sẻ, chụp lại, lưu vào dự án |
| 5 | Thư viện | Nhóm theo Dự án / Ngày / Bản đồ (sơ đồ), chọn nhiều → **PDF** (bảng ảnh + metadata) / **ZIP** (ảnh + `metadata.csv`) / xóa |
| 6 | Chi tiết ảnh | Minimap, tọa độ, độ cao · hướng, người chụp, tệp; chia sẻ / xuất PDF / xóa |
| 7 | Dự án | Chọn dự án đang chụp, tạo mới, giữ lâu để sửa/xóa |
| 8 | Cài đặt | Định dạng ngày giờ, đơn vị tọa độ, chất lượng ảnh, tự lưu vào Ảnh iOS (qua Share sheet), người chụp, Light/Dark/Theo hệ thống, Việt/English, xóa dữ liệu |

Watermark được **đốt vào ảnh** bằng canvas (cùng bố cục với thẻ trên viewfinder); ảnh gốc + metadata lưu trong
IndexedDB trên máy. Địa chỉ lấy từ Nominatim (OSM), thời tiết từ Open-Meteo (chỉ khi bật trường tương ứng) — không có
mạng thì bỏ qua, app vẫn chụp được (service worker cache app shell để chạy offline ngoài công trường).

## Chạy thử trên máy tính

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Mở <http://localhost:8765>. Trên màn hình rộng, app hiển thị trong khung iPhone 393×852 kèm bảng điều khiển bên phải
(chuyển màn, Light/Dark, Việt/English, neo watermark) giống mục 1a của bản thiết kế.

## Cài lên iPhone

Camera / GPS chỉ hoạt động qua **HTTPS** (hoặc `localhost`). Đưa thư mục này lên một host tĩnh có HTTPS
(GitHub Pages, Cloudflare Pages, Netlify, IIS nội bộ có chứng chỉ…), mở bằng Safari → Chia sẻ → **Thêm vào MH chính**.
Lần đầu mở, cấp quyền Camera + Vị trí ở màn Onboarding. Ảnh muốn vào ứng dụng Ảnh của iOS: bật “Tự lưu vào Ảnh iOS”
(sau mỗi lần chụp hiện Share sheet → *Lưu ảnh*), hoặc chọn ảnh trong Thư viện → Chia sẻ.

## Tệp

- `index.html` · `styles.css` · `app.js` — toàn bộ ứng dụng (không cần build)
- `manifest.webmanifest` · `icon.svg` · `sw.js` — PWA
- `serve.ps1` — server tĩnh để thử trên Windows
