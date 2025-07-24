import React, { useRef, useEffect, useState, useCallback } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

interface LiquidChromeProps extends React.HTMLAttributes<HTMLDivElement> {
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
  quality?: 'low' | 'medium' | 'high';
  targetFPS?: number;
}

export const LiquidChrome: React.FC<LiquidChromeProps> = React.memo(({
  baseColor = [0.1, 0.1, 0.1],
  speed = 0.2,
  amplitude = 0.5,
  frequencyX = 3,
  frequencyY = 2,
  interactive = true,
  quality = 'medium',
  targetFPS = 30,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [pixelRatio, setPixelRatio] = useState(1);
  const frameTimeRef = useRef(0);
  const lastFrameTime = useRef(0);

  // Performance monitoring
  const performanceRef = useRef({
    frameCount: 0,
    lastFPSCheck: 0,
    currentFPS: 0,
    adaptiveQuality: quality
  });

  // Adaptive quality based on performance
  const getQualitySettings = useCallback((qualityLevel: string) => {
    switch (qualityLevel) {
      case 'low':
        return { 
          pixelRatio: 0.5, 
          iterations: 3, 
          antialiasing: false,
          rippleStrength: 0.01
        };
      case 'medium':
        return { 
          pixelRatio: 0.75, 
          iterations: 5, 
          antialiasing: false,
          rippleStrength: 0.02
        };
      case 'high':
        return { 
          pixelRatio: 1, 
          iterations: 8, 
          antialiasing: true,
          rippleStrength: 0.03
        };
      default:
        return { 
          pixelRatio: 0.75, 
          iterations: 5, 
          antialiasing: false,
          rippleStrength: 0.02
        };
    }
  }, []);

  // Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isVisible) return;

    const container = containerRef.current;
    const qualitySettings = getQualitySettings(performanceRef.current.adaptiveQuality);
    
    // Adjust pixel ratio based on device capabilities
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const effectivePixelRatio = devicePixelRatio * qualitySettings.pixelRatio;
    setPixelRatio(effectivePixelRatio);

    const renderer = new Renderer({ 
      antialias: qualitySettings.antialiasing,
      powerPreference: "high-performance"
    });
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    const vertexShader = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Optimized fragment shader with fewer iterations and simpler math
    const fragmentShader = `
      precision mediump float;
      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec3 uBaseColor;
      uniform float uAmplitude;
      uniform float uFrequencyX;
      uniform float uFrequencyY;
      uniform vec2 uMouse;
      uniform float uIterations;
      uniform float uRippleStrength;
      varying vec2 vUv;

      vec4 renderImage(vec2 uvCoord) {
          vec2 fragCoord = uvCoord * uResolution.xy;
          vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);
          
          float iterations = uIterations;
          
          for (float i = 1.0; i < 10.0; i++){
              if (i > iterations) break;
              float factor = uAmplitude / i;
              uv.x += factor * cos(i * uFrequencyX * uv.y + uTime);
              uv.y += factor * cos(i * uFrequencyY * uv.x + uTime);
          }

          // Simplified mouse interaction
          if (length(uMouse) > 0.0) {
              vec2 diff = (uvCoord - uMouse);
              float dist = length(diff);
              float falloff = exp(-dist * 15.0);
              float ripple = sin(8.0 * dist - uTime * 1.5) * uRippleStrength;
              uv += (diff / (dist + 0.001)) * ripple * falloff;
          }

          vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
          return vec4(color, 1.0);
      }

      void main() {
          gl_FragColor = renderImage(vUv);
      }
    `;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Float32Array([
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height,
          ]),
        },
        uBaseColor: { value: new Float32Array(baseColor) },
        uAmplitude: { value: amplitude },
        uFrequencyX: { value: frequencyX },
        uFrequencyY: { value: frequencyY },
        uMouse: { value: new Float32Array([0, 0]) },
        uIterations: { value: qualitySettings.iterations },
        uRippleStrength: { value: qualitySettings.rippleStrength },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      renderer.setSize(
        container.offsetWidth * effectivePixelRatio,
        container.offsetHeight * effectivePixelRatio
      );
      const resUniform = program.uniforms.uResolution.value as Float32Array;
      resUniform[0] = gl.canvas.width;
      resUniform[1] = gl.canvas.height;
      resUniform[2] = gl.canvas.width / gl.canvas.height;
      
      // Style the canvas to fill container
      gl.canvas.style.width = container.offsetWidth + 'px';
      gl.canvas.style.height = container.offsetHeight + 'px';
    }
    window.addEventListener("resize", resize);
    resize();

    let mouseX = 0;
    let mouseY = 0;
    let isMouseActive = false;
    let mouseTimeout: NodeJS.Timeout;

    function handleMouseMove(event: MouseEvent) {
      const rect = container.getBoundingClientRect();
      mouseX = (event.clientX - rect.left) / rect.width;
      mouseY = 1 - (event.clientY - rect.top) / rect.height;
      isMouseActive = true;
      
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        isMouseActive = false;
      }, 1000);
    }

    function handleTouchMove(event: TouchEvent) {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        mouseX = (touch.clientX - rect.left) / rect.width;
        mouseY = 1 - (touch.clientY - rect.top) / rect.height;
        isMouseActive = true;
        
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
          isMouseActive = false;
        }, 1000);
      }
    }

    if (interactive) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, { passive: true });
    }

    let animationId: number;
    const targetFrameTime = 1000 / targetFPS;
    
    function update(currentTime: number) {
      animationId = requestAnimationFrame(update);
      
      // Throttle framerate
      if (currentTime - lastFrameTime.current < targetFrameTime) {
        return;
      }
      
      // Performance monitoring
      const perf = performanceRef.current;
      perf.frameCount++;
      
      if (currentTime - perf.lastFPSCheck > 1000) {
        perf.currentFPS = perf.frameCount;
        perf.frameCount = 0;
        perf.lastFPSCheck = currentTime;
        
        // Adaptive quality adjustment
        if (perf.currentFPS < targetFPS * 0.8 && perf.adaptiveQuality !== 'low') {
          perf.adaptiveQuality = perf.adaptiveQuality === 'high' ? 'medium' : 'low';
          console.log(`LiquidChrome: Adapting quality to ${perf.adaptiveQuality} (FPS: ${perf.currentFPS})`);
        } else if (perf.currentFPS > targetFPS * 1.2 && perf.adaptiveQuality !== quality) {
          const qualityLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
          const currentIndex = qualityLevels.indexOf(perf.adaptiveQuality);
          const targetIndex = qualityLevels.indexOf(quality);
          if (currentIndex < targetIndex) {
            perf.adaptiveQuality = qualityLevels[Math.min(currentIndex + 1, targetIndex)];
            console.log(`LiquidChrome: Improving quality to ${perf.adaptiveQuality} (FPS: ${perf.currentFPS})`);
          }
        }
      }
      
      lastFrameTime.current = currentTime;
      program.uniforms.uTime.value = currentTime * 0.001 * speed;
      
      // Update mouse position smoothly
      if (interactive) {
        const mouseUniform = program.uniforms.uMouse.value as Float32Array;
        if (isMouseActive) {
          mouseUniform[0] = mouseX;
          mouseUniform[1] = mouseY;
        } else {
          // Fade out mouse effect
          mouseUniform[0] *= 0.95;
          mouseUniform[1] *= 0.95;
        }
      }
      
      renderer.render({ scene: mesh });
    }
    animationId = requestAnimationFrame(update);

    container.appendChild(gl.canvas);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(mouseTimeout);
      window.removeEventListener("resize", resize);
      if (interactive) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("touchmove", handleTouchMove);
      }
      if (gl.canvas.parentElement) {
        gl.canvas.parentElement.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [baseColor, speed, amplitude, frequencyX, frequencyY, interactive, quality, targetFPS, isVisible, getQualitySettings]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      {...props}
    />
  );
});

LiquidChrome.displayName = 'LiquidChrome';

export default LiquidChrome;
