
'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform vec3 u_color4;
  
  vec3 colorA = vec3(0.912,0.191,0.652);
  vec3 colorB = vec3(1.000,0.777,0.052);

  void main() {
    vec2 uv = vUv;
    float time = u_time * 0.1;
    
    // Bubble 1
    vec2 pos1 = vec2(0.5 + 0.3 * sin(time), 0.5 + 0.3 * cos(time));
    float d1 = distance(uv, pos1);
    float bubble1 = smoothstep(0.2, 0.1, d1);
    
    // Bubble 2
    vec2 pos2 = vec2(0.5 + 0.4 * cos(time * 0.8 + 2.0), 0.5 + 0.4 * sin(time * 0.8 + 2.0));
    float d2 = distance(uv, pos2);
    float bubble2 = smoothstep(0.3, 0.15, d2);
    
    // Bubble 3
    vec2 pos3 = vec2(0.5 + 0.2 * sin(time * 1.2 + 4.0), 0.5 + 0.2 * cos(time * 1.2 + 4.0));
    float d3 = distance(uv, pos3);
    float bubble3 = smoothstep(0.15, 0.05, d3);

    // Bubble 4
    vec2 pos4 = vec2(0.5 + 0.35 * cos(time * 0.9 - 1.0), 0.5 + 0.35 * sin(time * 0.9 - 1.0));
    float d4 = distance(uv, pos4);
    float bubble4 = smoothstep(0.25, 0.1, d4);
    
    vec3 color = u_color1 * bubble1 + u_color2 * bubble2 + u_color3 * bubble3 + u_color4 * bubble4;
    
    // Mix with a base background color
    vec3 baseColor = mix(u_color1, u_color2, uv.y);
    color = mix(baseColor, color, 0.7);

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface AnimatedBackgroundProps {
  colors: [string, string];
}

export function AnimatedBackground({ colors }: AnimatedBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    mountRef.current.appendChild(renderer.domElement);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      u_time: { value: 0.0 },
      u_color1: { value: new THREE.Color(colors[0]) },
      u_color2: { value: new THREE.Color(colors[1]) },
      u_color3: { value: new THREE.Color('#3A5F0B') },
      u_color4: { value: new THREE.Color('#FF00FF') },
    };

    const targetColor1 = new THREE.Color(colors[0]);
    const targetColor2 = new THREE.Color(colors[1]);
    const targetColor3 = new THREE.Color('#3A5F0B');
    const targetColor4 = new THREE.Color('#FF00FF');

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      uniforms.u_time.value = clock.getElapsedTime();
      
      // Smoothly interpolate colors
      uniforms.u_color1.value.lerp(targetColor1, 0.05);
      uniforms.u_color2.value.lerp(targetColor2, 0.05);
      uniforms.u_color3.value.lerp(targetColor3, 0.05);
      uniforms.u_color4.value.lerp(targetColor4, 0.05);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [colors]);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
