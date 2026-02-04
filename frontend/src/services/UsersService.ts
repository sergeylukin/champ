import type { Record } from "pocketbase";
import { POCKET } from "./PocketBase";

export interface User {
  link: string;
  name: string;
}

export async function adminLoginWithPass(email: string, pass: string) {
  const authData = await POCKET.admins.authWithPassword(
    normalizeEmail(email),
    pass
  );
  const admin = authData.admin;
  window.localStorage.setItem("admin_uid", admin.id);
  window.localStorage.setItem("admin_email", admin.email);
}

export async function loginWithPass(mail: string, pass: string) {
  const resp = await POCKET.collection("champ_users").authWithPassword(
    normalizeEmail(mail),
    pass
  );
  addInSorage(resp.record);
}

export async function fetchIntroSlideContents() {
  const record = await POCKET.collection("champ_pages").getList<User>(0, 1, {
    filter: `name='intro'`,
  });

  return record.items.length > 0 ? record.items[0]?.body : null;
}
export async function updateIntroSlideContents(md) {
  const record = await POCKET.collection("champ_pages").getList<User>(0, 1, {
    filter: `name='intro'`,
  });
  const item = record.items.length > 0 ? record.items[0] : null;
  if (item)
    await POCKET.collection("champ_pages").update(item?.id, { body: md });
}

export async function registerWithPass(
  rawEmail: string,
  pass: string,
  firstname: string,
  lastname: string
) {
  const email = normalizeEmail(rawEmail);
  const record = await POCKET.collection("champ_users").create({
    username: `${email.replace("@", "")}`,
    firstname,
    lastname,
    email,
    emailVisibility: true,
    password: pass,
    passwordConfirm: pass,
    link: getUniqueId(),
  });
  addInSorage(record);
}

function normalizeEmail(email) {
  return email.toLowerCase();
}

export async function findUser(email: string): Promise<User | null> {
  const record = await POCKET.collection("champ_users").getList<User>(0, 1, {
    filter: `email='${normalizeEmail(email)}'`,
  });

  return record.items.length > 0 ? record.items[0] : null;
}

export async function setIsImportantBySlideId(slideId, isImportant) {
  const filter = `slide = '${slideId}' && user = '${getId()}'`;
  const submission = await POCKET.collection(
    "champ_submissions"
  ).getFirstListItem(filter);

  if (submission) {
    await POCKET.collection("champ_submissions").update(submission.id, {
      ...submission,
      is_important: isImportant,
    });
  }
}

