import React, { useState, useEffect } from "react";
import { useControls, button, folder, Leva } from "leva";
import { Settings, ArrowLeft, PlayCircle, RotateCcw } from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type WidgetConfig = Record<string, any>;

interface WidgetDefinition {
  name: string;
  Component: React.FC<{ config: WidgetConfig }>;
  getLevaSchema: () => any;
}

/* ============================================================
   QUIZ WIDGET
============================================================ */

const QuizWidget: React.FC<{ config: WidgetConfig }> = ({ config }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Reset khi thay đổi câu hỏi trong Leva
  useEffect(() => {
    setSelectedIndex(null);
    setShowResult(false);
  }, [config.question]);

  // Chuyển đổi các field opt1, opt2... từ Leva thành array
  const options = [config.opt1, config.opt2, config.opt3, config.opt4].filter(
    Boolean
  );
  const isCorrect = selectedIndex === config.correctIndex;

  return (
    <div
      className="p-10 rounded-xl min-h-[400px] transition-all duration-500"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        {config.question}
      </h2>

      <div className="space-y-4">
        {options.map((opt, i) => (
          <button
            key={i}
            disabled={showResult}
            onClick={() => {
              setSelectedIndex(i);
              setShowResult(true);
            }}
            className="w-full p-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-95 shadow-sm border border-black/5"
            style={{
              backgroundColor:
                showResult && i === selectedIndex
                  ? isCorrect
                    ? "#10b981"
                    : "#ef4444"
                  : config.buttonColor,
              color: "#ffffff",
              opacity: showResult && i !== selectedIndex ? 0.6 : 1,
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {showResult && (
        <div
          className={`mt-8 p-4 rounded-xl text-center font-bold animate-bounce ${
            isCorrect
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isCorrect ? "✓ Chính xác!" : "✗ Sai rồi, thử lại nhé!"}
        </div>
      )}
    </div>
  );
};

const getQuizLevaSchema = () => ({
  Content: folder({
    question: { value: "Thủ đô của Việt Nam là gì?", label: "Câu hỏi" },
    opt1: { value: "TP. Hồ Chí Minh", label: "Đáp án 1" },
    opt2: { value: "Hà Nội", label: "Đáp án 2" },
    opt3: { value: "Đà Nẵng", label: "Đáp án 3" },
    opt4: { value: "Cần Thơ", label: "Đáp án 4" },
    correctIndex: {
      value: 1,
      min: 0,
      max: 3,
      step: 1,
      label: "Index đáp án đúng",
    },
  }),
  Styling: folder({
    backgroundColor: { value: "#ffffff", label: "Màu nền" },
    buttonColor: { value: "#4f46e5", label: "Màu nút" },
  }),
});

/* ============================================================
   FLASHCARD WIDGET
============================================================ */

const FlashcardWidget: React.FC<{ config: WidgetConfig }> = ({ config }) => {
  const [flip, setFlip] = useState(false);

  // Reset mặt thẻ khi nội dung thay đổi
  useEffect(() => setFlip(false), [config.front, config.back]);

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div
        onClick={() => setFlip(!flip)}
        className="group w-full max-w-sm h-64 [perspective:1000px] cursor-pointer"
      >
        <div
          className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${
            flip ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex items-center justify-center p-8 text-center rounded-3xl shadow-xl [backface-visibility:hidden]"
            style={{
              backgroundColor: config.cardColor,
              color: config.textColor,
            }}
          >
            <p className="text-2xl font-bold">{config.front}</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 flex items-center justify-center p-8 text-center rounded-3xl shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{
              backgroundColor: config.backColor || "#312e81",
              color: config.textColor,
            }}
          >
            <p className="text-xl">{config.back}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const getFlashcardLevaSchema = () => ({
  Content: folder({
    front: { value: "React là gì?", label: "Mặt trước" },
    back: {
      value: "Một thư viện JavaScript để xây dựng giao diện người dùng.",
      label: "Mặt sau",
    },
  }),
  Styling: folder({
    cardColor: { value: "#6366f1", label: "Màu thẻ" },
    backColor: { value: "#4338ca", label: "Màu mặt sau" },
    textColor: { value: "#ffffff", label: "Màu chữ" },
  }),
});

/* ============================================================
   COUNTDOWN WIDGET
============================================================ */

const CountdownWidget: React.FC<{ config: WidgetConfig }> = ({ config }) => {
  const [time, setTime] = useState<number>(config.duration);
  const [running, setRunning] = useState(false);

  // Đồng bộ hóa khi chỉnh sửa duration trong Leva
  useEffect(() => {
    setTime(config.duration);
    setRunning(false);
  }, [config.duration]);

  useEffect(() => {
    if (!running || time <= 0) return;
    const id = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [running, time]);

  const m = String(Math.floor(time / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <h2 className="text-xl font-medium text-gray-500 mb-2">{config.title}</h2>
      <div
        className={`text-8xl font-black mb-10 tabular-nums ${
          time < 10 && running ? "animate-pulse" : ""
        }`}
        style={{ color: config.timerColor }}
      >
        {m}:{s}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setRunning(!running)}
          className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all"
        >
          {running ? (
            "Tạm dừng"
          ) : (
            <>
              <PlayCircle size={20} /> Bắt đầu
            </>
          )}
        </button>
        <button
          onClick={() => {
            setTime(config.duration);
            setRunning(false);
          }}
          className="p-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-all"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

const getCountdownLevaSchema = () => ({
  Content: folder({
    title: { value: "Thời gian còn lại", label: "Tiêu đề" },
    duration: { value: 60, min: 5, max: 3600, step: 5, label: "Giây" },
  }),
  Styling: folder({
    timerColor: { value: "#1f2937", label: "Màu số" },
  }),
});

/* ============================================================
   REGISTRY & MAIN
============================================================ */

const WIDGETS: Record<string, WidgetDefinition> = {
  quiz: {
    name: "Trắc nghiệm",
    Component: QuizWidget,
    getLevaSchema: getQuizLevaSchema,
  },
  flashcard: {
    name: "Thẻ ghi nhớ",
    Component: FlashcardWidget,
    getLevaSchema: getFlashcardLevaSchema,
  },
  countdown: {
    name: "Đồng hồ đếm ngược",
    Component: CountdownWidget,
    getLevaSchema: getCountdownLevaSchema,
  },
};

const WidgetWithLeva: React.FC<{ widgetType: string; onExit: () => void }> = ({
  widgetType,
  onExit,
}) => {
  const widget = WIDGETS[widgetType];

  // Hook useControls nên dùng widgetType làm key để reset khi đổi widget
  const config = useControls(widget.name, widget.getLevaSchema(), [widgetType]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-12">
      <button
        onClick={onExit}
        className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Quay lại danh sách
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-gray-100">
          <widget.Component config={config} />
        </div>

        <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
          <div className="p-2 bg-indigo-500 rounded-lg text-white">
            <Settings size={20} />
          </div>
          <div>
            <h4 className="font-bold text-indigo-900">Chế độ tùy chỉnh</h4>
            <p className="text-indigo-700 text-sm">
              Sử dụng bảng điều khiển bên phải để thay đổi nội dung và màu sắc
              của Widget.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  if (selectedWidget) {
    return (
      <WidgetWithLeva
        widgetType={selectedWidget}
        onExit={() => setSelectedWidget(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Widget Studio
          </h1>
          <p className="text-gray-500 text-lg font-medium">
            Chọn một công cụ để bắt đầu cấu hình
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(WIDGETS).map(([key, widget]) => (
            <button
              key={key}
              onClick={() => setSelectedWidget(key)}
              className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-50 flex flex-col items-center text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Settings className="text-indigo-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {widget.name}
              </h3>
              <p className="text-gray-400 text-sm">
                Nhấp để cấu hình giao diện và nội dung
              </p>
            </button>
          ))}
        </div>
      </div>
      {/* Ẩn tiêu đề Leva mặc định để giao diện sạch hơn */}
      <Leva titleBar={false} fill collapsed={false} />
    </div>
  );
}
