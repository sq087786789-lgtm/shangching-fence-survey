# AI 接手文件

接續前先讀 [HANDOFF.md](HANDOFF.md)，核對本機與正式部署狀態、正確工作室網址及待驗證事項。

這是完整可執行的手機圍籬勘查工具，不只是展示畫面。從 ai.html 讀取 README、原始碼索引、單一檔案及完整原始碼 JSON 即可重建。

## 架構與資料流
index.html + style.css → app.js 編輯勘查草稿 → estimate()/lines() 試算 → schedulePreview以250ms合併更新 → 同源 iframe studio.html 驗證 origin/source 及幾何資料後顯示；首次開啟自動載入圖面。按確認保留design與表單快照標記為已確認。
後續表單修改自動更新預覽並標示尚未重新確認。完整配置工作室另開後的編輯不反寫勘查表。

## 檔案與函式
- app.js：fresh/seg 預設；migrate 舊資料補欄位；validate 範圍檢查；render 表單；design 幾何資料；estimate 材料；lines 報價項目；quote 總額計算；update 儲存及摘要；sendPreview/schedulePreview 與確認按鈕處理即時圖面。
- studio.html：既有單檔 Canvas 工作室。window.fenceStudio 暴露 getState、validate、stats 等；父頁訊息 type=sq-survey-design。
- 推拉門直接拖曳：`slidingGateSpan`依slideOpen／direction算門片位置，`beginSlidingDrag`／`moveSlidingDrag`按畫面投影軸計算0–100%；`finishSlidingDrag`一次寫入復原歷史，pointercancel還原快照。只改slideOpen，不能移動門柱或調整長度。端點圈圈優先命中；平面推拉鈕避開端點。fit預留全開範圍；showControls控制操作鈕，嵌入預覽及客戶PNG不顯示。雙開／單開門保留原角度規則；示意滑輪與軌道不新增配件估價。
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
`segments[].existing`／`edges[].existing`缺省false；true表示整段已完成、只供位置參照，優先於meshOnly。既有段排除本次total／mesh／rail／gates／新增柱與基礎、自動配件及length-based labor；其已有柱位亦排除相接新段的新柱。全案手動加減及費用仍保留。note為最長20000字串，客戶圖及確認單保留既有名稱與備註，材料CSV排除。JSON完整保留以便編輯；新增段不繼承existing及note。customerReport提供rowIndices對應原段索引，CAD查選取規格不得直接用過濾後rows[index]。客戶簡版若含既有段，必須同時繪全案平面位置，不能只畫新段局部而遺失既有位置。
`segments[].meshOnly`／`edges[].meshOnly` 為可選布林值，缺省或舊檔為false。true只適用圍籬（type=fence／style=clamp），表示只裝圍網並沿用既有立柱；網量與安裝長度照算，不計新立柱、橫桿、基礎或自動管夾配件。原管材、工法與橫桿排數保留供切回一般圍籬，計算與繪圖須優先判斷meshOnly，不能只看railCount。混合配置若新段柱位落在既有柱位，也不重複計新柱。客戶規格須註明既有立柱、留空新管材與基礎尺寸；3D與共用線稿以虛線示意既有柱，不標新管長或埋深。
每段跨數 ceil(length/spacing)，接點共享端柱；門段只有兩端柱，不生中間柱。網量=sum(非門段 length)，絕不能乘 height。橫桿=sum(length*railCount)。單獨埋入／混凝土／底板按接點計處；工法交界採先出現段，需人工覆核。
單價尚未按規格拆分，怪手施工費=excavatorShifts*excavatorRate，進退場費=excavatorTransport，各自列在lines；quote()計算小計、折讓、稅與總額，JSON/CSV/列印均含這兩項。全案估價不按需求段數倍乘，舊檔由migrate補0，保留原extra避免丟失，固定扣件及耗損另列。正2英吋與2英吋名稱必須區分，但圖面mm僅近似；不要推定供應商規範。
200段、單段5000m、總長20000m上限是試算工具效能限制。大案3D可能很細小，不是結構設計圖。
安全：表單插入HTML先經esc，匯入有大小與格式限制，postMessage只接受同源父頁，雲端僅由 drive.js 手動觸發，授權範圍為 drive.file。

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

