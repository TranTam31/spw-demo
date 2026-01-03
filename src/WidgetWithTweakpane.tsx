import React, { useEffect, useRef, useState } from "react";
import { Pane } from "tweakpane";
import { getRegisteredWidgets } from "widget-sdk";

export function WidgetWithTweakpane({ widgetId }: { widgetId: string }) {
  const widgets = getRegisteredWidgets();
  const widget = widgets[widgetId];
  const [config, setConfig] = useState(widget.defaultData);
  console.log("trong widgetWithTp", widget);
  const paneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pane = new Pane({ container: paneRef.current! });
    const proxy = { ...widget.defaultData };
    widget.setupPane(pane, proxy, (v) => setConfig(v));
    return () => pane.dispose();
  }, [widgetId]);

  return (
    <div style={{ display: "flex" }}>
      <widget.Component config={config} />
      <div ref={paneRef} />
    </div>
  );
}
