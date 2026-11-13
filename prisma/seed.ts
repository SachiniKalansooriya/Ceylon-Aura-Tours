import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    12
  );

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@demo.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@demo.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });

  console.log("Admin user created");

  // Create sample destinations
  const destinations = [
    {
      name: "Sigiriya",
      slug: "sigiriya",
      description:
        "Sigiriya, also known as Lion Rock, is an ancient rock fortress and UNESCO World Heritage Site rising nearly 200 meters above the surrounding plains. Built in the 5th century by King Kashyapa, this architectural marvel features stunning frescoes, the famous Lion's Paw gateway, and breathtaking panoramic views from the summit.\n\nThe surrounding area includes beautiful gardens, ancient moats, and the Pidurangala Rock, which offers a spectacular view of Sigiriya itself. It's one of the most visited tourist destinations in Sri Lanka.",
      shortDesc: "Ancient rock fortress & UNESCO World Heritage Site",
      category: "Culture & Heritage",
      highlights: JSON.stringify([
        "UNESCO World Heritage Site",
        "Ancient frescoes & mirror wall",
        "Lion's Paw terrace",
        "Panoramic views from summit",
        "Water gardens & boulder gardens",
      ]),
      featured: true,
      sortOrder: 1,
    },
    {
      name: "Kandy",
      slug: "kandy",
      description:
        "Kandy is the cultural capital of Sri Lanka and home to the sacred Temple of the Tooth Relic (Sri Dalada Maligawa), which houses a tooth relic of the Buddha. This UNESCO World Heritage city is nestled among hills and surrounded by lush tea plantations.\n\nThe city offers a vibrant arts scene, traditional Kandyan dance performances, the beautiful Kandy Lake, the Royal Botanical Gardens at Peradeniya, and a bustling city market. Every August, the spectacular Esala Perahera festival fills the streets with decorated elephants, dancers, and drummers.",
      shortDesc: "Cultural capital & Temple of the Tooth",
      category: "Culture & Heritage",
      highlights: JSON.stringify([
        "Temple of the Tooth Relic",
        "Kandy Lake",
        "Royal Botanical Gardens",
        "Kandyan dance performances",
        "Esala Perahera festival",
      ]),
      featured: true,
      sortOrder: 2,
    },
    {
      name: "Ella",
      slug: "ella",
      description:
        "Ella is a small hill town in the central highlands of Sri Lanka, famous for its stunning natural beauty and laid-back atmosphere. Surrounded by tea plantations, waterfalls, and misty mountains, Ella is a paradise for hikers and nature lovers.\n\nKey attractions include the iconic Nine Arches Bridge, Ella Rock hike, Little Adam's Peak, Ravana Falls, and the scenic train ride from Kandy to Ella — widely regarded as one of the most beautiful train journeys in the world.",
      shortDesc: "Hill country paradise with scenic train rides",
      category: "Hills & Tea Country",
      highlights: JSON.stringify([
        "Nine Arches Bridge",
        "Ella Rock hike",
        "Little Adam's Peak",
        "Ravana Falls",
        "Scenic train ride from Kandy",
      ]),
      featured: true,
      sortOrder: 3,
    },
    {
      name: "Yala National Park",
      slug: "yala",
      description:
        "Yala National Park is Sri Lanka's most popular wildlife park and home to one of the highest leopard densities in the world. Located in the southeast, this vast park covers nearly 1,000 square kilometers of scrubland, forests, and lagoons.\n\nBesides leopards, Yala is home to elephants, sloth bears, crocodiles, wild boar, and over 200 bird species. Morning and afternoon safari jeep drives offer incredible wildlife encounters in a stunning natural setting.",
      shortDesc: "Highest leopard density in the world",
      category: "Wildlife & Safari",
      highlights: JSON.stringify([
        "Leopard sightings",
        "Elephant herds",
        "Sloth bears",
        "Over 200 bird species",
        "Morning & afternoon safaris",
      ]),
      featured: true,
      sortOrder: 4,
    },
    {
      name: "Galle",
      slug: "galle",
      description:
        "Galle is a historic coastal city on Sri Lanka's southwest tip, best known for its beautifully preserved 17th-century Dutch Fort — a UNESCO World Heritage Site. The fort area is a charming maze of cobblestone streets lined with colonial architecture, boutique shops, art galleries, and cafes.\n\nBeyond the fort, Galle offers stunning beaches, whale-watching opportunities (November to April), and serves as a gateway to the palm-fringed beaches of Unawatuna and Mirissa.",
      shortDesc: "Colonial fort & southern coast charm",
      category: "Forts & Towns",
      highlights: JSON.stringify([
        "UNESCO Dutch Fort",
        "Colonial architecture",
        "Boutique shops & galleries",
        "Nearby beaches",
        "Whale watching season",
      ]),
      featured: true,
      sortOrder: 5,
    },
    {
      name: "Mirissa",
      slug: "mirissa",
      description:
        "Mirissa is a dreamy beach town on Sri Lanka's southern coast, famous for its whale and dolphin watching, stunning sunsets, and relaxed surf-town vibe. The crescent-shaped Mirissa Beach is perfect for swimming, surfing, and simply lounging under palm trees.\n\nFrom November to April, Mirissa is one of the best places in the world to spot blue whales and sperm whales. The town also offers great seafood, nightlife at the beach bars, and the picturesque Coconut Tree Hill viewpoint.",
      shortDesc: "Whale watching & golden beaches",
      category: "Beaches & Ocean",
      highlights: JSON.stringify([
        "Blue whale watching",
        "Surfing & swimming",
        "Coconut Tree Hill",
        "Beach nightlife",
        "Fresh seafood",
      ]),
      featured: true,
      sortOrder: 6,
    },
    {
      name: "Nuwara Eliya",
      slug: "nuwara-eliya",
      description:
        "Known as 'Little England', Nuwara Eliya is a charming hill station surrounded by rolling tea plantations, manicured gardens, and colonial-era bungalows. At 1,868 meters above sea level, it offers a refreshing escape from the tropical lowland heat.\n\nVisit working tea factories to learn about Ceylon tea production, explore Hakgala Botanical Gardens, take a boat out on Gregory Lake, and enjoy the cool mountain air. The town comes alive during the April season with horse racing and flower shows.",
      shortDesc: "Tea country & colonial hill station",
      category: "Hills & Tea Country",
      highlights: JSON.stringify([
        "Tea plantation tours",
        "Gregory Lake",
        "Hakgala Botanical Gardens",
        "Colonial architecture",
        "Cool mountain climate",
      ]),
      sortOrder: 7,
    },
    {
      name: "Anuradhapura",
      slug: "anuradhapura",
      description:
        "Anuradhapura is one of the ancient capitals of Sri Lanka and a UNESCO World Heritage Site. Founded in the 4th century BC, it was the center of Theravada Buddhism for many centuries. The sacred city contains some of the oldest and most significant Buddhist monuments in the world.\n\nHighlights include the sacred Bodhi Tree (said to be grown from a branch of the tree under which Buddha attained enlightenment), massive stupas like Ruwanwelisaya and Jetavanaramaya, and ancient monasteries spread across the archaeological park.",
      shortDesc: "Ancient Buddhist capital & sacred city",
      category: "Culture & Heritage",
      highlights: JSON.stringify([
        "Sacred Bodhi Tree",
        "Ruwanwelisaya Stupa",
        "Jetavanaramaya",
        "Ancient monasteries",
        "UNESCO World Heritage Site",
      ]),
      sortOrder: 8,
    },
  ];

  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: dest,
      create: dest,
    });
  }

  console.log(`${destinations.length} destinations created`);

  // Create sample packages
  const packages = [
    {
      title: "5-Day Cultural Triangle Tour",
      slug: "5-day-cultural-triangle-tour",
      description:
        "Explore the heart of Sri Lanka's cultural heritage on this 5-day journey through the Cultural Triangle. Visit ancient cities, climb rock fortresses, and discover centuries-old temples — all with your private vehicle and experienced driver.\n\nThis tour takes you through the best of Sri Lanka's UNESCO World Heritage Sites while staying in comfortable hotels with breakfast included.",
      highlights: JSON.stringify([
        "Climb Sigiriya Rock Fortress",
        "Visit Temple of the Tooth in Kandy",
        "Explore Dambulla Cave Temple",
        "Ancient city of Polonnaruwa",
        "Scenic Kandy Lake walk",
        "Private vehicle throughout",
      ]),
      duration: "5 Days / 4 Nights",
      durationDays: 5,
      price: 320,
      priceLabel: "per person",
      destinations: JSON.stringify(["Sigiriya", "Kandy", "Anuradhapura"]),
      itinerary: JSON.stringify([
        { day: "1", title: "Airport to Sigiriya", description: "Airport pickup and transfer to Sigiriya. Evening at leisure. Overnight in Sigiriya." },
        { day: "2", title: "Sigiriya & Polonnaruwa", description: "Morning climb of Sigiriya Rock Fortress. Afternoon visit to the ancient city of Polonnaruwa. Overnight in Sigiriya." },
        { day: "3", title: "Dambulla & Kandy", description: "Visit Dambulla Cave Temple. Drive to Kandy via spice garden. Evening Kandyan dance show. Overnight in Kandy." },
        { day: "4", title: "Kandy Sightseeing", description: "Visit Temple of the Tooth, Royal Botanical Gardens at Peradeniya, and Kandy Lake. Overnight in Kandy." },
        { day: "5", title: "Departure", description: "Transfer to Colombo airport or your next destination." },
      ]),
      inclusions: JSON.stringify([
        "Private air-conditioned vehicle",
        "English-speaking driver",
        "4 nights hotel accommodation",
        "Daily breakfast",
        "All highway tolls & parking",
      ]),
      exclusions: JSON.stringify([
        "Entrance tickets to sites",
        "Lunch & dinner",
        "Personal expenses",
        "Tips for driver",
        "Travel insurance",
      ]),
      featured: true,
      sortOrder: 1,
    },
    {
      title: "7-Day Complete Sri Lanka",
      slug: "7-day-complete-sri-lanka",
      description:
        "The ultimate Sri Lanka experience in one week. This tour combines ancient temples, wildlife safaris, scenic hill country, and stunning beaches into a perfectly paced itinerary.\n\nFrom the cultural treasures of the north-central plains to the golden beaches of the south coast, you'll see the very best of what this incredible island has to offer.",
      highlights: JSON.stringify([
        "Sigiriya Rock Fortress",
        "Wildlife safari in Yala",
        "Scenic train ride to Ella",
        "Nine Arches Bridge",
        "Galle Fort walk",
        "Mirissa beach time",
        "Tea plantation visit",
      ]),
      duration: "7 Days / 6 Nights",
      durationDays: 7,
      price: 550,
      priceLabel: "per person",
      destinations: JSON.stringify(["Sigiriya", "Kandy", "Ella", "Yala", "Galle", "Mirissa"]),
      itinerary: JSON.stringify([
        { day: "1", title: "Arrival", description: "Airport pickup, transfer to Sigiriya. Overnight in Sigiriya." },
        { day: "2", title: "Sigiriya & Dambulla", description: "Climb Sigiriya, visit Dambulla Cave Temple. Overnight in Sigiriya." },
        { day: "3", title: "Kandy", description: "Drive to Kandy. Temple of the Tooth, botanical gardens. Overnight in Kandy." },
        { day: "4", title: "Train to Ella", description: "Scenic train ride to Ella. Evening at leisure. Overnight in Ella." },
        { day: "5", title: "Ella Sightseeing", description: "Nine Arches Bridge, Little Adam's Peak, Ravana Falls. Drive to Yala area. Overnight near Yala." },
        { day: "6", title: "Yala Safari & South Coast", description: "Morning safari in Yala. Afternoon drive to Galle/Mirissa via coast. Overnight in Mirissa." },
        { day: "7", title: "Galle & Departure", description: "Morning at Galle Fort. Transfer to airport." },
      ]),
      inclusions: JSON.stringify([
        "Private air-conditioned vehicle",
        "English-speaking driver",
        "6 nights hotel accommodation",
        "Daily breakfast",
        "Yala safari jeep (shared)",
        "Train tickets (2nd class reserved)",
      ]),
      exclusions: JSON.stringify([
        "Entrance tickets",
        "Lunch & dinner",
        "Personal expenses",
        "Tips",
        "Travel insurance",
      ]),
      featured: true,
      sortOrder: 2,
    },
    {
      title: "3-Day Beach & Wildlife Escape",
      slug: "3-day-beach-wildlife-escape",
      description:
        "A short but incredible getaway combining Sri Lanka's best wildlife and beaches. Perfect for those with limited time who want to experience both a thrilling safari and pristine southern beaches.\n\nSpot leopards and elephants in Yala National Park, then unwind on the golden sands of Mirissa with a chance to see blue whales (seasonal).",
      highlights: JSON.stringify([
        "Yala National Park safari",
        "Leopard & elephant spotting",
        "Mirissa beach relaxation",
        "Whale watching (seasonal)",
        "Galle Fort visit",
      ]),
      duration: "3 Days / 2 Nights",
      durationDays: 3,
      price: 195,
      priceLabel: "per person",
      destinations: JSON.stringify(["Yala", "Mirissa", "Galle"]),
      itinerary: JSON.stringify([
        { day: "1", title: "Transfer to Yala", description: "Pickup from Colombo/airport. Drive to Yala area. Afternoon safari in Yala National Park. Overnight near Yala." },
        { day: "2", title: "Beach Day", description: "Morning at leisure or optional second safari. Drive to Mirissa. Beach afternoon. Overnight in Mirissa." },
        { day: "3", title: "Galle & Departure", description: "Optional whale watching (seasonal). Visit Galle Fort. Transfer to airport." },
      ]),
      inclusions: JSON.stringify([
        "Private vehicle",
        "English-speaking driver",
        "2 nights accommodation",
        "Daily breakfast",
        "One Yala safari jeep",
      ]),
      exclusions: JSON.stringify([
        "Yala entrance ticket",
        "Whale watching boat",
        "Meals (except breakfast)",
        "Personal expenses",
      ]),
      featured: true,
      sortOrder: 3,
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }

  console.log(`${packages.length} packages created`);
  console.log("\nSeed complete!");
  console.log(`Admin login: ${process.env.ADMIN_EMAIL || "admin@demo.com"} / ${process.env.ADMIN_PASSWORD || "admin123"}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
