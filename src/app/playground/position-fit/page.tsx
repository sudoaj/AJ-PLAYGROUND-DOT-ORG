import { Suspense } from 'react';
import PositionFit from '@/components/position-fit/PositionFit';

export default function PositionFitPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PositionFit />
    </Suspense>
  );
}
