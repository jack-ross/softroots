const getDailyChecklists = checklists => {
  return Object.keys(checklists)
    .map(location =>
      Object.keys(checklists[location])
        .map(role =>
          Object.keys(checklists[location][role]).map(
            checklistId => checklists[location][role][checklistId]
          )
        )
        .reduce((a, c) => a.concat(c), [])
    )
    .reduce((a, c) => a.concat(c), []);
};

const getChecklistProgress = checklist => {
  let total = 0;
  let completed = 0;
  checklist.subsections.map(section =>
    section.subtasks.map(task => {
      total++;
      if (task.isCompleted) {
        completed++;
      }
    })
  );

  return { completed, total };
};

const getChecklistProgressStr = checklist => {
  const { completed, total } = getChecklistProgress(checklist);

  return `${completed}/${total}`;
};

const generateReportUrl = (role, location) => {
  const range = [moment().subtract(1, "d"), moment()].join(",");
  const search = {
    range,
    role,
    location
  };

  return "http://localhost:3000/history?" + queryString.stringify(search);
};

const getDateKey = () => {
  let dateISOString = moment().format();
  let dayMonthYearString = dateISOString.substring(0, 10); // formatted as YYYY-MM-DD
  return dayMonthYearString;
};

const getChecklistString = c => {
  const timeStr = `${c.endTime.hours}:${c.endTime.minutes}${c.endTime.amPm}`;
  return `${getChecklistProgressStr(c)} ${timeStr} ${c.title}`;
};

export const generateEmails = (users, templates, checklists) => {
  const subscribedUsers = Object.keys(users.verified)
    .map(id => {
      const user = users.verified[id];
      if (user.reportIds) {
        return user;
      }
      return null;
    })
    .filter(u => !!u);
  const dailyChecklists = getDailyChecklists(checklists);
  const templateList = getDailyChecklists(templates);
  const emails = subscribedUsers.map(user => {
    const subscribedList = dailyChecklists.filter(
      c => user.reportIds.indexOf(c.templateKey) > -1
    );
    const incomplete = subscribedList
      .filter(c => {
        const progress = getChecklistProgress(c);
        return progress.completed !== progress.total;
      })
      .map(c => "+ " + getChecklistString(c))
      .join("\n");

    const link = generateReportUrl(user.role, user.location);

    return {
      email: user.email,
      title: "Checklist report for ${getDateKey()}",
      body: `Incomplete: \n${incomplete}\n\n<a href="${link}">View report</a> `
    };
  });
  return emails;
};
