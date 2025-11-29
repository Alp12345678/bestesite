import AboneOl from '@/components/AboneOl/Abone';
import Blog from '@/components/Blog/Blog';
import Footer from '@/components/Footer/Footer';
import Populer from '@/components/Populer/Populer';

export default function Home() {
  return (
    <div>
      <Populer />
      <AboneOl />
      <Blog />
      <Footer />
    </div>
  );
}