## Drive 整合接手
- drive.js：GIS token client + Google Picker + Drive REST v3；createStore 可在 Node 用模擬 fetch 測試。drive-config.js 僅公開瀏覽器設定；任何 client secret／token 禁止寫入來源及 AI manifest。
- app.js fullSnapshot() 在 await 前複製表單並計算衍生資料，再透過 photoLibrary.expand 嵌入照片；restoreSnapshot() 先移轉並驗證、原子寫入照片，backupAndReplace 成功備份目前案才換案。JSON 匯入與雲端載入共用此路徑。
- 只按儲存時上傳。每次新資料夾 appProperties={sqKind:survey-case,sqComplete:no}；完整JSON、去除內部段備註的3D設計JSON、影像子資料夾及照片說明全部成功後才 PATCH sqComplete=yes。載入清單只查成功版本，支援下一頁。中斷不刪檔、不覆寫舊案，可手動整理殘留未完成資料夾。
- 權杖只在記憶體，Google操作只用 https://www.googleapis.com 的固定路徑與 Bearer header，雲端ID限制字元避免路徑／查詢注入。照片及JSON延用20張/15MB限制，載入後由表單validate覆核，雲端衍生小計不可信。
- 根資料夾不硬編碼：使用者以相同帳號從Picker選取，才授予該網站drive.file的存取權。聊天插件的Drive連線不能代替網站授權。只顯示網站建立且完成的案件，不任意掃描整顆Drive。
- 檢查：node --check drive.js、node test.cjs、node drive-test.cjs、node build-handoff.cjs。模擬測試不是Google實際連線證明，發布後仍需實際登入、選資料夾、儲存含照片合成案並載入覆核。

「選取雲端 JSON 載入」可從 Google Picker 明確選取先前手動上傳的完整勘查JSON，不必由此網站建立。選檔後只讀取該檔，驗證大小、內容與照片，先備份目前案才換案；不改寫雲端來源檔。

### 已完成的雲端驗證（2026-10-23）
Google Cloud專案 shangching-fence-survey，Drive及Picker API已啟用；OAuth為外部測試模式，上慶帳號可登入。瀏覽器公開設定已限制來源；Picker Key限制該來源與Picker API。Google登入、選根資料夾、完整JSON雲端儲存均有實際成功結果。獨立合成JSON含1張測試照片：經Picker明確選檔載入，再由網站另存新版本，Drive確認完整JSON、3D JSON、勘場照片子資料夾、JPEG與照片說明均存在且未公開；已從網站版本清單載回含照片案，最後恢復測試前原案。模擬測試另覆蓋中斷上傳不標完成、分頁、無權杖及非法ID。
Google Picker視窗須用fixed置中，避免頁面捲動後視窗跑出畫面；樣式在style.css。不要把全域iframe樣式改到影響Picker。QA時Chrome擴充功能未開本機檔案存取，不能以代理工具上傳照片；以獨立雲端合成檔驗證載入、再存與還原，沒有覆寫既有雲端案件。手機390px無溢出，實體手機Google授權仍待覆核。


## 彙整確認單與iPhone／LINE輸出
頁首輸出確認單自動彙整表單材料、工法、總長、參照線稿、平面圖、地形與現場／路段注意事項，不另填補充。相同材料規格加總、不同規格分列；門長不計入菱形網。立柱接點以座標去重，門柱至少89.1mm；交界工法依先出現段，仍須覆核。客戶版不含價格，內部版附報價。使用者最新要求已取代舊版隱藏自由備註的行為：分享前須在預覽核對現場備註。
confirmation.js model為HTML與Canvas圖片共用資料來源；不把原始案件／報價物件藏入客戶檔。Canvas每頁1120×1584，逐頁編碼並釋放畫布，圖片與PDF均使用同份快照。PDF為JPEG頁面的A4多頁PDF，無外部字型、無第三方轉檔服務；中文字呈現為圖像，不能搜尋選取。按輸出後先產生PNG File與PDF File，再啟用分享按鈕，保留iOS使用者手勢。navigator.canShare(files)可用時呼叫原生分享面板，由使用者自行選LINE與收件人；未支援時提供圖片展開長按儲存、逐頁圖片下載及直接PDF下載。取消分享不自動重送；無自動傳訊或雲端上傳。iPhone實機LINE分享仍需由使用者覆核。

驗證紀錄：材料／共用柱／工法加總、客戶版排除價格與排除照片測試通過；合成案產生3頁PNG與A4 PDF，解析頁數與尺寸正確，並將PDF轉為圖片覆核中文、黑白線稿與分頁。離線SVG轉圖使用Resvg與本機中文字型；正式網站使用瀏覽器原生SVG解碼。本機預覽與GitHub曾受聊天專用網站拒絕紀錄阻擋；GitHub紀錄已經使用者明確核准撤銷，並實測恢復存取。本機預覽限制保留。瀏覽器下載與發布結果以當次GitHub Pages驗收為準；iPhone LINE實機仍待覆核。


