export const groupedWords: any = {
    foodAndBeverages: [
        "beef",
        "beverages",
        "canned",
        "dairy",
        "dried",
        "dry",
        "food",
        "foods",
        "fresh",
        "frozen",
        "fruits",
        "gelatin",
        "gelatine",
        "meat",
        "meats",
        "oil",
        "oils",
        "pork",
        "poultry",
        "sauce",
        "vegetable",
        "vegetables"
    ],
    manufacturingAndIndustrial: [
        "adhesives",
        "aluminum",
        "automotive",
        "building",
        "casting",
        "chemical",
        "chemicals",
        "components",
        "construction",
        "consumer",
        "control",
        "development",
        "die",
        "distribution",
        "electric",
        "electrical",
        "electronic",
        "engineering",
        "equipment",
        "fabric",
        "fabrics",
        "film",
        "freight",
        "high",
        "industrial",
        "industries",
        "industry",
        "iron",
        "machine",
        "machinery",
        "machines",
        "manufacturing",
        "marine",
        "materials",
        "metal",
        "natural",
        "non",
        "paper",
        "parts",
        "plastic",
        "plastics",
        "power",
        "processing",
        "production",
        "products",
        "raw",
        "rubber",
        "steel",
        "supplies",
        "system",
        "systems",
        "textile",
        "tools",
        "transport",
        "transportation",
        "warehousing"
    ],
    apparelAndAccessories: [
        "accessories",
        "apparel",
        "bags",
        "clothing",
        "footwear",
        "leather",
        "men",
        "shoes"
    ],
    homeAndHousehold: [
        "appliances",
        "care",
        "furniture",
        "home",
        "household",
        "items",
        "office",
        "personal",
        "stationery"
    ],
    logisticsAndShipping: [
        "cargo",
        "customs",
        "freight",
        "forwarding",
        "international",
        "logistics",
        "shipping",
        "storage",
        "transport",
        "transportation",
        "warehousing"
    ],
    medicalAndPharmaceutical: [
        "medical",
        "pharmaceutical",
        "research"
    ],
    businessAndServices: [
        "business",
        "commercial",
        "consumer",
        "development",
        "freelance",
        "general",
        "management",
        "offers",
        "provides",
        "quality",
        "related",
        "services",
        "solutions",
        "special",
        "specialises",
        "specialty",
        "well"
    ],
    technologyAndElectronics: [
        "computer",
        "devices",
        "electronic",
        "technology"
    ],
    miscellaneous: [
        "air",
        "based",
        "by",
        "cooked",
        "custom",
        "customs",
        "design",
        "dried",
        "dry",
        "film",
        "fresh",
        "from",
        "hot",
        "in",
        "including",
        "its",
        "line",
        "natural",
        "of",
        "or",
        "on",
        "other",
        "personal",
        "prepared",
        "processed",
        "products",
        "quality",
        "raw",
        "related",
        "series",
        "service",
        "special",
        "supplies",
        "system",
        "systems",
        "that",
        "the",
        "to",
        "type",
        "used",
        "various",
        "wide"
    ],
    seafood: [
        "cod",
        "crab",
        "crabs",
        "fillet",
        "fillets",
        "fish",
        "lobster",
        "octopus",
        "pollock",
        "salmon",
        "seafood",
        "seafoods",
        "shellfish",
        "shrimp",
        "shrimps",
        "smoked",
        "sole",
        "squid",
        "tuna",
        "aquatic",
        "fishing",
        "marine",
        "ocean",
        "sea",
        "water"
    ]
};

export function isDeepEqual(a: Object, b: Object) {
    let keys1 = Object.keys(a);
    let keys2 = Object.keys(b);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key)) {
            return false;
        }
    }

    for (let key of keys1) {
        //@ts-ignore
        if (a[key] !== b[key]) {
            return false;
        }
    }

    return true;
}

export function filterOutliers(someArray: any) {

    // Copy the values, rather than operating on references to existing values
    const values = someArray.concat();

    // Then sort
    values.sort(function (a: any, b: any) {
        return a - b;
    });

    /* Then find a generous IQR. This is generous because if (values.length / 4)
     * is not an int, then really you should average the two elements on either
     * side to find q1.
     */
    const q1 = values[Math.floor((values.length / 4))];
    // Likewise for q3.
    const q3 = values[Math.ceil((values.length * (3 / 4)))];
    const iqr = q3 - q1;

    // Then find min and max values
    const maxValue = q3 + iqr * 3.5;
    const minValue = q1 - iqr * 3.5;

    // Then filter anything beyond or beneath these values.
    const filteredValues = values.filter(function (x: any) {
        return (x <= maxValue) && (x >= minValue);
    });

    // Then return
    return filteredValues;
}