// import React, { useState, useEffect, useRef } from "react";
// import { Pane } from "tweakpane";
// import { Settings, ArrowLeft, RotateCcw } from "lucide-react";

// /* ============================================================
//    TYPES
// ============================================================ */
// export type BaseWidgetConfig = Record<string, any>;

// interface WidgetDefinition<T extends BaseWidgetConfig> {
//   name: string;
//   Component: React.FC<{ config: T }>;
//   defaultData: T;
//   setupPane: (pane: Pane, config: T, onChange: (newVal: T) => void) => void;
// }

// /* ============================================================
//    WIDGET 1: QUIZ
// ============================================================ */
// const QuizWidget: React.FC<{ config: BaseWidgetConfig }> = ({ config }) => {
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
//   const [showResult, setShowResult] = useState(false);

//   useEffect(() => {
//     setSelectedIndex(null);
//     setShowResult(false);
//   }, [config.question]);

//   const options = [config.opt1, config.opt2, config.opt3, config.opt4].filter(
//     Boolean
//   );
//   const isCorrect = selectedIndex === config.correctIndex;

//   return (
//     <div
//       className="p-10 rounded-xl min-h-[400px]"
//       style={{ backgroundColor: config.backgroundColor }}
//     >
//       <h2 className="text-2xl font-bold mb-8 text-gray-800">
//         {config.question}
//       </h2>
//       <div className="space-y-4">
//         {options.map((opt, i) => (
//           <button
//             key={i}
//             disabled={showResult}
//             onClick={() => {
//               setSelectedIndex(i);
//               setShowResult(true);
//             }}
//             className="w-full p-4 rounded-xl font-semibold text-white transition-all shadow-sm"
//             style={{
//               backgroundColor:
//                 showResult && i === selectedIndex
//                   ? isCorrect
//                     ? "#10b981"
//                     : "#ef4444"
//                   : config.buttonColor,
//               opacity: showResult && i !== selectedIndex ? 0.6 : 1,
//             }}
//           >
//             {opt}
//           </button>
//         ))}
//       </div>
//       {showResult && (
//         <div
//           className={`mt-8 p-4 rounded-xl text-center font-bold ${
//             isCorrect
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {isCorrect ? "✓ Chính xác!" : "✗ Sai rồi!"}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ============================================================
//    WIDGET 2: FLASHCARD
// ============================================================ */
// const FlashcardWidget: React.FC<{ config: BaseWidgetConfig }> = ({
//   config,
// }) => {
//   const [flip, setFlip] = useState(false);
//   useEffect(() => setFlip(false), [config.front, config.back]);

//   return (
//     <div className="flex items-center justify-center min-h-[400px] p-6">
//       <div
//         onClick={() => setFlip(!flip)}
//         className="w-full max-w-sm h-64 [perspective:1000px] cursor-pointer"
//       >
//         <div
//           className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${
//             flip ? "[transform:rotateY(180deg)]" : ""
//           }`}
//         >
//           <div
//             className="absolute inset-0 flex items-center justify-center p-8 text-center rounded-3xl shadow-xl [backface-visibility:hidden]"
//             style={{
//               backgroundColor: config.cardColor,
//               color: config.textColor,
//             }}
//           >
//             <p className="text-2xl font-bold">{config.front}</p>
//           </div>
//           <div
//             className="absolute inset-0 flex items-center justify-center p-8 text-center rounded-3xl shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]"
//             style={{
//               backgroundColor: config.backColor,
//               color: config.textColor,
//             }}
//           >
//             <p className="text-xl font-medium">{config.back}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ============================================================
//    WIDGET 3: COUNTDOWN
// ============================================================ */
// const CountdownWidget: React.FC<{ config: BaseWidgetConfig }> = ({
//   config,
// }) => {
//   const [time, setTime] = useState<number>(config.duration);
//   const [running, setRunning] = useState(false);

