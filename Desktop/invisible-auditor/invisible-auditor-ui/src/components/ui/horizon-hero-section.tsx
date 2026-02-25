import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

gsap.registerPlugin(ScrollTrigger);

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const threeRefs = useRef<any>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    animationId: null,
    targetCameraY: 30,
    targetCameraZ: 300,
  });

  useEffect(() => {
    const initThree = () => {
      const refs = threeRefs.current;
      
      refs.scene = new THREE.Scene();
      refs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      refs.camera.position.set(0, 30, 300);

      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      refs.composer = new EffectComposer(refs.renderer);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);
      
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), 
        1.5, 0.4, 0.85
      );
      refs.composer.addPass(bloomPass);

      const starGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(3000 * 3);
      for(let i=0; i < 3000 * 3; i++) posArray[i] = (Math.random() - 0.5) * 1500;
      starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.7, color: 0xffffff }));
      refs.scene.add(stars);

      // FIX: Cast to 'any' to stop TS from complaining about position/rotation
      const geometry = new THREE.PlaneGeometry(2000, 1000, 50, 50);
      const material = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, wireframe: true });
      const terrain = new THREE.Mesh(geometry, material) as any; 
      terrain.rotation.x = -Math.PI / 2;
      terrain.position.y = -50;
      refs.scene.add(terrain);

      const animate = () => {
        refs.animationId = requestAnimationFrame(animate);
        if (refs.camera) {
          refs.camera.position.y += (refs.targetCameraY - refs.camera.position.y) * 0.05;
          refs.camera.position.z += (refs.targetCameraZ - refs.camera.position.z) * 0.05;
          refs.camera.lookAt(0, 0, -500);
        }
        refs.composer?.render(0.01);
      };
      animate();
    };

    initThree();
    return () => {
      if (threeRefs.current.animationId) cancelAnimationFrame(threeRefs.current.animationId);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
      setScrollProgress(scrolled);
      threeRefs.current.targetCameraZ = 300 - (scrolled * 800);
      threeRefs.current.targetCameraY = 30 + (scrolled * 100);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-screen bg-black z-0 pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter opacity-70 italic">
          {scrollProgress < 0.3 ? "HORIZON" : "AUDITOR"}
        </h1>
        <div className="w-24 h-1 bg-sky-500 mt-4 animate-pulse" />
      </div>
    </div>
  );
};