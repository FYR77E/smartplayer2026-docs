import {useEffect} from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function QuickstartRedirect() {
  const redirectUrl = useBaseUrl('/quickstart-site/index.html');

  useEffect(() => {
    window.location.replace(redirectUrl);
  }, [redirectUrl]);

  return (
    <Layout
      title={'SmartPlayer \u2014 \u0411\u044b\u0441\u0442\u0440\u044b\u0439 \u0441\u0442\u0430\u0440\u0442'}
      description={'\u0411\u044b\u0441\u0442\u0440\u044b\u0439 \u0441\u0442\u0430\u0440\u0442 SmartPlayer.'}>
      <main className="container margin-vert--lg">
        <h1>{'\u0411\u044b\u0441\u0442\u0440\u044b\u0439 \u0441\u0442\u0430\u0440\u0442'}</h1>
        <p>{'\u041e\u0442\u043a\u0440\u044b\u0432\u0430\u044e \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443 \u0431\u044b\u0441\u0442\u0440\u043e\u0433\u043e \u0441\u0442\u0430\u0440\u0442\u0430...'}</p>
        <p>
          {'\u0415\u0441\u043b\u0438 \u0440\u0435\u0434\u0438\u0440\u0435\u043a\u0442 \u043d\u0435 \u0441\u0440\u0430\u0431\u043e\u0442\u0430\u043b, \u043e\u0442\u043a\u0440\u043e\u0439 \u0432\u0440\u0443\u0447\u043d\u0443\u044e:'}{' '}
          <a href={redirectUrl}>{redirectUrl}</a>
        </p>
      </main>
    </Layout>
  );
}
