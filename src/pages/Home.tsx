import Cursor from '../components/common/Cursor';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import About from '../components/home/About';
import Industries from '../components/home/Industries';
import CTA from '../components/home/CTA';
import useScrollReveal from '../hooks/useScrollReveal';
import ScrollLine from '../components/home/ScrollLine';

export default function Home() {
  useScrollReveal();

  return (
    <>
      <Cursor />
      <ScrollLine />
      <Header />
      <Hero />
      <Services />
      <About />
      <Industries />
      <CTA />
      <Footer tagline="Web &amp; App Designer" />
    </>
  );
}
