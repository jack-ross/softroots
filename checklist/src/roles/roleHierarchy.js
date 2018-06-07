let roleHierarchy = {
  Admin: [
    "Admin",
    "GM",
    "Assistant GM",
    "Kitchen Manager",
    "Prep",
    "Dish",
    "Shift Manager",
    "Line",
    "Grill"
  ],
  GM: [
    "GM",
    "Assistant GM",
    "Kitchen Manager",
    "Prep",
    "Dish",
    "Shift Manager",
    "Line",
    "Grill"
  ],
  "Assistant GM": [
    "Assistant GM",
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
