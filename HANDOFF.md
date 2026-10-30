# 圍籬工作室交接紀錄

## 2026-10-30：GitHub統一工具入口

- 已實際讀取Render正式入口，確認「圍籬配置工作室」仍連到hongsing-fence-planner舊專案，這是入口連結落後，昨天新版studio本體部署仍正確。
- 使用者明確選擇「一個GitHub總入口集中管理所有連結，各工具保留自己的專案」。新增 `tools.html`＋`tools.js`＋唯一清單 `tools.json`；正式網址 `https://sq087786789-lgtm.github.io/shangching-fence-survey/tools.html`。工作室卡片直連同專案studio，常用工具包含勘查、進銷存、裝車、尺寸、名片、官網；舊圍籬工具收在legacy展開區，官網預備專案連結亦保留。
- 清單根據GitHub帳號全部7個公開專案與現有正式入口盤點；工作室與勘查共用本儲存庫，沒有額外複製工具。工具連結統一不代表案件資料自動同步。新增／修改連結只編輯本專案tools.json；本體功能在各自儲存庫修改。AI來源打包同步含3個入口檔案。
- 原Render入口的來源在 `E:\GPT\fence-inventory-free\public\tools.html`，改成自動轉址與手動備援連結；/admin保持原址。該專案先正常快轉遠端ef3acfb再修改，自己的HANDOFF.md同步記錄。沒有修改舊hongsing-fence-planner、登入設定或資料庫。
- 通過node --check app.js、tools.js及完整node test.cjs、兩入口HTML結構／ID檢查、8張卡片與全部7個公開專案清單核對。新增入口為獨立導航，不改計算核心。
- 本次Chrome工具已恢復可用。已在本機HTTP使用真實Chrome驗證桌機配置、實際390 CSS px寬度（innerWidth=390、scrollWidth=371，無水平溢出）、7張常用卡片、舊版展開與卡片實際開啟新版studio（含推拉門／分組工具列）。檢查後還原暫時viewport覆寫；先前「Chrome不可用」紀錄屬歷史狀態。本次未重新執行全部工作室幾何互動實測。
- **已上線：** GitHub入口來源提交 `be4118ca7c89e00266bd9bbce53c5466d8b69461`，Pages執行 `41019028571` completed/success；tools.html／tools.js／tools.json正式檔案HTTP200，SHA-256全部與本機已測試來源一致。Chrome正式頁已完整載入清單，驗證截圖保存在忽略目錄 `work/tools-live-20261030.png`。
- 原Render入口轉址提交 `965a4c859dd1633951c63ccd896f4de35ec2702a` 已推送main並自動部署；正式tools.html HTTP200且SHA-256與轉址來源一致，/ready HTTP200。已直接重新整理使用者原本的Chrome入口分頁，確認自動抵達GitHub總入口並載入全部7張常用卡片；保留該正式入口分頁，暫時測試分頁與viewport已清理。
- 以後新增或修正工具連結只改tools.json，本體程式仍修改各工具自己的專案並部署。完成每次任務都更新HANDOFF.md，並重建AI來源索引；不再另維護Render的工具卡片清單。

## 2026-10-29：工具列分組與上方留白壓縮

