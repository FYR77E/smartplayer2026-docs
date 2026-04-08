import Layout from '@theme/Layout';
import InteractiveTourPage from '@site/src/components/interactive-tour/InteractiveTourPage';

export default function InteractiveTour() {
  return (
    <Layout
      title="SmartPlayer — Интерактивное обучение"
      description="Интерактивный маршрут по ключевым шагам Quick Start: Контент, Устройства, Трансляции и Расписание.">
      <InteractiveTourPage />
    </Layout>
  );
}
