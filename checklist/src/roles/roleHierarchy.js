let roleHierarchy = {
  Admin: [
    "Admin",
    "General Manager ",
    "Assistant General Manager",
    "Kitchen Manager",
    "Prep",
    "Dish",
    "Shift Manager",
    "Line",
    "Grill"
  ],
  "General Manager": [
    "General Manager",
    "Assistant General Manager",
    "Kitchen Manager",
    "Prep",
    "Dish",
    "Shift Manager",
    "Line",
    "Grill"
  ],
  "Assistant General Manager": [
    "Assistant General Manager",
    "Kitchen Manager",
    "Prep",
    "Dish",
    "Shift Manager",
    "Line",
    "Grill"
  ],
  "Kitchen Manager": ["Kitchen Manager", "Prep", "Dish"],
  "Shift Manager": ["Shift Manager", "Line", "Grill"],
  Grill: ["Grill"],
  Prep: ["Prep"],
  Line: ["Line"],
  Dish: ["Dish"]
};

export default roleHierarchy;