- 依使用者截圖整理studio上方：新增／操作／視角／檢視按用途靠左排齊、自動換行，取消兩端拉開的大片空白；編輯本段保留橘色。勘查表橋接提示改成緊湊橫條，備份說明仍可展開。
- A／B端與拖曳轉向留在同排，旁邊「接點／方向」按鈕控制獨立面板，維護hidden／aria-expanded。分開接點、自動接合與15°微調均保留；方向箭頭改單排，操作說明／快捷鍵收進面板內展開，編輯狀態只占窄條。左側桌機構件卡片同步縮小留白。
- 一般／放大圖面模式沿用全部原按鈕ID；放大模式顯示復原／重做／刪除，隱藏新增組及狀態條。手機按鈕維持至少44px並可換行；沒有修改設計資料、幾何、材料數量、雲端或舊hongsing-fence-planner。
- 通過app語法與完整node test.cjs、工作室全部內嵌腳本語法、HTML巢狀與ID唯一／原控制項完整性檢查；實際新面板事件開關及ARIA同步檢查通過。AI來源索引已重建。此次為可回復的版面調整，未新增測試套件。
- 瀏覽器操作工具目前仍無法連線；尚未完成Chrome／390px實際畫面驗證，不將程式檢查當成實機驗證。
- **已上線：** 功能提交 `fcad061c05b982443ce64e8862314ddcf62c8c99`，Pages執行 `40822169450` completed/success；正式studio HTTP 200，SHA-256與本機測試來源完全一致：`0e3b3ebb1409eeb876c84bf9eb1e8da9ccadf1a47e572d8d6fefadb70c95c989`。
- 新版入口：https://sq087786789-lgtm.github.io/shangching-fence-survey/studio.html?v=fcad061-toolbar 。交接及AI重建來源同步。

## 2026-10-29：中間編輯圖面放大與選取段取景

- 使用者確認太小的是中間拖拉圖面。一般桌機模式縮窄左側構件欄並壓縮工具列／數量區留白，手機完整工作室的畫布增高為70dvh、至少380px；嵌入勘查預覽維持原樣。
- 上方新增「放大圖面」，用視窗內的大圖模式暫時隱藏兩側、頁首及次要摘要；保留移動／編輯／視角／A-B轉向、置中、縮放、尺寸及復原／重做／刪除。按「返回一般畫面」或Esc退出；訊息提示在大圖模式仍可顯示。
- 新增「看清本段」，只按選取段取景，保留全案置中；resizeCanvas依實際畫布與裝置像素比例重設解析度。切換模式只調相機，設計、數量及歷史不改；退出恢復原捲動位置。手機大圖模式不跳到已隱藏的右側設定。
- 已通過 `node --check app.js`、`node test.cjs`；新增測試覆蓋放大／返回／Esc、像素尺寸、選取段取景及設計／歷史不變。HTML結構及ID檢查另執行。瀏覽器工具仍回報停用，本次未完成Chrome／390px實機畫面驗證，不要求使用者重複切設定。
- **已上線：** 功能提交 `fa330b156a2fd4af3ce5bd7f0eca8b10bc09ce19`，Pages執行 `40821333728` completed/success；正式studio HTTP 200，SHA-256與本機測試來源一致。
- 新版入口：https://sq087786789-lgtm.github.io/shangching-fence-survey/studio.html?v=fa330b1-canvas 。交接及AI重建來源同步；真實Chrome／手機畫面操作狀態如上。

## 2026-10-29：移除精確角度與座標欄位，保留刪除

- 工作室右側移除「精確角度／連動設定」整區；「端點座標與刪除」改為直接顯示「刪除本段」按鈕，不再有X／Y座標輸入。
- 同步移除已刪控制項的事件綁定、數值同步與輸出前讀取，避免找不到欄位造成初始化或匯出錯誤。常用設定的段落選單、圖上A／B拖曳、上方方向／轉向、刪除與復原保留；JSON節點及既有配置不改。
- 已通過 `node --check app.js`、`node test.cjs`；另檢查HTML結構、ID唯一及移除欄位沒有殘留程式引用。本次為設定區簡化，未新增測試；Chrome／手機實際操作仍待可用連線覆核。
- **已上線：** 功能提交 `f3822f40afb3e7177dd9fddda65f23b792271ab2`，Pages執行 `40817440088` completed/success；正式studio HTTP 200，SHA-256與本機測試來源一致。
- 新版入口：https://sq087786789-lgtm.github.io/shangching-fence-survey/studio.html?v=f3822f4-simple 。交接及AI重建來源同步。

## 2026-10-29：簡易圍籬、獨立立柱／門柱與長度分列

