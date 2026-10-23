# AI 接手文件

這是完整可執行的手機圍籬勘查工具，不只是展示畫面。從 ai.html 讀取 README、原始碼索引、單一檔案及完整原始碼 JSON 即可重建。

## 架構與資料流
index.html + style.css → app.js 編輯勘查草稿 → estimate()/lines() 試算 → schedulePreview以250ms合併更新 → 同源 iframe studio.html 驗證 origin/source 及幾何資料後顯示；首次開啟自動載入圖面。按確認保留design與表單快照標記為已確認。
後續表單修改自動更新預覽並標示尚未重新確認。完整配置工作室另開後的編輯不反寫勘查表。

## 檔案與函式
- app.js：fresh/seg 預設；migrate 舊資料補欄位；validate 範圍檢查；render 表單；design 幾何資料；estimate 材料；lines 報價項目；quote 總額計算；update 儲存及摘要；sendPreview/schedulePreview 與確認按鈕處理即時圖面。
- studio.html：既有單檔 Canvas 工作室。window.fenceStudio 暴露 getState、validate、stats 等；父頁訊息 type=sq-survey-design。
- test.cjs 透過 VM 載入計算部分，測實際數量與資料；非完整 UI 測試。

## 儲存與匯出契約
localStorage key：sq-field-survey-v1。
完整資料 format=sq-field-survey，version=1，meshQuantityUnit=m。
project：name/client/phone/address/date；conditions：ground/access/slope/demolition/boundary/utilities；notes 自由備註。
segments[]：length(m)、turn(相對前段角度；第一段絕對方向)、height(m)、spacing(m)、wire(mm)、mesh(圖面近似mm)、meshChoice(採購名稱)、meshMat、base、depth(m)、railCount、postDia(mm)、type、gate、angle、excavator、note。
base：plate 底板、buried 混凝土埋入、direct 單獨埋入；excavator：待確認／需要怪手／不需怪手。
rates：mesh(元/m)、post、rail、plate、buried、direct、gate、labor。pricing：extra/discount/tax/excavatorShifts/excavatorRate/excavatorTransport。
完整匯出另外含 design/estimate/quoteLines，均可由來源重新計算，不要把舊匯出的小計當作真實來源。
幾何 format=sq-fence-design，version=1；nodes x/z公尺，edges a/b端點索引。朝向0°東、90°北，z減少為北。

## 核心算法與限制
每段跨數 ceil(length/spacing)，接點共享端柱；門段只有兩端柱，不生中間柱。網量=sum(非門段 length)，絕不能乘 height。橫桿=sum(length*railCount)。單獨埋入／混凝土／底板按接點計處；工法交界採先出現段，需人工覆核。
單價尚未按規格拆分，怪手施工費=excavatorShifts*excavatorRate，進退場費=excavatorTransport，各自列在lines；quote()計算小計、折讓、稅與總額，JSON/CSV/列印均含這兩項。全案估價不按需求段數倍乘，舊檔由migrate補0，保留原extra避免丟失，固定扣件及耗損另列。正2英吋與2英吋名稱必須區分，但圖面mm僅近似；不要推定供應商規範。
200段、單段5000m、總長20000m上限是試算工具效能限制。大案3D可能很細小，不是結構設計圖。
安全：表單插入HTML先經esc，匯入有大小與格式限制，postMessage只接受同源父頁，沒有雲端同步。

## 接手驗收
1. 長150m高1.8m的網量=150m，改高3m仍150m。
2. 門段不算菱形網長度。直線連段共用柱。
3. 開啟或載入表單即有示意圖；修改後自動更新，確認狀態失效。
4. 150m以上可套入；多段任意左右彎折保留。
5. 50cm埋深、四種網目、怪手與direct匯出後載入不丟失。
6. 390px寬度無整頁橫向溢出，底部切換與表單操作可用。
7. 修改原始碼後重新執行 build-handoff.cjs，保持 ai-source.json 與 ai-manifest.json 的hash同步。

## 部署
GitHub Pages main/root，所有資源採相對路徑，支援 /shangching-fence-survey/ 子路徑。不需 npm install。先測試再生成AI索引並提交；確認 Pages 成功後回報。不要把私人 Sites manifest 或 Git 憑證加入專案。

