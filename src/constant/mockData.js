import { images } from "./image";

// mockData.js or dummyRooms.js
import img1 from "../assets/images/aboutbg.webp";
import img2 from "../assets/images/signupbg.webp";

//freebies
export const freebies = [
  {
    image: images.room,
    name: "Comfortable Accommodations",
  },
  {
    image: images.spring,
    name: "Natural Hot Springs",
  },
  {
    image: images.waterBike,
    name: "Water Biking",
  },
  {
    image: images.bike,
    name: "Biking Around the Lagoon",
  },
  {
    image: images.fish,
    name: "Fish Feeding at the Lagoon",
  },
  {
    image: images.service,
    name: "Personalized Service",
  },
];

//dummy Room Categories
export const dummyRoomCategories = [
  {
    id: 1,
    name: "AIR-CONDITIONED ROOMS WITH MINI POOL",
    image: img1,
  },
  {
    id: 2,
    name: "AIR-CONDITIONED SUITE ROOMS WITH SHARED BIG",
    image: img1,
  },
  {
    id: 3,
    name: "AIR-CONDITIONED ROOMS WITHOUT MINI POOL",
    image: img1,
  },
  {
    id: 4,
    name: "STANDARD AIR-CONDITIONED ROOMS WITHOUT MINI POOL",
    image: img1,
  },
];

//dummyRooms
export const dummyRooms = [
  {
    id: 1,
    image: img2,
    name: "AIR-CONDITIONED ROOMS WITH MINI POOL",
  },
  { id: 2, image: img2, name: "AIR-CONDITIONED SUITE ROOMS WITH SHARED BIG" },
  { id: 3, image: img2, name: "AIR-CONDITIONED ROOMS WITHOUT MINI POOL" },
  {
    id: 4,
    image: img2,
    name: "STANDARD AIR-CONDITIONED ROOMS WITHOUT MINI POOL",
  },
];

//cottages
export const dummyCottages = [
  {
    id: 1,
    image: img1,
    name: "Cottage 1",
    price: "10,60.00",
    capacity: "5-10 persons",
    duration: "8 hours",
  },
  {
    id: 2,
    image: img1,
    name: "Cottage 2",
    price: "10,60.00",
    capacity: "5-10 persons",
    duration: "8 hours",
  },
  {
    id: 3,
    image: img1,
    name: "Cottage 3",
    price: "10,60.00",
    capacity: "5-10 persons",
    duration: "8 hours",
  },
  {
    id: 4,
    image: img1,
    name: "Cottage 4",
    price: "10,60.00",
    capacity: "5-10 persons",
    duration: "8 hours",
  },
  {
    id: 5,
    image: img1,
    name: "Cottage 5",
    price: "10,60.00",
    capacity: "5-10 persons",
    duration: "8 hours",
  },
];

//function Hall
export const dummyFunctionHall = [
  {
    id: 1,
    image: img1,
    name: "Function Hall 1 with Videoke",
    price: "4,240.00",
    capacity: "60-80 persons",
    duration: "8 hours",
  },
  {
    id: 2,
    image: img1,
    name: "Function Hall 2 with Videoke",
    price: "4,240.00",
    capacity: "60-80 persons",
    duration: "8 hours",
  },
];

//options admin
export const options = [
  { value: "mr", label: "Mr." },
  { value: "mrs", label: "Mrs." },
  { value: "ms", label: "Ms." },
  { value: "dr", label: "Dr." },
];

//amenities
export const amenities = [
  "Free Wifi",
  "Air-Conditioning",
  "Private Bathroom",
  "Flowing Hot Water",
  "TV",
  "1 Mini Pool",
  "1 Queen Sized Bed",
  "4 Pillows",
  "2 Blankets",
  "2 Towels",
];

export const roomInclusions = [
  "2 Complimentary Breakfast",
  "Liquid Soap",
  "Shampoo",
  "Towels",
  "Toothbrush and Toothpaste",
  "Toiletries",
];

//why choose us
export const offerToChoose = [
  {
    id: 1,
    image: images.first,
    title: "Relax in Nature’s Embrace",
    desc: "Nestled amid lush greenery and natural landscapes, our hot spring offers a peaceful escape from the hustle and bustle of daily life. Reconnect with nature while enjoying the soothing warmth of our mineral-rich waters.",
  },
  {
    id: 2,
    image: images.second,
    title: "Authentic Hot Spring Experience",
    desc: "Our pools are naturally heated and packed with therapeutic minerals that help relieve stress, improve circulation, and rejuvenate your body and mind — a true spa experience, straight from nature.",
  },
  {
    id: 3,
    image: images.third,
    title: "Comfort Meets Serenity",
    desc: "Whether you’re staying overnight or for a weekend getaway, our cozy rooms and private cottages provide modern comfort in a rustic, nature-inspired setting. Wake up to the sound of birds and fresh mountain air.",
  },
  {
    id: 4,
    image: images.fourth,
    title: "Perfect Venue for Every Occasion",
    desc: "From intimate gatherings to grand celebrations, our function halls and open spaces are ideal for weddings, corporate events, reunions, and family milestones — all surrounded by stunning natural scenery.",
  },
  {
    id: 5,
    image: images.fith,
    title: "Easy Reservations & Warm Hospitality",
    desc: "Booking your stay or event is simple through our online reservation system. Our friendly staff is always ready to assist you, ensuring every visit is smooth, relaxing, and memorable.",
  },
  {
    id: 6,
    image: images.sixth,
    title: "Eco-Friendly Commitment",
    desc: "We believe in preserving the beauty that surrounds us. Our resort practices sustainability through responsible waste management and eco-conscious operations — so you can unwind with peace of mind.",
  },
];
