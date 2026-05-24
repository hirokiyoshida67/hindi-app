// India Trivia — seed deck for the Coffee Break feature.
// Loaded into localStorage once on first run (see seedTrivia in lib/storage.js).
// After seeding, the user fully owns the trivia store and can edit/delete via UI.

export const indiaTrivia = [
  {
    question: 'Who is the actor who played the main character in the movie "3 Idiots"?',
    choices: ['Shah Rukh Khan', 'Aamir Khan', 'Salman Khan', 'Hrithik Roshan', 'Ranbir Kapoor'],
    correctIndex: 1,
    explanation: 'Aamir Khan starred as Rancho in the 2009 hit "3 Idiots", directed by Rajkumar Hirani.',
  },
  {
    question: 'Who is the author who wrote the book "Q & A" that later became the Bollywood movie "Slumdog Millionaire"?',
    choices: ['Chetan Bhagat', 'Aravind Adiga', 'Vikas Swarup', 'Amish Tripathi', 'Vikram Seth'],
    correctIndex: 2,
    explanation: 'Vikas Swarup, an Indian diplomat, published "Q & A" in 2005. The film adaptation won 8 Academy Awards in 2009.',
  },
  {
    question: 'What is the common feature between Hindi and Japanese languages?',
    choices: [
      'SOV structure is the same',
      'Pronunciation is similar',
      'Linguistic group is the same',
      'They use the same writing system',
      'Both are tonal languages',
    ],
    correctIndex: 0,
    explanation: 'Both languages share Subject-Object-Verb (SOV) word order, unlike English which is SVO.',
  },
  {
    question: 'Who built the Red Fort in Delhi?',
    choices: ['Akbar', 'Babur', 'Shah Jahan', 'Aurangzeb', 'Humayun'],
    correctIndex: 2,
    explanation: 'Shah Jahan commissioned the Red Fort (Lal Qila) in 1638 as his new capital, Shahjahanabad. He also built the Taj Mahal.',
  },
  {
    question: 'Which state/territory is Chandigarh the capital of?',
    choices: ['Haryana', 'Punjab', 'Himachal Pradesh', 'Both Punjab and Haryana', 'Delhi'],
    correctIndex: 3,
    explanation: 'Chandigarh is a Union Territory and serves as the shared capital of both Punjab and Haryana states.',
  },
  {
    question: 'In which state is Agra located?',
    choices: ['Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Haryana', 'Bihar'],
    correctIndex: 2,
    explanation: 'Agra, home of the Taj Mahal, is in Uttar Pradesh in northern India.',
  },
  {
    question: 'In which state is Bengaluru (Bangalore) located?',
    choices: ['Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Karnataka', 'Telangana'],
    correctIndex: 3,
    explanation: 'Bengaluru is the capital of Karnataka and India’s tech hub.',
  },
  {
    question: 'In which state was Sundar Pichai (Google CEO) born?',
    choices: ['Karnataka', 'Kerala', 'Andhra Pradesh', 'Tamil Nadu', 'Maharashtra'],
    correctIndex: 3,
    explanation: 'Sundar Pichai was born in Madurai, Tamil Nadu in 1972.',
  },
  {
    question: 'Which city is the capital of Telangana state?',
    choices: ['Visakhapatnam', 'Vijayawada', 'Hyderabad', 'Warangal', 'Karimnagar'],
    correctIndex: 2,
    explanation: 'Hyderabad is the capital of Telangana, formed in 2014 when it split from Andhra Pradesh.',
  },
  {
    question: 'In which state is the city of Ahmedabad located?',
    choices: ['Rajasthan', 'Maharashtra', 'Gujarat', 'Madhya Pradesh', 'Karnataka'],
    correctIndex: 2,
    explanation: 'Ahmedabad is the largest city in Gujarat and was Mahatma Gandhi’s base for the independence movement.',
  },
  {
    question: 'In which state is Mumbai (formerly Bombay) located?',
    choices: ['Gujarat', 'Maharashtra', 'Goa', 'Karnataka', 'Madhya Pradesh'],
    correctIndex: 1,
    explanation: 'Mumbai is the capital of Maharashtra and India’s financial center.',
  },
  {
    question: 'Which beach destination in western India is known for Portuguese influence?',
    choices: ['Mumbai', 'Kerala', 'Goa', 'Daman', 'Pondicherry'],
    correctIndex: 2,
    explanation: 'Goa was a Portuguese colony for over 450 years until 1961; its architecture, food, and Catholic heritage reflect this.',
  },
  {
    question: 'In which state is Kolkata (formerly Calcutta) located?',
    choices: ['Bihar', 'Odisha', 'Jharkhand', 'West Bengal', 'Assam'],
    correctIndex: 3,
    explanation: 'Kolkata is the capital of West Bengal and was the capital of British India until 1911.',
  },
  {
    question: 'Which state is famous for Darjeeling Tea?',
    choices: ['Assam', 'Kerala', 'West Bengal', 'Sikkim', 'Himachal Pradesh'],
    correctIndex: 2,
    explanation: 'Darjeeling, in the northern hills of West Bengal, produces world-renowned tea often called the "Champagne of Teas".',
  },
  {
    question: 'In which state is Bodh Gaya (the place of Buddha’s enlightenment) located?',
    choices: ['Uttar Pradesh', 'Bihar', 'West Bengal', 'Madhya Pradesh', 'Jharkhand'],
    correctIndex: 1,
    explanation: 'Bodh Gaya, in Bihar, is where Siddhartha Gautama attained enlightenment under the Bodhi Tree.',
  },
  {
    question: 'What is the main spice that gives Indian chai (tea) its distinctive flavor?',
    choices: ['Cinnamon', 'Ginger', 'Cardamom', 'Cloves', 'Star anise'],
    correctIndex: 2,
    explanation: 'Cardamom (elaichi) is the signature spice of masala chai, though ginger, cinnamon, and cloves are common companions.',
  },
  {
    question: 'Which sweet dessert is often served at Indian celebrations and festivals?',
    choices: ['Gulab Jamun', 'Tiramisu', 'Cheesecake', 'Mochi', 'Baklava'],
    correctIndex: 0,
    explanation: 'Gulab Jamun — deep-fried milk-solid balls in rose-flavored sugar syrup — is a festival staple across India.',
  },
];

