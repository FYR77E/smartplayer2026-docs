import {useEffect} from 'react';
import Layout from '@theme/Layout';

export default function QuickstartRedirect() {
  useEffect(() => {
    window.location.replace('/quickstart/index.html');
  }, []);

  return (
    <Layout title="SmartPlayer — Быстрый старт" description="Быстрый старт SmartPlayer (HTML).">
      <main className="container margin-vert--lg">
        <h1>Быстрый старт</h1>
        <p>Открываю HTML‑версию быстрого старта…</p>
        <p>
          Если редирект не сработал, открой вручную: <a href="/quickstart/index.html">/quickstart/index.html</a>
        </p>
      </main>
    </Layout>
  );
}

