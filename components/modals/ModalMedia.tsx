'use client';

import styles from '@components/modals/ModalMedia.module.css';
import buttonStyles from '@components/ActionButton.module.css';

import * as React from 'react';
import Image from 'next/image';

import { setDebugGridVisible } from '@components/DebugGrid';
import { useModals } from '@components/page/ModalContext';

import Card from '@components/Card';

type MediaItem = {
  src: string;
  label: string;
  width: number;
  height: number;
  video?: boolean;
};

const MEDIA_ROWS: MediaItem[][] = [
  [
    { src: '/sputter-glass.webp', label: 'DC Sputter — Coated Glass', width: 1330, height: 1768 },
    { src: '/sputter-vid.mov', label: 'DC Sputter — In Action', width: 16, height: 9, video: true },
    { src: '/litho.jpg', label: 'Photolithography', width: 2268, height: 4032 },
  ],
  [
    { src: '/tube-furnace-jpg.jpg', label: 'Tube Furnace', width: 4032, height: 2268 },
    { src: '/tube-furnace-chart.jpg', label: 'Tube Furnace — Process Chart', width: 4032, height: 2268 },
  ],
  [
    { src: '/spincoater.jpeg', label: 'Spin Coater', width: 2304, height: 2782 },
    { src: '/vacuum-chuck-cad.webp', label: 'Vacuum Chuck — CAD', width: 1144, height: 1072 },
  ],
  [
    { src: '/afm-ld-circuit.png', label: 'AFM — LD Circuit', width: 2586, height: 1206 },
    { src: '/afm-opu.png', label: 'AFM — OPU', width: 1458, height: 1010 },
  ],
];

function ModalMedia() {
  const { close } = useModals();

  React.useEffect(() => {
    setDebugGridVisible(true);
    return () => setDebugGridVisible(false);
  }, []);

  return (
    <div className={styles.root}>
      <Card title="MEDIA">
        <div className={styles.gallery}>
          {MEDIA_ROWS.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`${styles.galleryRow} ${row.length === 3 ? styles.threeColumns : styles.twoColumns}`}
            >
              {row.map((item) => (
                <div key={item.src} className={styles.imageCard}>
                  {item.video ? (
                    <div className={styles.imageFrame}>
                      <video src={item.src} controls playsInline className={styles.video} />
                    </div>
                  ) : (
                    <div className={styles.imageFrame}>
                      <Image
                        src={item.src}
                        alt={item.label}
                        width={item.width}
                        height={item.height}
                        sizes="(max-width: 700px) 92vw, (min-width: 1000px) 30vw, 44vw"
                        className={styles.image}
                      />
                    </div>
                  )}
                  <span className={styles.imageLabel}>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <button type="button" className={buttonStyles.root} onClick={() => close()}>
            <span className={buttonStyles.content}>CLOSE</span>
          </button>
        </div>
      </Card>
    </div>
  );
}

export default ModalMedia;
