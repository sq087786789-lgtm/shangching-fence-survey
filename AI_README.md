# AI 接手文件

統一工具入口是 `tools.html`，唯一工具清單是 `tools.json`，由 `tools.js` 安全建立連結。新增／修改入口只更新這份清單，各工具仍在各自儲存庫維護。Render進銷存的 `public/tools.html` 僅轉址；新版工作室要連 `studio.html`，舊版已從入口移除，請勿重新加入。不要將工具入口統一誤做成案件或資料庫合併。

接續前先讀 [HANDOFF.md](HANDOFF.md)，核對本機與正式部署狀態、正確工作室網址及待驗證事項。

## 2026-11-05 同案更新與共用資訊卡（最新）

- app.fresh/migrate補caseId，cloudCase={parentId,folderId,revisionId}記錄雲端來源。完整JSON會保存此連結，resetScene通知Drive重畫狀態；saved回呼只在當前caseId等於開始存檔的來源caseId時綁定，避免非同步儲存誤綁另一案。Save As生成新caseId，原案保留。舊JSON無ID仍可載入。
- Drive根案件維持sqKind=survey-case，sqCurrent/sqPrevious指向案內資料版本；首次完成才sqComplete=yes。新版子資料夾sqKind=survey-revision、sqOwner=案件ID，完整JSON／去內部備註3D JSON／照片及說明全部上傳完再完成子版，最後切根指標。備份不刪除；根名稱保留首次姓名地點時間，不因每次儲存新增頂層案件。legacy表示舊版資料直接在案根；loadPrevious將來源資料附上當前revision，允許取回後重新儲存同案。
- 只用drive.file，權杖記憶體；目錄、caseId、權限與revision先驗證，完稿前再查revision，有HTTP ETag才附If-Match。這是過期編輯防護，不是完整多人原子鎖；未實作跨裝置合併。無連結但同caseId已存在時拒絕盲寫。上傳／提交回應不明確時要求重新載入確認，不宣稱雲端一定未更新。
- createDriveMock模擬真實multipart位元組／appProperties合併／分頁／ETag；drive-test涵蓋更新同根、上一版、刪除照片隔離、失敗、舊格式、Save As、錯誤parent及過期revision。本機8082以mock接入真實index UI完成首次保存→修改→同案保存→載入上一版與最新版→另存新案→重整再更新。**沒有實際Google登入或私人Drive寫入，不得將模擬測試當雲端實證。**
- reference-drawing.specGroups是CAD SVG與studio Canvas共同分組入口，複製displayRows不改原資料。橘框米底、灰標籤深藍值，高度紅、土面上／入土橘；大門分開門片／門柱／門框。管長、間距統一簡稱；有效埋深依底板0計算，depth隱藏時不能推導顯示postAbove。舊未知欄保留在工法，不遺失。CAD藍色圖例會區分既有柱／地面／地下段。
- captureStudioProposal帶cardSections，rows只保留配件及手填事項，避免規格重複。renderPages按兩欄卡列分頁、跨頁重複段標題，原rows-only呼叫相容；圖面最大高520px保持比例。Clipboard／原生手機圖片分享、PDF儲存路徑與返回保持既有功能。確認單仍用原彙總版型；本次主要修改工作室／參照線稿資訊。
- 實際下載圍籬線稿PDF1頁、雙開門線稿PDF1頁與3D提案PDF2頁，Poppler渲染人工確認無重疊／裁字，大門獨立頁。測試前8082資料已還原，viewport重設；8080與正式私人案件未改。本地證據work/cards-*.pdf／png與cloud-update-mobile.png不入公開repo。快取case-cards-1，36檔AI包不新增生產檔案。

## 2026-11-05 規格分列與電腦圖片複製（最新）

