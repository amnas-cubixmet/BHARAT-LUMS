"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useRef, type RefObject } from "react";
import { MathUtils, type Group, type MeshStandardMaterial } from "three";

type SceneProps = {
  power: number;
  reduced: boolean;
  paused: boolean;
  pointer: RefObject<{ x: number; y: number }>;
  onReady: () => void;
  onFailure: () => void;
};

function Fixture({ power, reduced, pointer, onReady, onFailure }: SceneProps) {
  const group = useRef<Group>(null);
  const diffuser = useRef<MeshStandardMaterial>(null);
  const gl = useThree((state) => state.gl);
  const ready = useRef(false);
  const camera = useThree((state) => state.camera);
  const compact = useThree((state) => state.size.width < 630);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    camera.position.set(-0.18, compact ? -1.57 : -1.26, compact ? 8.1 : 6.5);
    camera.lookAt(-0.12, compact ? -1.16 : -0.26, 0);
    invalidate();
  }, [camera, compact, invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const fail = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", fail);
    return () => canvas.removeEventListener("webglcontextlost", fail);
  }, [gl, onFailure]);
  useFrame(({ clock }, delta) => {
    const fixture = group.current;
    const lens = diffuser.current;
    if (!fixture || !lens) return;
    const t = MathUtils.smoothstep(clock.elapsedTime, 0, 1.4);
    fixture.rotation.y = reduced
      ? -0.39
      : MathUtils.damp(
          fixture.rotation.y,
          -0.39 + (1 - t) * 0.5 + pointer.current.x * 0.13,
          5,
          delta,
        );
    fixture.rotation.x = reduced
      ? 0.02
      : MathUtils.damp(
          fixture.rotation.x,
          0.02 + pointer.current.y * 0.085,
          5,
          delta,
        );
    fixture.position.y = reduced
      ? 0
      : MathUtils.damp(
          fixture.position.y,
          (1 - t) * 0.16 - pointer.current.y * 0.06,
          5,
          delta,
        );
    const glow =
      power * (reduced ? 1 : MathUtils.smoothstep(clock.elapsedTime, 0.2, 1.4));
    lens.emissiveIntensity = reduced
      ? glow * 1.65
      : MathUtils.damp(lens.emissiveIntensity, glow * 1.65, 5, delta);
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });
  return (
    <group ref={group} rotation={[0.02, -0.2, -0.13]}>
      <RoundedBox
        args={[0.25, 4.2, 0.32]}
        radius={0.055}
        smoothness={3}
        position={[1.12, -1.35, 0.02]}
      >
        <meshStandardMaterial
          color="#282828"
          roughness={0.49}
          metalness={0.42}
        />
      </RoundedBox>
      <group position={[0.7, 0.57, 0]} rotation={[0, 0, -0.18]}>
        <RoundedBox args={[1.1, 0.22, 0.24]} radius={0.09} smoothness={3}>
          <meshStandardMaterial
            color="#383838"
            roughness={0.42}
            metalness={0.55}
          />
        </RoundedBox>
        <RoundedBox
          args={[0.3, 0.32, 0.32]}
          radius={0.055}
          smoothness={3}
          position={[0.45, -0.045, 0]}
        >
          <meshStandardMaterial color="#292929" roughness={0.52} />
        </RoundedBox>
      </group>
      <group position={[-0.53, 0.69, 0.02]} rotation={[-0.34, 0.01, -0.23]}>
        <RoundedBox
          args={[2.58, 0.37, 1.14]}
          radius={0.17}
          smoothness={5}
          position={[0, 0.034, 0]}
        >
          <meshStandardMaterial
            color="#262626"
            roughness={0.35}
            metalness={0.5}
          />
        </RoundedBox>
        <RoundedBox
          args={[2.44, 0.1, 1.05]}
          radius={0.043}
          smoothness={3}
          position={[0, -0.13, 0]}
        >
          <meshStandardMaterial
            color="#555555"
            roughness={0.56}
            metalness={0.32}
          />
        </RoundedBox>
        <RoundedBox
          args={[2.24, 0.09, 0.9]}
          radius={0.043}
          smoothness={4}
          position={[0, -0.174, 0]}
        >
          <meshStandardMaterial
            ref={diffuser}
            color="#bfbfbf"
            emissive="#ffffff"
            emissiveIntensity={0}
            roughness={0.37}
            metalness={0.06}
          />
        </RoundedBox>
        <RoundedBox
          args={[1.95, 0.02, 0.055]}
          radius={0.008}
          smoothness={2}
          position={[0, -0.225, 0]}
        >
          <meshStandardMaterial
            color="#767676"
            roughness={0.53}
            metalness={0.1}
          />
        </RoundedBox>
        {[-0.83, -0.58, -0.33, -0.08, 0.17, 0.42].map((x) => (
          <RoundedBox
            key={x}
            args={[0.075, 0.055, 0.64]}
            radius={0.018}
            smoothness={2}
            position={[x, 0.226, 0]}
          >
            <meshStandardMaterial
              color="#4d4d4d"
              roughness={0.44}
              metalness={0.45}
            />
          </RoundedBox>
        ))}
      </group>
    </group>
  );
}

export default function StreetlightScene(props: SceneProps) {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.5]}
      frameloop={props.reduced || props.paused ? "demand" : "always"}
      camera={{ position: [-0.18, -1.26, 6.5], fov: 39 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(-0.12, -0.26, 0);
        gl.setClearAlpha(0);
      }}
    >
      <hemisphereLight intensity={1.55} color="#ffffff" groundColor="#686868" />
      <directionalLight position={[-3, 5, 3]} intensity={3.1} color="#ffffff" />
      <directionalLight position={[3, 3, -4]} intensity={2} color="#d4d4d4" />
      <pointLight
        position={[-1.4, -0.8, 3.4]}
        intensity={4.5 * props.power}
        color="#ffffff"
      />
      <Fixture {...props} />
    </Canvas>
  );
}