- 工作室構件樣式加入簡易圍籬（立柱＋菱形網），沿用clamp／railCount=0；選取後不顯示橫桿數、上橫桿固定、橫管形式／管徑／厚度。改回管夾式可恢復橫桿設定；舊零橫桿段亦辨識為簡易圍籬。
- 管材移到管材與固定區最前，選鍍鋅管帶入柱厚1.8mm，錏管／亞管1.4mm；手動厚度仍可調，不在載入或換段時覆寫。立柱與門柱的管徑／厚度欄位分開，常用42.7／48.6／60.5／76.3／89.1mm選單及數字自訂並存，僅改選取段。
- 勘查表同步新增樣式、管材及獨立門柱欄位；可選gatePostDia／gatePostThickness／gatePostMaterial與立柱值分開，postMaterial獨立於厚度。舊案沒有新欄位時保留原幾何與規格；帶入工作室換算成原有實際postDia／thickness／material。淨開口輸入轉回柱心length時加門柱外徑，未改舊檔length語義。
- CSV、客戶圖片及共用線稿分列圍籬長度(m)／大門淨開口(m)，柱外徑、厚度與管長也分立柱／門柱。門淨寬尺寸線取門柱內側；確認單門寬改以實際淨開口描述。舊輸出隱藏設定向新欄位繼承，不改既有數量／預覽操作。
- 配件自動計算先排除零橫桿段，避免簡易圍籬排在第一段使其他有橫桿段漏算；新柱與網長照計。既有圍籬排除與只裝網規則保留，照片及雲端未修改。
- 已通過app／confirmation／reference-drawing語法檢查與node test.cjs。新增實際選項／事件測試包含簡易欄位隱藏、有／無橫桿混用、材質厚度預設與自訂、兩角色管徑數字／提交／驗證、淨開口轉換、舊案／JSON／bridge相容、未知厚度、獨立輸出欄位與舊勾選繼承。HTML結構及唯一ID檢查通過。
- 已以共用CAD產生並檢視簡易圍籬與大門的合成線稿。瀏覽器工具仍回報停用，故不宣稱完成Chrome／390px頁面實機驗證，也不要求使用者重複切設定。
- **已上線：** 功能提交 `d22b13693d77218d9563d5bacaaf785aa2af3fd0`，Pages執行 `40802905061` completed/success；正式studio、app、confirmation、共用繪圖核心及index皆HTTP 200，SHA-256與本機測試來源一致。
- 新版入口：https://sq087786789-lgtm.github.io/shangching-fence-survey/studio.html?v=d22b136-posts 。交接及AI重建來源同步；Chrome／手機實際操作狀態如上。

## 2026-10-29：推拉提示移到門片下方，避免遮擋

- `studio.html`將推拉操作鈕從門片中央移到整片門投影範圍下方，改為淡色底／灰色外框；保留44px操作高度、直接拖曳、百分比與「推拉門」名稱。藍色名稱／尺寸標示及客戶PNG隱藏操作鈕的規則保留。
- 置中適配在選取推拉門時預留80px下方空間，讓操作鈕在窄版畫布內可見；門片、門柱、開啟方向、尺寸與數量不改。頁面及README的操作說明同步更新。
- 已通過 `node --check app.js`、`node test.cjs`；在既有直接拖曳測試增加立體／平面、左右兩方向、0／50／100%開啟時操作鈕與門片不重疊，350×300畫布內仍可見的檢查。原拖曳、復原、既有圍籬與材料排除測試均通過。
- 用實際Canvas程式產生並檢視新版門片畫面，確認操作鈕位於門下方且無紅色遮擋；本次未進行Chrome或手機頁面實機操作驗證。
- **已上線：** 功能提交 `598e8196e3ca0869615074cdc9dd4517b9023da8`，Pages執行 `40799885561` completed/success；正式studio HTTP 200，SHA-256與本機測試來源一致。
- 新版入口：https://sq087786789-lgtm.github.io/shangching-fence-survey/studio.html?v=598e819-clear 。交接及AI重建來源同步。

## 2026-10-28：既有圍籬參照及備註，排除本次施工

