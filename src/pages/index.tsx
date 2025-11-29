import AboneOl from '@/components/AboneOl/Abone';
import Blog from '@/components/Blog/Blog';
import MapsEmbed from '@/components/Genel/MapsEmbed';

import Populer from '@/components/Populer/Populer';

export default function Home() {
  return (
    <div>
      <Populer />
      <AboneOl />
      <Blog />
      <MapsEmbed />
    </div>
  );
}