- specColumns將height稱菱形網高(m)，新增只供輸出的gateHeight／門高(m)；specRows依構件只填其中一欄，edge.height及JSON格式不改。gateHeight未明確設定outputFields時沿用舊height開關，兼容舊案。customerReport另回displayRows，displaySpec將單位移到數值旁，長度去無意義尾零，門框與橫桿名稱依構件分開；原columns／rows仍供CSV，沒有修改數量或價格。
- reference-drawing用displayRows繪製逐列「項目／數值」表，18px文字、32px列高、交錯底色；每項data-spec-field標示穩定鍵。只有selected edge的規格，正／平面與圖面高度比例不改。無displayRows時仍兼容舊report介面。線稿最底部制式說明刪除；studio imageSpecLines每項一行、總量分行，移除自動估算備註及頁腳制式說明，保留實際e.note／既有施工範圍。
- fence-materials僅材料名稱「橫桿（管長Xm）」及文字改管長，rateKey／分組／逐段跨數×排數算法不變。confirmation僅共用gateHeight的舊height映射及移除HTML／Canvas最底部制式備註，實際現場注意事項及價格邏輯不改。
- 使用者確認分享失敗是**電腦版**，工作室與線稿兩個按鈕都不行，名稱須保留「分享圖片／LINE」。studio-output依handheld判斷：電腦以ClipboardItem(image/png)寫入圖片，提示Ctrl＋V貼到LINE，絕不自動送訊；多頁主操作先複製第1頁並提示其餘逐頁複製，頁下提供單頁複製鍵。無clipboard API／被拒絕改下載該頁，提示拖進LINE電腦版。手機仍用PNG Web Share，取消不重送。
- 線稿ready前由studioOutputController.prepareLinework預先完成PNG／JPEG／PDF與ASCII分享檔名；cadSharePacket與cadOutputVersion同步清理，點擊不重新編碼以保留使用者啟動資格。出圖dialog新增studioOutputSaveImage，手機失敗可獨立儲存。原生分享busy／revision防止重入及舊回呼改新圖狀態；PDF仍走儲存下載。
- studio-output-test涵蓋實際mixed sample的分別高度、每欄一列、單位／管長、舊開關、資料不變、現場事項保留及無制式footer；另外測cached packet不重編碼、ASCII分享名、儲存圖片、電腦clipboard成功與拒絕下載。官方PNG剪貼簿API參考：https://developer.chrome.com/blog/web-custom-formats-for-the-async-clipboard-api 。快取spec-clear-1涵蓋studio output／reference／materials／confirmation、app iframe與index對應script，36檔AI包不增檔數。實際發布與驗證見HANDOFF。

## 2026-11-05 參照線稿直接分享（最新澄清）

- 使用者補充是在參照線稿畫面出圖，並要求稱「儲存PDF」。cadDialog上方cadShareBar固定保留cadShareImage與cadSavePdf，原SVG／PNG下載照舊；工作室原出圖亦保留，PDF文字統一改儲存。cadOptions以class限制高度，不能再依nth-child(2)，避免新增分享列後手機設定區擠掉圖面。
- refreshCAD只產生一次currentCAD SVG，預覽與prepareCADShare使用同一字串。studio-output.lineworkPage將完整SVG等比置入2240×3168白底A4頁，不截手機捲動區，不額外加入3D圖或另一份規格。保留目前路段、局部／全貌、正／平面、網線、尺寸、規格勾選；縮放只改預覽，不影響完整輸出。
- raster非同步預先準備，cadOutputVersion遞增拒絕舊結果；準備中／失敗停用兩個分享鍵，close釋放canvas並取消舊revision。新頁ready後才允許點擊，studioOutputController.openLinework共用PNG／PDF生成、下載與原生圖片分享。PDF必須傳實際canvas尺寸給pdfFromJpegs，不能沿用1120×1584預設造成影像解碼尺寸錯誤。
- 出圖dialog疊在cadDialog上，返回文字為「返回參照線稿」，不關閉原CAD／改路段或zoom；工作室原提案仍返回工作室。圖片／PDF內容同頁，存檔名含案件名、第N段及參照線稿；iPhone用下載後儲存到檔案，不能改成PDF navigator.share。圖檔／案件不上傳。
- studio-output-test新增完整圖等比範圍、來源類型／檔名／返回、PDF與PNG分流、快速換設定舊結果隔離及close釋放；原回歸保留。快取cad-share-1同步studio CSS／JS、app iframe與index app。36檔來源包不新增檔數。實際發布見HANDOFF，實體iPhone／LINE未重測。

## 2026-11-05 工作室直接分享

