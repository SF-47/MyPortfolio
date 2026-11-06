import { useEffect, useRef } from "react";

/**
 * Signal Particles background (ThreeUI Predictive Arc, variant "signal-particles",
 * source revision fa86582fc870).
 *
 * The draw loop below is the authored canvas logic from
 * src/shaders/neuform-isolated/sources/signal-particles.html with the host patch
 * applied at the configured defaults (mode="dark", speed=1, size=1, length=1,
 * hue=0, saturation=1, brightness=1 → no CSS filter).
 * mode="light" swaps in the host's light-mode patch colours (#1d4ed8, #5b21b6,
 * rgba(36, 48, 68, a) on #eef1f6) without restarting the loop.
 *
 * The ThreeUI host loads the whole demo page in an iframe and isolates
 * #particle-canvas as a fixed full-viewport layer over #0a0a0a. Here the canvas is
 * rendered directly with the same result, without the demo page's Tailwind CDN,
 * GSAP and Iconify scripts.
 */
type Mode = "dark" | "light";

type Props = {
  speed?: number;
  mode?: Mode;
};

const PALETTE = {
  dark: { blue: "#3b82f6", purple: "#8b5cf6", dot: "148, 163, 184" },
  light: { blue: "#1d4ed8", purple: "#5b21b6", dot: "36, 48, 68" },
} as const;

export function SignalParticles({ speed = 1, mode = "dark" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef(speed);
  const paletteRef = useRef<(typeof PALETTE)[Mode]>(PALETTE[mode]);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    paletteRef.current = PALETTE[mode];
    redrawRef.current();
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const spacing = 16;
    const dotRadius = 1.5;
    let time = 0;
    let frame = 0;

    function resize() {
      width = canvas!.width = canvas!.offsetWidth;
      height = canvas!.height = canvas!.offsetHeight;
    }

    function render() {
      ctx!.clearRect(0, 0, width, height);

      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);

      const offsetX = (width - cols * spacing) / 2;
      const offsetY = (height - rows * spacing) / 2;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = offsetX + i * spacing;
          const y = offsetY + j * spacing;

          const nx = i * 0.1;
          const ny = j * 0.1;

          const wave1 = Math.sin(nx + time * 0.5) * Math.cos(ny - time * 0.3);
          const wave2 = Math.sin(nx * 0.5 - ny * 0.5 + time * 0.8);
          const value = wave1 + wave2;

          if (value > 0.1) {
            ctx!.beginPath();
            ctx!.arc(x, y, dotRadius, 0, Math.PI * 2);

            const highlightCheck = Math.sin(i * 12.34) * Math.cos(j * 56.78);

            const palette = paletteRef.current;
            if (highlightCheck > 0.98) {
              ctx!.fillStyle = palette.blue; // Blue highlight
            } else if (highlightCheck < -0.98) {
              ctx!.fillStyle = palette.purple; // Purple highlight
            } else {
              const alpha = Math.min(0.6, (value - 0.1) * 0.8);
              ctx!.fillStyle = `rgba(${palette.dot}, ${alpha})`;
            }

            ctx!.fill();
          }
        }
      }
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function draw() {
      render();
      time += 0.02 * (speedRef.current || 1);
      frame = requestAnimationFrame(draw);
    }

    function start() {
      cancelAnimationFrame(frame);
      if (reducedMotion.matches) {
        render(); // single still frame
      } else {
        draw();
      }
    }

    function onResize() {
      resize();
      if (reducedMotion.matches) render();
    }

    // Repaint immediately on theme change when the loop is not running (reduced motion).
    redrawRef.current = () => {
      if (reducedMotion.matches) render();
    };

    window.addEventListener("resize", onResize);
    reducedMotion.addEventListener("change", start);
    resize();
    start();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      reducedMotion.removeEventListener("change", start);
      redrawRef.current = () => {};
    };
  }, []);

  return (
    <div className="signal-particles" aria-hidden="true">
      <canvas ref={canvasRef} className="signal-particles__canvas" />
    </div>
  );
}
