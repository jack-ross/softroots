"use strict";
/**
 * @param context {WebtaskContext}
 */
const firebase = require("firebase");
const moment = require("moment");
const queryString = require("query-string");
const mailgun = require("mailgun.js");

let configListTalk = {
  apiKey: "",
  authDomain: "listtalk-admin.firebaseapp.com",
  databaseURL: "https://listtalk-admin.firebaseio.com",
  projectId: "listtalk-admin",
  storageBucket: "listtalk-admin.appspot.com",
  messagingSenderId: "302144185"
};
let configSoftroots = {
  apiKey: "",
  authDomain: "softroots-47db8.firebaseapp.com",
  databaseURL: "https://softroots-47db8.firebaseio.com",
  projectId: "softroots-47db8",
  storageBucket: "softroots-47db8.appspot.com",
  messagingSenderId: "980329113855"
};

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

  return { completed: completed, total: total };
};

const getChecklistProgressStr = checklist => {
  const progress = getChecklistProgress(checklist);

  return `${progress.completed}/${progress.total}`;
};

const generateReportUrl = (role, location) => {
  const range = [moment().subtract(1, "d"), moment()].join(",");
  const search = {
    range,
    role,
    location
  };

  return (
    "https://listtalk-admin.firebaseio.com/history?" +
    queryString.stringify(search)
  );
};

const getDateKey = () => {
  let dateISOString = moment()
    .subtract(5, "h")
    .format();
  let dayMonthYearString = dateISOString.substring(0, 10); // formatted as YYYY-MM-DD
  return dayMonthYearString;
};

const getChecklistString = c => {
  const timeStr = `${c.endTime.hours}:${c.endTime.minutes}${c.endTime.amPm}`;
  return `${getChecklistProgressStr(c)} ${timeStr} ${c.title}`;
};

const generateEmails = (users, templates, checklists) => {
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
      to: user.email,
      subject: `Checklist report for ${getDateKey()}`,
      body: `Incomplete: \n${
        incomplete.length > 0 ? incomplete : "None"
      }\n\nView checklists: ${link} `
    };
  });
  return emails;
};

module.exports = function(context, cb) {
  let app = null;
  if (firebase.apps.length === 0) {
    app = firebase.initializeApp(configListTalk);
  } else {
    app = firebase.apps[0];
  }

  const api_key = context.secrets.mailgunKey;
  const domain = "mg.portalanalytics.us";
  const mg = mailgun.client({
    username: "api",
    key: context.secrets.apiKey
  });

  firebase
    .database()
    .ref("/")
    .on("value", snapshot => {
      const val = snapshot.val();
      // if snapshot exists, store in the state
      if (snapshot.val()) {
        const emails = generateEmails(
          val.users,
          val.checklists,
          val.dailyLists[getDateKey()]
        );
        emails.forEach(e => {
          mg.messages
            .create(domain, {
              text: e.body,
              from: "admin@rootsnk.com",
              to: e.to,
              subject: e.subject
            })
            .catch(e => {
              console.error(e);
            });
        });
      }
      cb(null, { hello: context.query.name || "Anonymous" });
    });
};