export async function getOnboardingSteps(): Promise<any[]> {
  const steps = [];

  if (!getGender()) {
    const records = await POCKET.collection("champ_gender").getFullList({
      sort: "-created",
    });
    steps.push({
      options: records,
      title: "בחירת גירסה לפי מגדר",
      subtitle:
        "בחר/י את המגדר שהכי מתאים לך. תמונות וניסוחים בהערכה יופיעו בהתאמה למגדר שתבחר/י",
      size: "small",
      component: "boxes",
      onRender: async (options) => {},
      onChange: (val, currentOptions) => {
        window.localStorage.setItem("gender", val);
        return currentOptions.map((option) => {
          if (option.id === val) return { ...option, selected: true };
          return { ...option, selected: false };
        });
      },
      update: async (options) => {
        const answer = options.reduce((acc, item) => {
          if (item.selected) {
            acc = item.id;
          }
          return acc;
        }, "");
        await POCKET.collection("champ_users").update(getId(), {
          gender: answer,
        });
        window.localStorage.setItem("gender", answer);
      },
    });
  }

  if (!getAgeGroup()) {
    const records = await POCKET.collection("champ_age_groups").getFullList({
      sort: "-created",
    });
    steps.push({
      options: records,
      title: "בחירת גירסה לפי גיל",
      subtitle:
        "בחר/י את טווח הגילאים שמתאים לגיל שלך. הפריטים בהערכה יופיעו. בהתאמה לגיל שתבחר/י",
      size: "small",
      component: "boxes",
      onRender: async (options) => {},
      onChange: (val, currentOptions) => {
        window.localStorage.setItem("age_group", val);
        return currentOptions.map((option) => {
          if (option.id === val) return { ...option, selected: true };
          return { ...option, selected: false };
        });
      },
      update: async (options) => {
        const answer = options.reduce((acc, item) => {
          if (item.selected) {
            acc = item.id;
          }
          return acc;
        }, "");
        await POCKET.collection("champ_users").update(getId(), {
          age_group: answer,
        });
        window.localStorage.setItem("age_group", answer);
      },
    });
  }

  if (!getTopics().length) {
    const records = await POCKET.collection("champ_topics").getFullList({
      sort: "display_order",
    });
    setTopicsTitles(records);
    steps.push({
      options: records
        .filter((option) => option.id !== "syo76yuz3y8avn7")
        .map((option) => ({ ...option, selected: false })),
      title: "בחר/י את התחומים שאותם תרצה לכלול בהערכה",
      subtitle: "",
      size: "large",
      component: "checkboxes",
      onRender: async (options) => {
        setTopics(options.filter((t) => t.selected).map((t) => t.id));

        // await POCKET.collection("champ_users").update(getId(), {
        //   topics: getTopics(),
        // });
      },
      onChange: (val, currentOptions) => {
        const options = currentOptions.map((option) => {
          if (option.id === val)
            return { ...option, selected: !option.selected };
          return { ...option };
        });
        const isSpecialOptionEnabled =
          options.filter((option) => option.id === "syo76yuz3y8avn7").length >
          0;
        if (options.length > 0 && !isSpecialOptionEnabled) {
          const specialOption = { ...options[0] };
          specialOption.id = "syo76yuz3y8avn7";
          specialOption.selected = true;
          options.push(specialOption);
          console.log("added", specialOption);
        }
        setTopics(options.filter((t) => t.selected).map((t) => t.id));
        console.log("UPDATED OPTIONS", options);
        return options;
      },
      update: async (options) => {
        const topics = options.reduce((acc, item) => {
          if (item.selected) {
            acc.push(item.id);
          }
          return acc;
        }, []);
        await POCKET.collection("champ_users").update(getId(), {
          topics,
        });
      },
    });
  }

  if (!getTrainer().length) {
    const records = await POCKET.collection("champ_trainers").getFullList({
      sort: "created",
    });
    steps.push({
      options: records,
      title: "בחר את המטפל איתו אתה מבצע את ההערכה",
      subtitle: "",
      size: "small",
      component: "dropdown",
      onRender: async (options) => {
        const defaultValue = options[0].id;
        setTrainer(defaultValue);

        await POCKET.collection("champ_users").update(getId(), {
          trainer: defaultValue,
        });
      },
      onChange: (val, currentOptions) => {
        return currentOptions.map((option) => {
          if (option.id === val) return { ...option, selected: true };
          return { ...option, selected: false };
        });
      },
      update: async (options) => {
        const answer = options.reduce((acc, item) => {
          if (item.selected) {
            acc = item.id;
          }
          return acc;
        }, "");
        setTrainer(answer);
        await POCKET.collection("champ_users").update(getId(), {
          trainer: answer,
        });
      },
    });
  }

  return steps;
}

export async function fetchTrainers() {
  // const records = new Promise((resolve, reject) => {
  //   resolve([
  //     { id: "1", name: "Trainer 1" },
  //     { id: "2", name: "Trainer 2" },
  //   ]);
  // });
  const records = await POCKET.collection("champ_trainers").getFullList({
    sort: "created",
  });
  return records;
}

export async function fetchUsers() {
  // const records = new Promise((resolve, reject) => {
  //   resolve([
  //     { id: "1", email: "foo@example.com" },
  //     { id: "2", email: "test2@example.com" },
  //   ]);
  // });
  const records = await POCKET.collection("champ_users").getFullList({
    sort: "created",
  });
  return records;
}

export async function updateSlideImportance(
  slideId,
  isImportant = true
): Promise<any> {
  if (!slideId) return;
  // example create data
  const data = {
    user: getId(),
    slide: slideId,
    isImportant,
  };

  const record = await POCKET.collection("champ_submissions").create(data);
  return record;
}
export async function updateSlideAnswer(
  slideId,
  answer = 3,
  desired_improvement = null
): Promise<any> {
  if (!slideId) return;
  // example create data
  const data = {
    user: getId(),
    slide: slideId,
    answer: answer,
    desired_improvement,
  };

  const record = await POCKET.collection("champ_submissions").create(data);
  return record;
}
function getSubmissions() {
  const submissions: string[] = window.localStorage
    .getItem("submissions")
    ?.split(";");
  return !submissions || submissions[0] === "" ? [] : submissions;
}

