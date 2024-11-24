const discountData = [
    {
        Store: "3 Brasseurs",
        Discount: "15% off",
        Form: "Student ID",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.49756, -73.57519",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Poulet Rouge",
        Discount: "15% off",
        Form: "Student ID",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.49499051045618, -73.57832975965205",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Ahi Poke",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.529860731324376, -73.57976051754693",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Cuisine Formosa",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.49620467055416, -73.58068714261798",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Délicieux Mei Mei",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.50820493500185, -73.55968437499419",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Dobe and Andy",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.50747745011507, -73.56129080382992",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Dondonya",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA, CodeJam Shirt",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.49740501998397, -73.57735759218764",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Ganadara (McGill)",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.50486404124947, -73.5727769038301",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Dumpling Shop",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.510371063868675, -73.57503283266547",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "LiuYiShou",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.49681285630372, -73.57491627684482",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Malatang ZhangLiang",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.508034129740864, -73.56025402102274",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Pho Tay Ho",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.533941399510084, -73.60449560012832",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Raviolis Impressions",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.50603226892277, -73.56701538848712",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Resto Seoul",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.52277584461637, -73.57927627314325",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Sansotei Ramen",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.53032794028218, -73.57884735624926",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Thai Express (Parc)",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.51034212934857, -73.57514883081541",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Tsukuiyomi",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restaurant",
        AdditionalTag: "",
        Coordinates: "45.52426127183335, -73.59476877499321",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Allo Daisy",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        AdditionalTag: "",
        Coordinates: "45.51731690617989, -73.55921000382928",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Coco Bubble Tea",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        AdditionalTag: "",
        Coordinates: "45.49690967834423, -73.57588675965205",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Dessert Coréen Crofre",
        Discount: "15% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        AdditionalTag: "",
        Coordinates: "45.47799268805168, -73.5860847144436",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "GongCha",
        Discount: "15% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        AdditionalTag: "",
        Coordinates: "45.511754993097625, -73.56330259750344",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Matcha Zanmai",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        AdditionalTag: "Locally Owned",
        Coordinates: "45.496153844188726, -73.57755677314485",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Nos Thés",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        AdditionalTag: "",
        Coordinates: "45.49510772438699, -73.57823001732349",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "OCHA",
        Discount: "15% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        AdditionalTag: "",
        Coordinates: "45.49457682594679, -73.57889781917358",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Salon Thé Chai",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        AdditionalTag: "",
        Coordinates: "45.50972389343936, -73.57396824615839",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Tsujuri",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        AdditionalTag: "",
        Coordinates: "45.49755185778697, -73.57659424800902",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "Zoe Dessert",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        AdditionalTag: "",
        Coordinates: "45.495136468611655, -73.5814720903378",
        Applicable: "student",
        Promotions: "0"
    },
    {
        Store: "CodeJam SWAG",
        Discount: "100% off",
        Form: "CodeJam Shirt",
        Category: "Event",
        AdditionalTag: "Limited Time",
        Coordinates: "45.4975103039038, -73.57733613451617",
        Applicable: "student",
        Promotions: "1"
    },
    {
        Store: "BIXI Membership",
        Discount: "15% off",
        Form: "Student ID",
        Category: "Transportation",
        AdditionalTag: "Locally Owned, NPO",
        Coordinates: "45.5019, -73.5674",
        Applicable: "student",
        Promotions: "1",
        isCityWide: true
    }
];

export default discountData; 