import Layout from '@theme/Layout';
import InteractiveTourPage from '@site/src/components/interactive-tour/InteractiveTourPage';

export default function InteractiveTour() {
  return (
    <Layout
      title="SmartPlayer — Интерактивное обучение"
      description="Интерактивный маршрут по базовым рабочим сценариям SmartPlayer: контент, устройства, редактор и публикация.">
      <InteractiveTourPage />
    </Layout>
  );
}
