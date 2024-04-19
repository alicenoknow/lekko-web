'use client';

import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';

// TODO zoom out rings on window resizing down

// Scene settings
const clearColor = 0xffffff;
const ambientLightIntensity = 8;
const directLightIntensity = 5;
const directLightPosition = new THREE.Vector3(0, 20, 10);

const cameraFov = 100;
const cameraNear = 1;
const cameraFar = 500;
const cameraPosition = new THREE.Vector3(0, 0, 5);
const cameraOffsetLimit = 5;
const parallaxSpeed = 0.00001;

const fogColor = 0x000;
const fogDensity = 0.1;

// Rings settings
const metalness = 0.7;
const roughness = 0.2;
const ringGeometry = new THREE.TorusGeometry(2, 0.25, 6, 84);
const ringAngle = Math.PI / 30;
const ringRadius = 2;
const ringWidth = 0.25;
const ringOffset = 0.2;
const ringSize = 2 * ringRadius + 2 * ringWidth;
// blue, red, black, yellow, green
const ringsColors = [0x0081c8, 0xee334e, 0x333333, 0xfcb131, 0x00a651];
const ringsPositions = [
  [-(ringSize + ringOffset), ringRadius, 0],
  [ringSize + 2 * ringOffset, ringRadius, 0],
  [0, ringRadius, 0],
  [-(ringSize / 2 + ringOffset), -(ringSize / 2 + ringOffset) + ringRadius, 0],
  [ringSize / 2 + ringOffset, -(ringSize / 2 + ringOffset) + ringRadius, 0],
];
const ringsRotationsY = [
  -ringAngle,
  -ringAngle,
  -ringAngle,
  ringAngle,
  ringAngle,
];

const Rings: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const rings = useMemo(
    () =>
      ringsColors.map((color, i) => {
        const material = new THREE.MeshStandardMaterial({
          color,
          roughness,
          metalness,
        });
        material.depthTest = true;
        material.depthWrite = true;
        const ring = new THREE.Mesh(ringGeometry, material);
        ring.position.set(
          ringsPositions[i][0],
          ringsPositions[i][1],
          ringsPositions[i][2]
        );
        ring.castShadow = true;
        ring.receiveShadow = true;
        ring.rotation.y = ringsRotationsY[i];
        return ring;
      }),
    []
  );

  const recalculateCameraPosition = useCallback(
    (
      currentPosition: THREE.Vector3,
      mouseX: number,
      mouseY: number
    ): { x: number; y: number } => {
      let newX =
        currentPosition.x + (-mouseX + currentPosition.x) * parallaxSpeed;
      let newY =
        currentPosition.y + (mouseY - currentPosition.y) * parallaxSpeed;

      newX = Math.min(Math.max(newX, -cameraOffsetLimit), cameraOffsetLimit);
      newY = Math.min(Math.max(newY, -cameraOffsetLimit), cameraOffsetLimit);
      return { x: newX, y: newY };
    },
    []
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ref = containerRef;
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(fogColor, fogDensity);

      const camera = new THREE.PerspectiveCamera(
        cameraFov,
        window.innerWidth / window.innerHeight,
        cameraNear,
        cameraFar
      );
      camera.position.copy(cameraPosition);

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.setClearColor(clearColor, 0);
      containerRef.current?.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(
        clearColor,
        ambientLightIntensity
      );
      const directionalLight = new THREE.DirectionalLight(
        clearColor,
        directLightIntensity
      );
      directionalLight.position.copy(directLightPosition);
      directionalLight.castShadow = true;
      scene.add(ambientLight);
      scene.add(directionalLight);

      rings.forEach((ring) => scene.add(ring));

      let mouseX = 0,
        mouseY = 0;
      window.addEventListener(
        'mousemove',
        (event) => {
          mouseX = event.clientX - window.innerWidth / 2;
          mouseY = event.clientY - window.innerHeight / 2;
        },
        false
      );

      const handleWindowResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleWindowResize);

      const animate = () => {
        requestAnimationFrame(animate);

        const { x, y } = recalculateCameraPosition(
          camera.position,
          mouseX,
          mouseY
        );
        camera.position.x = x;
        camera.position.y = y;

        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener('resize', handleWindowResize);
        if (ref.current && renderer.domElement.parentNode === ref.current) {
          ref.current.removeChild(renderer.domElement);
        }
      };
    }
  }, [rings, recalculateCameraPosition]);
  return (
    <div
      className='absolute left-2/4 top-2/4 z-[2] -translate-x-2/4 -translate-y-2/4'
      ref={containerRef}
    />
  );
};
export default React.memo(Rings);
