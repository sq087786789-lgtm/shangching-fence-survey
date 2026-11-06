# CodeGraph 實測（2026-11-06）

使用者澄清主要要測 Graph／CodeGraph，而非 Repomix。本次透過已載入 MCP，對 E:/GPT/shangching-fence-survey 最新來源實測，不是推測。

## 結果

| 對照方法 | 輸入內容估算 Token |
|---|---:|
| 讀取相關3個完整檔案 | 14,698 |
| CodeGraph精準搜尋＋函式原碼與呼叫者 | 1,703 |
| rg精準搜尋相關行 | 852 |

CodeGraph相對完整讀檔少88.41%，但在此已知函式名稱的小案例，精準rg比CodeGraph更省；CodeGraph結果約為rg的2倍。不能把88.4%當所有工作、帳號額度、費用或整段聊天的節省。

## 測法與範圍

任務：定位drawInlineRow、讀取函式內容並列出三個直接呼叫來源。對照來源提交4f0e029595170371cb30bbf74e3f31448b84f43b；相關檔案fitting-library.js／confirmation.js／studio-output.js。兩種工具都在同一來源上讀取，原碼以SHA256記錄。

CodeGraph代表流程：symbol_search(query=drawInlineRow,compact=true,limit=1,symbolType=function)＋get_detailed_symbol(nodeId=搜尋所得ID,includeSource=true,includeCallers=true,includeCallees=true)。只算實際回傳的text內容，不人工刪掉重複metadata。rg對照命令：rg -n --fixed-strings drawInlineRow fitting-library.js confirmation.js studio-output.js，保留所有命中行。完整檔案對照含各路徑及檔案原文。

統一使用本機既有gpt-tokenizer 4.1.0／o200k_base（透過Repomix TokenCounter作計數器；測試對象仍是CodeGraph）。不計工具schema、請求、推理、系統提示、交接讀取與其他聊天。本回合所有額外診斷回應合計5756 Token，並非僅1703；代表流程數字不能充當整回合實際用量。沒有作帳號／費用量測。

## 功能核對

- 最新新增inlineRows／drawInlineRow／mergeInlinePages均找到，路徑為E槽正式來源。詳細symbol原碼與目前磁碟drawInlineRow函式逐字一致，這個樣本沒有索引落後。
- drawInlineRow三個直接呼叫者正確：confirmation.renderPages、studio-output.renderPages、fitting-library.mergeInlinePages；已核對原碼。
- 找到一個錯誤關聯：mergeInlinePages內CanvasRenderingContext2D的ctx.save()被連至drive.js的save函式。圖譜關聯不能當成全部都正確。
- 工具文件稱line為0-based；本樣本傳8返回第8行inlineRows、傳9返回第9行drawInlineRow，實際表現為1-based。後續優先用當次symbol_search取得nodeId，不持久化跨索引版本ID；仍須核對原碼位置。
- MCP配置為v0.21.0 --graph-only。本次工具回報semantic matching unavailable，只驗證名稱／文字搜尋，不宣稱語意向量搜尋已啟用或有效。compact=true仍含metadata，limit=1能限制本次精準查詢結果。

## 後續使用方式

簡單已知字詞定位先用rg，跨檔呼叫／修改影響用CodeGraph，再針對需要的原碼片段核對。不要一次讀整個專案；不要因為工具已安裝就認定每個工作自動省固定百分比。動態JavaScript屬性與同名函式可能錯連，結果不足時回原碼確認。

機讀證據與可重跑計數器在ignored work：codegraph-token-evidence.json、codegraph-token-benchmark.json、codegraph-rg-targeted.txt、measure-codegraph-tokens.cjs。未改引擎、配置、監控、網站功能、案件或雲端資料。