- studio-output.js/.css負責客戶出圖dialog與1120×1584分頁。桌機image／studioPdf、手機mobileShareImage／mobileStudioPdf共用prepare；圖片按鈕同步capture／編碼，再於同一點擊直接呼叫navigator.share PNG File列表，盡量保留iPhone使用者啟動資格。失敗或不支援保留圖片及下載連結；AbortError只顯示取消，不自動重送。只能由使用者選LINE及收件人。
- PDF沿原iPhone已驗證的download/open route，物件URL存活60秒，沒有直接PDF navigator.share。confirmation.js僅將既有pdfFromJpegs公開在surveyConfirmation，供工作室共用；原勘查確認單start、資料與分享流程不變。載入順序必須reference-drawing→fence-materials→confirmation→studio-output→工作室inline，否則confirmation建立共用線稿時會失敗。
- captureStudioProposal先commitEditor，空設計不出圖；固定1000×650邏輯畫布／1500×975像素，fit(undefined,300)輸出全案，保留目前立體／平面與方向，不沿用手機窄畫布或使用者放大裁切。finally還原W／H、像素尺寸、showDims／showControls、scale／pan／center與原圖，不能改案件／歷史。fit新增maxScale預設90，不改一般看圖；showControls=false不畫編輯端點、橘線與吸附文字。
- imageSpecLines第二參數compact=true只在新工作室分享使用，移除零用量配件，仍保留非零／手調配件、相關估算說明、備註、既有段與outputFields。原預設／CSV規格不變。PDF與PNG以同一批canvas頁面產生，不含照片或內部價格；內容過多分頁，不縮成不可讀小字。
- studio-output-test.cjs納主測試與36檔AI來源包，覆蓋分頁／末段保留、PNG分享／PDF下載分流、不支援／取消／失敗、空capture、圖面與相機還原及零配件篩選。快取studio-share-1同步index app／confirmation、app的studio iframe；新studio-output.css／js必須發布。實體iPhone與LINE仍待使用者實機確認，不能以內建窄版當實機。

## 2026-11-05 實物格柵門片

- reference-drawing.js的createFenceReference回傳gateFrameMembers(width,e)，提供門片局部座標的一道middle及多支vertical；CAD與studio.panel共用，不能各自維護另一套斜撐。單／雙開且brace=true才有格柵；brace=false保留外框與網，sliding沿用原圖形及五金。UI改稱「門片補強」，資料鍵／格式不變。
- 直向分格ceil((門片寬−1e-8)/0.6)，至少1、最多40跨，處理浮點邊界與超大門寬性能；中橫桿在0.08m到height−0.025m之間的中點，直向補強同範圍。中橫／直管徑暫依外框0.8／0.65比例示意；這些是外觀參照，不能直接當裁料表或變更估料與報價。保留原railShape／railDia／material，不憑照片猜實際管材規格。
- drawGate只有雙開才扣中央20mm間隙，單開不再多扣2cm，對齊CAD原本的單開淨寬。兩側各30mm、離地80mm、門高／門柱管長與開啟方向／角度仍獨立；推拉分支不改。
- gate-frame-test.cjs納入test.cjs及build-handoff.cjs，驗證共享格柵、尺寸比例、窄門／浮點／極寬上限、CAD無大斜撐、實際panel／drawGate開門與管形、停用補強、推拉門不受影響與輸入不變。快取gate-grid-1須同步index、app內studio iframe及studio共用reference script。
- 工作區維持C:/Users/nosa/Documents/Codex/2026-11-04/shangching-span-quote；照片只用於外觀參考，未放入公開repo。HANDOFF記錄實際發布與手機驗證，不能以本機測試當成實機iPhone／LINE通過。

2026-11-04大門尺寸欄修正：app.render的gate不產生spacing欄，height用數字input（0.5～6m、step0.01），圍籬仍用原網高及柱距選單。資料鍵height／spacing均不刪除或遷移，舊spacing保留供切回圍籬；大門計數原本就僅兩端柱。design／3D／確認單沿用height，門柱postLength仍獨立。此次只改app與index的app快取gate-height-1，既有studio支援自訂門高且會隱藏spacingfield，不需修改。

## 2026-11-04 線徑與網目選項