export function alreadySubmitted(slideId) {
  const submissions = getSubmissions();
  return submissions.indexOf(slideId) !== -1;
}
export function addSubmission(slideId) {
  const submissions = [...getSubmissions(), slideId];
  window.localStorage.setItem("submissions", submissions.join(";"));
}
export function addSubmissionForSummary(
  topicId,
  topicName,
  slideId,
  slideTitle,
  slideSubtitle,
  answer,
  desiredImprovementValue
) {
  const summary = getSummary();

  summary[slideId] = {
    slideId,
    topicId,
    topicName,
    slideTitle,
    slideSubtitle,
    answer: answer ? answer : "",
    desiredImprovementValue: desiredImprovementValue
      ? desiredImprovementValue
      : "",
  };

  // const submissions = [...getSubmissions(), topicId];
  // window.localStorage.setItem("submissions", submissions.join(";"));
  window.localStorage.setItem(
    "summary",
    Object.keys(summary)
      .map((key) => {
        const val = summary[key];
        return `${val.slideId}|${val.topicId}|${val.topicName}|${val.slideTitle}|${val.slideSubtitle}|${val.answer}|${val.desiredImprovementValue}`;
      })
      .join(";")
  );
}
export function getSummaryByTopicId(topicId) {
  const summary = getSummary();

  return Object.keys(summary).reduce((acc, key) => {
    const curr = summary[key];
    if (curr.topicId === topicId)
      acc.push({
        slideId: curr.slideId,
        topicName: curr.topicName,
        answer: curr.answer,
        desired_answer: curr.desiredImprovementValue,
        title: curr.slideTitle,
        subtitle: curr.slideSubtitle,
      });
    return acc;
  }, []);
}
export function getSummary() {
  const items = window.localStorage.getItem("summary")?.split(";");
  console.log("BEFORE summary", items);
  const res =
    !items || items[0] === ""
      ? {}
      : items.reduce((acc, curr) => {
          const subval = curr?.split("|");
          acc[subval[0]] = {
            slideId: subval[0],
            topicId: subval[1],
            topicName: subval[2],
            slideTitle: subval[3],
            slideSubtitle: subval[4],
            answer: subval[5],
            desiredImprovementValue: subval[6],
          };
          return acc;
        }, {});

  console.log("HEEEEEEEEEY summary", items, res);
  return res;
}

export async function fetchSubmissionsByTrainer(trainer_id) {
  let filter = `user.trainer.id ?= '${trainer_id}'`;
  const records = await POCKET.collection("champ_submissions").getFullList({
    filter,
    expand: `user,slide,slide.topic,desired_improvement`,
    fields: `answer,expand.user.firstname,expand.user.lastname,expand.user.firstname,expand.user.lastname,expand.user.email,expand.slide.title,expand.slide.topic.name,expand.desired_improvement.name,is_important,expand.slide.display_order`,
    sort: "user.id,slide.display_order",
  });
  const topics_res = await POCKET.collection("champ_topics").getFullList({
    sort: "display_order",
  });
  const topics = topics_res.reduce((acc, topic) => {
    acc[topic.id] = topic.name;
    return acc;
  }, {});
  console.log("fetchSubmissionsByTrainer", records);
  const data = records.map((item) => {
    return {
      slide: item.expand?.slide?.title,
      topic: topics[item.expand?.slide?.topic],
      email: item.expand?.user ? item.expand.user?.email : "",
      firstname: item.expand?.user ? item.expand.user?.firstname : "",
      lastname: item.expand?.user ? item.expand.user?.lastname : "",
      answer: item.answer,
      desired_improvement: item.expand?.desired_improvement?.name,
      is_important: item.is_important ? "כן" : "",
    };
  });
  // const submissions = submittedSlides.reduce(
  //   (amp, item) => [...amp, item.slide],
  //   []
  // );
  console.log("got submissions", data);
  return data;
}

export async function getSlides() {
  // Fetch desired improvements
  const desired_improvements = await POCKET.collection(
    "desired_improvements"
  ).getFullList({
    sort: "display_order",
  });
  setDesiredImprovements(desired_improvements);

  const topics = getTopics();
  const submittedSlides = await POCKET.collection(
    "champ_submissions"
  ).getFullList({
    filter: `user = '${getId()}'`,
  });
  const submissions = submittedSlides.reduce(
    (amp, item) => [...amp, item.slide],
    []
  );
  window.localStorage.setItem("submissions", submissions.join(";"));
  const filter = `(age_group ?~ '${getAgeGroup()}' && gender ?~ '${getGender()}' ${
    topics.length
      ? " && (" +
        topics
          .map((topic) => " || topic = '" + topic + "'")
          .join("")
          .slice(4) +
        ")"
      : ""
  })`;
  console.log("FILTER", filter);
  const records = await POCKET.collection("champ_slides").getFullList({
    sort: "topic.display_order,display_order",
    filter,
  });

  const filteredSlides = records.filter((slide) => !alreadySubmitted(slide.id));

  console.log("here are the slides");
  console.log(filteredSlides);

  return filteredSlides;
}

