// The toolbar click only shows a popup when this window is focused and the
// popup can anchor to it. That fails when another Edge process owns the
// visible window, so the click does nothing. Open the same page in a tab
// instead; that always works.
chrome.action.onClicked.addListener(async () => {
  const url = chrome.runtime.getURL('popup.html');
  const tabs = await chrome.tabs.query({ url });
  const existing = tabs[0];
  if (existing) {
    await chrome.tabs.update(existing.id, { active: true });
    if (existing.windowId != null) {
      await chrome.windows.update(existing.windowId, { focused: true });
    }
    return;
  }
  await chrome.tabs.create({ url });
});
