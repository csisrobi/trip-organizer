import dynamic from 'next/dynamic';

const testmap = () => {
  const Map = dynamic(() => import('../src/components/MapMarker'), {
    loading: () => <p>A map is loading</p>,
    ssr: false,
  });
  return <Map showMarker={[45.9442858, 25.0094303]} />;
};

export default testmap;