## 路線與新案操作
每段備註下方的 data-insert-fence 按鈕呼叫 insertSegment('fence',目前索引)，直接在該段後插入圍籬，render 後 showSegment 捲到新段，沿用即時預覽與自動儲存；後續段落及穩定 ID 不變。insertSegment(type,after) 可末尾或指定段後插入圍籬／門，新增 fence 用目前第一個 type=fence 的段落作範本（沒有時用 seg()），連 length 也帶入；高度、柱距、柱徑、線徑、網目、材質、橫桿、基礎、埋深一併複製。每次插入使用獨立資料與新 ID，turn=0、note留白，不回寫既有段落；第一段修改只影響之後新增的圍籬。門仍沿用最後圍籬規格，預設4m且柱徑至少89.1mm；不自動切割前一段，若要保持總長須自行調整。removeSegment/restoreSegment 保留最近刪除段的位置與規格，復原時不覆蓋後續表單編輯。blankDesign 一段10m圍籬；backupAndReplace 先成功寫入 sq-field-survey-previous 再換案，resetScene 清除確認狀態，由即時預覽更新新案圖面；取回上一案會與目前案交換。新設計自動顯示預覽，確認狀態重置。角度輸入支援0.1°，常用選單左右15～150°與180°。

## 勘場照片
photos.js（先於app.js載入）管理window.photoLibrary，IndexedDB sq-field-photos / images存 id→JPEG dataURL。data.photos保存{id,name,caption,segmentId,width,height,addedAt}，segments.id為穩定ID，插門不重用ID，刪除路段不刪照片。migrate為舊案補photos=[]與segment ID。JSON匯出expand會嵌入dataUrl；匯入先validatePhotos限制類型／20張／文字及dataURL上限，再原子IDB寫入，以新image id避免覆蓋其他案圖片，成功後才換目前資料。15MB匯入上限。新案／上一案保留照片索引；移除照片只移除目前案參照，保留影像供復原和上一案，暫無孤兒資料清理。不得把真實照片提交GitHub。壓縮使用Canvas，最長1600px，JPEG最多480000字元base64，無法讀取HEIC時請轉JPEG。照片只是現場參照，不自動定位、測量或改變3D幾何。列印含照片與文字備註；CSV及純3D設計檔不含照片。

## 勘查表帶入完整3D工具
openStudio 按鈕先 validate 表單及埋深，將 design() 去除段落內部備註及怪手需求，經 studio-bridge.js 存為本機一次性 sq-survey-transfer-<token>，同頁導航 studio.html?survey=<token>，不靠彈出視窗、不把案件內容放在URL，也不上傳伺服器。橋接檔檢查格式、24小時效期及尺寸，接收端再用工作室 validate 檢查設計。成功帶入前先將現有工作室設計備份至 sq-survey-studio-v1-before-survey 並保存新設計，然後替換畫面；支援按鈕交換恢復與復原。成功後刪除一次性資料並清除query；失敗保留工作室原圖並顯示錯誤。
逐段設定、網目名稱及單／雙開 gateType 保留，客戶PNG與CSV網目顯示名稱（工具修改毫米值後會退回實際mm），工法區分單獨埋入。菱形網統計及客戶圖片為不含門的長度公尺；保留舊outputFields.area鍵以相容，但其意義改為網長。正2英吋50.8mm可通過輸出欄位驗證，長段座標與長度輸入支援原表單上限。工作室管厚、橫桿管徑等仍為design()預設，出圖前須核對；配件估算有既有規則與限制。照片、內部備註、客戶電話、地址、報價不會帶入此圖面；需報價時由勘查表另行匯出／列印。

怪手只在報價區顯示與計價；各圍籬段不顯示怪手需求，也不顯示勾選段數或舊需求提醒。舊JSON的segments[].excavator保留相容，不參與費用計算。

新案件／新圍籬與3D工作室新增構件預設使用單獨埋入（direct），埋深50cm；後續圍籬沿用第一段設定。已儲存或匯入的案件保留原工法，不自動改寫。

新圍籬立柱外徑預設48.6mm，後續新增沿用第一段；門柱維持獨立規格（新門預設至少89.1mm）。已儲存／匯入案件保留原柱徑，不自動改寫。
