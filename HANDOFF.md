# 圍籬工作室交接紀錄

## 2026-11-05：依實物照片改格柵大門

- 使用者提供現場大門與舊3D對照，要求符合自家樣式。單開／雙開改矩形外框、一道中橫桿及多支直向補強，移除門片大斜撐；照片未加入公開repo。保留原圓／方管、管徑、材質、門寬、獨立門高／柱長及開啟方向／角度，不猜照片的實際製作規格。
- reference-drawing新增gateFrameMembers供CAD與studio.panel共用；格柵依門片寬約0.6m平均分格、最多40跨，窄門及浮點邊界有保護，屬外觀示意不變更材料量／價格。brace資料鍵不變，UI「門片補強」；停用只留原外框網片。推拉門原補強、輪組、軌道不改。drawGate僅雙開扣中央20mm，修正單開原先多扣2cm使CAD與3D一致。
- index、app iframe及studio reference快取同步gate-grid-1。新增gate-frame-test.cjs納主測試與AI來源包，涵蓋共享幾何、單／雙開、開門0／60度、管形、窄門／極寬、停用與推拉保留；既有數量／整米進位／照片／高度等測試及Drive序列化通過。
- 內建瀏覽器桌面實測雙開3.20m、門高1.65m新格柵及開門0～110度正常。單開CAD實際SVG為1道中橫、5支直向、無outline斜線；勘查客戶簡圖仍用原雙開案，1頁圖片，2道中橫、4支直向。390×844手機看全貌innerWidth=scrollWidth=390、畫布約373px，無整頁橫向溢出；截圖work/gate-grid-mobile.png與gate-grid-3d-detail.png、SVG gate-grid-front.svg為本機合成證據，不公開案件／照片。
- 本機測試前studio設計已透過「取回帶入前的3D設計」恢復，勘查表已透過本機測試helper還原，viewport已重設。未測實體iPhone／LINE／私人Drive授權，功能未改。只使用本Documents/Codex checkout，E槽副本及原資料不變。
- **已上線：** 功能提交 `c7c8b720a50900cb2e813e7a3b55d9e12cc1e4a6` 正常快轉推送main，Pages執行 `41949120218` completed/success。正式index.html、app.js、studio.html及reference-drawing.js皆HTTP200，原始SHA-256與已測試提交一致。正式內建瀏覽器已確認app及reference載入gate-grid-1；沒有變更正式案件。
- 正式網址 `https://sq087786789-lgtm.github.io/shangching-fence-survey/?v=gate-grid-1`。README、AI_README、AGENTS及33檔AI來源包同步；接續先核對GitHub HEAD與本節，保留單／雙開共享格柵與推拉門分支。此次本機伺服器已停止，正式分頁保留；實機及雲端未重測的範圍如上。
- 來源包注意：本checkout設core.autocrlf=false，保留既有混合行尾；Windows全域autocrlf=true曾在切回main時轉換新檔／共用圖檔工作副本，已還原為Git原始位元組並重建索引，33檔雜湊與提交一致。以後建包前核對工作檔與Git blob，不把行尾轉換當功能修改。

## 2026-11-04：大門移除柱距欄、門片高度自由輸入

