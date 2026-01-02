import React, { useState, useEffect } from "react";
import { Play, Settings } from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type WidgetMode = "select" | "edit" | "runtime";

type SchemaField =
  | {
      type: "text" | "textarea";
      label: string;
      default: string;
      category: string;
    }
  | {
      type: "number";
      label: string;
      default: number;
      min?: number;
      max?: number;
      category: string;
    }
  | {
      type: "color";
      label: string;
      default: string;
      category: string;
    }
  | {
      type: "array";
      label: string;
      default: string[];
      category: string;
    };

type WidgetSchema = Record<string, SchemaField>;

type WidgetConfig = Record<string, any>;

interface WidgetDefinition {
  name: string;
  schema: WidgetSchema;
  Component: React.FC<{ config: WidgetConfig }>;
}

/* ============================================================
   QUIZ WIDGET
============================================================ */

const QuizSchema: WidgetSchema = {
  question: {
    type: "text",
    label: "Question",
    default: "What is 2 + 2?",
    category: "Content",
  },
  options: {
    type: "array",
    label: "Answer Options",
    default: ["3", "4", "5", "6"],
    category: "Content",
  },
  correctIndex: {
    type: "number",
    label: "Correct Answer Index",
    default: 1,
    min: 0,
    max: 10,
    category: "Content",
  },
  backgroundColor: {
    type: "color",
    label: "Background Color",
    default: "#f0f9ff",
    category: "Styling",
  },
  buttonColor: {
    type: "color",
    label: "Button Color",
    default: "#3b82f6",
    category: "Styling",
  },
};

