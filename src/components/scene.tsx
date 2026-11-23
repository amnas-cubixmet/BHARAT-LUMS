"use client";

import { OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Color, MathUtils, Vector3, type Group } from "three";
import type { OrbitControls as Controls } from "three-stdlib";
import { finishColor, fixtures, temperatures, type Setup } from "@/lib/studio";

type Position = [number, number, number];
const roomColors: Record<Setup["environment"], string> = {
  Office: "#46413e",
  "Living room": "#544a43",
  "Retail store": "#42454a",
  Restaurant: "#4c3530",
};
const initialTarget = new Vector3(0, 1.5, 0);
const cameraPosition: Position = [6.1, 2.95, 7.1];

function Furniture({ environment }: { environment: Setup["environment"] }) {
  if (environment === "Living room")
    return (
      <>
        <RoundedBox
          args={[3.15, 0.55, 0.92]}
          radius={0.12}
          position={[0, 0.38, -1.28]}
        >
          <meshStandardMaterial color="#a49481" roughness={0.9} />
        </RoundedBox>
        <RoundedBox
          args={[3.15, 0.72, 0.24]}
          radius={0.1}
          position={[0, 0.75, -1.65]}
        >
          <meshStandardMaterial color="#a49481" />
        </RoundedBox>
        <RoundedBox
          args={[2.05, 0.15, 0.85]}
          radius={0.07}
          position={[0, 0.35, 0.42]}
        >
          <meshStandardMaterial color="#512f21" />
        </RoundedBox>
      </>
    );
  if (environment === "Retail store")
    return (
      <>
        {[-1.9, 0, 1.9].map((x) => (
          <RoundedBox
            key={x}
            args={[0.94, 0.85, 1.05]}
            radius={0.04}
            position={[x, 0.425, -0.65]}
          >
            <meshStandardMaterial color="#4a4543" />
          </RoundedBox>
        ))}
        <mesh position={[0, 1.2, -2.18]}>
          <boxGeometry args={[4.7, 0.08, 0.4]} />
          <meshStandardMaterial color="#665145" />
        </mesh>
      </>
    );
  if (environment === "Restaurant")
    return (
      <>
        {[-1.35, 1.35].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh position={[0, 0.79, 0]}>
              <cylinderGeometry args={[0.69, 0.69, 0.1, 24]} />
              <meshStandardMaterial color="#603829" />
            </mesh>
            <mesh position={[0, 0.39, 0]}>
              <cylinderGeometry args={[0.07, 0.16, 0.78, 12]} />
              <meshStandardMaterial color="#211b1a" />
            </mesh>
            {[-1, 1].map((z) => (
              <RoundedBox
                key={z}
                args={[0.59, 0.62, 0.52]}
                radius={0.09}
                position={[0, 0.31, z]}
              >
                <meshStandardMaterial color="#664e43" />
              </RoundedBox>
            ))}
          </group>
        ))}
      </>
    );
  return (
    <group>
      <RoundedBox
        args={[3.3, 0.12, 1.35]}
        radius={0.055}
        position={[0, 0.83, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#634433" roughness={0.54} />
      </RoundedBox>
      {[-1.24, 1.24].map((x) => (
        <mesh key={x} position={[x, 0.4, 0]}>
          <boxGeometry args={[0.12, 0.8, 0.95]} />
          <meshStandardMaterial color="#252427" />
        </mesh>
      ))}
      {[-1.1, 0, 1.1].map((x) => (
        <RoundedBox
          key={x}
          args={[0.68, 0.64, 0.38]}
          radius={0.07}
          position={[x, 0.34, -1.04]}
        >
          <meshStandardMaterial color="#343238" />
        </RoundedBox>
      ))}
    </group>
  );
}

function Fixture({
  position,
  length,
  angle,
  vertical,
  setup,
  index,
}: {
  position: Position;
  length: number;
  angle: number;
  vertical?: boolean;
  setup: Setup;
  index: number;
}) {
  const ref = useRef<Group>(null);
  const { invalidate } = useThree();
  const target = position[1];
  const diffuser =
    temperatures.find((item) => item.value === setup.temperature)?.color ??
    "#fff";
  const intensity = setup.power ? setup.brightness / 100 : 0;
  const reduced =
    typeof window !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;
  const suspended = setup.mounting === "Suspended" && !vertical;
  const recessed = setup.mounting === "Recessed";
  const height = recessed ? 0.035 : 0.095;
  useFrame((_, delta) => {
    if (!ref.current) return;
    if (reduced || Math.abs(ref.current.position.y - target) < 0.002) {
      ref.current.position.y = target;
      return;
    }
    ref.current.position.y = MathUtils.damp(
      ref.current.position.y,
      target,
      7,
      delta,
    );
    invalidate();
  });
  return (
    <group
      ref={ref}
      position={[
        position[0],
        reduced ? target : target + (vertical ? 0.2 : 0.46 + index * 0.12),
        position[2],
      ]}
      rotation={vertical ? [Math.PI / 2, 0, Math.PI / 2, "ZYX"] : [0, angle, 0]}
    >
      {suspended &&
        [-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * length * 0.38, (3.48 - target) / 2, 0]}
          >
            <cylinderGeometry args={[0.009, 0.009, 3.48 - target, 8]} />
            <meshStandardMaterial color="#575458" metalness={0.6} />
          </mesh>
        ))}
      <RoundedBox
        args={[length, height, recessed ? 0.14 : 0.19]}
        radius={0.015}
      >
        <meshStandardMaterial
          color={finishColor[setup.finish]}
          metalness={setup.finish === "Aluminum" ? 0.68 : 0.24}
          roughness={0.43}
        />
      </RoundedBox>
      <mesh position={[0, -height / 2 - 0.012, 0]}>
        <boxGeometry args={[length - 0.035, 0.028, recessed ? 0.126 : 0.176]} />
        <meshStandardMaterial
          color={intensity ? diffuser : "#47454b"}
          emissive={new Color(diffuser)}
          emissiveIntensity={intensity * 2.7}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <pointLight
          key={side}
          color={diffuser}
          intensity={intensity * 12}
          position={[side * length * 0.29, -0.26, 0]}
          distance={7}
          decay={2}
        />
      ))}
    </group>
  );
}