- 使用者指出大門沒有最大柱距，門片高度須能調整。app.render的gate不再產生spacing欄；門片height改數字input，0.5～6m、step0.01，支援1.65m等非原選單高度。一般圍籬保留原網高及柱距選單。
- 不改JSON格式或資料鍵，舊spacing值保留供切回圍籬；門仍只有兩端柱。height沿用原design／3D／客戶確認單傳輸，門柱postLength獨立，沒有自動修改門柱高度、價格或其他路段。index的app快取為gate-height-1，studio及其他共用圖面檔不需改。
- 通過node --check app.js、完整node test.cjs。此次是既有欄位顯示／輸入方式修正，未增加重複的表面測試套件。
- 內建瀏覽器390×844／scrollWidth375實測：純門案例spacing欄數0，門高可輸入1.65且正確保存。客戶產生1頁圖片，線稿門高1.65m、淨開口4m，材料顯示雙開門高1.65m、門柱2支。帶入完整3D後height欄為165cm且spacingfield.hidden=true。合成截圖work/mobile-gate-height.png，未使用真實客戶資料。
- **已上線：** 功能提交 `bd57db24e3d2833aca8a3ca8d18c13177a34cad8` 正常快轉推送main，Pages執行 `41858019564` completed/success。正式index.html及app.js皆HTTP200，原始SHA-256與已測試提交一致；正式內建瀏覽器已載入app.js?v=gate-height-1並確認一般圍籬柱距控制保留。
- 網址 `https://sq087786789-lgtm.github.io/shangching-fence-survey/?v=gate-height-1`。本機測試前案件已還原、viewport已重設，本次伺服器已停止；正式分頁保留。尚未重測實體iPhone／LINE／私人Drive登入；此次不改分享與雲端功能。接手仍使用本Documents/Codex checkout，核對GitHub最新HEAD後再修改。

## 2026-11-04：PVC線徑、50／57／75／85mm網目及表單分組

- 依使用者要求新增3.9mm線徑預設與其他自訂1～6mm。選PVC時setMeshMaterial預帶3.9，但之後可自訂，載入舊案／換段／重選同一材質不重設。工作室setSegmentSpec同規則，原數字wire欄仍可自由調整。
- 網目分列2英吋／50mm、2英吋／57mm、3英吋／75mm、3英吋／85mm，數值分別50／57／75／85。新段預設明確50mm名稱；舊2英吋、3英吋別名及原尺寸保留，UI對目前舊選項顯示原案mm。保留4英吋與正2英吋50.8mm，不能以英吋換算取代業主指定規格。
- 新segmentSpecs把菱形網規格、立柱與工法、橫桿分區；立柱管材／總長／基礎／埋深在一起。橫桿短標籤為排數與管長m，資料鍵及按跨數計支、整米計價、配件、照片及圖面比例不改。gate為門柱與工法／門框，meshOnly只留既有柱提示。
- wire／meshChoice／mesh沿原JSON／Drive及design傳輸；studio.meshSpecification新增識別四個精確名稱，避免57／85輸出錯名。新增mesh-presets-test.cjs納入test及AI來源包；驗證PVC3.9預設、自訂3.7、舊PVC3.2不改、50／57／75／85／正2英吋、繼承／JSON／3D／客戶報表及實際studio setter。完整node test.cjs、node drive-test.cjs、app語法、static DOM binding均通過。
- 內建瀏覽器390×844實測scrollWidth375：選PVC自動3.9、選57mm成功，分組及短標籤清楚；自訂3.7＋3英吋／85mm重新整理仍保留。客戶圖片產生1頁並列出PVC／3.7／85mm，帶入完整3D後wire3.7、mesh85、material=pvc。證據work/mobile-mesh-fields.png為合成資料。
- 實際Canvas／A4 PDF仍產生1頁；新PVC3.9／85mm材料文字保留，計價範例未稅2380／稅119／含稅2499不受影響。忽略的work/mesh-quotation-1.png及mesh-quotation.pdf為測試證據。實體iPhone／LINE及私人Drive登入未重測。
- **已上線：** 功能提交 `d25c61b38a2207c6870f66060646efb518a9df73` 正常快轉推送main，Pages執行 `41854558641` completed/success。正式index.html、app.js與studio.html皆HTTP200，原始SHA-256與已測試提交一致。正式內建瀏覽器已確認app快取mesh-presets-1、3.9選項、四個精確網目、立柱與工法分組及排數短標籤。
- 正式網址 `https://sq087786789-lgtm.github.io/shangching-fence-survey/?v=mesh-presets-1`。本機測試前案件已還原、viewport已重設，正式分頁保留；沒有寫入真實客戶資料或改E槽副本。本次伺服器已停止。接手來源仍是本Documents/Codex checkout，先核對GitHub最新HEAD及本節，再修改並更新交接與AI來源包。

