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
      title="SmartPlayer — Чек-лист перед запуском"
      description="Короткий маршрут к финальной сверке перед пилотом и массовым запуском SmartPlayer.">
      <main className="container margin-vert--lg">
        <h1>Чек-лист перед запуском SmartPlayer</h1>
        <p>Открываю короткий маршрут к финальной сверке перед пилотом, приёмкой и массовым запуском.</p>
        <p>
          Если редирект не сработал, откройте вручную: <a href={redirectUrl}>{redirectUrl}</a>
        </p>
      </main>
    </Layout>
  );
}