2026-10-23 線稿版：確認單上方改為與工作室共用 reference-drawing.js 的黑白參照線稿（圍籬正面局部2跨、全案平面與大門），下方加總材料規格、工法、地形與注意事項。同規格合併展示，尺寸mm／總長m。確認單不含勘場照片或照片備註，不讀取照片儲存庫；照片仍保留在案件與Google雲端備份。app.js confirmationSnapshot() 與含照片的 fullSnapshot() 分開。未由表單實填的橫桿外徑不在確認單標尺寸。發布時須同步更新reference-drawing.js、studio.html、confirmation.js、index.html及AI索引；iPhone實機分享待覆核。

## 管材規格（2026-10-24）
立柱、橫桿分別選外徑及厚度；常用48.6／60.5mm，支援其他自訂。厚度按業主用語標示1.4mm亞管、1.8mm鍍鋅管，其他厚度亦可填。新段沿用第一段；無橫桿不列材料。JSON、雲端、3D與確認單保留規格。舊案新增欄位保留待確認，不將工具幾何預設視為實際材料；管種名稱依厚度快捷標籤，不代表材料認證。

## 手機勘場與公司接續（2026-10-24）
每次雲端存檔建立姓名｜地點｜台灣儲存時間｜案件名資料夾，完整JSON含參數及照片，另有3D JSON及照片子資料夾；保留歷次版本，不覆寫舊案。缺姓名／地點會明確標未填。公司電腦登入相同Google帳號、選相同根資料夾，可搜尋已載入案件的姓名地點日期，較舊版本用載入更多；舊命名仍可載入。手機客戶簡版使用全案路線簡圖，合併材料工法與地形，保留全部交代事項，優先一頁；超量自動續頁以維持可讀。公司完整版保留詳細線稿和報價。照片備份保留，不放客戶PDF。iPhone原生分享及本次命名雲端實際連線另行覆核。

## 客戶輸出返回鍵（2026-10-24）
confirmDialog使用flex固定頂部與底部返回列，只有confirmBody滾動；預覽iframe與展開圖片皆不遮住返回。三個返回鍵共用returnToSurvey：關閉對話框、取消待完成的渲染、釋放輸出暫存並回焦點，案件資料與照片保持原值。Escape保留可用。

## 手機欄位簡化（2026-10-24）
立柱／橫桿厚度與管徑只顯示選單，選其他才出現自訂數值；匯入非預設規格會顯示自訂欄位。底部固定「客戶簡圖」按鈕、頁首與配置區「給客戶看簡易圖／PDF」均直接開啟一頁優先客戶簡版。埋深改選單（10、20、25、30、40、50～200cm等，保留舊案其他數值），底板顯示不需埋入並輸出0cm；切換回埋入工法會取回該段先前埋深。新段單獨埋入仍先帶50cm，可修改。

## 局部參照與師傅討論（2026-10-24）
手機客戶簡版只放第一個圍籬段的局部樣式參照（純大門案用大門），不放平面圖；所有不同規格與事項仍完整彙整，下方提示其他差異依規格。公司完整版維持多種局部參照與總覽。頁首「師傅討論大圖」用一次性本機資料帶入並直接開工作室線稿：選段、局部兩跨、20～600%放大、符合視窗、單段或全案平面、SVG向量下載。放大只改觀看不改尺寸。平面輸出不畫立柱圈；工作室平面只有編輯模式顯示可拖曳端點。詳細討論圖為製作參照，非結構設計。


AI 接手包中的 drive-config.js 是 apiKey 留白的設定範本（configurationTemplate=true），不可直接覆寫既有網站設定；新網站須自行設定 Google Picker Key。ai-source 的範本校驗值依留白內容計算，ai-manifest 仍核對實際網站檔案。


## 立柱總長與局部柱距（2026-10-24）
每段新增 postLength（公尺），代表整支立柱總長，包含埋入部分；新案預設2m，新增段沿用第一段。地上柱長=postLength−埋深，底板用0埋深。圍籬／門高是獨立設定，不會偷偷調整；若管長扣埋深低於圍籬／門高，表單和確認單提醒核對。立柱總長必須大於埋深，可填0.5～10m。
既有案未填此欄時，按原圖高度加4cm柱頂餘量及埋深回推，保留原圖形狀；這是舊圖推算值，使用前須核對實際管長。既有3D設計亦相容。JSON、Drive備份、3D、CSV與材料彙整皆保留管長，長度不同分組。
共享線稿及3D立柱依實際管長減埋深繪製。局部兩跨是設定柱距的樣式參照，每跨直接標「柱距 2 m」等輸入值，不顯示兩跨柱心合計或均分後毫米值；全段總長仍依原資料，估算數量及幾何節點不變。整段／大門可保留總長尺寸；管徑維持mm。