## 2026-11-04：報價整數數量、整米進位與橫桿按跨計支（最新）

- 使用者最新要求取代先前進料管長算法：10m、柱距2m、5跨，上下兩排＝10支。fence-materials.railGroups改逐段ceil(length/spacing)×排數，進料管長只保留採購參考與規格分組；studio.specRows及客戶材料CSV／圖片／PDF同步。環帽連結片以實際跨數接頭計算，其他配件及排除／手動增減沿用。
- 使用者另明確確認「10.5m進位11m，按11m計價」。lines對整行mesh／labor總數進位，quote與CSV沿用此量，量測length／estimate原量／3D節點不改。若priced客戶輸出與量測網長不同，增加整米計價米數說明；無價簡版、圖面比例及照片隔離保留。
- 報價數量不再補.00，數字與單位分行；手機數量欄13%、單價欄29%，每個單價輸入至少44px高，金額可換行。半台班以½／1½顯示，實際費用不進位，單價及必要的管徑／厚度／尺寸仍可含小數。報價metrics改標計價數量並顯示整數。
- fresh/migrate及design標railQuantityBasis=span。舊缺省／length案改piece並存previousRailPricing=length，rates.rail原米價仍保存，但UI不再提供舊按米橫桿；元／支不挪用元／米，舊案提示核對每支價。原每支單價鍵保留，新支數可能改總額。這是使用者授權的算法更新，不能再套先前「12m/進料3m」作所有案件支數。
- 本次中途可寫工作區改變，已從正式GitHub HEAD 045954367b66e36f097661ed61ce9d8a7327b30c取新checkout到 `C:/Users/nosa/Documents/Codex/2026-11-04/shangching-span-quote`，逐檔帶入剛才的6個程式修改後續作。舊 `E:/GPT/shangching-fence-survey` 的先前未提交修改原樣保留，沒有刪除／重設；不可在舊副本直接重複發布。GitHub專案與正式網址不變。
- 已通過app／confirmation／fence-materials語法、完整node test.cjs、新quote-units-test.cjs及drive-test.cjs。新測試包含10m/2m×2=10支、管長改6m仍10支、環帽4連結片、10.5m計11、兩段5.25m合計後計11、不改圖面10.5m、半班原費用、舊米價隔離、JSON。原配件／幾何／圖面比例／照片／返回檢查通過。
- Chrome目前無可用連線，本次改用內建瀏覽器實測390×844：scrollWidth375無整頁溢出，10m案例表格網10m／橫桿10支／橫通8個／尾夾4個；單價input寬約83px，數量與輸入欄不重疊。實際改量測10.5後表格網11m／橫桿12支，客戶報價顯示整米說明且保留量測10.5。證據為忽略目錄work/mobile-span-quote-10.png。
- 實際Canvas／PNG／A4 PDF渲染驗證1頁：10.5m的測試費率案例計11米、12橫桿、10橫通與4尾夾，未稅2380、稅119、含稅2499。work/span-quotation-1.png及span-quotation.pdf為合成資料；實體iPhone／LINE及私人Google Drive連線未重測，不將內建窄版當實機。
- **已上線：** 功能提交 `7ccc1e43f20ed35d0822d25e6d035bb63342ac74` 正常快轉推送main，Pages執行 `41831040248` completed/success。正式index.html、app.js、fence-materials.js、studio.html、confirmation.js、style.css皆HTTP200，原始SHA-256與已測試提交一致。正式內建瀏覽器已實際載入span-quote-1、整數數量、橫桿支單位及舊米價核對提示；沒有向正式站寫入合成測試案。
- 正式網址 `https://sq087786789-lgtm.github.io/shangching-fence-survey/?v=span-quote-1`。本機測試前案件已恢復，暫時viewport已重設，本次伺服器已停止，測試分頁已清理，正式網站保留供使用者開啟。下一位AI先讀本節與最新GitHub HEAD，實際checkout路徑見上；每次完成再更新交接與AI來源包。原E槽副本仍保留，不把舊副本或先前發表的進料算法當現行規則。

