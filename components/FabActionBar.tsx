'use client';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import { toggleDebugGrid } from '@components/DebugGrid';
import { useHotkeys } from '@modules/hotkeys';

import { useModals } from '@components/page/ModalContext';

const useGlobalNavigationHotkeys = () => {
  const onHandleSubmit = (event: KeyboardEvent) => {
    const target = event.target;
    if (!Utilities.isFocusableElement(target)) return;
    const el = target as HTMLElement;
    const tag = el.tagName;
    if (tag === 'BUTTON' || tag === 'A' || tag === 'SELECT' || tag === 'INPUT') return;
    const role = el.getAttribute('role');
    if (role === 'menuitem' || role === 'option') return;
    event.preventDefault();
    el.click();
  };

  const onHandleNextFocus = (event: KeyboardEvent) => {
    const target = event.target;
    if (!Utilities.isFocusableElement(target)) return;
    const el = target as HTMLElement;
    if (el.closest('[role="menu"], [role="listbox"], [role="grid"]') || el.getAttribute('aria-haspopup')) return;
    event.preventDefault();
    const next = Utilities.findNextFocusable(el, 'next');
    if (next) next.focus();
  };

  const onHandlePreviousFocus = (event: KeyboardEvent) => {
    const target = event.target;
    if (!Utilities.isFocusableElement(target)) return;
    const el = target as HTMLElement;
    if (el.closest('[role="menu"], [role="listbox"], [role="grid"]') || el.getAttribute('aria-haspopup')) return;
    event.preventDefault();
    const prev = Utilities.findNextFocusable(el, 'previous');
    if (prev) prev.focus();
  };

  useHotkeys('ArrowDown', onHandleNextFocus);
  useHotkeys('ArrowUp', onHandlePreviousFocus);
  useHotkeys('ArrowRight', onHandleNextFocus);
  useHotkeys('ArrowLeft', onHandlePreviousFocus);
  useHotkeys('Enter', onHandleSubmit);
  useHotkeys(' ', onHandleSubmit);
};

const TINTS = [null, null, 'tint-blue', 'tint-green', 'tint-orange', 'tint-purple', 'tint-red', 'tint-pink'];

const FabActionBar: React.FC = () => {
  const { close } = useModals();

  useHotkeys('Escape', () => close());

  useGlobalNavigationHotkeys();

  React.useEffect(() => {
    const tint = TINTS[Math.floor(Math.random() * TINTS.length)];
    Utilities.onHandleAppearanceModeChange(tint ?? undefined);
  }, []);

  return null;
};

export default FabActionBar;
