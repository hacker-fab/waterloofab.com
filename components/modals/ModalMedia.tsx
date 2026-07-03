'use client';

import styles from '@components/modals/ModalMedia.module.css';

import * as React from 'react';

import { useModals } from '@components/page/ModalContext';

import Button from '@components/Button';
import Card from '@components/Card';

const MEDIA_ITEMS = [
  { src: '/sputter-glass.webp', label: 'DC Sputter — Coated Glass' },
  { src: '/sputter-vid.mov', label: 'DC Sputter — In Action', video: true },
  { src: '/tube-furnace-jpg.jpg', label: 'Tube Furnace' },
  { src: '/tube-furnace-chart.jpg', label: 'Tube Furnace — Process Chart' },
  { src: '/litho.jpg', label: 'Photolithography' },
  { src: '/spincoater.jpeg', label: 'Spin Coater' },
  { src: '/vacuum-chuck-cad.webp', label: 'Vacuum Chuck — CAD' },
];

function ModalMedia() {
  const { close } = useModals();

  return (
    <div className={styles.root}>
      <Card title="MEDIA">
        <div className={styles.gallery}>
          {MEDIA_ITEMS.map((item) => (
            <div key={item.src} className={styles.imageCard}>
              {item.video ? (
                <video src={item.src} controls playsInline />
              ) : (
                <img src={item.src} alt={item.label} />
              )}
              <span className={styles.imageLabel}>{item.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <Button onClick={() => close()}>Close</Button>
        </div>
      </Card>
    </div>
  );
}

export default ModalMedia;