- 工作室右側常用設定新增「既有圍籬／門（不列本次施工）」勾選與段落備註；勘查表同步新增施工範圍。逐段existing預設false，note保留匯入及JSON，舊資料相容。與meshOnly（還要裝網）分開。
- 既有部分在3D以灰色及「不施工」名稱呈現，備註另列，關閉尺寸仍保留名稱。客戶PNG保留完整位置與備註，CSV規格／材料排除既有段。完整可編輯JSON保留全部段落。
- 本次長度、網長、橫桿、門數、新柱／基礎、自動配件及依長度計算的施工費排除既有段；新段與既有柱共用處不重算新柱。全案手動配件加減及自行填寫費用保留，不能推定屬於哪一段而自動刪除。
- 客戶確認單保留既有位置與說明，含既有段時簡版自動增加全案平面參照；材料及工法表只列本次施工。共用CAD以灰色虛線區分既有位置、保留備註並跳過其新材料規格。規格過濾後用rowIndices找原段，避免選取新段卻顯示另一段規格。
- 新增普通／獨立圍籬或大門不沿用既有旗標與備註；既有旗標可復原，取消標示不刪原備註。名稱／備註插入HTML及SVG均跳脫。
- 已通過 `node --check app.js`、`node --check confirmation.js`、`node --check reference-drawing.js`、`node test.cjs`。新增案例含混合既有／新作、共用柱、材料CSV排除、客戶及內部確認單、備註跳脫、正確段落規格、全部既有時零施工量、舊檔／JSON／bridge、新增不繼承、復原及實際表單產生內容。
- 已以實際Canvas程式產生合成既有／新作混合圖並檢視灰色、名稱與備註；無真實客戶資料，示例留忽略的work目錄。Chrome／390px實際頁面操作仍待可用連線覆核；未變更照片或雲端功能。
- 使用者已確認範圍：「客戶圖保留，材料與報價排除」。
- **已上線：** 功能提交 `8dddb1565be382fafcebe4a22dcf7c4e1f9ca695`，Pages執行 `40672856881` completed/success；正式studio、app、confirmation、共用繪圖核心及index均HTTP 200，SHA-256與本機測試來源一致。
- 正式入口：https://sq087786789-lgtm.github.io/shangching-fence-survey/studio.html?v=8dddb15-existing 。交接與AI重建來源同步，真實Chrome／手機操作驗證狀態如上。

## 2026-10-28：圖面明確標示「推拉門」

- 工作室立體／平面圖的門寬標籤由「門」改為「推拉門」，橘色操作鈕同樣寫「推拉門」。即使關閉尺寸，仍保留推拉門名稱；客戶PNG沿用相同圖面。
- 共用線稿平面段名及工作室的參照圖段落選單亦顯示推拉門；正面線稿原已使用推拉門名稱，保留。更新繪圖核心版本避免快取舊標示。
- 僅修改名稱標示，未改門片幾何、拖曳、數量或資料格式。已通過 `node --check app.js`、`node --check reference-drawing.js`、`node test.cjs`。
- **已上線：** 功能提交 `a3278af3378e72ce444a480f0972c028770dceb3`，Pages執行 `40671008926` completed/success；正式工作室、共用繪圖核心與index來源均與本機SHA-256一致。另已檢視實際Canvas產生的關閉尺寸／隱藏操作鈕畫面，確認仍顯示「推拉門」。真實瀏覽器操作仍依下方既有記錄待覆核。
- 新版入口：https://sq087786789-lgtm.github.io/shangching-fence-survey/studio.html?v=a3278af-label 。

## 2026-10-28：推拉門外觀與直接拖曳開關

