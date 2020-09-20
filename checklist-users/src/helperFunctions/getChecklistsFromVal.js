import {flatten} from "lodash";
import {storeLocations} from "./locations";
import {roles} from "./roles";

export const getChecklistsFromVal = (checklistVal) => {
    return flatten(storeLocations.map(location => {
      const locationVal = checklistVal[location]
      if(!locationVal) {
        return [];
      }
        const roleChecklists = roles
            .map((role, roleIndex) => {
                let roleChecklists = locationVal[role];
                if (!roleChecklists) {
                    return null;
                }
                return Object.keys(roleChecklists).map(key => {
                    // build URI for object (easier deleting/updating)
                  if(roleChecklists[key] && roleChecklists[key]["path"]) {
                    roleChecklists[key]["path"] =
                        "/checklists/" + location + "/" + role + "/" + key;
                    }
                    return roleChecklists[key];
                });
            });
        return flatten(roleChecklists)
    }))

}
