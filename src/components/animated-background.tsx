
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
  
  // Function to generate a rainbow color based on a single value
  vec3 rainbow(float t) {
    t = fract(t);
    vec3 c = vec3(1.0, 0.0, 0.0); // Red
    if (t < 1.0/6.0) c = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 0.5, 0.0), t * 6.0); // Red to Orange
    else if (t < 2.0/6.0) c = mix(vec3(1.0, 0.5, 0.0), vec3(1.0, 1.0, 0.0), (t - 1.0/6.0) * 6.0); // Orange to Yellow
    else if (t < 3.0/6.0) c = mix(vec3(1.0, 1.0, 0.0), vec3(0.0, 1.0, 0.0), (t - 2.0/6.0) * 6.0); // Yellow to Green
    else if (t < 4.0/6.0) c = mix(vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0), (t - 3.0/6.0) * 6.0); // Green to Blue
    else if (t < 5.0/6.0) c = mix(vec3(0.0, 0.0, 1.0), vec3(0.5, 0.0, 1.0), (t - 4.0/6.0) * 6.0); // Blue to Indigo
    else c = mix(vec3(0.5, 0.0, 1.0), vec3(1.0, 0.0, 1.0), (t - 5.0/6.0) * 6.0); // Indigo to Violet
    return c;
  }

  void main() {
    vec2 uv = vUv;
    float time = u_time * 0.1;
    
    // Bubble 1
    vec2 pos1 = vec2(0.5 + 0.3 * sin(time), 0.5 + 0.3 * cos(time));
    float d1 = distance(uv, pos1);
    float bubble1 = smoothstep(0.2, 0.1, d1);
    vec3 color1 = rainbow(time * 0.1);
    
    // Bubble 2
    vec2 pos2 = vec2(0.5 + 0.4 * cos(time * 0.8 + 2.0), 0.5 + 0.4 * sin(time * 0.8 + 2.0));
    float d2 = distance(uv, pos2);
    float bubble2 = smoothstep(0.3, 0.15, d2);
    vec3 color2 = rainbow(time * 0.1 + 0.25);
    
    // Bubble 3
    vec2 pos3 = vec2(0.5 + 0.2 * sin(time * 1.2 + 4.0), 0.5 + 0.2 * cos(time * 1.2 + 4.0));
    float d3 = distance(uv, pos3);
    float bubble3 = smoothstep(0.15, 0.05, d3);
    vec3 color3 = rainbow(time * 0.1 + 0.5);

    // Bubble 4
    vec2 pos4 = vec2(0.5 + 0.35 * cos(time * 0.9 - 1.0), 0.5 + 0.35 * sin(time * 0.9 - 1.0));
    float d4 = distance(uv, pos4);
    float bubble4 = smoothstep(0.25, 0.1, d4);
    vec3 color4 = rainbow(time * 0.1 + 0.75);
    
    vec3 color = color1 * bubble1 + color2 * bubble2 + color3 * bubble3 + color4 * bubble4;
    
    // Mix with a base background color that shifts with the rainbow
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
    };

    const targetColor1 = new THREE.Color(colors[0]);
    const targetColor2 = new THREE.Color(colors[1]);

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