export function adminLogout() {
  window.localStorage.removeItem("admin_uid");
  window.location.href = "/admin";
}
export function logout() {
  window.localStorage.removeItem("uid");
  window.localStorage.removeItem("summary");
  window.location.href = "/";
}

export function isLogged() {
  return !!window.localStorage.getItem("uid");
}

export function isAdmin() {
  return !!window.localStorage.getItem("admin");
}
export function isAdminLogged() {
  return !!window.localStorage.getItem("admin_uid");
}

function getUniqueId() {
  return "#hi" + Math.random().toString(16).slice(2);
}

export function link() {
  return window.localStorage.getItem("uid") ?? "";
}

export function name() {
  const firstname = window.localStorage.getItem("firstname");
  const lastname = window.localStorage.getItem("lastname");
  return [firstname, lastname]
    .filter((name) => name && name.length > 0)
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(" ");
}

export function email() {
  return window.localStorage.getItem("email") ?? "";
}

export function username() {
  return window.localStorage.getItem("username") ?? "";
}

export function isLink(val: string) {
  return val.indexOf("#hi") === 0;
}

function addInSorage(user: Record) {
  window.localStorage.setItem("uid", user.id);
  window.localStorage.setItem("username", user.username);
  window.localStorage.setItem("email", user.email);
  window.localStorage.setItem("firstname", user.firstname);
  window.localStorage.setItem("lastname", user.lastname);
  window.localStorage.setItem("gender", user.gender);
  window.localStorage.setItem("age_group", user.age_group);
  setTopics(user.topics);
  setTrainer(user.trainer);
  console.log("ADD IN STORAGE");
  console.dir(user);
}

function getId() {
  return window.localStorage.getItem("uid") ?? "";
}
function getGender() {
  return window.localStorage.getItem("gender") ?? "";
}
function getAgeGroup() {
  return window.localStorage.getItem("age_group") ?? "";
}
function getTrainer() {
  return window.localStorage.getItem("trainer") ?? "";
}
function setTrainer(val) {
  window.localStorage.setItem("trainer", val);
}
export function getTopics() {
  const topics: string[] = window.localStorage.getItem("topics")?.split(";");
  return !topics || topics[0] === "" ? [] : topics;
}
function setTopics(topics) {
  window.localStorage.setItem("topics", topics.join(";"));
}
function setTopicsTitles(topics) {
  console.log(topics);
  window.localStorage.setItem(
    "topics_titles",
    topics.map((val) => `${val.id}|${val.name}`).join(";")
  );
}
export function getTopicsTitles() {
  const topicsTitles: string[] = window.localStorage
    .getItem("topics_titles")
    ?.split(";");
  console.log("BEFORE topics titles", topicsTitles);
  const res =
    !topicsTitles || topicsTitles[0] === ""
      ? {}
      : topicsTitles.reduce((acc, curr) => {
          const subval = curr?.split("|");
          acc[subval[0]] = subval[1];
          return acc;
        }, {});

  console.log("HEEEEEEEEEY topicsTitles", topicsTitles, res);
  return res;
}
function setDesiredImprovements(desired_improvements) {
  window.localStorage.setItem(
    "desired_improvements",
    desired_improvements.map((val) => `${val.id}|${val.name}`).join(";")
  );
}
export function getDesiredImprovements() {
  const improvements: string[] = window.localStorage
    .getItem("desired_improvements")
    ?.split(";");
  console.log("BEFORE IMPROVEMENTS", improvements);
  const res =
    !improvements || improvements[0] === ""
      ? []
      : improvements.map((val) => {
          const subval = val?.split("|");
          return {
            id: subval[0],
            name: subval[1],
          };
        });

  console.log("HEEEEEEEEEY IMPROVEMENTS", improvements, res);
  return res;
}

export const isOnboarded = () => {
  const gender = getGender();
  const age_group = getAgeGroup();
  const topics = getTopics();
  const trainer = getTrainer();
  console.log(
    "gender",
    gender,
    "age_grou",
    age_group,
    "topics",
    topics,
    "trainer",
    trainer
  );
  if (!gender || !age_group || !topics.length || !trainer) return false;
  return true;
};