- `studio.html`推拉門新增中央門框、腰桿、雙格補強、把手、兩個底輪與地面軌道示意；一般圍籬、雙開／單開門及只裝網維持原計算。滑輪／軌道為外觀示意，不代入未知配件尺寸或數量。
- 選取推拉門後可直接拖橘色「↔ 推拉」鈕，即使目前為移動畫面模式也可開始；編輯模式可拖門片。左右方向、立體及平面圖均按投影軸調整0–100%開啟，門柱座標／門寬／其他段規格不變。A／B端點圈圈優先，仍可用原操作調整配置。
- 整次拖曳只新增一次復原紀錄；點按／微小抖動不新增紀錄，pointercancel恢復原狀，過小投影軸改提示用平面或滑桿。右側滑桿保留，加「關上／半開／全開」按鈕。
- fit預留推拉門全開範圍；右側開啟程度同步，客戶PNG隱藏橘色操作鈕，嵌入勘查預覽亦隱藏直接操作鈕。既有JSON的gateType／slideOpen／direction契約保留，無格式升版。
- `reference-drawing.js`共用正面閉門線稿同步門框、補強及底輪外觀，公司／客戶確認單沿用此核心；平面仍依實際開啟位置。`index.html`及工作室更新繪圖核心版本，避免舊快取。
- 已通過 `node --check app.js`、`node --check reference-drawing.js`、`node test.cjs`及HTML結構／唯一ID檢查。新增測試實際pointerdown／move／up／cancel處理器，覆蓋兩視圖與兩方向、上下限、欄位同步、門柱與其他段不動、一次復原／重做、取消、端點與平移優先、預設開度、全開適配、SVG底輪及輸出操作鈕隱藏。
- 另用本機Canvas繪圖套件執行實際draw程式，產生0／50／100%畫面並檢視門框、底輪、把手及全開範圍；合成示例僅放忽略的work目錄。瀏覽器工具仍回報停用，因此不宣稱已完成Chrome／390px頁面實機操作，不要求使用者重複切設定。
- **已上線：** 功能提交 `d03e0eaab010f4e9d9b8eaf7013f8918f4352d77`；Pages執行 `40670407462` 結果 completed/success。正式 `studio.html`、`reference-drawing.js`、`index.html` 皆HTTP 200且SHA-256與測試過的本機來源一致。
- 新版入口：https://sq087786789-lgtm.github.io/shangching-fence-survey/studio.html?v=d03e0ea-verified 。交接與AI來源同步；Chrome／手機實際頁面操作仍待可用連線覆核。

## 2026-10-28：只裝圍網，沿用客戶既有立柱

- 工作室上方新增「＋只裝圍網」，左側構件及右側樣式亦可選；勘查表每段「施工項目」同步支援。維持正確的 `shangching-fence-survey/studio.html`，沒有修改舊專案。
- 資料採逐段 `meshOnly: true`，仍為fence／clamp，舊檔缺省false；可混合一般圍籬與各種門。新增、套用樣式、切換、復原及JSON／勘查表帶入均保留。只裝網時收起新管材／工法設定，原值保留供切回；門不能同時為meshOnly。
- 網子與安裝長度照常計算，不計新柱、橫桿、底板、埋入及自動管夾／環帽／連結片／轉角。混合段落在既有柱上的共同接點也排除新柱，手動配件增減仍保留。
- 3D與共用CAD以灰色虛線示意既有柱，註明非本次供料；只裝網段不畫新橫桿／管夾／地下柱，也不標新柱管長或埋深。柱距為可調現場參照值。CSV／圖片／確認單註明沿用既有柱，排除新管材規格及施工量；客戶與公司兩版共用相同規則。
- 修改 `studio.html`、`app.js`、`confirmation.js`、`reference-drawing.js`；`index.html`與工作室的變更腳本版本同步更新，避免瀏覽器沿用舊繪圖核心。
- 已通過 `node --check app.js`、`node --check confirmation.js`、`node --check reference-drawing.js`、`node test.cjs`；新增檢查含純圍網／混合共用柱數量與報價、設定切回、新增／復原、非法門設定、JSON／bridge、CSV、客戶及公司共用CAD、舊檔與實際表單產生內容。HTML結構與ID完整性檢查通過。
- 真實瀏覽器與390px手機操作仍待工具連線可用時覆核；本次不宣稱已完成實機驗證。雲端、照片及既有資料保留。
- **已上線：** 功能提交 `9e45e54442eea8c8e7845f77def7744a740d3c05`；Pages執行 `40668418116` 結果為 completed/success。正式 `studio.html`、`app.js`、`confirmation.js`、`reference-drawing.js`、`index.html` 皆HTTP 200且SHA-256與測試過的本機檔案完全一致。
- 正式工作室：https://sq087786789-lgtm.github.io/shangching-fence-survey/studio.html?v=9e45e54 。程式／部署已驗證，真實Chrome及390px畫面操作狀態仍如上。