const QuizWidget: React.FC<{ config: WidgetConfig }> = ({ config }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const isCorrect = selectedIndex === config.correctIndex;

  return (
    <div
      className="p-8 rounded-lg min-h-[400px]"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <h2 className="text-2xl font-bold mb-6">{config.question}</h2>

      <div className="space-y-3">
        {config.options.map((opt: string, i: number) => (
          <button
            key={i}
            disabled={showResult}
            onClick={() => {
              setSelectedIndex(i);
              setShowResult(true);
            }}
            className="w-full p-4 text-white rounded-lg font-medium"
            style={{
              backgroundColor:
                showResult && i === selectedIndex
                  ? isCorrect
                    ? "#10b981"
                    : "#ef4444"
                  : config.buttonColor,
              opacity: showResult && i !== selectedIndex ? 0.5 : 1,
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {showResult && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            isCorrect
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isCorrect ? "✓ Correct!" : "✗ Wrong answer"}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   FLASHCARD WIDGET
============================================================ */

const FlashcardSchema: WidgetSchema = {
  front: {
    type: "text",
    label: "Front Text",
    default: "What is React?",
    category: "Content",
  },
  back: {
    type: "textarea",
    label: "Back Text",
    default: "A JavaScript library for building UI",
    category: "Content",
  },
  cardColor: {
    type: "color",
    label: "Card Color",
    default: "#8b5cf6",
    category: "Styling",
  },
  textColor: {
    type: "color",
    label: "Text Color",
    default: "#ffffff",
    category: "Styling",
  },
};

const FlashcardWidget: React.FC<{ config: WidgetConfig }> = ({ config }) => {
  const [flip, setFlip] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div
        onClick={() => setFlip(!flip)}
        className="w-96 h-64 rounded-2xl shadow-xl flex items-center justify-center text-center cursor-pointer"
        style={{
          backgroundColor: config.cardColor,
          color: config.textColor,
        }}
      >
        <div className="text-xl font-semibold">
          {flip ? config.back : config.front}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   COUNTDOWN WIDGET
============================================================ */

const CountdownSchema: WidgetSchema = {
  title: {
    type: "text",
    label: "Title",
    default: "Time Remaining",
    category: "Content",
  },
  duration: {
    type: "number",
    label: "Duration (seconds)",
    default: 60,
    min: 1,
    max: 3600,
    category: "Settings",
  },
  timerColor: {
    type: "color",
    label: "Timer Color",
    default: "#ef4444",
    category: "Styling",
  },
};

const CountdownWidget: React.FC<{ config: WidgetConfig }> = ({ config }) => {
  const [time, setTime] = useState<number>(config.duration);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || time <= 0) return;
    const id = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [running, time]);

  const m = String(Math.floor(time / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold mb-6">{config.title}</h2>
      <div
        className="text-7xl font-mono mb-6"
        style={{ color: config.timerColor }}
      >
        {m}:{s}
      </div>
      <div className="space-x-4">
        <button
          onClick={() => setRunning(!running)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setTime(config.duration);
            setRunning(false);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   WIDGET REGISTRY
============================================================ */

const WIDGETS: Record<string, WidgetDefinition> = {
  quiz: {
    name: "Multiple Choice Quiz",
    schema: QuizSchema,
    Component: QuizWidget,
  },
  flashcard: {
    name: "Flashcard",
    schema: FlashcardSchema,
    Component: FlashcardWidget,
  },
  countdown: {
    name: "Countdown Timer",
    schema: CountdownSchema,
    Component: CountdownWidget,
  },
};

/* ============================================================
   PROPERTY EDITOR
============================================================ */

interface PropertyEditorProps {
  schema: WidgetSchema;
  values: WidgetConfig;
  onChange: (key: string, value: any) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  schema,
  values,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      {Object.entries(schema).map(([key, prop]) => (
        <div key={key}>
          <label className="block text-sm font-medium mb-1">{prop.label}</label>

          {prop.type === "text" && (
            <input
              className="w-full border px-3 py-2 rounded"
              value={values[key]}
              onChange={(e) => onChange(key, e.target.value)}
            />
          )}

          {prop.type === "textarea" && (
            <textarea
              className="w-full border px-3 py-2 rounded"
              value={values[key]}
              onChange={(e) => onChange(key, e.target.value)}
            />
          )}

          {prop.type === "number" && (
            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              value={values[key]}
              onChange={(e) => onChange(key, Number(e.target.value))}
            />
          )}

          {prop.type === "color" && (
            <input
              type="color"
              value={values[key]}
              onChange={(e) => onChange(key, e.target.value)}
            />
          )}

          {prop.type === "array" && (
            <div className="space-y-2">
              {values[key].map((v: string, i: number) => (
                <input
                  key={i}
                  className="w-full border px-2 py-1 rounded"
                  value={v}
                  onChange={(e) => {
                    const next = [...values[key]];
                    next[i] = e.target.value;
                    onChange(key, next);
                  }}
                />
              ))}
              <button
                type="button"
                className="text-sm text-blue-600"
                onClick={() => onChange(key, [...values[key], ""])}
              >
                + Add
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   MAIN APP
============================================================ */

export default function WidgetSystemApp() {
  const [mode, setMode] = useState<WidgetMode>("select");
  const [type, setType] = useState<string | null>(null);
  const [config, setConfig] = useState<WidgetConfig>({});

  const handleSelectWidget = (key: string) => {
    const schema = WIDGETS[key].schema;
    const defaults: WidgetConfig = {};
    Object.keys(schema).forEach((k) => (defaults[k] = schema[k].default));
    setType(key);
    setConfig(defaults);
    setMode("edit");
  };

  const handleExit = () => {
    setMode("select");
    setType(null);
    setConfig({});
  };

  if (mode === "select") {
    return (
      <div className="p-8 grid grid-cols-3 gap-6">
        {Object.entries(WIDGETS).map(([k, w]) => (
          <button
            key={k}
            onClick={() => handleSelectWidget(k)}
            className="p-6 bg-white rounded shadow"
          >
            <Settings className="mx-auto mb-2" />
            <h3 className="font-bold">{w.name}</h3>
          </button>
        ))}
      </div>
    );
  }

  const Widget = type ? WIDGETS[type].Component : null;

  return (
    <div className="flex h-screen">
      {/* MAIN */}
      <div className="flex-1 p-8 bg-gray-50">
        <div className="mb-4">
          <button
            onClick={handleExit}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Thoát
          </button>
        </div>

        {Widget && <Widget config={config} />}
      </div>

      {/* SIDEBAR */}
      <div className="w-96 p-6 border-l bg-white">
        {mode === "edit" ? (
          <>
            <button
              className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => setMode("runtime")}
            >
              <Play className="inline w-4 h-4 mr-2" />
              Run
            </button>

            <PropertyEditor
              schema={WIDGETS[type!].schema}
              values={config}
              onChange={(k, v) => setConfig({ ...config, [k]: v })}
            />
          </>
        ) : (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setMode("edit")}
          >
            <Settings className="inline w-4 h-4 mr-2" />
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
