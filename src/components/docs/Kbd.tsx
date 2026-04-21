import type {ReactNode} from 'react';

import styles from './docs.module.css';

type KbdProps = {
  children: ReactNode;
};

export default function Kbd({children}: KbdProps) {
  return <kbd className={styles.kbd}>{children}</kbd>;
}