## 2026-11-04：立柱與菱形網高度依獨立參數等比繪製

- 使用者要求「立柱高度跟菱形網高度分開參數，圖面按比例改變」。沿用postLength／depth／height，不新增或重設案件欄位。表單明確標「菱形網高度」及門片高度，studio標示高度獨立於柱長。
- 找到一般圍籬網片原只畫0.05至height−0.025，少畫7.5cm；studio.panel及共用CAD改為0至height。立柱仍按postLength減有效埋深，底板不扣；改柱長不改網高，改網高不改柱長。門片框架間隙、橫桿排位、數量／配件／價格／照片不變。
- 原CAD每次最高處壓成接近205px，改為一般135px/m、寬度及極高尺寸上限下整圖等比縮放，ground及面板高度隨實際高度調整。柱、網、埋深使用同一scale；客戶HTML／PNG／PDF與工作室參照線稿共用。快取height-scale-1，保留局部2跨及原固定柱距標註。
- 新height-scale-test.cjs納入完整test及AI來源包：實際CAD矩形比例、柱長獨立增長、網高獨立增長、底板、不同埋深、短柱與10m極值、3D實際panel/renderPost輸出座標。已通過完整node test.cjs與app/reference/confirmation語法；實際Canvas PNG／A4 PDF解析通過，一般12m範例仍1頁，橫桿8支／配件6與4／稅額均保留。
- Chrome本機390 CSS px／scrollWidth371無水平溢出；設定管長2.5m、埋入50cm、網高1.2m，客戶預覽矩形柱高270px／網高162px，比例正確2:1.2；產生1頁圖片。帶入完整3D顯示柱長2.5m、網高120cm、地上柱2m，返回正常。合成對照頁已人工檢視，證據work/height-comparison-browser.png；左→中只改管長，網片像素高162不變，柱高202.5→270；中→右只改網高，網片162→243，柱270不變。
- 本機測試前表單已恢復、暫時viewport已重設。沒有修改真實案件或上傳合成案件；實體iPhone／LINE與私人Google Drive未重測。下一位AI須保留gate本體間隙及舊資料，不能把圖面等比誤改為網量乘高度計價。
- **已上線：** 功能提交 `7944e2cd718b43721cf1aebe2bd5c6eaeaa15b91` 正常快轉推送main，Pages執行 `41786655434` completed/success。正式index.html、app.js、studio.html、reference-drawing.js及confirmation.js皆HTTP200，原始SHA-256與已測試提交一致。網址 `https://sq087786789-lgtm.github.io/shangching-fence-survey/?v=height-scale-1`；不是舊私人Sites網址。合成對照截圖精簡版work/height-comparison-browser-detail.png亦已人工檢視，三種獨立比例清楚可見。每次完成同步本交接及AI來源索引，不要把本機或歷史發布當成下一次修改的正式驗證。

## 2026-11-04：手機橫桿支數、配件數量與單價

