import Categories from "../components/Categories";
import FeaturedSection from "../components/FeaturedSection";
import Hero from "../components/Hero";

const Home = () => {
  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedSection />
    </main>
  );
};

export default Home;