import Categories from "../components/Categories";
import FeaturedSection from "../components/FeaturedSection";
import Hero from "../components/Hero";
import RecentlyViewedSection from "../components/RecentlyViewedSection";

const Home = () => {
  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedSection />
      <RecentlyViewedSection />
    </main>
  );
};

export default Home;