- app.meshOptions加入2英吋／50mm、57mm與3英吋／75mm、85mm四個獨立名稱，分別映射50／57／75／85數值。新段預設2英吋／50mm；保留舊2英吋=50、3英吋=75別名供舊案，只有目前舊名會加原案mm選項，不丟棄或改寫原尺寸。4英吋及正2英吋50.8仍保留。名稱為業主採購規格，不可用英吋換算覆蓋57／85。
- wireField提供2.6／3／3.4／3.9／4／5及other自訂1～6mm，實際data-key仍wire；wirePreset僅UI不存進案件。選other只顯示自訂欄，不先改資料，數字change沿用既有validate。setMeshMaterial只有明確從其他材質改選pvc時帶3.9，讀取／render／同材質重選不重設自訂值；studio.setSegmentSpec採相同規則。
- segmentSpecs集中產生菱形網規格、立柱與工法、橫桿分組；基礎及埋深移到立柱旁，gate用門柱與工法／門框，meshOnly不出新管材工法與橫桿。排數與管長只簡化標籤，railCount／railLength及按跨計支、規格分組、價格鍵均不改。
- design原樣攜帶wire／meshChoice／mesh；studio.meshSpecification識別四個新精確名稱，CSV／圖片不會退回錯誤網目。完整JSON／Drive沿用原序列化。mesh-presets-test.cjs納入主測試及AI來源包，涵蓋PVC預設／自訂、舊PVC保留、4種精確網目、正2英吋、JSON／3D／客戶輸出／第一段繼承及實際studio setter。
- 版本mesh-presets-1，發布app.js／studio.html／index.html及AI來源包。工作區仍為Documents/Codex/2026-11-04/shangching-span-quote；原E槽副本不改動。

## 2026-11-04 獨立高度與繪圖比例

- 沿用既有height（網高／門高）、postLength（含埋入的整支管長）、depth及base，沒有新增或遷移資料欄位。app將圍籬height標籤明確改成「菱形網高度」，門片仍用門高；studio顯示「菱形網／門高（獨立於柱長）」。地上柱長維持postLength−burial，plate的burial為0，不能用網高覆寫柱長。
- studio.panel一般圍籬網片範圍由舊0.05～height−0.025改成0～height，與標註網高一致。gate本體原框架間隙保留，橫桿／扣件排位不變，配件數量與報價不受影響。renderPost仍獨立使用postAbove。
- reference-drawing.cadSVG採同一scale繪製地上立柱、埋深、網片與寬度。一般比例上限135px/m，寬度870px／極高尺寸540px上限才整圖等比縮放；不再每次以205px固定最高處。ground及面板高度隨實際最大高度調整，防止長柱超出畫框。一般圍籬mesh矩形使用ground到ground−height*scale，data-mesh屬性供實際幾何驗證。
- 所有客戶HTML／PNG／PDF與工作室參照線稿共用此核心，輸出標註說明改為同視圖等比。兩張輸出在不同頁面或容器內仍可能整體縮放，但同圖柱高／網高／埋深的相對比例不變。
- height-scale-test.cjs已納入test.cjs及AI來源包，驗證CAD實際矩形比例、改柱不改網、改網不改柱、共地面、底板／埋深／短柱／10m極值，以及實際studio.panel/renderPost函式的輸出座標；不依賴另一份假繪圖函式。index與app嵌入圖及reference快取版本height-scale-1；發布不能漏reference-drawing.js與studio.html。

## 2026-11-04 報價整數數量與依跨計支（最新契約）

- 使用者最新明確要求覆蓋先前依進料管長計支規則：`railGroups`數量=sum(各段ceil(段長/spacing)×railCount)。例10m／柱距2m／2排＝10支；12m／柱距3m／2排＝8支。`railLength`保留為採購參考，不決定安裝支數；規格群組及`railPiece_管長_外徑_厚度`單價鍵保留，原每支價不丟失。
- 共用fence-materials.js提供survey／studio／confirmation數量；環帽上排每跨一支，連結片依直線相連跨數減1計。零橫桿、meshOnly、existing及gate本體排除自動量，手動accessoryAdjustments保留。studio.specRows的railPieces同步改依spanCount(length,spacing)×排數。
- `fresh/migrate`標示`railQuantityBasis='span'`，design傳輸也帶此欄。railPricing統一piece；舊缺省／length由migrate存previousRailPricing='length'後改piece。rates.rail元／m仍保存在檔案，但lines不再使用，不可當元／支。每支價依rates[rateKey]，缺少用rates.railPiece，預設0；舊每米案UI提示核對。UI取消舊按米選項。
- `wholeMeters`用ceil(max(0,n−1e-8))，只在lines的mesh／labor將整行總數進位；不可逐段各自進位，更不能改segments[].length、estimate().mesh／total或design節點。quote、CSV及內部報價使用lines的整數計價量；網高仍不乘入數量。報價上方metrics顯示計價米數並改標題。
- 報價表qtyValue及qtyUnit分行；一般量為整數，quantityText保留半台班為½／1½等分數，實際台班數與費用不進位。單價input可保留小數；此需求不刪掉管徑48.6、厚度1.4、網高1.5等必要規格精度。
- 客戶材料表及工法保留量測實值，橫桿為跨數支數；若實際網長與整米計價數不同，priced報表增加整米進位計價說明。無價簡版仍不含價，照片仍排除，圖面比例沿用高度修正；PNG／PDF用同一model。
- quote-units-test.cjs已納入test.cjs及AI來源包，覆蓋10米5跨10支、進料管長不改數量、環帽跨接頭、10.5計11、跨段合計後進位、實際長度不變、qtyValue不含小數點、半班、原米價隔離及JSON。material-test.cjs更新舊模式預期。快取span-quote-1；發布不可漏fence-materials.js／studio.html／confirmation.js。
- 本次延續工作時可寫區改為Documents/Codex，實際接手checkout為`C:/Users/nosa/Documents/Codex/2026-11-04/shangching-span-quote`；origin仍是同一GitHub專案。舊E:/GPT/shangching-fence-survey保留先前未提交修改且本次不再寫入，不能把舊副本當最新發布來源。先核對GitHub HEAD與本HANDOFF再接續，不刪除原資料。

