import type {ReactNode} from 'react';

import styles from './docs.module.css';

type UiPathProps = {
  children: ReactNode;
};

export default function UiPath({children}: UiPathProps) {
  return <span className={styles.uiPath}>{children}</span>;
}
