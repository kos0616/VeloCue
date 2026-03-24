# VELOCUE SEO 發版檢查清單

## 1. 基本 SEO

- [ ] `title` 是否對應當前頁面主題，且可讀性高
- [ ] `meta description` 是否為自然中文，且可說明產品價值
- [ ] `canonical` 是否為正式站點網址
- [ ] `lang` 是否維持 `zh-Hant`

## 2. 社群分享

- [ ] `og:title`、`og:description` 與頁面內容一致
- [ ] `og:image` 可正常存取（建議 1200x630）
- [ ] `twitter:card` 使用 `summary_large_image`
- [ ] 分享連結預覽圖與文案是否正常

## 3. 結構化資料

- [ ] `WebSite` JSON-LD 正確
- [ ] `SoftwareApplication` JSON-LD 正確
- [ ] `FAQPage` JSON-LD 問答內容與頁面定位一致

## 4. 可抓取性

- [ ] `robots.txt` 可存取且指向正確 sitemap
- [ ] `sitemap.xml` 包含要曝光的主要路由
- [ ] sitemap 網址使用正式網域（非本機）

## 5. 部署後驗證

- [ ] 使用 Google Rich Results Test 檢查結構化資料
- [ ] 使用社群除錯工具檢查 OG（Facebook Sharing Debugger / X Card Validator）
- [ ] 在 Search Console 重新提交 sitemap
- [ ] 手動搜尋品牌關鍵字，確認索引標題與描述

## 6. 常見錯誤

- canonical 仍指向舊網域
- sitemap 還是本機網址
- OG 圖檔路徑錯誤或被 404
- `noindex` 被誤加到正式版