客戶圖片優先：index.html將confirmShareImages移到confirmBackBar，confirmSharePdf移入outputOptions，保留原ID及事件；style.css的主按鈕樣式改指向confirmShareImages。分享仍用PNG files，不支援或失敗時showImages展開並捲到圖片，AbortError不重送；PDF兩按鈕仍走download(pdf)，不可為了改位置而改成直接PDF navigator.share。確認單模型、圖片／PDF內容與原資料不變。index的style／confirmation快取版本為image-first-1。

手機大圖／收合：app.js的segmentOpen為以穩定segment.id索引的記憶體Map，只管details.segment.open；不放入data或JSON。render保留Map，resetScene清除，新增／復原呼叫showSegment自動展開。原生toggle使用capture事件記狀態；segmentSummaryText供render與欄位change共同更新摘要，避免長度／柱距改了卻顯示舊數字。beforeprint展開、afterprint復原。

mobile-view.css在studio的scene-photos.css之後載入，850px以下預設隱藏次要資訊、保留看圖控制；mobile-tools-open顯示原設定，setMobileTools不改設計或歷史。勘查表overview按鈕透過原transfer附overview=1，工作室必須在history.replaceState清查詢前捕捉requestOverview，帶入完成後才toggleCanvasFocus。embed不顯示手機導航，desktop不受手機簡化影響。資料／數量／照片規則沿用；版本修改須同時更新app的iframe快取參數與index的JS/CSS參數。

2026-11-04：`project.phone2`是第二組電話，migrate補空字串；phone／phone2為最多60字的文字，不轉數字。`confirmation.model/build`第二參數支援舊boolean及`customer`／`quote`／`internal`；customer仍無價格，quote只列雜項折讓及net／tax／total摘要且使用簡版線稿，internal保留詳細價格。HTML／Canvas／PDF共用model，金額來自quoteSummary，不重算另一套稅。

`scene-photos.js/.css`為勘查與工作室共用的獨立照片面板。`design().sitePhotoRefs`只有id/name/caption/segmentId，影像由既有`photos.js`的唯讀read(id)取IndexedDB，不能把dataUrl塞進傳輸packet或PDF。段落以既有edge.id對應；工作室新增圍籬清除沿用範本的id，避免誤帶舊照片。缺少影像、孤兒路段、切換案件與非同步過期讀取須安全處理；面板用textContent建立文字，不插HTML。原`confirmationSnapshot`仍清空photos，model不帶sitePhotoRefs。照片面板不參與材料／價格／幾何，放大圖面模式暫時收起照片。

