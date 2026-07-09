'use client';

import buttonStyles from '@components/ActionButton.module.css';
import navStyles from '@components/FabNav.module.css';

import * as React from 'react';

import { useHotkeys } from '@modules/hotkeys';
import { useModals } from '@components/page/ModalContext';

import ModalMedia from '@components/modals/ModalMedia';

interface NavItem {
  label: string;
  hotkey: string;
  hotkeyKey: string;
  href: string;
  external?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'CONTACT', hotkey: '⌃+K', hotkeyKey: 'ctrl+k', href: '#contact' },
  { label: 'SPONSOR', hotkey: '⌃+S', hotkeyKey: 'ctrl+s', href: 'https://docs.google.com/document/d/1br1uqPcKH3_II-7GZcfvDpuFsgBN5H3fRLDFnIcEbh0/edit?usp=sharing', external: true },
];

const pulseSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.classList.remove('section-pulse');
  void el.offsetWidth;
  el.classList.add('section-pulse');
  el.addEventListener('animationend', () => el.classList.remove('section-pulse'), { once: true });
};

const FabNav: React.FC = () => {
  const { open, close, modalStack } = useModals();
  const mediaKeyRef = React.useRef<string | null>(null);
  const refs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  NAV_ITEMS.forEach((item, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotkeys(item.hotkeyKey, () => refs.current[i]?.click());
  });

  const isMediaOpen = mediaKeyRef.current !== null && modalStack.some((m) => m.key === mediaKeyRef.current);

  const toggleMedia = () => {
    if (isMediaOpen) {
      close(mediaKeyRef.current ?? undefined);
      mediaKeyRef.current = null;
    } else {
      mediaKeyRef.current = open(ModalMedia, {});
    }
  };

  useHotkeys('ctrl+i', toggleMedia);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {NAV_ITEMS.map((item, i) => (
        <a
          key={item.label}
          ref={(el) => { refs.current[i] = el; }}
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
          className={buttonStyles.root}
          style={{ textDecoration: 'none' }}
          onClick={!item.external ? (e) => { e.preventDefault(); pulseSection(item.href.slice(1)); } : undefined}
        >
          <span className={`${buttonStyles.hotkey} ${navStyles.hotkey}`}>{item.hotkey}</span>
          <span className={buttonStyles.content}>{item.label}</span>
        </a>
      ))}
      <button
        className={buttonStyles.root}
        onClick={toggleMedia}
        style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}
      >
        <span className={`${buttonStyles.hotkey} ${navStyles.hotkey}`}>⌃+I</span>
        <span className={buttonStyles.content}>MEDIA</span>
      </button>
    </div>
  );
};

export default FabNav;