## 2026-10-28：上方新增門與簡化編輯畫面

- 正確來源仍為 `E:\GPT\shangching-fence-survey`，發布入口為 `studio.html`。本次沒有修改舊的 `hongsing-fence-planner`。
- 圖面上方新增「＋大門」「＋推拉門」，直接新增與選取新門段、進入編輯；保留既有圍籬與各段規格，新增可復原。按新增前先提交有效的欄位修改，欄位有錯就停止新增。
- 「編輯本段」改成顯眼橘色按鈕；圖上選取段加橘色線、編輯模式加橘色圖框與狀態列，明示目前第幾段及門型。右側標題使用圍籬／單開／雙開／推拉門的實際名稱。
- 右側預設只展開常用設定（選段、樣式、長度、高度、柱距，門段另顯示門型與開啟設定）。管材與固定、菱形網、精確角度、端點座標、輸出、配件及提案名稱各自可展開，既有欄位與處理器均保留。
- 上方接點分離、接合開關、方向箭頭與15°微調收進「接點／方向進階」，A／B端及拖曳轉向保留可見；快捷鍵說明可展開。手機按編輯會定位到設定，提供「回到圖面」；窄版工具列換行，主圖區可捲動，避免內容被裁切。
- 已通過 `node --check app.js`、`node test.cjs`；新增測試使用實際新增及復原函式，覆蓋兩種門新增、既有構件不變、自動選取與編輯、復原、手機設定定位、無效欄位停止新增、空白設計新增及模式提示。HTML結構、ID無重複及原欄位ID完整性另已檢查。
- 瀏覽器工具此次仍回報 `Local browser use is disabled in Work settings`。不要求使用者重複調整已啟用的設定；目前沒有完成真實Chrome與390px畫面操作驗證，程式測試不代表實機驗證。
- **已上線：** 功能提交 `9d076ed07dd99f00b58921f509a73eaefbb2e523`；GitHub Pages執行 `40666986096` 結果為 completed/success。正式 `studio.html` HTTP 200，與本機測試檔案SHA-256完全一致：`557d8fc6f7a3e9b58812cf5c70778a4bcdd06a8639a38e13bba65db6fd7895cd`。
- 本次正式連結：https://sq087786789-lgtm.github.io/shangching-fence-survey/studio.html?v=9d076ed 。交接及AI來源索引同步；真實Chrome與390px操作仍待可用連線覆核。

## 2026-10-28：上方刪除鍵與快捷鍵

- `studio.html` 頁首新增「刪除本段」按鈕，與右側刪除按鈕共用 `deleteSelectedSegment()`；無選取段時停用。
- Delete只刪選取段，Ctrl+Z復原，Ctrl+Y／Ctrl+Shift+Z重做；Command對應可用。長按Delete不連續刪除，不用Backspace刪段。
- 輸入欄位、下拉選單、可編輯文字、role=textbox、中文組字、已處理事件及參照圖對話框內，不攔截這些快捷鍵，保留原本欄位／視窗操作。
- 既有構件及接點計算不變；刪除可復原，刪除最後一段後仍可用快捷鍵復原。
- 已通過 `node --check app.js`、`node test.cjs`；新增實際函式測試包含刪除、復原、重做、Command、Shift+Z、輸入／組字／視窗／長按防誤觸、空白設計與還原。
- 本次瀏覽器工具仍回報停用，因此不宣稱已完成真實鍵盤／390px畫面操作驗證；不要求使用者重新切換已啟用的Chrome設定。使用現有Git登入同步，交接與AI來源索引一併更新。
- **已上線：** 功能提交 `1b08948e366f1979bfed684dc677a9f2c253492b`；GitHub Pages 執行 `40665554081` 結果為 completed/success。已透過HTTP核對正式 `studio.html` 與本機檔案SHA-256完全一致。
- 本次正式連結：https://sq087786789-lgtm.github.io/shangching-fence-survey/studio.html?v=1b08948 。下方端點／推拉門記錄為先前版本的追溯資料。真實瀏覽器及實體手機互動驗證狀態不變。