function CameraControls({
  reset,
  command,
}: {
  reset: number;
  command: string;
}) {
  const ref = useRef<Controls>(null);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const orbit = ref.current;
    if (!orbit || !reset) return;
    if (command === "reset") {
      camera.position.set(...cameraPosition);
      orbit.target.copy(initialTarget);
    }
    if (command === "rotate") {
      const offset = camera.position.clone().sub(orbit.target);
      offset.applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 8);
      camera.position.copy(orbit.target.clone().add(offset));
    }
    if (command === "zoom") {
      const offset = camera.position.clone().sub(orbit.target);
      offset.setLength(offset.length() <= 6 ? 9.5 : offset.length() * 0.83);
      camera.position.copy(orbit.target.clone().add(offset));
    }
    orbit.update();
    invalidate();
  }, [camera, command, invalidate, reset]);
  return (
    <OrbitControls
      ref={ref}
      target={initialTarget}
      minDistance={5.2}
      maxDistance={14}
      minPolarAngle={0.29}
      maxPolarAngle={Math.PI / 2.05}
      enablePan={false}
      enableDamping
      rotateSpeed={0.58}
    />
  );
}

function ContextMonitor({ onFailure }: { onFailure: () => void }) {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    canvas.addEventListener("webglcontextlost", onFailure);
    return () => canvas.removeEventListener("webglcontextlost", onFailure);
  }, [canvas, onFailure]);
  return null;
}

export default function Scene({
  setup,
  reset,
  command,
  onFailure,
}: {
  setup: Setup;
  reset: number;
  command: string;
  onFailure: () => void;
}) {
  const layout = fixtures[setup.arrangement];
  const position =
    setup.mounting === "Suspended"
      ? 2.56
      : setup.mounting === "Surface"
        ? 3.32
        : 3.44;
  return (
    <Canvas
      className="studio-canvas"
      camera={{ position: cameraPosition, fov: 39 }}
      frameloop="demand"
      shadows
      dpr={[1, 1.35]}
      gl={{ antialias: true, powerPreference: "low-power" }}
      fallback={<span role="status">Interactive 3D is unavailable.</span>}
    >
      <color attach="background" args={["#141318"]} />
      <fog attach="fog" args={["#141318", 14, 27]} />
      <hemisphereLight args={["#c2cde1", "#3f2d28", 0.52]} />
      <directionalLight
        position={[2, 6, 4]}
        intensity={0.67}
        color="#fff5e7"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.001}
      />
      <ContextMonitor onFailure={onFailure} />
      <mesh position={[0, -0.065, 0]} receiveShadow>
        <boxGeometry args={[7, 0.12, 5.4]} />
        <meshStandardMaterial color="#413934" roughness={0.75} />
      </mesh>
      <mesh position={[0, 1.75, -2.72]} receiveShadow>
        <boxGeometry args={[7, 3.5, 0.15]} />
        <meshStandardMaterial
          color={roomColors[setup.environment]}
          roughness={0.83}
        />
      </mesh>
      <mesh position={[-3.5, 1.75, 0]} receiveShadow>
        <boxGeometry args={[0.15, 3.5, 5.4]} />
        <meshStandardMaterial
          color={roomColors[setup.environment]}
          roughness={0.88}
        />
      </mesh>
      {[-2.2, -0.75, 0.7, 2.15].map((x) => (
        <mesh key={x} position={[x, 1.75, -2.625]}>
          <boxGeometry args={[0.017, 3.45, 0.02]} />
          <meshStandardMaterial color="#343137" />
        </mesh>
      ))}
      <mesh position={[0, 3.51, -2.43]}>
        <boxGeometry args={[7, 0.09, 0.58]} />
        <meshStandardMaterial color="#343237" />
      </mesh>
      <Furniture environment={setup.environment} />
      {layout.map((item, index) => (
        <Fixture
          key={`${setup.arrangement}-${setup.mounting}-${index}`}
          setup={setup}
          index={index}
          position={[item.x, item.vertical ? 1.85 : position, item.z]}
          vertical={item.vertical}
          length={item.length}
          angle={item.angle}
        />
      ))}
      <CameraControls reset={reset} command={command} />
    </Canvas>
  );
}