## 確認單去除重複工法（2026-10-24）
材料規格與數量加總只列材料與管長（例如「管長2m」），不重複「含埋入」、埋深、單獨埋入／混凝土／底板固定的處數。工法彙整統一顯示施工方式、埋入公分及土面上公分，例如「單獨埋入，埋入50公分，土面上150公分」。地上長度依管長扣埋深計算；底板不需埋入。相同材料跨工法仍加總，相同工法但埋深或地上高度不同則分列。實際案件參數、基礎數量計算與內部報價不變。HTML、PNG、PDF共用此model；3D規格輸出將管長標題簡化為「立柱管長(m)」。

## 清楚配色（2026-10-24）
介面改為深藍標題、白底欄位、藍色主要按鈕及較深文字，手機維持44px操作目標。3D用淺灰地面、銀灰管材與深灰網線，綠色／黑色網仍依材料設定；管材多邊形加入明暗，遠距地面改5m網格減少干擾，近距維持1m。畫面新增＋／−縮放，置中仍可恢復全案；尺寸、材料代號、價格及案件參數不受配色影響。工作室桌機版使用可用視窗高度，手機保持垂直排列與捲動。CAD共享線稿保留黑白；確認單文字改深灰、頁頂藍色，HTML／PNG／PDF一致。

清晰度覆核補充：帶入與備份說明預設收合，返回與帶入狀態仍顯示。置中改按實際使用端點、地上／地下投影範圍與視窗大小取景，避免長圍籬被過度縮小；不改案件座標。

## 手機勘場與客戶核對版面（2026-10-24）
重點改為手機勘查表：精簡頁首，新增／匯入／匯出與師傅大圖放「案件」選單；案件資料優先，雲端操作與長篇說明預設收合。每段尺寸、立柱網片、橫桿工法分組，主要數值加大，底部「給客戶看」保持明顯。
客戶確認單以預覽為主，底部固定返回與PDF分享，其他輸出收合。HTML預覽採手機字級、總長摘要、清楚的材料數量與工法卡片；線稿可點擊放大並水平捲動，不重複生成圖。iframe依內容自動加高，讓外層單一區域捲動。PNG與PDF資料和一頁優先策略保留，價格與照片排除規則不變。無自動LINE傳送；由使用者分享面板選擇收件人。

## iPhone PDF與LINE（2026-10-25）
使用者實機確認：網站直接呼叫檔案分享時沒有LINE選項，但下載PDF開啟後，iPhone下方原生分享可選LINE。因此主要按鈕改為「開啟PDF／傳LINE」，與「下載／開啟PDF」共用既有PDF開啟／下載流程，不再對PDF呼叫navigator.share。提示開啟PDF後用下方分享圖示選LINE；圖片分享保留原路徑。不自動選LINE或傳給任何收件人；實機分享面板由使用者操作。

## 工作室端點與推拉門
正式修改入口為 studio.html。上方可選 A/B 端、分開單端或兩端；編輯模式點圈圈分開接點，拖曳只修改本段，其他段不動。端點距離小於16螢幕像素且不超過0.4m時提示橘圈，放開接合；可關閉自動接合。方向箭頭依平面圖，選取端轉動、另一端固定，保留長度；拖曳轉向模式支援Shift對齊45度。精確角度仍可輸入。
推拉門採style=gate、gateType=sliding、slideOpen=0～100、direction=±1，單片沿段落方向平移。可從樣式區或門型選單選取，長度欄為門柱內側淨開口。門段不列入圍籬網長及管夾；既有門框/門柱估算不代表推拉軌道、滑輪、導輪、馬達等實際五金清單。參照正面為關閉單片門，平面依開啟程度平移；勘查表也可選推拉門，確認單保持正確門型。工作室修改仍不反寫原勘查表。

## 工作室刪除與快捷鍵
頁首「刪除本段」與右側刪除按鈕共用操作，僅刪除目前選取段，可復原。Delete刪除、Ctrl+Z復原、Ctrl+Y或Ctrl+Shift+Z重做；Mac可用Command。輸入欄位、下拉選單、可編輯文字、中文輸入組字或參照圖對話框開啟時，不攔截編輯器按鍵。不用Backspace刪段；長按Delete不連續刪除。刪除最後一段後按鈕停用，復原可恢復。
