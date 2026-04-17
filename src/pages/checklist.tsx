import {useEffect} from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function ChecklistRedirect() {
  const redirectUrl = useBaseUrl('/generated/17-13-чек-лист-запуска');

  useEffect(() => {
    window.location.replace(redirectUrl);
  }, [redirectUrl]);

  return (
    <Layout
      title="SmartPlayer — Чек-лист запуска"
      description="Короткий маршрут к чек-листу запуска SmartPlayer.">
      <main className="container margin-vert--lg">
        <h1>Чек-лист запуска SmartPlayer</h1>
        <p>Открываю короткий маршрут к рабочему чек-листу запуска и приёмки.</p>
        <p>
          Если редирект не сработал, откройте вручную: <a href={redirectUrl}>{redirectUrl}</a>
        </p>
      </main>
    </Layout>
  );
}
