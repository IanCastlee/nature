import { offerToChoose } from "../../constant/mockData";
import SubtTitle from "../molecules/SubtTitle";
import Title from "../molecules/Title";

function WhyChooseUs() {
  return (
    <section className="flex flex-col items-center justify-center gap-12 px-4 lg:px-[130px] py-16 dark:bg-black relative">
      {/* Section Header */}
      <div className="w-full flex flex-col justify-center items-center text-center">
        <SubtTitle title="WHY CHOOSE US" />
        <Title title="THE PERFECT BLEND OF NATURE & COMFORT" />
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {offerToChoose.map((offer) => (
          <div
            key={offer.id}
            className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center p-6"
          >
            <img
              src={offer.image}
              alt={offer.title}
              className="w-20 h-20 object-cover mb-4 rounded-full"
            />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {offer.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {offer.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
