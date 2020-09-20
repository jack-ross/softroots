import {storeLocations} from "../locations";
import roles from "../roles/roles";
import {flatten} from "lodash";

export const getChecklistsFromVal = (checklistVal) => {
    return flatten(storeLocations.map(location => {
        const locationVal = checklistVal[location]
        const roleChecklists = roles
            .map((role, roleIndex) => {
                let roleChecklists = locationVal[role];
                if (!roleChecklists) {
                    return null;
                }
                return Object.keys(roleChecklists).map(key => {
                    // build URI for object (easier deleting/updating)
                    roleChecklists[key]["path"] =
                        "/checklists/" + location + "/" + role + "/" + key;
                    return roleChecklists[key];
                });
            });
        return flatten(roleChecklists)
    }))

}
