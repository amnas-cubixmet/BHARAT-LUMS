"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Box, Power, RotateCcw, RotateCw, ZoomIn } from "lucide-react";
import { Action } from "./ui";
import {
  arrangements,
  defaultSetup,
  environments,
  finishColor,
  finishes,
  fixtures,
  mountings,
  roomColors,
  setupQuery,
  temperatures,
  type Setup,
} from "@/lib/studio";

const Scene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => (
    <p className="scene-loading" role="status">
      Loading interactive 3D…
    </p>
  ),
});
class SceneBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function FlatPreview({
  setup,
  rotation,
  zoom,
}: {
  setup: Setup;
  rotation: number;
  zoom: number;
}) {
  const color =
    temperatures.find((option) => option.value === setup.temperature)?.color ??
    "#fff";
  const power = setup.power ? setup.brightness / 100 : 0;
  return (
    <div
      className="flat-preview"
      data-testid="flat-preview"
      role="img"
      aria-label={`2D preview, ${setup.environment}, ${setup.arrangement}, ${setup.power ? setup.brightness + "% brightness" : "power off"}`}
    >
      <div
        className="flat-room"
        style={{
          background: `linear-gradient(${roomColors[setup.environment]} 68%, #413934 68%)`,
          filter: `brightness(${0.18 + power * 0.53})`,
          transform: `scale(${1 + zoom * 0.08}) translateX(${rotation * 3}%)`,
        }}
      >
        {setup.environment === "Office" && (
          <Image
            src="/images/office.webp"
            alt=""
            fill
            loading="lazy"
            sizes="(max-width: 805px) 92vw, (max-width: 1450px) 58vw, 835px"
          />
        )}
      </div>
      <div
        className="flat-ambient"
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${color}, transparent 63%)`,
          opacity: power * 0.22,
        }}
      />
      {fixtures[setup.arrangement].map((item, index) => (
        <div
          className="flat-fixture"
          key={index}
          style={{
            left: `${50 + item.x * 9 + rotation * 3}%`,
            top: `${(item.vertical ? 45 : setup.mounting === "Suspended" ? 38 : 23) + item.z * 7}%`,
            width: `${item.length * (8 + zoom)}%`,
            transform: `translate(-50%,-50%) rotate(${item.vertical ? 90 : item.angle * 40}deg)`,
            background: finishColor[setup.finish],
            borderBottomColor: power ? color : "#5b5a61",
            boxShadow: power ? `0 5px ${3 + power * 29}px ${color}` : "none",
          }}
        />
      ))}
    </div>
  );
}

export default function Studio() {
  const [setup, setSetup] = useState<Setup>(defaultSetup);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [useFlat, setUseFlat] = useState(false);
  const [camera, setCamera] = useState({
    count: 0,
    command: "",
    rotation: 0,
    zoom: 0,
  });
  const preview = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = preview.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const canvas = document.createElement("canvas");
      let available = false;
      try {
        const context = canvas.getContext("webgl2");
        available = Boolean(context);
        context?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {}
      setSupported(available);
    }, { rootMargin: "120px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  function update<K extends keyof Setup>(field: K, value: Setup[K]) {
    setSetup((current) => ({ ...current, [field]: value }));
  }
  function cameraAction(command: string) {
    setCamera((current) => ({
      count: current.count + 1,
      command,
      rotation:
        command === "reset"
          ? 0
          : command === "rotate"
            ? (current.rotation + 1) % 5
            : current.rotation,
      zoom:
        command === "reset"
          ? 0
          : command === "zoom"
            ? (current.zoom + 1) % 4
            : current.zoom,
    }));
  }
  const flat = (
    <FlatPreview setup={setup} rotation={camera.rotation} zoom={camera.zoom} />
  );
  return (
    <div className="studio-grid">
      <section className="studio-stage" aria-label="Lighting preview">
        <div className="scene-toolbar">
          <p>
            <Box size={15} />{" "}
            {useFlat || supported !== true ? "2D preview" : "3D preview"}
          </p>
          <div>
            <button
              className="icon-button"
              aria-label="Rotate camera"
              onClick={() => cameraAction("rotate")}
            >
              <RotateCw size={17} />
            </button>
            <button
              className="icon-button"
              aria-label="Zoom camera"
              onClick={() => cameraAction("zoom")}
            >
              <ZoomIn size={17} />
            </button>
            <button
              className="icon-button"
              aria-label="Reset camera"
              onClick={() => cameraAction("reset")}
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </div>
        <div className="scene-view" ref={preview}>
          {supported && !useFlat ? (
            <SceneBoundary fallback={flat}>
              <Scene
                setup={setup}
                reset={camera.count}
                command={camera.command}
                onFailure={() => {
                  setSupported(false);
                  setUseFlat(true);
                }}
              />
            </SceneBoundary>
          ) : (
            flat
          )}
        </div>
        <div className="scene-caption">
          <span>
            {supported && !useFlat
              ? "Drag to orbit · Scroll or pinch to zoom"
              : "Use the camera buttons to change your view."}
          </span>
          {supported && (
            <button
              className="text-link"
              onClick={() => setUseFlat((value) => !value)}
            >
              {useFlat ? "Switch to 3D" : "Switch to 2D"}
            </button>
          )}
        </div>
      </section>
      <section className="studio-controls" aria-label="Lighting controls">
        <div className="controls-top">
          <h2>Configure light</h2>
          <button
            type="button"
            className="power-button"
            role="switch"
            aria-label="Fixture power"
            aria-checked={setup.power}
            onClick={() => update("power", !setup.power)}
          >
            <Power size={16} /> {setup.power ? "On" : "Off"}
          </button>
        </div>
        <label className="slider-label" htmlFor="brightness">
          Brightness <output htmlFor="brightness">{setup.brightness}%</output>
        </label>
        <input
          id="brightness"
          type="range"
          min="0"
          max="100"
          value={setup.brightness}
          onChange={(event) => update("brightness", Number(event.target.value))}
        />
        <fieldset>
          <legend>Colour temperature</legend>
          <div className="options temperature-options">
            {temperatures.map((option) => (
              <button
                type="button"
                key={option.value}
                aria-pressed={setup.temperature === option.value}
                onClick={() => update("temperature", option.value)}
              >
                <span style={{ background: option.color }} />
                <strong>{option.value} K</strong>
                <small>{option.label}</small>
              </button>
            ))}
          </div>
        </fieldset>
        <label>
          Arrangement
          <select
            value={setup.arrangement}
            onChange={(event) =>
              update("arrangement", event.target.value as Setup["arrangement"])
            }
          >
            {arrangements.map((label) => (
              <option key={label}>{label}</option>
            ))}
          </select>
        </label>
        <label>
          Mounting
          <select
            value={setup.mounting}
            onChange={(event) =>
              update("mounting", event.target.value as Setup["mounting"])
            }
          >
            {mountings.map((label) => (
              <option key={label}>{label}</option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend>Fixture finish</legend>
          <div className="options finish-options">
            {finishes.map((label) => (
              <button
                type="button"
                aria-pressed={setup.finish === label}
                key={label}
                onClick={() => update("finish", label)}
              >
                <span style={{ background: finishColor[label] }} />
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <label>
          Environment
          <select
            value={setup.environment}
            onChange={(event) =>
              update("environment", event.target.value as Setup["environment"])
            }
          >
            {environments.map((label) => (
              <option key={label}>{label}</option>
            ))}
          </select>
        </label>
        <Action href={`/request-quote?${setupQuery(setup)}`}>
          Request this configuration
        </Action>
        <p className="form-note">
          Concept preview. Light levels are illustrative.
        </p>
      </section>
    </div>
  );
}