## 目前狀態：已上線（2026-10-28）

- 正式工作室：https://sq087786789-lgtm.github.io/shangching-fence-survey/studio.html?v=86ed241
- 使用者在自己的電腦完成 GitHub 登入與上傳。後續核對遠端 `main` 已包含 `2447967`、`2b309e8`、`86ed241`，再次 push 回覆 `Everything up-to-date`。
- GitHub Pages 部署成功：提交 `86ed241add6df7cbb8cb698ba0a6980fff2d6a94`，執行紀錄 https://github.com/sq087786789-lgtm/shangching-fence-survey/actions/runs/40664424762 。
- 已核對正式 `studio.html` 與本機來源 SHA-256 完全一致：`6a3c81119ff595a105843fc3728ceea7fe916778b990adf59bd5482d991567a5`。正式內容包含推拉門、A/B端分開、靠近接合及上下左右方向按鈕。
- 下面保留先前受阻紀錄供追溯，最新狀態以本節為準。
- 真實瀏覽器互動、390px手機畫面及實體手機下載分享仍待覆核；本次程式測試與正式檔案一致性驗證不等於已完成這些畫面操作。

## 2026-10-28：端點獨立操作、接合、轉向與推拉門

### 正確專案與發布入口

- 儲存庫：https://github.com/sq087786789-lgtm/shangching-fence-survey
- 工作室：https://sq087786789-lgtm.github.io/shangching-fence-survey/studio.html
- 勘查表：https://sq087786789-lgtm.github.io/shangching-fence-survey/
- 持續開發目錄：`E:\GPT\shangching-fence-survey`。
- GitHub Pages 使用 `main` 根目錄，沒有 npm 安裝或前端建置需求。
- **不要修改或發布舊的 `hongsing-fence-planner` 來代替這個網站。** 兩者來源、資料格式細節、儲存位置與發布入口不同；之前在舊專案所做的端點修改沒有上線。

### 本次修改

- `studio.html`：上方新增 A／B 端選取、分開單端／兩端、獨立圍籬、自動接合開關、方向箭頭、15°微調和拖曳轉向。
- 編輯模式點端點圈圈可分開該端；拖曳端點、改長度、改座標時先分離共用節點，只改本段，其他段保持位置。端點命中優先使用選取段，以免共用點或重疊端點選錯段。
- 靠近其他段端點時顯示橘色圈，放開後接合。容差為16個畫面像素且最多0.4m；可關閉自動接合。點圈圈分開但沒有拖曳時，不會立即自動接回。
- 上方方向箭頭採平面畫面的上下左右，固定另一端並保留長度；拖曳轉向模式保留長度，可用 Shift 對齊45°。右側精確角度及明確勾選的後續連動保留。
- 新增推拉門樣式及門型選單，使用 `style: gate`、`gateType: sliding`、`slideOpen: 0–100`、`direction: 1 / -1`。單片門沿段落方向平移，不使用鉸鏈開啟角度。工作室長度欄仍採淨開口。
- `app.js`：勘查表門型增加推拉門及推拉開啟／方向欄位，轉入工作室保留參數；門型變更會重新呈現相關欄位。
- `reference-drawing.js`：推拉門正面採單片關閉參照；平面按開啟程度平移，適配範圍含移動後門片。此核心由工作室與確認單共用。
- `confirmation.js`：材料表保留「推拉門」名稱。CSV和可編輯JSON保留門型；門段不算入圍籬菱形網長、橫桿與管夾數量。
- 樣式套用及新增圍籬不再一併改寫其他段的橫桿排數。保留逐段獨立規格、原勘查表、照片、雲端功能及既有資料。