`quote-photo-test.cjs`涵蓋三種報表模式、電話相容、折讓與0%稅、照片穩定關聯／篩選／讀取失敗／舊讀取取消／返回及輸出隔離；由test.cjs一併執行。一般報價PDF線稿高度最多400px（1120px畫布），給三項金額留空間；無價簡版不受此限制，內容過長照常續頁。

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
簡易圍籬為既有style=clamp與railCount=0，不增資料版本；需有新立柱及網量，沒有橫桿／自動管夾，混合計算不可把零橫桿段當全案配件的排數來源。工作室postDia／thickness是選取段實際柱規格，門柱使用獨立UI控制器映射同一段的實際規格，不改其他圍籬。
勘查表segments新增可選gatePostDia、gatePostThickness、postMaterial、gatePostMaterial：門柱明確選值優先；舊案未提供時沿用舊門柱至少89.1的繪圖回推，migrate不覆寫舊資料。design把選取角色換算成edges.postDia／thickness／material，再移除表單角色欄位；原始完整勘查JSON保留獨立欄位。材料選擇與自訂厚度分開，不能把2mm錏管因厚度改判鍍鋅管。表單gateOpening為淨開口輸入，轉存原length時加門柱外徑，原length仍為柱心幾何。
工作室輸出length只列圍籬長度，gateWidth只列門淨開口；門柱另有gatePostDia／gatePostThickness／gatePostLength輸出鍵（這些輸出鍵不是工作室幾何來源）。新輸出鍵未設定時繼承舊length／postDia／thickness／postLength勾選，避免舊案隱藏的資訊重新出現。共用CAD門淨寬尺寸線取門柱內側，不改實際節點；客戶確認單的門柱材質／厚度以實際選取角色列出，未知厚度仍標待確認。
`segments[].existing`／`edges[].existing`缺省false；true表示整段已完成、只供位置參照，優先於meshOnly。既有段排除本次total／mesh／rail／gates／新增柱與基礎、自動配件及length-based labor；其已有柱位亦排除相接新段的新柱。全案手動加減及費用仍保留。note為最長20000字串，客戶圖及確認單保留既有名稱與備註，材料CSV排除。JSON完整保留以便編輯；新增段不繼承existing及note。customerReport提供rowIndices對應原段索引，CAD查選取規格不得直接用過濾後rows[index]。客戶簡版若含既有段，必須同時繪全案平面位置，不能只畫新段局部而遺失既有位置。
`segments[].meshOnly`／`edges[].meshOnly` 為可選布林值，缺省或舊檔為false。true只適用圍籬（type=fence／style=clamp），表示只裝圍網並沿用既有立柱；網量與安裝長度照算，不計新立柱、橫桿、基礎或自動管夾配件。原管材、工法與橫桿排數保留供切回一般圍籬，計算與繪圖須優先判斷meshOnly，不能只看railCount。混合配置若新段柱位落在既有柱位，也不重複計新柱。客戶規格須註明既有立柱、留空新管材與基礎尺寸；3D與共用線稿以虛線示意既有柱，不標新管長或埋深。
每段跨數 ceil(length/spacing)，接點共享端柱；門段只有兩端柱，不生中間柱。網量=sum(非門段 length)，絕不能乘 height。橫桿安裝米數=sum(length*railCount)，供新支數算法與舊案按米計價區分；採購支數依上方railGroups契約。單獨埋入／混凝土／底板按接點計處；工法交界採先出現段，需人工覆核。
橫桿依規格分組單價，其餘原材料仍用既有單價；怪手施工費=excavatorShifts*excavatorRate，進退場費=excavatorTransport，各自列在lines；quote()計算小計、折讓、稅與總額，JSON/CSV/列印均含這兩項。全案估價不按需求段數倍乘，舊檔由migrate補0，保留原extra避免丟失；橫桿配件已依part_*單價列費，耗損及未列零星扣件另估。正2英吋與2英吋名稱必須區分，但圖面mm僅近似；不要推定供應商規範。
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
- 只按儲存時上傳。2026-11-05起使用同一案件根資料夾＋案內staged revisions；全部成功才更新sqCurrent及sqPrevious，清單只查已完成案件，支援下一頁。中斷不刪舊版本。詳見本文最新同案更新章節。
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
首次雲端存檔建立姓名｜地點｜台灣建立時間｜案件名資料夾；後續更新同一案件，完整JSON含參數及照片，另有3D JSON及照片子資料夾，歷次資料版本保留案內。另存新案才新增案件根。缺姓名／地點會明確標未填。公司電腦登入相同Google帳號、選相同根資料夾，可搜尋已載入案件的姓名地點日期，較舊版本用載入更多；舊命名仍可載入。手機客戶簡版使用全案路線簡圖，合併材料工法與地形，保留全部交代事項，優先一頁；超量自動續頁以維持可讀。公司完整版保留詳細線稿和報價。照片備份保留，不放客戶PDF。iPhone原生分享及本次命名雲端實際連線另行覆核。

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
