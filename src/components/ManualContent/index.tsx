import type {ReactNode} from 'react';
import clsx from 'clsx';

import styles from './styles.module.css';

type ManualLeadProps = {
  text: string;
};

type ManualFigureProps = {
  src: string;
  alt: string;
  caption?: string;
};

type ManualCalloutProps = {
  text: string;
  title?: string;
  tone?: 'note' | 'tip';
};

function ManualShell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={clsx(styles.shell, className)}>{children}</div>;
}

export function ManualLead({text}: ManualLeadProps) {
  return (
    <ManualShell className={styles.lead}>
      <p>{text}</p>
    </ManualShell>
  );
}

export function ManualFigure({src, alt, caption}: ManualFigureProps) {
  return (
    <figure className={styles.figure}>
      <img className={styles.figureImage} src={src} alt={alt} loading="lazy" decoding="async" />
      {caption ? <figcaption className={styles.figureCaption}>{caption}</figcaption> : null}
    </figure>
  );
}

export function ManualCallout({text, title, tone = 'note'}: ManualCalloutProps) {
  return (
    <ManualShell className={clsx(styles.callout, tone === 'tip' && styles.calloutTip)}>
      {title ? <strong className={styles.calloutTitle}>{title}</strong> : null}
      <p>{text}</p>
    </ManualShell>
  );
}
