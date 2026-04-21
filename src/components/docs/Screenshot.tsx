import styles from './docs.module.css';

type ScreenshotProps = {
  src: string;
  alt: string;
  caption?: string;
};

export default function Screenshot({src, alt, caption}: ScreenshotProps) {
  return (
    <figure className={styles.figure}>
      <img className={styles.figureImage} src={src} alt={alt} loading="lazy" decoding="async" />
      {caption ? <figcaption className={styles.figureCaption}>{caption}</figcaption> : null}
    </figure>
  );
}
