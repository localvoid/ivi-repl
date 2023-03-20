const send = (msg) => parent.postMessage(msg, "*");
addEventListener("error", (ev) => {
  send({ action: "error", value: ev.error });
});
addEventListener("unhandledrejection", (ev) => {
  send({ action: "unhandledrejection", value: ev.reason });
});

let prevLog = { level: null, args: null };
const addLevel = (level) => {
  const _orig = console[level];
  console[level] = (...input) => {
    let args = null;
    try {
      args = input.map((v) => JSON.stringify(v));
    } catch (err) {}
    if (prevLog.level === level && prevLog.args && prevLog.args === args) {
      send({ action: "console", level, duplicate: true });
    } else {
      prevLog = { level, args };
      try {
        send({ action: "console", level, args });
      } catch (err) {
        send({ action: "console", level: "unclonable" });
      }
    }
    _orig(...input);
  };
};
addLevel("clear");
addLevel("log");
addLevel("info");
addLevel("dir");
addLevel("warn");
addLevel("error");
addLevel("table");

const addGroupMethod = (method, action) => {
  const _orig = console[method];
  console[method] = (label) => {
    send({ action, label });
    _orig(label);
  };
};
addGroupMethod("group", "console_group");
addGroupMethod("groupEnd", "console_group_end");
addGroupMethod("groupCollapsed", "console_group_collapsed");

const perf = performance;
const timers = new Map();

const _time = console.time;
console.time = (label = "default") => {
  _time(label);
  timers.set(label, perf.now());
};
const _timeLog = console.timeLog;
console.timeLog = (label = "default") => {
  _timeLog(label);
  const now = perf.now();
  if (timers.has(label)) {
    send({
      action: "console",
      level: "system-log",
      args: [`${label}: ${now - timers.get(label)}ms`],
    });
  } else {
    send({
      action: "console",
      level: "system-warn",
      args: [`Timer '${label}' does not exist`],
    });
  }
};
const _timeEnd = console.timeEnd;
console.timeEnd = (label = "default") => {
  const now = perf.now();
  _timeEnd(label);
  send({
    action: "console",
    level: "system-log",
    args: timers.has(label)
      ? [`${label}: ${now - timers.get(label)}ms`]
      : [`Timer '${label}' does not exist`],
  });
  timers.delete(label);
};

const _assert = console.assert;
console.assert = (condition, ...args) => {
  if (condition) {
    const stack = new Error().stack;
    send({
      action: "console",
      level: "assert",
      args,
      stack,
    });
  }
  _assert(condition, ...args);
};

const counter = new Map();

const _count = console.count;
console.count = (label = "default") => {
  const i = counter.get(label) || 0;
  counter.set(label, i + 1);
  send({
    action: "console",
    level: "system-log",
    args: `${label}: ${i}`,
  });
  _count(label);
};

const _countReset = console.countReset;
console.countReset = (label = "default") => {
  if (counter.has(label)) {
    counter.set(label, 0);
  } else {
    send({
      action: "console",
      level: "system-warn",
      args: `Count for '${label}' does not exist`,
    });
  }
  _countReset(label);
};

const _trace = console.trace;
console.trace = (...args) => {
  const stack = new Error().stack;
  send({ action: "console", level: "trace", args, stack });
  _trace(...args);
};
