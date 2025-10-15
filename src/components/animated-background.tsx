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
  
  // 2D Simplex Noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xw + h.yz * x12.y;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float noise = 0.0;
    
    float time = u_time * 0.1;
    
    uv *= 2.0; // zoom
    
    // Add multiple layers of noise
    noise += snoise(uv + time) * 0.5;
    noise += snoise(uv * 2.0 + time) * 0.25;
    noise += snoise(uv * 4.0 + time) * 0.125;
    
    noise = (noise + 1.0) / 2.0; // Remap from [-1, 1] to [0, 1]
    
    vec3 color = mix(u_color1, u_color2, smoothstep(0.4, 0.6, noise));
    
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
