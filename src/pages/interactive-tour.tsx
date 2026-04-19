import Layout from '@theme/Layout';
import InteractiveTourPage from '@site/src/components/interactive-tour/InteractiveTourPage';

export default function InteractiveTour() {
  return (
    <Layout
      title="SmartPlayer — Интерактивный тур"
      description="Интерактивный маршрут по ключевым шагам пошагового старта: контент, устройства, трансляции и расписание.">
      <InteractiveTourPage />
    </Layout>
  );
}
