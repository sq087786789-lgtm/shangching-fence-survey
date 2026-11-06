# Repomix Token 實測（2026-11-06）

對照版本：e874cfe196c3165a6eb3cab49598d558d4cf3a31。Repomix MCP pack_codebase 對相同36個根目錄 JS／CJS／HTML／CSS，比較 compress:false／true；兩次清單一致，其他條件相同。

| 項目 | Repomix 回報 Token |
|---|---:|
| 完整打包 | 144,734 |
| 壓縮地圖 | 63,075 |
| 節省 | 81,659（56.42%） |

此為程式打包輸入量估計，不代表整段聊天／帳號配額或費用。對照組同樣套用既有去空行／忽略規則；排除照片、work、node_modules、.git及重複AI大包。未啟動監控或修改配置。

壓縮後仍可grep找到 inlineRows、drawInlineRow、mergeInlinePages；可先定位再局部讀取原碼。實作細節已省略，不能以地圖取代修改功能時的原碼檢查。

studio.html兩次均41547 Token，style.css均6329 Token，HTML／樣式限制整體降幅，不保證技能說明70～85%。本次為事後實測，不代表先前每步都有使用地圖；實際節省取決於後續讀入多少內容。

詳細條件／清單／暫存對照檔位置記於work/repomix-token-benchmark.json（ignored）。對照大包不加入公開Git或AI包。