//   useEffect(() => {
//     setTime(config.duration);
//     setRunning(false);
//   }, [config.duration]);
//   useEffect(() => {
//     if (!running || time <= 0) return;
//     const id = setInterval(() => setTime((t) => t - 1), 1000);
//     return () => clearInterval(id);
//   }, [running, time]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
//       <h2 className="text-xl text-gray-500 mb-2 font-medium">{config.title}</h2>
//       <div
//         className="text-8xl font-black mb-10 tabular-nums"
//         style={{ color: config.timerColor }}
//       >
//         {String(Math.floor(time / 60)).padStart(2, "0")}:
//         {String(time % 60).padStart(2, "0")}
//       </div>
//       <div className="flex gap-4">
//         <button
//           onClick={() => setRunning(!running)}
//           className="px-8 py-3 bg-black text-white rounded-full font-bold"
//         >
//           {running ? "Tạm dừng" : "Bắt đầu"}
//         </button>
//         <button
//           onClick={() => {
//             setTime(config.duration);
//             setRunning(false);
//           }}
//           className="p-3 bg-gray-200 text-gray-600 rounded-full"
//         >
//           <RotateCcw size={24} />
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ============================================================
//    REGISTRY
// ============================================================ */
// const WIDGETS: Record<string, WidgetDefinition<any>> = {
//   quiz: {
//     name: "Trắc nghiệm",
//     Component: QuizWidget,
//     defaultData: {
//       question: "React là thư viện của ngôn ngữ nào?",
//       opt1: "Java",
//       opt2: "Python",
//       opt3: "JavaScript",
//       opt4: "C++",
//       correctIndex: 2,
//       backgroundColor: "#ffffff",
//       buttonColor: "#4f46e5",
//     },
//     setupPane: (pane, config, onChange) => {
//       const f1 = pane.addFolder({ title: "Nội dung" });
//       f1.addBinding(config, "question", { label: "Câu hỏi" });
//       f1.addBinding(config, "opt1");
//       f1.addBinding(config, "opt2");
//       f1.addBinding(config, "opt3");
//       f1.addBinding(config, "opt4");
//       f1.addBinding(config, "correctIndex", { min: 0, max: 3, step: 1 });
//       const f2 = pane.addFolder({ title: "Giao diện" });
//       f2.addBinding(config, "backgroundColor");
//       f2.addBinding(config, "buttonColor");
//       pane.on("change", () => onChange({ ...config }));
//     },
//   },
//   flashcard: {
//     name: "Thẻ ghi nhớ",
//     Component: FlashcardWidget,
//     defaultData: {
//       front: "Hello",
//       back: "Xin chào",
//       cardColor: "#6366f1",
//       backColor: "#4338ca",
//       textColor: "#ffffff",
//     },
//     setupPane: (pane, config, onChange) => {
//       const f1 = pane.addFolder({ title: "Nội dung" });
//       f1.addBinding(config, "front", { label: "Mặt trước" });
//       f1.addBinding(config, "back", { label: "Mặt sau" });
//       const f2 = pane.addFolder({ title: "Giao diện" });
//       f2.addBinding(config, "cardColor");
//       f2.addBinding(config, "backColor");
//       f2.addBinding(config, "textColor");
//       pane.on("change", () => onChange({ ...config }));
//     },
//   },
//   countdown: {
//     name: "Đồng hồ",
//     Component: CountdownWidget,
//     defaultData: {
//       title: "Tập trung nào!",
//       duration: 60,
//       timerColor: "#1f2937",
//     },
//     setupPane: (pane, config, onChange) => {
//       pane.addBinding(config, "title");
//       pane.addBinding(config, "duration", { min: 5, max: 600, step: 5 });
//       pane.addBinding(config, "timerColor");
//       pane.on("change", () => onChange({ ...config }));
//     },
//   },
// };

// /* ============================================================
//    MAIN ENGINE
// ============================================================ */
// const WidgetWithTweakpane: React.FC<{
//   widgetType: string;
//   onExit: () => void;
// }> = ({ widgetType, onExit }) => {
//   const widget = WIDGETS[widgetType];
//   const [config, setConfig] = useState(widget.defaultData);
//   const paneRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!paneRef.current) return;
//     const pane = new Pane({
//       container: paneRef.current,
//       title: `Cài đặt ${widget.name}`,
//     });
//     const dataProxy = { ...widget.defaultData };
//     widget.setupPane(pane, dataProxy, (newVal) => setConfig(newVal));
//     return () => pane.dispose();
//   }, [widgetType]);

//   return (
//     <div className="min-h-screen bg-[#f8fafc] flex">
//       <div className="flex-1 p-8 md:p-12">
//         <button
//           onClick={onExit}
//           className="flex items-center gap-2 text-gray-500 mb-8 hover:text-black transition-colors"
//         >
//           <ArrowLeft size={20} /> Quay lại danh sách
//         </button>
//         <div className="max-w-2xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
//           <widget.Component config={config} />
//         </div>
//       </div>
//       <div className="w-80 bg-white border-l p-4 shadow-lg flex flex-col">
//         <div className="flex-1 overflow-y-auto" ref={paneRef} />
//         <div className="mt-4 p-3 bg-indigo-50 rounded-xl text-[10px] text-indigo-400 font-mono italic">
//           Powered by Tweakpane v4
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function App() {
//   const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

//   if (selectedWidget)
//     return (
//       <WidgetWithTweakpane
//         widgetType={selectedWidget}
//         onExit={() => setSelectedWidget(null)}
//       />
//     );

//   return (
//     <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
//       <div className="max-w-5xl w-full">
//         <header className="text-center mb-16">
//           <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
//             Widget Studio
//           </h1>
//           <p className="text-gray-500">
//             Sử dụng Tweakpane để cấu hình thời gian thực
//           </p>
//         </header>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {Object.entries(WIDGETS).map(([key, widget]) => (
//             <button
//               key={key}
//               onClick={() => setSelectedWidget(key)}
//               className="group bg-white p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-gray-50 flex flex-col items-center text-center"
//             >
//               <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//                 <Settings className="text-indigo-600" size={32} />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800">{widget.name}</h3>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { loadWidgetBundle } from "./widgetLoader";
import { WidgetWithTweakpane } from "./WidgetWithTweakpane";
import { getRegisteredWidgets } from "widget-sdk";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadWidgetBundle("http://localhost:5173/widgets/widget.js").then(() =>
      setReady(true)
    );
  }, []);

  if (!ready) return <p>Loading widget...</p>;

  const widgets = getRegisteredWidgets();
  const firstId = Object.keys(widgets)[0];

  return <WidgetWithTweakpane widgetId={firstId} />;
}
