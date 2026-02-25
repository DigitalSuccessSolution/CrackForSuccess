import HeroSection from "../components/Layout/Hero";
import AboutSection from "../components/Sections/About";
import PlacementMarquee from "../components/Sections/PlacementMarquee";
import Testimonials from "../components/Sections/Testimonials";

const Landing = () => {
  return (
    <div className="bg-gray-50">
      <div id="home">
        <HeroSection />
      </div>
      <div id="placements">
        <PlacementMarquee />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="about">
        <AboutSection />
      </div>
    </div>
  );
};

export default Landing;
