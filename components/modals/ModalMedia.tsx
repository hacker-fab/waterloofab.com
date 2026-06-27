'use client';

import styles from '@components/modals/ModalAlert.module.css';

import * as React from 'react';

import { useModals } from '@components/page/ModalContext';

import Button from '@components/Button';
import Card from '@components/Card';

function ModalMedia() {
  const { close } = useModals();

  return (
    <div className={styles.root} style={{ maxWidth: '96ch' }}>
      <Card title="MEDIA">
        <span style={{ opacity: 0.5 }}>Coming soon.</span>
        <br />
        <br />
        <Button onClick={() => close()}>Close</Button>
      </Card>
    </div>
  );
}

export default ModalMedia;