// Additional question batches added after the initial seed.
// Each batch should be seeded with its OWN flag in main.jsx so existing users
// pick up new batches without re-receiving (or duplicating) older ones.

export const indiaTriviaImages = [
  {
    question: 'Which state is this? (highlighted in orange)',
    image: '/Tamilnadu.png',
    choices: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana'],
    correctIndex: 1,
    explanation: 'Tamil Nadu sits at the southern tip of India, with Chennai as its capital. Famous for Dravidian temples, classical Tamil literature, and Bharatanatyam dance.',
  },
];

export const indiaTriviaImagesV2 = [
  {
    question: 'Which state is this? (highlighted in orange)',
    image: '/Rajasthan.png',
    choices: ['Gujarat', 'Rajasthan', 'Punjab', 'Madhya Pradesh', 'Haryana'],
    correctIndex: 1,
    explanation: 'Rajasthan is India\'s largest state by area, in the northwest, bordering Pakistan. Capital: Jaipur. Famous for the Thar Desert, forts, and palaces.',
  },
  {
    question: 'Which state is this? (highlighted in orange)',
    image: '/Bihar.png',
    choices: ['Uttar Pradesh', 'Jharkhand', 'Bihar', 'West Bengal', 'Odisha'],
    correctIndex: 2,
    explanation: 'Bihar lies in the eastern Gangetic plain with Patna as its capital. Birthplace of Buddhism and Jainism, and home to Bodh Gaya and the ancient Nalanda University.',
  },
  {
    question: 'Which state is this? (highlighted in orange)',
    image: '/Maharashtra.png',
    choices: ['Gujarat', 'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Telangana'],
    correctIndex: 3,
    explanation: 'Maharashtra occupies the west-central Deccan plateau. Its capital is Mumbai — India\'s financial center and home to Bollywood.',
  },
];

export const indiaTriviaImagesV3 = [
  {
    question: 'What South Indian dish is this?',
    image: '/Idli.png',
    choices: ['Dosa', 'Idli', 'Vada', 'Appam', 'Uttapam'],
    correctIndex: 1,
    explanation: 'Idli (इडली) — steamed savory cakes made from fermented rice and lentil batter, served with chutneys and sambar. A staple South Indian breakfast.',
  },
  {
    question: 'What South Indian dishes are shown here?',
    image: '/Sambar.png',
    choices: [
      'Idli and Sambar',
      'Vada and Sambar',
      'Dosa and Sambar',
      'Uttapam and Chutney',
      'Roti and Dal',
    ],
    correctIndex: 2,
    explanation: 'Dosa and Sambar (डोसा और सांबर) — a thin, crispy fermented rice-and-lentil crepe served with a spiced lentil-vegetable stew. The classic South Indian combo, usually accompanied by chutneys.',
  },
];

// Batches are seeded once each, in order. Adding a new batch later: append
// a new { flagKey, items } entry — existing users will get only the new batch.
export const triviaBatches = [
  { flagKey: 'india-v1',           items: indiaTrivia },
  { flagKey: 'india-images-v1',    items: indiaTriviaImages },
  { flagKey: 'india-images-v2',    items: indiaTriviaImagesV2 },
  { flagKey: 'india-images-v3',    items: indiaTriviaImagesV3 },
];
