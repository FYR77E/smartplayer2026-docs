import {useEffect} from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function QuickstartRedirect() {
  const redirectUrl = useBaseUrl('/quickstart-site/index.html');

  useEffect(() => {
    window.location.replace(redirectUrl);
  }, [redirectUrl]);

  return (
    <Layout title="SmartPlayer — Быстрый старт" description="Быстрый старт SmartPlayer.">
      <main className="container margin-vert--lg">
        <h1>Быстрый старт</h1>
        <p>Открываю страницу быстрого старта…</p>
        <p>
          Если редирект не сработал, открой вручную:{' '}
          <a href={redirectUrl}>{redirectUrl}</a>
        </p>
      </main>
    </Layout>
  );
}