### 測試與狀態

- 功能提交：`2447967`（尚未推送）。此交接文件及後續發布準備另有本機提交。
- 已通過：`node --check app.js`、`node test.cjs`、`node build-handoff.cjs`。
- 新測試覆蓋兩端轉動時其他段不動、改長度分開共用點、接近端點接合、推拉參數驗證、勘查資料轉入、推拉門網量排除、3D平移座標、CSV門型、參照線稿與確認單門型。
- **首次發布嘗試當時：未上線（現已解除，見文件開頭）。** 2026-10-28 嘗試推送時，既有 Git 寫入登入不可用（無法非互動取得認證）；當時遠端為 `329813c`。瀏覽器操作回報 `Local browser use is disabled in Work settings`，因此無法改用已登入的網頁編輯器。
- **尚未驗證：** 真實瀏覽器的新版互動、390px手機版、圖面即時更新、實體手機下載／分享及正式站畫面。程式測試不能當作這些操作已驗證。
- 已取得的遠端基底應在後續推送前重新 fetch；若有其他提交，正常合併並重測，禁止 force push。

### 2026-10-28 接續部署嘗試

- 已核對本機功能提交 `2447967`、交接提交 `2b309e8` 及 origin，兩者均屬正確的 `shangching-fence-survey`；沒有修改或發布舊專案。
- 使用者確認已登入、提供 Chrome 擴充功能已安裝及開關開啟的截圖，也已明確以 `@Chrome` 指定瀏覽器。工具仍回報 `Local browser use is disabled in Work settings`；不能將此錯誤歸因於使用者尚未登入，也不應重複要求切換已開啟的同一開關。
- 可由使用者在自己電腦的 PowerShell 執行 `git -C E:\GPT\shangching-fence-survey push origin main`，如出現 GitHub 登入則由使用者本人完成。成功後代理再核對遠端提交、Pages 部署與正式檔案，補寫成功紀錄。若顯示遠端有新修改，先 fetch 並正常整合，不要 force push。
- 本次受阻時沒有宣稱已上線；後續由使用者登入上傳成功，見文件開頭。瀏覽器互動與手機畫面驗證仍待可用連線。

### 接續發布流程

1. 由使用者啟用此聊天的瀏覽器操作能力，使用已登入的 GitHub；或由使用者在自己的電腦完成 Git 寫入登入。**不要向使用者索取密碼、token或驗證碼，也不要將憑證寫入檔案。**
2. 先檢查工作目錄與遠端差異，保留其他修改；檢查 `studio.html` 是上述正確專案。
3. 在本機HTTP預覽測試 A/B端拖曳、點圈分開、橘圈接合、復原、方向按鈕、推拉門左右開啟、表單即時預覽及390px版面。
4. 修正後重跑測試及 `node build-handoff.cjs`；此指令同步 `ai-source.json`、`ai-manifest.json`，包含本交接紀錄。
5. 提交並推送main，或用GitHub網頁編輯器上傳**實際改動的公開檔案**。不要重新上傳或改寫雲端識別設定。
6. 等 GitHub Pages 部署成功；驗證正式網站的實際版本與畫面後，新增交接紀錄，寫明成功提交、部署結果和仍未實機確認的項目。

### 保留規則與界線

- 工作室修改不反寫原勘查表，重新由表單帶入會使用表單配置。實際案件須由使用者另存JSON備份。
- 接點分開時先保留原位；重疊接點在柱數／配件計算仍可能按既有5mm幾何容差視為同一處，拖開後才成為不同位置。這與編輯時各段是否共用節點是兩個不同概念。
- 推拉門目前是構造與行程參照。軌道、滑輪、導輪、止擋、馬達及安裝空間等不擅自套用數量或報價，仍需業主確認實際構造。
- `work/`與真實案件、聯絡資料、照片、localStorage、憑證都不公開。本交接文件只記程式、測試與發布狀態。
