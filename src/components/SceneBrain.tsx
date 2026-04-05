"use client";
import { useRef, Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  MeshTransmissionMaterial,
  useGLTF,
  Text,
  useProgress,
  Html,
} from "@react-three/drei";
import { useMediaQuery } from "react-responsive";

const useControls =
  process.env.NODE_ENV === "development"
    ? require("leva").useControls
    : () => ({
        thickness: 0.1,
        roughness: 0.5,
        transmission: 1,
        ior: 1.0125,
        chromaticAberration: 0.01,
        backside: false,
      });

const Model = () => {
  const { nodes } = useGLTF("/medias/particle_ai_brain.glb") as any;
  const { viewport } = useThree();
  const Brain_Part_06 = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useFrame(() => {
    if (Brain_Part_06.current && !isDragging) {
      Brain_Part_06.current.rotation.x += 0.0;
      Brain_Part_06.current.rotation.y -= 0.0035;
      Brain_Part_06.current.rotation.z += 0.0;
    }
  });

  const materialProps = useControls("Material Props", {
    thickness: { value: 0.1, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0.5, min: 0, max: 1, step: 0.05 },
    transmission: { value: 1, min: 0, max: 1, step: 0.05 },
    ior: { value: 1.0125, min: 0, max: 3, step: 0.005 },
    chromaticAberration: { value: 0.01, min: 0, max: 1, step: 0.005 },
    backside: { value: false },
  });

  const handlePointerDown = (event: any) => {
    setIsDragging(true);
    // Handle both mouse and touch events
    const clientX = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
    const clientY = event.clientY ?? event.touches?.[0]?.clientY ?? 0;
    setPreviousMousePosition({
      x: clientX,
      y: clientY,
    });
    event.stopPropagation();
  };

  const handlePointerEnter = () => {
    document.body.style.cursor = "grab";
  };

  const handlePointerLeave = () => {
    document.body.style.cursor = "auto";
  };

  const handlePointerMove = (event: any) => {
    if (!isDragging || !Brain_Part_06.current) return;

    // Prevent scrolling on touch devices when dragging the 3D model
    if (event.cancelable) {
      event.preventDefault();
    }

    // Handle both mouse and touch events
    const clientX = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
    const clientY = event.clientY ?? event.touches?.[0]?.clientY ?? 0;

    const deltaX = clientX - previousMousePosition.x;
    const deltaY = clientY - previousMousePosition.y;

    Brain_Part_06.current.rotation.y += deltaX * 0.01;
    Brain_Part_06.current.rotation.x += deltaY * 0.01;

    setPreviousMousePosition({
      x: clientX,
      y: clientY,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      // Mouse events
      document.addEventListener("mousemove", handlePointerMove);
      document.addEventListener("mouseup", handlePointerUp);
      // Touch events - use { passive: false } to allow preventDefault()
      document.addEventListener("touchmove", handlePointerMove, {
        passive: false,
      });
      document.addEventListener("touchend", handlePointerUp);

      return () => {
        document.removeEventListener("mousemove", handlePointerMove);
        document.removeEventListener("mouseup", handlePointerUp);
        document.removeEventListener("touchmove", handlePointerMove);
        document.removeEventListener("touchend", handlePointerUp);
      };
    }
  }, [isDragging, previousMousePosition]);

  // Responsive scale based on screen size
  const isSM = useMediaQuery({ minWidth: 640 }); // sm and up
  const isXL = useMediaQuery({ minWidth: 1280 }); // xl and up

  let meshScale = 1;
  if (isSM && !isXL) {
    meshScale = 0.75;
  } else if (isXL) {
    meshScale = 0.45;
  }

  let fontSize = 0.1;
  let fontSizeInfo = 0.1;

  if (isXL) {
    fontSize = 0.3;
    fontSizeInfo = 0.042;
  } else {
    fontSize = 0.2;
    fontSizeInfo = 0.07;
  }

  let textPositionTop: [number, number, number] = [0, 0.4, -1.5];
  let textPositionMiddle: [number, number, number] = [0, 0.15, -1.5];
  let textPositionBottom: [number, number, number] = [0, -0.1, -1.5];
  let textPositionInfo: [number, number, number] = [0, -0.1, -1.5];

  if (isXL) {
    textPositionTop = [0, 0.4, -1.5];
    textPositionMiddle = [0, 0.1, -1.5];
    textPositionBottom = [0, -0.2, -1.5];
    textPositionInfo = [0, -1.175, -1.5];
  } else {
    textPositionTop = [0, 0.4, -1.5];
    textPositionMiddle = [0, 0.2, -1.5];
    textPositionBottom = [0, 0.0, -1.5];
    textPositionInfo = [0, -1.15, -1.5];
  }

  return (
    <group scale={viewport.width * 1} position={[0, 0, 0]}>
      <Text
        font="/fonts/Gambetta-BoldItalic.woff"
        position={textPositionTop}
        fontSize={fontSize}
        letterSpacing={-0.025}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Four Years Of Foundational
      </Text>
      <Text
        font="/fonts/Gambetta-BoldItalic.woff"
        position={textPositionMiddle}
        fontSize={fontSize}
        letterSpacing={-0.025}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Engineering Experience
      </Text>
      <Text
        font="/fonts/Gambetta-BoldItalic.woff"
        position={textPositionBottom}
        fontSize={fontSize}
        letterSpacing={-0.025}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Accelerated With Modern AI Tools.
      </Text>

      <Text
        position={textPositionInfo}
        fontSize={fontSizeInfo}
        letterSpacing={-0.05}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        🤚Drag to move the 3D Brain 🧠
      </Text>

      {nodes?.Brain_Part_06 && (
        <mesh
          ref={Brain_Part_06}
          geometry={nodes.Brain_Part_06.geometry}
          position={[0, 0, 0.025]}
          rotation={nodes.Brain_Part_06.rotation}
          scale={meshScale}
          onPointerDown={handlePointerDown}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
      )}
    </group>
  );
};

const CanvasContent = () => {
  return (
    <Suspense fallback={null}>
      <Model />

      <directionalLight intensity={100} position={[0, -3, 3]} />
      <Environment preset="city" />
    </Suspense>
  );
};

const SceneBrain = () => {
  return (
    <div className="relative w-full h-full md:min-h-screen ">
      <Canvas
        className=" relative "
        dpr={[1, 2]}
        performance={{ min: 0.5, max: 1, debounce: 500 }}
      >
        <CanvasContent />
      </Canvas>
    </div>
  );
};

export default SceneBrain;
