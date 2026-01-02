import mongoose from "mongoose";
import dotenv from "dotenv";
import Plant from "../models/Plant.js";

dotenv.config();

const plants = [
  {
    name: "Tulsi (Holy Basil)",
    botanicalName: "Ocimum sanctum",
    family: "Lamiaceae",
    localNames: ["Tulsi", "Tulasi", "Holy Basil", "Sacred Basil"],
    ayushSystem: "Ayurveda",
    category: "Herb",
    gardenZone: "Ayurvedic Zone",
    shortInsight: "Revered as the 'Queen of Herbs', Tulsi is a sacred plant in India known for its powerful immune-boosting and respiratory healing properties.",
    description: "Tulsi, also known as Holy Basil or Ocimum sanctum, is an aromatic perennial plant native to the Indian subcontinent. It holds a sacred place in Hindu culture and Ayurvedic medicine. The plant has green or purple leaves with a strong, pleasant aroma. Tulsi is considered an adaptogen, helping the body adapt to stress and maintain homeostasis. It has been used for thousands of years in traditional medicine to treat various ailments, from common colds to chronic conditions.",
    culturalSignificance: "Tulsi is considered the most sacred plant in Hinduism and is often grown in courtyards and temples. It is believed to be an incarnation of the goddess Lakshmi and is worshipped daily in many Indian households. The plant is associated with purity, protection, and spiritual enlightenment.",
    medicinalUses: [
      "Strengthens immune system",
      "Treats respiratory disorders like asthma, bronchitis, and cough",
      "Reduces stress and anxiety",
      "Lowers blood sugar levels",
      "Fights bacterial and viral infections",
      "Improves skin health",
      "Relieves fever and common cold",
      "Supports cardiovascular health"
    ],
    traditionallyUsedFor: ["cough", "cold", "fever", "asthma", "bronchitis", "diabetes", "stress", "anxiety", "immunity"],
    partsUsed: ["Leaves", "Seeds", "Root"],
    partsUsageDetail: "Fresh or dried leaves are most commonly used. The leaves can be chewed raw, made into tea, or used in decoctions. Seeds are used for urinary disorders, and roots are used in specific formulations.",
    procedure: "For common cold: Take 10-15 fresh Tulsi leaves, wash them, and boil in 2 cups of water for 10 minutes. Add a pinch of black pepper and ginger. Strain and drink warm twice daily. For immunity: Chew 4-5 fresh leaves every morning on an empty stomach.",
    safetyNotes: "Generally safe for most people. Pregnant and breastfeeding women should consult a doctor. May interact with blood-thinning medications.",
    habitat: "Tropical and subtropical regions, well-drained soil, full sunlight",
    growthConditions: "Requires warm climate, regular watering, and well-drained soil. Grows best in temperatures between 20-30°C.",
    distribution: "Native to India, now cultivated throughout Southeast Asia, Australia, and parts of Africa",
    season: "Year-round in tropical climates, best growth in monsoon and post-monsoon seasons",
    image: "/uploads/plants/tulsi.jpg",
    additionalImages: []
  },
  {
    name: "Ashwagandha",
    botanicalName: "Withania somnifera",
    family: "Solanaceae",
    localNames: ["Ashwagandha", "Indian Winter Cherry", "Indian Ginseng", "Aswagandha"],
    ayushSystem: "Ayurveda",
    category: "Herb",
    gardenZone: "Ayurvedic Zone",
    shortInsight: "A powerful adaptogenic herb known as 'Indian Ginseng', Ashwagandha helps the body manage stress, enhances stamina, and improves overall vitality.",
    description: "Ashwagandha, scientifically known as Withania somnifera, is a small woody shrub native to India, the Middle East, and parts of Africa. The name 'Ashwagandha' means 'smell of horse' in Sanskrit, referring to its unique odor and the belief that consuming it gives the strength of a horse. This adaptogenic herb has been used in Ayurvedic medicine for over 3,000 years. It's classified as a 'rasayana' herb, meaning it promotes longevity and rejuvenation.",
    culturalSignificance: "Ashwagandha is highly valued in Ayurveda as a 'rasayana' (rejuvenator) and is mentioned in ancient texts like Charaka Samhita. It's considered a gift from nature for maintaining youth and vitality. The plant is often associated with strength, stamina, and virility.",
    medicinalUses: [
      "Reduces stress and anxiety",
      "Improves cognitive function and memory",
      "Enhances physical strength and stamina",
      "Boosts immune system",
      "Improves sleep quality",
      "Supports thyroid function",
      "Reduces inflammation",
      "Improves fertility and reproductive health",
      "Helps manage blood sugar levels",
      "Supports muscle growth and recovery"
    ],
    traditionallyUsedFor: ["stress", "anxiety", "fatigue", "weakness", "memory", "insomnia", "arthritis", "diabetes", "infertility", "immunity"],
    partsUsed: ["Root", "Leaves", "Fruits"],
    partsUsageDetail: "The root is the most commonly used part, typically dried and powdered. Leaves and fruits are also used in specific formulations. Root powder is often mixed with milk or ghee.",
    procedure: "Traditional preparation: Mix 1-2 grams of Ashwagandha root powder with warm milk and a teaspoon of honey. Take once or twice daily, preferably in the morning and evening. For stress relief, it's best taken before bedtime. Can also be taken with ghee for enhanced absorption.",
    safetyNotes: "Generally safe when taken in recommended doses. Avoid during pregnancy and breastfeeding. May interact with immunosuppressants, sedatives, and thyroid medications. Consult a doctor if you have autoimmune conditions.",
    habitat: "Dry regions, rocky soil, subtropical areas",
    growthConditions: "Thrives in dry, stony soil with good drainage. Requires full sunlight and minimal water. Grows well in temperatures between 20-35°C.",
    distribution: "Native to India, Pakistan, and Sri Lanka. Also found in parts of Africa and the Mediterranean region.",
    season: "Flowers in late winter to early spring, roots harvested in autumn",
    image: "/uploads/plants/ashwagandha.jpg",
    additionalImages: []
  },
  {
    name: "Neem",
    botanicalName: "Azadirachta indica",
    family: "Meliaceae",
    localNames: ["Neem", "Nimba", "Indian Lilac", "Margosa"],
    ayushSystem: "Ayurveda",
    category: "Tree",
    gardenZone: "Ayurvedic Zone",
    shortInsight: "Known as the 'Village Pharmacy', Neem is one of the most versatile medicinal trees, with every part offering therapeutic benefits.",
    description: "Neem, or Azadirachta indica, is an evergreen tree native to the Indian subcontinent. It's often called the 'Village Pharmacy' because every part of the tree - leaves, bark, seeds, flowers, and fruits - has medicinal properties. The tree can grow up to 15-20 meters tall and has a dense, rounded crown. Neem has been used in Ayurvedic medicine for over 4,500 years and is mentioned in ancient Sanskrit texts. It's known for its bitter taste and strong medicinal properties.",
    culturalSignificance: "Neem is considered sacred in many parts of India. It's often planted near homes for its purifying properties. In some regions, Neem leaves are used in religious ceremonies and festivals. The tree is also associated with the goddess Shitala, who protects against diseases.",
    medicinalUses: [
      "Purifies blood",
      "Treats skin disorders like acne, eczema, and psoriasis",
      "Fights bacterial and fungal infections",
      "Supports oral health",
      "Helps manage diabetes",
      "Boosts immune system",
      "Acts as an anti-inflammatory",
      "Treats digestive disorders",
      "Repels insects naturally",
      "Supports liver health"
    ],
    traditionallyUsedFor: ["skin problems", "diabetes", "fever", "infection", "digestion", "oral health", "immunity", "inflammation"],
    partsUsed: ["Leaves", "Bark", "Seeds", "Flowers", "Fruits", "Oil"],
    partsUsageDetail: "Leaves are used fresh or dried for teas and pastes. Bark is used in decoctions. Neem oil extracted from seeds is used topically. Flowers are used in specific formulations. Each part has distinct therapeutic properties.",
    procedure: "For skin issues: Crush fresh Neem leaves into a paste and apply to affected areas. For internal use: Boil 10-15 Neem leaves in 2 cups of water until reduced to half. Strain and drink once daily. For oral health: Chew 2-3 fresh Neem twigs daily or use Neem-based toothpaste.",
    safetyNotes: "Neem oil should not be consumed internally. Pregnant women should avoid Neem. May cause allergic reactions in some people. Long-term internal use should be supervised by a qualified practitioner.",
    habitat: "Tropical and semi-tropical regions, well-drained soil",
    growthConditions: "Thrives in hot, dry climates. Requires full sunlight and minimal water once established. Grows in various soil types but prefers well-drained soil.",
    distribution: "Native to India, Myanmar, and Bangladesh. Now cultivated in many tropical countries including Africa, Australia, and parts of the Americas.",
    season: "Flowers in spring, fruits in summer. Leaves available year-round in tropical regions.",
    image: "/uploads/plants/neem.jpg",
    additionalImages: []
  },
  {
    name: "Turmeric",
    botanicalName: "Curcuma longa",
    family: "Zingiberaceae",
    localNames: ["Turmeric", "Haldi", "Haridra", "Yellow Root"],
    ayushSystem: "Ayurveda",
    category: "Herb",
    gardenZone: "Medicinal Herbs Zone",
    shortInsight: "The 'Golden Spice' of India, Turmeric is celebrated worldwide for its powerful anti-inflammatory and antioxidant properties.",
    description: "Turmeric, scientifically known as Curcuma longa, is a flowering plant of the ginger family native to the Indian subcontinent and Southeast Asia. The plant's rhizomes (underground stems) are harvested, dried, and ground into the bright yellow-orange powder we know as turmeric. It has been used for over 4,000 years in Ayurvedic medicine and is a staple in Indian cuisine. The active compound curcumin gives turmeric its distinctive color and most of its medicinal properties.",
    culturalSignificance: "Turmeric holds great cultural significance in India. It's used in religious ceremonies, weddings, and festivals. The yellow color is considered auspicious. In Hindu weddings, turmeric paste is applied to the bride and groom as part of the pre-wedding rituals. It's also used as a natural dye for clothing.",
    medicinalUses: [
      "Reduces inflammation and joint pain",
      "Boosts immune system",
      "Supports liver function",
      "Improves digestion",
      "Enhances skin health",
      "Helps manage arthritis",
      "Supports brain health",
      "May help prevent cancer",
      "Improves heart health",
      "Aids in wound healing"
    ],
    traditionallyUsedFor: ["inflammation", "arthritis", "digestion", "liver", "skin", "immunity", "wounds", "cough", "cold"],
    partsUsed: ["Rhizome", "Leaves"],
    partsUsageDetail: "The rhizome (root) is the primary part used, either fresh or dried and powdered. Fresh turmeric can be juiced or made into paste. Turmeric leaves are sometimes used in cooking and for wrapping food.",
    procedure: "Golden Milk: Mix 1 teaspoon of turmeric powder with warm milk, add a pinch of black pepper (enhances curcumin absorption), and a little honey. Drink before bedtime. For inflammation: Take 500-1000mg of turmeric powder with meals. For wounds: Apply turmeric paste (turmeric + water) directly to the wound.",
    safetyNotes: "Generally safe when used as a spice in food. High doses may cause stomach upset. May interact with blood-thinning medications. People with gallstones should consult a doctor. Black pepper enhances absorption of curcumin.",
    habitat: "Tropical and subtropical regions, well-drained loamy soil",
    growthConditions: "Requires warm, humid climate with temperatures between 20-30°C. Needs regular rainfall or irrigation. Grows best in well-drained, fertile soil with good organic matter.",
    distribution: "Native to India and Southeast Asia. Major producers include India, China, and other tropical Asian countries.",
    season: "Planted in spring, harvested 7-10 months later in winter. Best quality turmeric comes from winter harvest.",
    image: "/uploads/plants/turmeric.jpg",
    additionalImages: []
  },
  {
    name: "Brahmi",
    botanicalName: "Bacopa monnieri",
    family: "Plantaginaceae",
    localNames: ["Brahmi", "Water Hyssop", "Herb of Grace", "Jal Brahmi"],
    ayushSystem: "Ayurveda",
    category: "Herb",
    gardenZone: "Medicinal Herbs Zone",
    shortInsight: "The 'Brain Tonic' of Ayurveda, Brahmi is renowned for enhancing memory, cognitive function, and mental clarity.",
    description: "Brahmi, scientifically known as Bacopa monnieri, is a perennial, creeping herb native to the wetlands of southern and Eastern India, Australia, Europe, Africa, and Asia. The name 'Brahmi' is derived from 'Brahma', the Hindu god of creation, reflecting its reputation for enhancing creativity and intelligence. This small, succulent herb grows in marshy areas and has been used in Ayurvedic medicine for over 3,000 years as a brain tonic and memory enhancer.",
    culturalSignificance: "Brahmi is highly revered in Ayurveda as a 'medhya rasayana' - a herb that enhances intellect and memory. It's associated with the goddess Saraswati, the deity of knowledge and learning. Students and scholars have traditionally used Brahmi to improve learning and retention.",
    medicinalUses: [
      "Enhances memory and cognitive function",
      "Reduces anxiety and stress",
      "Improves focus and concentration",
      "Supports brain health and neuroprotection",
      "Helps manage ADHD symptoms",
      "Reduces inflammation",
      "Supports digestive health",
      "May help with epilepsy",
      "Improves sleep quality",
      "Acts as an antioxidant"
    ],
    traditionallyUsedFor: ["memory", "anxiety", "stress", "focus", "ADHD", "epilepsy", "insomnia", "digestion"],
    partsUsed: ["Whole Plant", "Leaves"],
    partsUsageDetail: "The entire plant is used, but leaves are most commonly utilized. Can be consumed fresh, as juice, powder, or in medicated ghee (Brahmi Ghrita). The plant is often processed to extract active compounds.",
    procedure: "Fresh juice: Extract juice from fresh Brahmi leaves (10-15 leaves), mix with equal parts water, and drink on an empty stomach in the morning. Powder: Take 300-500mg of Brahmi powder with warm water or milk twice daily. Brahmi Ghrita: 1-2 teaspoons with warm milk before bedtime for enhanced memory.",
    safetyNotes: "Generally safe when taken in recommended doses. May cause nausea, stomach cramps, or dry mouth in some people. Pregnant and breastfeeding women should consult a doctor. May interact with medications for Alzheimer's, thyroid, and sedatives.",
    habitat: "Wetlands, marshy areas, edges of ponds and streams",
    growthConditions: "Requires consistently moist or wet soil. Grows best in partial shade to full sun. Thrives in temperatures between 20-30°C. Can grow in water or very wet soil.",
    distribution: "Native to India, now found in tropical and subtropical regions worldwide including Southeast Asia, Australia, and parts of the Americas",
    season: "Grows year-round in tropical climates, best growth during monsoon season",
    image: "/uploads/plants/brahmi.jpg",
    additionalImages: []
  },
  {
    name: "Giloy (Guduchi)",
    botanicalName: "Tinospora cordifolia",
    family: "Menispermaceae",
    localNames: ["Giloy", "Guduchi", "Amrita", "Heavenly Elixir", "Indian Tinospora"],
    ayushSystem: "Ayurveda",
    category: "Herb",
    gardenZone: "Medicinal Herbs Zone",
    shortInsight: "Known as 'Amrita' (nectar of immortality), Giloy is a powerful immunomodulator that boosts immunity and fights infections.",
    description: "Giloy, scientifically known as Tinospora cordifolia, is a herbaceous vine native to the tropical regions of India, Myanmar, and Sri Lanka. The name 'Guduchi' means 'one that protects the body', and 'Amrita' means 'nectar of immortality', reflecting its reputation as a powerful rejuvenating herb. This climbing shrub has heart-shaped leaves and is often found growing on other trees. It's been used in Ayurvedic medicine for over 2,000 years and gained significant attention during recent times for its immune-boosting properties.",
    culturalSignificance: "Giloy is mentioned in ancient Ayurvedic texts as a 'rasayana' (rejuvenator) and is considered one of the most important herbs in Ayurveda. It's associated with longevity and vitality. The plant is often called 'Amrita' because of its life-giving properties.",
    medicinalUses: [
      "Boosts immune system",
      "Reduces fever",
      "Helps manage diabetes",
      "Improves digestion",
      "Reduces inflammation",
      "Supports liver health",
      "Treats respiratory infections",
      "Reduces stress and anxiety",
      "Improves skin health",
      "Acts as an antioxidant"
    ],
    traditionallyUsedFor: ["fever", "immunity", "diabetes", "digestion", "liver", "cough", "cold", "infection", "inflammation"],
    partsUsed: ["Stem", "Leaves", "Root"],
    partsUsageDetail: "The stem is the most commonly used part, either fresh or dried. Fresh stems can be juiced, while dried stems are used in powders and decoctions. Leaves are also used in some formulations.",
    procedure: "Fresh juice: Extract juice from fresh Giloy stems (2-3 inches), mix with water, and drink on an empty stomach. Decoction: Boil 10-15 grams of dried Giloy stem in 2 cups of water until reduced to half. Strain and drink twice daily. For fever: Take Giloy juice with Tulsi leaves for enhanced effect.",
    safetyNotes: "Generally safe when taken in recommended doses. May cause constipation in some people. People with autoimmune diseases should use with caution. May lower blood sugar, so monitor if taking diabetes medications.",
    habitat: "Tropical forests, climbs on trees, well-drained soil",
    growthConditions: "Grows as a climbing vine, requires support. Thrives in tropical climate with good rainfall. Prefers partial shade to full sun. Grows well in temperatures between 20-35°C.",
    distribution: "Native to India, Myanmar, and Sri Lanka. Found throughout tropical regions of Asia.",
    season: "Grows year-round in tropical climates, best growth during monsoon season",
    image: "/uploads/plants/giloy.jpg",
    additionalImages: []
  },
  {
    name: "Amla (Indian Gooseberry)",
    botanicalName: "Phyllanthus emblica",
    family: "Phyllanthaceae",
    localNames: ["Amla", "Amlaki", "Indian Gooseberry", "Amlaki", "Nellikai"],
    ayushSystem: "Ayurveda",
    category: "Tree",
    gardenZone: "Ayurvedic Zone",
    shortInsight: "The 'Superfruit' of Ayurveda, Amla is one of the richest natural sources of Vitamin C and a powerful antioxidant.",
    description: "Amla, or Indian Gooseberry (Phyllanthus emblica), is a deciduous tree native to India and Southeast Asia. The small, round, greenish-yellow fruits are extremely sour and astringent but are packed with nutrients. Amla is considered one of the most important fruits in Ayurveda and is a key ingredient in the famous 'Triphala' formulation. The tree can grow up to 18 meters tall and produces fruits that are rich in Vitamin C, antioxidants, and various phytochemicals.",
    culturalSignificance: "Amla is considered sacred in Hinduism and is associated with the goddess Lakshmi. The tree is often planted in temple courtyards. In Ayurveda, Amla is called 'Amalaki' and is considered a 'rasayana' (rejuvenator). It's one of the three fruits in Triphala, one of the most important Ayurvedic formulations.",
    medicinalUses: [
      "Rich source of Vitamin C",
      "Powerful antioxidant",
      "Boosts immune system",
      "Improves digestion",
      "Supports liver health",
      "Enhances hair health",
      "Improves skin complexion",
      "Helps manage diabetes",
      "Supports heart health",
      "Improves eyesight"
    ],
    traditionallyUsedFor: ["immunity", "digestion", "hair", "skin", "diabetes", "cough", "cold", "liver", "eyesight"],
    partsUsed: ["Fruit", "Leaves", "Bark", "Seeds"],
    partsUsageDetail: "The fruit is most commonly used - can be consumed fresh, dried, pickled, or as powder. Amla juice is very popular. Dried fruit (Amalaki) is used in many Ayurvedic formulations. Leaves and bark are used in specific treatments.",
    procedure: "Fresh fruit: Eat 1-2 fresh Amla fruits daily on an empty stomach (very sour, may need to acquire taste). Amla juice: Mix 20-30ml of fresh Amla juice with water and honey, drink in the morning. Amla powder: Take 1-2 grams of dried Amla powder with warm water or milk. For hair: Apply Amla oil to scalp regularly.",
    safetyNotes: "Generally safe when consumed in food amounts. High doses may cause stomach upset due to acidity. People with hyperacidity should consume with caution. Very sour taste may not be palatable for everyone.",
    habitat: "Subtropical and tropical regions, well-drained soil",
    growthConditions: "Requires warm climate with good rainfall. Grows in various soil types but prefers well-drained loamy soil. Needs full sunlight. Grows well in temperatures between 15-35°C.",
    distribution: "Native to India and Southeast Asia. Cultivated in tropical and subtropical regions worldwide.",
    season: "Fruits ripen in late autumn to early winter (October-December). Best quality fruits are harvested in winter.",
    image: "/uploads/plants/amla.jpg",
    additionalImages: []
  },
  {
    name: "Shatavari",
    botanicalName: "Asparagus racemosus",
    family: "Asparagaceae",
    localNames: ["Shatavari", "Shatmuli", "Wild Asparagus", "Hundred Roots"],
    ayushSystem: "Ayurveda",
    category: "Herb",
    gardenZone: "Medicinal Herbs Zone",
    shortInsight: "The 'Queen of Herbs' for women's health, Shatavari is renowned for supporting female reproductive health and hormonal balance.",
    description: "Shatavari, scientifically known as Asparagus racemosus, is a climbing plant native to India, Sri Lanka, and the Himalayas. The name 'Shatavari' means 'one who possesses a hundred husbands' or 'having a hundred roots', referring to its tuberous root system and its traditional use as a female reproductive tonic. This perennial herb has been used in Ayurvedic medicine for over 2,000 years, primarily for women's health issues, though it benefits both men and women.",
    culturalSignificance: "Shatavari is highly valued in Ayurveda as a 'rasayana' (rejuvenator) and is considered the primary herb for female reproductive health. It's associated with fertility, motherhood, and nurturing qualities. The plant is often called the 'Queen of Herbs' for women.",
    medicinalUses: [
      "Supports female reproductive health",
      "Enhances lactation in nursing mothers",
      "Balances hormones",
      "Improves fertility",
      "Supports digestive health",
      "Boosts immune system",
      "Reduces inflammation",
      "Acts as an adaptogen",
      "Supports respiratory health",
      "Improves libido"
    ],
    traditionallyUsedFor: ["fertility", "lactation", "hormones", "menopause", "digestion", "immunity", "cough", "libido"],
    partsUsed: ["Root", "Leaves"],
    partsUsageDetail: "The tuberous roots are the primary part used, typically dried and powdered. Fresh roots can also be used. Root powder is often mixed with milk or ghee. Leaves are used in some formulations.",
    procedure: "Powder: Mix 1-2 grams of Shatavari root powder with warm milk and honey. Take twice daily, preferably in the morning and evening. For lactation: Take with warm milk after meals. For hormonal balance: Best taken consistently for 2-3 months. Can also be taken with ghee for enhanced absorption.",
    safetyNotes: "Generally safe when taken in recommended doses. Pregnant women should consult a doctor before use. May interact with diuretics and lithium. People with kidney issues should use with caution. May cause allergic reactions in some people.",
    habitat: "Tropical and subtropical regions, well-drained sandy soil",
    growthConditions: "Grows as a climbing shrub, requires support. Thrives in warm climate with moderate rainfall. Prefers well-drained, sandy soil. Grows best in temperatures between 20-30°C.",
    distribution: "Native to India, Sri Lanka, and the Himalayas. Found throughout tropical regions of Asia and Africa.",
    season: "Roots are harvested in autumn after the plant has matured. Best quality roots come from 2-3 year old plants.",
    image: "/uploads/plants/shatavari.jpg",
    additionalImages: []
  },
  {
    name: "Triphala",
    botanicalName: "Terminalia chebula, Terminalia bellirica, Phyllanthus emblica",
    family: "Combretaceae, Phyllanthaceae",
    localNames: ["Triphala", "Three Fruits", "Triphala Churna"],
    ayushSystem: "Ayurveda",
    category: "Formulation",
    gardenZone: "Ayurvedic Zone",
    shortInsight: "The 'Three Fruits' combination, Triphala is one of the most important Ayurvedic formulations for digestive health and overall wellness.",
    description: "Triphala is not a single plant but a traditional Ayurvedic formulation made from three fruits: Haritaki (Terminalia chebula), Bibhitaki (Terminalia bellirica), and Amalaki (Phyllanthus emblica). This powerful combination has been used in Ayurveda for over 1,000 years. The name 'Triphala' means 'three fruits' in Sanskrit. Each fruit contributes unique properties, and together they create a synergistic effect that supports digestive health, detoxification, and overall wellness.",
    culturalSignificance: "Triphala is considered one of the most important formulations in Ayurveda. It's mentioned in ancient texts like Charaka Samhita and is used by millions of people daily. It's considered safe for long-term use and is often called the 'nectar of life'.",
    medicinalUses: [
      "Improves digestion",
      "Natural laxative",
      "Detoxifies the body",
      "Boosts immune system",
      "Supports weight management",
      "Improves skin health",
      "Enhances eye health",
      "Supports cardiovascular health",
      "Acts as an antioxidant",
      "Promotes healthy aging"
    ],
    traditionallyUsedFor: ["digestion", "constipation", "detox", "immunity", "weight", "skin", "eyes", "aging"],
    partsUsed: ["Fruits (dried)"],
    partsUsageDetail: "All three fruits are dried, powdered, and mixed in equal proportions. The powder can be taken with water, honey, or ghee. Can also be taken as tablets or capsules.",
    procedure: "Powder: Take 1-2 grams of Triphala powder with warm water before bedtime. Can also be taken with honey. For digestion: Take 30 minutes before meals. For detox: Take on an empty stomach in the morning with warm water. Start with small doses and gradually increase.",
    safetyNotes: "Generally safe for long-term use. May cause loose stools initially - start with small doses. Pregnant and breastfeeding women should consult a doctor. May interact with certain medications, consult healthcare provider.",
    habitat: "Various - Haritaki and Bibhitaki grow in forests, Amalaki in tropical regions",
    growthConditions: "Each component plant has different growth requirements. The formulation is made from dried fruits of all three plants.",
    distribution: "Native to India. Haritaki and Bibhitaki are found in Himalayan and forest regions, Amalaki in tropical areas.",
    season: "Fruits are harvested when ripe, typically in autumn. The formulation is available year-round.",
    image: "/uploads/plants/triphala.jpg",
    additionalImages: []
  },
  {
    name: "Ginger",
    botanicalName: "Zingiber officinale",
    family: "Zingiberaceae",
    localNames: ["Ginger", "Adrak", "Shunti", "Inji"],
    ayushSystem: "Ayurveda",
    category: "Herb",
    gardenZone: "Medicinal Herbs Zone",
    shortInsight: "The 'Universal Medicine' of Ayurveda, Ginger is a warming spice that aids digestion, reduces nausea, and fights inflammation.",
    description: "Ginger, scientifically known as Zingiber officinale, is a flowering plant whose rhizome (underground stem) is widely used as a spice and medicine. Native to Southeast Asia, ginger has been used in Ayurvedic and traditional Chinese medicine for over 2,000 years. The plant grows about one meter tall and produces clusters of white and pink flower buds. The rhizome has a pungent, spicy flavor and contains bioactive compounds like gingerol, which give it its medicinal properties.",
    culturalSignificance: "Ginger is an integral part of Indian cuisine and Ayurvedic medicine. It's considered a 'sattvic' food that promotes clarity and purity. In Ayurveda, ginger is called 'Vishwabheshaja' meaning 'universal medicine' due to its wide range of therapeutic uses.",
    medicinalUses: [
      "Aids digestion",
      "Reduces nausea and vomiting",
      "Fights inflammation",
      "Relieves pain",
      "Treats common cold and cough",
      "Reduces menstrual pain",
      "Supports cardiovascular health",
      "May help prevent cancer",
      "Improves blood circulation",
      "Boosts immune system"
    ],
    traditionallyUsedFor: ["digestion", "nausea", "cold", "cough", "pain", "inflammation", "menstrual cramps", "motion sickness"],
    partsUsed: ["Rhizome", "Fresh or Dried"],
    partsUsageDetail: "Fresh ginger rhizome is most commonly used. Can be consumed raw, as juice, in tea, or cooked. Dried ginger powder (Sunthi) is also used in Ayurvedic formulations. Both forms have therapeutic value.",
    procedure: "Ginger tea: Boil 1-2 slices of fresh ginger in 1 cup of water for 5-10 minutes. Add honey and lemon. Drink 2-3 times daily for cold/cough. For digestion: Chew a small piece of fresh ginger before meals. For nausea: Take ginger tea or chew crystallized ginger. Ginger juice: Extract juice from fresh ginger, mix with honey, take 1-2 teaspoons.",
    safetyNotes: "Generally safe when used as a spice in food. High doses may cause heartburn or stomach upset. May interact with blood-thinning medications. People with gallstones should use with caution. Pregnant women should consult a doctor for high doses.",
    habitat: "Tropical and subtropical regions, well-drained soil",
    growthConditions: "Requires warm, humid climate with temperatures between 20-30°C. Needs well-drained, fertile soil with good organic matter. Grows best in partial shade.",
    distribution: "Native to Southeast Asia. Now cultivated worldwide in tropical and subtropical regions. Major producers include India, China, and Nigeria.",
    season: "Can be harvested 8-10 months after planting. Best quality ginger comes from mature rhizomes. Available year-round.",
    image: "/uploads/plants/ginger.jpg",
    additionalImages: []
  }
];

const seedPlants = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear existing plants (optional - remove if you want to keep existing)
    // await Plant.deleteMany({});
    // console.log("🗑️ Cleared existing plants");

    // Insert plants
    for (const plant of plants) {
      // Check if plant already exists
      const existing = await Plant.findOne({ name: plant.name });
      if (!existing) {
        await Plant.create(plant);
        console.log(`✅ Seeded: ${plant.name}`);
      } else {
        console.log(`⏭️  Skipped (already exists): ${plant.name}`);
      }
    }

    console.log(`\n🌿 Successfully seeded ${plants.length} plants!`);
    console.log("📝 Note: You'll need to add actual images to the uploads/plants/ folder");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedPlants();

