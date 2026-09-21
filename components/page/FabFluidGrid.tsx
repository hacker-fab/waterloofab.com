'use client';

import styles from '@components/page/FabFluidGrid.module.css';

import * as React from 'react';

const FRAME_INTERVAL = 1000 / 60;
const CELL_GAP = 1;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const smoothstep = (value: number) => value * value * (3 - 2 * value);

const sampleField = (field: Float32Array, x: number, y: number, cols: number, rows: number) => {
  const sampleX = clamp(x, 0, cols - 1);
  const sampleY = clamp(y, 0, rows - 1);
  const x0 = Math.floor(sampleX);
  const y0 = Math.floor(sampleY);
  const x1 = Math.min(x0 + 1, cols - 1);
  const y1 = Math.min(y0 + 1, rows - 1);
  const tx = sampleX - x0;
  const ty = sampleY - y0;
  const top = field[y0 * cols + x0] * (1 - tx) + field[y0 * cols + x1] * tx;
  const bottom = field[y1 * cols + x0] * (1 - tx) + field[y1 * cols + x1] * tx;
  return top * (1 - ty) + bottom * ty;
};

const FabFluidGrid: React.FC = () => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const measure = measureRef.current;
    if (!root || !canvas || !measure) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    let cols = 0;
    let rows = 0;
    let cellWidth = 8;
    let cellHeight = 20;
    let field = new Float32Array();
    let nextField = new Float32Array();
    let palette: string[] = [];
    let frame = 0;
    let lastFrame = 0;
    let isVisible = document.visibilityState === 'visible';
    let previousPointer: { x: number; y: number } | null = null;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const readPalette = () => {
      const computed = getComputedStyle(document.body);
      palette = [
        '--theme-background',
        '--theme-background-modal',
        '--theme-border-subdued',
        '--theme-border',
        '--theme-focused-foreground-subdued',
      ].map((token) => computed.getPropertyValue(token).trim());
    };

    const seedField = () => {
      field = new Float32Array(cols * rows);
      nextField = new Float32Array(cols * rows);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const wave = Math.sin(x * 0.18 + Math.sin(y * 0.12) * 2.4) + Math.cos(y * 0.16 - x * 0.05);
          field[y * cols + x] = Math.max(0, wave * 0.06);
        }
      }
    };

    const draw = (time: number) => {
      const phase = time * 0.001;
      context.fillStyle = palette[0];
      context.fillRect(0, 0, root.clientWidth, root.clientHeight);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const index = y * cols + x;
          const broadWave = Math.sin(x * 0.085 + Math.sin(y * 0.105 + phase * 0.12) * 2.6 + phase * 0.07);
          const crossWave = Math.cos(y * 0.125 - Math.cos(x * 0.075 - phase * 0.1) * 2.1 - phase * 0.06);
          const diagonalWave = Math.sin((x + y) * 0.052 + phase * 0.08);
          const ambient = smoothstep(clamp(0.48 + broadWave * 0.2 + crossWave * 0.18 + diagonalWave * 0.12, 0, 1));
          const intensity = clamp(ambient * 0.78 + field[index] * 0.95, 0, 1);
          const paletteIndex = Math.min(palette.length - 1, Math.floor(intensity * palette.length));

          context.fillStyle = palette[paletteIndex];
          context.fillRect(
            x * cellWidth + CELL_GAP,
            y * cellHeight + CELL_GAP,
            Math.max(1, cellWidth - CELL_GAP),
            Math.max(1, cellHeight - CELL_GAP),
          );
        }
      }
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const measureRect = measure.getBoundingClientRect();
      cellWidth = Math.max(5, measureRect.width);
      cellHeight = Math.max(8, measureRect.height);

      const nextCols = Math.max(1, Math.ceil(rect.width / cellWidth));
      const nextRows = Math.max(1, Math.ceil(rect.height / cellHeight));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(rect.height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (nextCols !== cols || nextRows !== rows) {
        cols = nextCols;
        rows = nextRows;
        seedField();
      }

      draw(reducedMotion.matches ? 0 : performance.now());
    };

    const advect = (time: number) => {
      const phase = time * 0.001;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const index = y * cols + x;
          const velocityX =
            Math.sin(y * 0.14 + phase * 1.4) * 0.45 +
            Math.cos((x + y) * 0.075 - phase) * 0.3;
          const velocityY =
            Math.cos(x * 0.12 - phase * 1.2) * 0.42 -
            Math.sin((x - y) * 0.085 + phase * 0.9) * 0.28;
          const transported = sampleField(field, x - velocityX, y - velocityY, cols, rows);
          const neighborAverage =
            (field[y * cols + Math.max(0, x - 1)] +
              field[y * cols + Math.min(cols - 1, x + 1)] +
              field[Math.max(0, y - 1) * cols + x] +
              field[Math.min(rows - 1, y + 1) * cols + x]) /
            4;

          nextField[index] = Math.max(0, transported * 0.94 + neighborAverage * 0.025 - 0.006);
        }
      }

      [field, nextField] = [nextField, field];
    };

    const deposit = (x: number, y: number, strength = 1) => {
      const radius = 5;
      const minX = Math.max(0, Math.floor(x - radius));
      const maxX = Math.min(cols - 1, Math.ceil(x + radius));
      const minY = Math.max(0, Math.floor(y - radius));
      const maxY = Math.min(rows - 1, Math.ceil(y + radius));

      for (let cellY = minY; cellY <= maxY; cellY++) {
        for (let cellX = minX; cellX <= maxX; cellX++) {
          const distance = Math.hypot(cellX - x, cellY - y);
          if (distance >= radius) continue;
          const falloff = 1 - distance / radius;
          const index = cellY * cols + cellX;
          field[index] = Math.min(1.2, field[index] + falloff * falloff * strength);
        }
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches) return;
      const rect = root.getBoundingClientRect();
      const pointer = {
        x: (event.clientX - rect.left) / cellWidth,
        y: (event.clientY - rect.top) / cellHeight,
      };

      if (previousPointer) {
        const distance = Math.hypot(pointer.x - previousPointer.x, pointer.y - previousPointer.y);
        const steps = Math.max(1, Math.ceil(distance * 2));
        for (let step = 0; step <= steps; step++) {
          const progress = step / steps;
          deposit(
            previousPointer.x + (pointer.x - previousPointer.x) * progress,
            previousPointer.y + (pointer.y - previousPointer.y) * progress,
            0.9,
          );
        }
      } else {
        deposit(pointer.x, pointer.y, 0.9);
      }

      previousPointer = pointer;
    };

    const handlePointerLeave = () => {
      previousPointer = null;
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible && !reducedMotion.matches) frame = requestAnimationFrame(loop);
    };

    const loop = (time: number) => {
      if (!isVisible || reducedMotion.matches) return;
      if (time - lastFrame >= FRAME_INTERVAL) {
        advect(time);
        draw(time);
        lastFrame = time;
      }
      frame = requestAnimationFrame(loop);
    };

    const handleReducedMotionChange = () => {
      cancelAnimationFrame(frame);
      if (reducedMotion.matches) {
        draw(0);
      } else if (isVisible) {
        lastFrame = 0;
        frame = requestAnimationFrame(loop);
      }
    };

    readPalette();
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);

    //NOTE(jimmylee): Appearance and font controls both mutate body classes, so one observer keeps
    //NOTE(jimmylee): the simulation palette and its character-cell geometry locked to the active site instance.
    const bodyObserver = new MutationObserver(() => {
      readPalette();
      resize();
    });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });

    root.addEventListener('pointermove', handlePointerMove, { passive: true });
    root.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotion.addEventListener('change', handleReducedMotionChange);

    if (!reducedMotion.matches) frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      bodyObserver.disconnect();
      root.removeEventListener('pointermove', handlePointerMove);
      root.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotion.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root} aria-label="Interactive semiconductor process field">
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <span ref={measureRef} className={styles.measure} aria-hidden="true" />
    </div>
  );
};

export default FabFluidGrid;
