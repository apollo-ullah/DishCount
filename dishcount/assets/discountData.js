const discountData = [
    {
        Store: "3 Brasseurs",
        Discount: "15%",
        Form: "Student ID",
        Category: "Restuarant",
        Coordinates: "45.49756, -73.57519"
    },
    {
        Store: "Poulet Rouge",
        Discount: "15%",
        Form: "Student ID",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.49499051045618, -73.57832975965205",
        Applicable: "student"
    },
    {
        Store: "Ahi Poke",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.529860731324376, -73.57976051754693",
        Applicable: "student"
    },
    {
        Store: "Cuisine Formosa",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.49620467055416, -73.58068714261798",
        Applicable: "student"
    },
    {
        Store: "Délicieux Mei Mei",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.50820493500185, -73.55968437499419",
        Applicable: "student"
    },
    {
        Store: "Dobe and Andy",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.50747745011507, -73.56129080382992",
        Applicable: "student"
    },
    {
        Store: "Dondonya",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.49740501998397, -73.57735759218764",
        Applicable: "student"
    },
    {
        Store: "Ganadara (McGill)",
        Discount: "10% off, 15% off for cash",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.50486404124947, -73.5727769038301",
        Applicable: "student"
    },
    {
        Store: "Le Restaurant Dumpling Shop",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.510371063868675, -73.57503283266547",
        Applicable: "student"
    },
    {
        Store: "LiuYiShou",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.49681285630372, -73.57491627684482",
        Applicable: "student"
    },
    {
        Store: "Malatang ZhangLiang",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.508034129740864, -73.56025402102274",
        Applicable: "student"
    },
    {
        Store: "Pho Tay Ho",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.533941399510084, -73.60449560012832",
        Applicable: "student"
    },
    {
        Store: "Raviolis Impressions (Ste-Catherine W)",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.50603226892277, -73.56701538848712",
        Applicable: "student"
    },
    {
        Store: "Resto Seoul",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.52277584461637, -73.57927627314325",
        Applicable: "student"
    },
    {
        Store: "Sansotei Ramen",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.53032794028218, -73.57884735624926",
        Applicable: "student"
    },
    {
        Store: "Thai Express (Parc)",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.51034212934857, -73.57514883081541",
        Applicable: "student"
    },
    {
        Store: "Tsukuiyomi (Mile end)",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.52426127183335, -73.59476877499321",
        Applicable: "student"
    },
    {
        Store: "Dodonya",
        Discount: "10% off",
        Form: "Codejam Shirt",
        Category: "Restuarant",
        LocallyOwned: "",
        Coordinates: "45.4975103039038, -73.57733613451617",
        Applicable: "student"
    },
    {
        Store: "Allo Daisy",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        LocallyOwned: "",
        Coordinates: "45.51731690617989, -73.55921000382928",
        Applicable: "student"
    },
    {
        Store: "Coco Bubble Tea (St-Catherine W)",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        LocallyOwned: "",
        Coordinates: "45.49690967834423, -73.57588675965205",
        Applicable: "student"
    },
    {
        Store: "Dessert Coréen Crofre",
        Discount: "15% off in-person",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        LocallyOwned: "",
        Coordinates: "45.47799268805168, -73.5860847144436",
        Applicable: "student"
    },
    {
        Store: "GongCha",
        Discount: "15% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        LocallyOwned: "",
        Coordinates: "45.511754993097625, -73.56330259750344",
        Applicable: "student"
    },
    {
        Store: "Matcha Zanmai",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        LocallyOwned: "",
        Coordinates: "45.496153844188726, -73.57755677314485",
        Applicable: "student"
    },
    {
        Store: "Nos Thés",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        LocallyOwned: "",
        Coordinates: "45.49510772438699, -73.57823001732349",
        Applicable: "student"
    },
    {
        Store: "OCHA",
        Discount: "15% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        LocallyOwned: "",
        Coordinates: "45.49457682594679, -73.57889781917358",
        Applicable: "student"
    },
    {
        Store: "Salon Thé Chai (Parc)",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        LocallyOwned: "",
        Coordinates: "45.50972389343936, -73.57396824615839",
        Applicable: "student"
    },
    {
        Store: "Tsujuri",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        LocallyOwned: "",
        Coordinates: "45.49755185778697, -73.57659424800902",
        Applicable: "student"
    },
    {
        Store: "Zoe Dessert",
        Discount: "10% off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        LocallyOwned: "",
        Coordinates: "45.495136468611655, -73.5814720903378",
        Applicable: "student"
    },
    {
        Store: "Schulich",
        Discount: "0%off",
        Form: "MCSA, MECA, HKSN, MTSA",
        Category: "Drinks/Desserts",
        LocallyOwned: "",
        Coordinates: "45.50500207528078, -73.57557070553032",
        Applicable: "student"
    }
];

export default discountData; 