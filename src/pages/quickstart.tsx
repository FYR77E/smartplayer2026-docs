import {useEffect} from 'react';
import Layout from '@theme/Layout';

export default function QuickstartRedirect() {
  useEffect(() => {
    window.location.replace('/quickstart-site/index.html');
  }, []);

  return (
    <Layout title="SmartPlayer — Быстрый старт" description="Быстрый старт SmartPlayer.">
      <main className="container margin-vert--lg">
        <h1>Быстрый старт</h1>
        <p>Открываю страницу быстрого старта…</p>
        <p>
          Если редирект не сработал, открой вручную:{' '}
          <a href="/quickstart-site/index.html">/quickstart-site/index.html</a>
        </p>
      </main>
    </Layout>
  );
}

