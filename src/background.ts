type TaskInfo = { winId: number; tabId: number; url: string };

let taskInfos: TaskInfo[] = [];

const listenUrl = (winId: number, tabId: number, url: string) => {
  let isExist = false;
  taskInfos.every(info => {
    if (winId === info.winId) {
      isExist = true;
      return false;
    }
    return true;
  });
  if (!isExist) {
    taskInfos.push({ winId, tabId, url });
  }
};

const discardUrl = (winId: number) => {
  taskInfos = taskInfos.filter(info => info.winId !== winId);
};

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: "watch this page",
    type: "checkbox",
    checked: false,
    onclick: ({ pageUrl: url, checked }, { windowId: winId, id: tabId }) => {
      if (checked) {
        listenUrl(winId, tabId!, url);
        return;
      }
      discardUrl(winId);
    }
  });
});

type TNotification = { id: string; winId: number; tabId: number };

const notifications: TNotification[] = [];

const createNotification = (winId: number, tabId: number, bugsCount: string) => {
  const id = new Date().getTime() + "";
  notifications.push({ id, winId, tabId });
  chrome.notifications.create(id, {
    type: "basic",
    title: "Mantis Notifier",
    message: `You have ${bugsCount} bugs to be resolved`,
    iconUrl: "icon.png",
    isClickable: true
  });
};

const onNotificationClicked = (id: string) => {
  const ns = notifications.filter(n => n.id === id);
  if (ns.length === 0) return;
  const n = ns[0];
  chrome.windows.update(n.winId, { focused: true }, () => {
    chrome.tabs.update(n.tabId, { active: true });
  });
};

chrome.notifications.onClicked.addListener(onNotificationClicked);

const createTask = async (info: TaskInfo) => {
  const req = new Request(info.url, { credentials: "same-origin" });
  try {
    const resp = await fetch(req);
    const text = await resp.text();
    const matches = /指定给我的\(尚未解决\)[\s\S]*?\(\d+\s-\s\d+\s\/\s(\d+)\)/g.exec(text);
    if (matches && matches.length === 2) {
      createNotification(info.winId, info.tabId, matches[1]);
    }
  } catch (e) {
    console.error(e);
  }
};

let isFetching = false;
const doFetch = (alarm: chrome.alarms.Alarm) => {
  if (isFetching || taskInfos.length === 0) return;

  isFetching = true;
  const tasks = taskInfos.map(info => createTask(info));
  Promise.all(tasks).then(() => {
    isFetching = false;
  });
};

chrome.alarms.create("fetch", { periodInMinutes: 3 });

chrome.alarms.onAlarm.addListener(doFetch);