- 使用者已確認「每支3m，上下各一排，各段分別計算後加總」；一段12m為8支。新增每段railLength（預設3m）與topFix（through／ring）欄位，新增段繼承第一段；不同管長／管徑／厚度分列報價並填元／支。逐段各排進位，不跨段合併餘料。
- 新增共用fence-materials.js，勘查、3D工作室、確認單共用橫桿與配件算法。配件逐支點／逐排高度計數，處理共用直線柱、轉角、不同排數與環帽／連結片；保留studio手動增減。只裝網、既有、零橫桿與大門本體排除自動量。複雜分岔／混用高度與固定方式仍需人工覆核。
- 報價橫桿後立即列正用量配件及各自單價，加入小計／未稅／稅／含稅；客戶圖片及PDF材料表改支數並列配件。零用量不列，新增價格預設0待填。保留新案piece、舊案length雙模式，原元／米單價與總額不自動改；切換piece須重新填價，不能誤套舊米價。JSON／完整案件保留參數與單價，不改雲端授權與照片。
- 工作室可調每支管長，規格CSV／圖片有railLength及railPieces；圖面幾何、照片位置、客戶簡版無價、圖片主操作／PDF次選、返回與逐段收合保留。快取版本rail-pieces-1；build-handoff包含共用檔與material-test.cjs。
- 已通過app／confirmation／fence-materials語法、完整node test.cjs（含新增material-test及原照片／報價／手機／studio檢查）、node drive-test.cjs。數量測試覆蓋逐段進位、不同規格、浮點邊界、角柱、混2／3排、環帽接頭、排除供料、手動增減、舊價保留、稅金、繼承與JSON有效性。
- Chrome本機合成案件實測：390 CSS px／scrollWidth371無整頁水平溢出；12m、3m管、上下2排得到8支、橫通6、尾夾4，各填450／50／25後未稅4580、稅229、含稅4809。改6m管為4支；改環帽式為橫通3、尾夾4、環帽5、連結片3。帶入完整3D後管長3及配件6／4一致，返回正常。
- 已實際產生1頁PNG與A4 PDF，解析PDF頁數並人工檢視PNG，支數／配件／三項稅額一致；客戶無價模式保留。忽略目錄work/rail-quotation-1.png及rail-quotation.pdf為合成資料證據。實體iPhone／LINE及真實Google Drive登入未重測，不將Chrome窄版當成實機。
- **已上線：** 功能提交 `e7fd89ba6eefe456ab8bee308eeab424a95de491` 正常快轉推送main；Pages執行 `41785285853` completed/success。正式index.html、app.js、studio.html、confirmation.js、style.css、fence-materials.js均HTTP200，原始SHA-256與已測試提交一致。正式Chrome頁已載入新管長欄位、共用數量檔與配件單價；原有舊案件維持length模式，未改真實案件價格或內容。
- 正式網址 `https://sq087786789-lgtm.github.io/shangching-fence-survey/?v=rail-pieces-1`。本機合成測試前表單已恢復，暫時viewport已重設。瀏覽器截圖曾逾時／空白，未將空白截圖當畫面證據；已另成功保存並檢視合成輸出截圖work/rail-output-browser.png及其局部rail-output-browser-detail.png，配合前述DOM及真實Canvas／PDF檢查。實體手機、LINE與私人雲端限制如上。後續修改先讀本節、fetch核對遠端，再修改共用算法；每次完成同步交接與AI來源索引。

## 2026-11-04：客戶主操作改分享圖片、PDF收進選項

- 依使用者要求交換圖片與PDF位置：固定底部主按鈕為confirmShareImages「分享圖片／LINE」；confirmSharePdf「開啟PDF／傳LINE」與原confirmPdf留在「PDF、下載與其他輸出」。頁面入口文字改為簡易圖／圖片及客戶報價／圖片，底部提示也改為圖片優先。
- 保留原ID、PNG files及PDF File產生流程；分享內容仍由同一模型建立。圖片不支援原生分享或分享失敗時，showImages會展開圖片並捲入視窗，提示長按／下載圖片再由LINE附加；使用者取消不重送。PDF仍使用原download(pdf)與iPhone預覽底部分享圖示，不直接Web Share PDF。不自動傳訊、不選收件人。
- 通過confirmation語法、完整node test.cjs及靜態DOM IDs／控制項綁定檢查。既有函式測試仍確認PDF走下載／開啟、圖片handler傳PNG列表、未完成輸出時不動作；本次主要為位置及提示調整，沒有更改案件格式、價格、圖面、照片或雲端功能。
- Chrome本機合成案驗證實際innerWidth390／scrollWidth371；圖片主按鈕可見且產生完成後啟用，兩個PDF按鈕在其他選項收合時不可見、展開後可見。展開圖片驗證為1120×1584及.png下載名；保持返回功能。證據在忽略目錄work/image-first-mobile.png，不含真實案件；未重新測試實體iPhone／LINE原生分享。
- **已上線：** 圖片優先功能提交 `1051a1d`，發布提交 `58cfe3b99b83a4881cc1eaa2ba102253d2b6bc9c`（只另整理行尾格式）已正常快轉推送main；Pages執行 `41782226317` completed/success。正式index.html、confirmation.js、style.css皆HTTP200，原始SHA-256與已測試提交一致。
- 正式網址：`https://sq087786789-lgtm.github.io/shangching-fence-survey/?v=image-first-1`。本機測試表單及暫時viewport已恢復，沒有把合成案件或真實案件寫入公開儲存庫；PDF原生開啟路徑與圖片傳送由使用者選擇收件人。

