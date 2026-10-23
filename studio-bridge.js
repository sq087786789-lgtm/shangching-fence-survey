(function () {
  'use strict';
  const prefix = 'sq-survey-transfer-';
  function key(token) {
    if (typeof token !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(token)) throw Error('帶入識別資料不正確');
    return prefix + token;
  }
  function save(storage, design) {
    const token = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    storage.setItem(key(token), JSON.stringify({format: 'sq-survey-transfer', version: 1, createdAt: Date.now(), design}));
    return token;
  }
  function load(storage, token, validate) {
    const raw = storage.getItem(key(token));
    if (!raw) throw Error('找不到帶入資料，請回勘查表重新按「帶入圍籬 3D 工具」');
    if (raw.length > 1000000) throw Error('帶入資料過大');
    const packet = JSON.parse(raw);
    if (packet?.format !== 'sq-survey-transfer' || packet.version !== 1 || !Number.isFinite(packet.createdAt) || Date.now() - packet.createdAt > 86400000 || packet.createdAt > Date.now() + 300000) throw Error('帶入資料已過期或格式不正確，請回勘查表重新帶入');
    return validate(packet.design);
  }
  window.surveyStudioBridge = {save, load, consume: (storage, token) => storage.removeItem(key(token))};
})();
