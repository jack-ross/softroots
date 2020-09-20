const allRoles = [
  "Manager",
  "Crew Member",
  "------ Old roles below here ",
  "Admin",
  "GM",
  "Assistant GM",
  "Kitchen Manager",
  "Prep",
  "Dish",
  "Shift Manager",
  "Line",
  "Grill"
]

let roleHierarchy = {
  Manager: allRoles,
  "Crew Member": ["Crew Member"],
  Admin: allRoles,
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