## 2026-11-04：手機全貌大圖與逐段收合

- 使用者希望手機完整圖少顯示資訊、圖面更大，填完參數後每段可收合。每段改原生details，摘要保留段號、長度／門淨開口、高度、柱距與網目；有「填好了，收合本段」「全部收合／展開」。預設只開第一段，新增／復原自動展開；用segment.id的Map保留畫面狀態，改規格及重新render不亂開段，也不寫入JSON／報價。摘要由segmentSummaryText與change共用，長度等不重新render的欄位也會更新摘要。
- 手機工作室以大圖為預設，只留返回勘查表、設定／工具、看全貌、立體／平面、置中與縮放。設定及原工具仍可展開；桌機不受影響，照片在圖下方，放大模式暫時收起。mobile-view.css放在scene-photos.css後；嵌入預覽不顯示手機導航。勘查圖面高度增至64dvh且至少400px，底部新增「圖面」快捷。
- 勘查表新增「放大看全貌」，原一次性transfer帶overview=1，工作室完成帶入後直接啟用原canvas-expanded模式。修正帶入後history.replaceState清URL使overview遺失的情況：先捕捉requestOverview再安裝設計。返回按鈕與Esc沿用原機制，放大按鈕補動態aria-label。
- 列印前暫時展開所有段，列印結束復原狀態；客戶PDF及完整JSON仍從原資料產生，不依賴details是否展開。電話、稅額、材料算法、原圖片／PDF輸出及雲端未變更。
- 通過app語法、完整node test.cjs與靜態DOM ID／控制項綁定檢查。新增實際函式／事件測試含第一段預設、單段toggle、全部開關、新增目標展開、id與render保留、列印復原、資料／報價不變、手機設定返回，以及transfer後URL清理仍可進大圖。
- Chrome本機合成案件已實測390px、scrollWidth390無溢出；單段收合、修改高度仍保留開關、新增段自動展開、移除後原報價相同。一般手機canvas約373×676px，設定hidden；全貌模式約373×788px，返回後恢復一般畫面；照片保持在圖下方。已驗證從勘查表放大入口直接進全貌。證據在忽略目錄work/mobile-segments-collapsed.png、mobile-whole-design.png、mobile-fullscreen-design.png，無真實案件。
- **已上線：** 功能提交 `48ff40df6f3b4fea38dc8741911eaed4c85d2b47` 已正常快轉發布main，Pages執行 `41781161989` completed/success；正式index.html、app.js、studio.html、style.css、mobile-view.css皆HTTP200，原始SHA-256與已測試提交一致。正式Chrome頁已顯示逐段收合、全部收合／展開與全貌入口，既有案件仍可載入；本次未改正式案件欄位。
- 正式網址：`https://sq087786789-lgtm.github.io/shangching-fence-survey/?v=mobile-overview-1`。本機另以原生數值鍵將長度20→22，摘要及用量同步正確，再還原20；測試表單已恢復原狀，暫時手機viewport覆寫已清理。實體iPhone及原生分享未在本次重測。

## 2026-11-04：稅額分列、第二電話與3D照片對照

