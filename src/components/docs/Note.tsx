import type {ReactNode} from 'react';
import clsx from 'clsx';

import styles from './docs.module.css';

type NoteProps = {
  children: ReactNode;
  title?: string;
  type?: 'info' | 'warning' | 'success';
};

export default function Note({children, title, type = 'info'}: NoteProps) {
  return (
    <aside
      className={clsx(styles.note, {
        [styles.noteInfo]: type === 'info',
        [styles.noteWarning]: type === 'warning',
        [styles.noteSuccess]: type === 'success',
      })}>
      {title ? <strong className={styles.noteTitle}>{title}</strong> : null}
      <div className={styles.noteBody}>{children}</div>
    </aside>
  );
}
