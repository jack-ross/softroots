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
  Admin: allRoles,
  GM: allRoles,
  "Assistant GM": allRoles,
  "Kitchen Manager": allRoles,
  "Shift Manager": allRoles,
  Grill: allRoles,
  Prep: allRoles,
  Line: allRoles,
  Dish: allRoles
};

export default roleHierarchy;