- 最終報價明列折讓後未稅金額、稅金（稅率%）、含稅總額；CSV同步。新增「輸出客戶報價／PDF」與quote模式，只有金額摘要；原客戶簡版保持無價，公司完整版逐項計價。一般範例一頁A4，金額三項盡量同頁，過量仍續頁。PDF開啟／iPhone下方分享LINE流程維持，無自動發送。
- project.phone2新增備用電話，原phone保留；舊案補空白，最多60字，以文字保存並保留0與分機。HTML／PNG／PDF共用model帶出兩組電話，未填不顯示。完整JSON／Drive沿用既有保存來源。
- 新增共用scene-photos.js/.css；勘查表圖面及完整工作室都有畫布外照片區，桌機右側、手機下方，沒有照片就隱藏。沿用照片segmentId對edge.id，篩選路段可對應3D取景；工作室選段同步篩選，照片可放大並返回。新增構件不沿用舊edge.id，避免誤配。照片讀取失敗及孤兒路段提示，非同步過期結果不回寫新畫面。放大圖面模式隱藏照片以保留空間。
- design.sitePhotoRefs僅存id/name/caption/segmentId，從原IndexedDB唯讀讀圖；完整JSON／雲端仍含實際照片。跨裝置要先在勘查表載入完整案件再帶入3D，單獨3D JSON不是照片備份。客戶確認單／報價輸出不含照片或照片備註。雲端授權、API金鑰及真實案件均未改動。
- 通過node --check app.js／confirmation.js／scene-photos.js、完整node test.cjs、node drive-test.cjs及新增quote-photo-test.cjs（主測試已包含）。涵蓋稅率0、折讓過額、金額一致、電話遷移及跳脫、無價隔離、照片篩選／缺檔／過期讀取／返回與studio內嵌腳本語法。
- 使用實際Canvas／Resvg及pdf-lib產生並解析合成報價：1頁A4；48,000未稅、2,400稅金、50,400含稅。證據在忽略的work/quotation-1.png及quotation.pdf，沒有真實客戶資料。
- 已在Chrome以僅限本機合成案件驗證：兩組電話、2張照片載入、390 CSS px／scrollWidth390無水平溢出、照片在圖下方不重疊、實際報價產生1頁且PDF按鈕啟用、三項金額正確及返回正常。完整工作室帶入3段後，照片出現在畫布右側，照片選第2段同步selectionTitle，放大及返回正常。證據work/mobile-quote-totals.png、studio-photo-comparison.png。實體iPhone與LINE未重測。
- 瀏覽器擴充功能無本機檔案上傳權限，這次用忽略目錄的本機合成fixture驗證讀取及顯示，沒有改擴充權限；原照片挑選／HEIC與Google雲端實際登入存取未重新測試。
- **已上線：** 功能提交 `f0688fb7061d9bf38837eec78ed31b0a5ef1f362` 已正常快轉推送main；Pages執行 `41779352708` completed/success。index.html、app.js、confirmation.js、photos.js、studio.html、scene-photos.js與scene-photos.css正式HTTP200，原始SHA-256與已測試提交一致。Windows換分支曾將新增檔LF轉CRLF，已按提交原始位元組核對，不能將文字解碼／本機換行差異誤認成正式網站不同版本。
- 正式網址：`https://sq087786789-lgtm.github.io/shangching-fence-survey/?v=quote-photos-1`。Chrome已確認正式頁能保留既有案件、顯示備用電話／客戶報價按鈕／三項稅額與新版嵌入圖面。沒有把合成案件寫入正式網站，沒有將真實案件寫入儲存庫。本機合成測試表單已恢復測試前內容；正式頁保留供使用者開啟。
- GitHub連接器建立PR回覆403，但既有git推送權限正常；本次採主分支正常快轉發布，沒有強制推送、權限變更或建立PR。後續修改先fetch再核對新提交，不必因此重設登入或API金鑰。

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
