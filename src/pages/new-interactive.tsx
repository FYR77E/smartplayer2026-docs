import {useEffect} from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function NewInteractiveRedirect() {
  const redirectUrl = useBaseUrl('/interactive-tour');

  useEffect(() => {
    window.location.replace(redirectUrl);
  }, [redirectUrl]);

  return (
    <Layout
      title="SmartPlayer - Интерактивный тур"
      description="Маршрут /new-interactive перенаправляет на финальный React-тур /interactive-tour.">
      <main className="container margin-vert--lg">
        <h1>Интерактивный тур SmartPlayer</h1>
        <p>Открываю финальную версию маршрута в формате React/Docusaurus.</p>
        <p>
          Если редирект не сработал, откройте вручную: <a href={redirectUrl}>{redirectUrl}</a>
        </p>
      </main>
    </Layout>
  );
}
