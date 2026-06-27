'use client';

import buttonStyles from '@components/ActionButton.module.css';
import navStyles from '@components/FabNav.module.css';

import * as React from 'react';

import { useHotkeys } from '@modules/hotkeys';

interface NavItem {
  label: string;
  hotkey: string;
  hotkeyKey: string;
  href: string;
  external?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'MAP',
    hotkey: '⌃+M',
    hotkeyKey: 'ctrl+m',
    href: 'https://maps.app.goo.gl/UcKTWBqJWAMLfbE97',
    external: true,
  },
  { label: 'CONTACT', hotkey: '⌃+K', hotkeyKey: 'ctrl+k', href: '#contact' },
  { label: 'MEDIA', hotkey: '⌃+I', hotkeyKey: 'ctrl+i', href: '#media' },
  { label: 'FAQ', hotkey: '⌃+Q', hotkeyKey: 'ctrl+q', href: '#faq' },
];

const FabNav: React.FC = () => {
  const refs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  NAV_ITEMS.forEach((item, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotkeys(item.hotkeyKey, () => refs.current[i]?.click());
  });

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
        >
          <span className={`${buttonStyles.hotkey} ${navStyles.hotkey}`}>{item.hotkey}</span>
          <span className={buttonStyles.content}>{item.label}</span>
        </a>
      ))}
    </div>
  );
};

export default FabNav;
