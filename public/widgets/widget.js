import { registerWidget as r } from "widget-sdk";
import * as o from "react";
const l = ({ config: t }) => {
  console.log(o);
  // const [e, n] = d(t.duration);
  // return i(() => {
  //   n(t.duration);
  // }, [t.duration]), /* @__PURE__ */ o.createElement("div", null, /* @__PURE__ */ o.createElement("h2", null, t.title), /* @__PURE__ */ o.createElement("div", { style: { color: t.timerColor } }, e, "s"));
};
// r("countdown", {
//   name: "Countdown",
//   Component: l,
//   defaultData: {
//     title: "Focus!",
//     duration: 60,
//     timerColor: "#000"
//   },
//   setupPane(t, e, n) {
//     t.addBinding(e, "title"), t.addBinding(e, "duration", {
//       min: 5,
//       max: 300,
//       step: 5
//     }), t.addBinding(e, "timerColor"), t.on("change", () => n({ ...e }));
//   }
// });
