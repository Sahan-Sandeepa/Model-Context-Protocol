// Normalizes a string by converting it to a string, trimming whitespace and converting to lowercase.
const normalize = (stringVal) => {
  return (stringVal || "").toString().trim().toLowerCase();
};

//Calculates the total years of experience from an array of experience objects.
const totalYears = (experiences = []) => {
  let months = 0;
  for (const experience of experiences) {
    const start = experience.startDate ? new Date(experience.startDate) : null;
    const end = experience.endDate ? new Date(experience.endDate) : new Date();
    if (start) {
      // Calculate months between start and end date
      months += (end - start) / (1000 * 60 * 60 * 24 * 30.44);
    }
  }
  return months / 12;
};

//Search that finds the most relevant text blob based on keyword matching.
function fallbackSearch(q, resume) {
  const textBlobs = [];
  if (resume.summary) textBlobs.push(resume.summary);
  if (Array.isArray(resume.skills)) textBlobs.push(resume.skills.join(" "));
  for (const e of resume.experience || []) {
    textBlobs.push(
      [e.title, e.company, e.description].filter(Boolean).join(" ")
    );
  }
  const words = q.split(/\W+/).filter(Boolean);
  const score = (text) =>
    words.reduce((acc, w) => acc + (text.toLowerCase().includes(w) ? 1 : 0), 0);

  let best = "";
  let bestScore = -1;
  for (const blob of textBlobs) {
    const s = score(blob || "");
    if (s > bestScore) {
      bestScore = s;
      best = blob;
    }
  }
  if (bestScore <= 0)
    return "I'm not sure. Try rephrasing the question or ensure resume.json has the info.";
  return best.length > 300 ? best.slice(0, 300) + "…" : best;
}

//Answers a question based on the content of a resume data object.
function answer(question, resume) {
  const q = normalize(question);
  const exp = Array.isArray(resume.experience) ? [...resume.experience] : [];
  exp.sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0));
  const last = exp[0];

  // last role / position / title
  if (
    /\b(last|most recent)\b.*\b(role|position|title)\b/.test(q) ||
    /\b(role|position|title)\b.*\b(last|most recent)\b/.test(q)
  ) {
    if (last?.title) {
      return `Your last role was ${last.title} at ${last.company} (${
        last.startDate
      }–${last.endDate || "Present"}).`;
    }
    return "I couldn't find your last role. Make sure experience includes title/company/dates.";
  }

  if (/\bskills?\b/.test(q)) {
    if (Array.isArray(resume.skills) && resume.skills.length) {
      return `Skills: ${resume.skills.join(", ")}.`;
    }
    return "No skills listed in resume.json.";
  }

  // companies worked at
  if (/\bcompan(y|ies)\b/.test(q) || /\bwhere\b.*\bwork(ed)?\b/.test(q)) {
    const companies = [...new Set(exp.map((e) => e.company).filter(Boolean))];
    if (companies.length) return `Companies: ${companies.join(", ")}.`;
    return "No companies found in experience.";
  }

  // education / highest degree
  if (/\beducation|degree|university|college\b/.test(q)) {
    const edu = Array.isArray(resume.education) ? resume.education : [];
    if (edu.length) {
      const highest = edu[0];
      return `${highest.degree} in ${highest.field} from ${highest.institution} (${highest.startDate}–${highest.endDate}).`;
    }
    return "No education entries found.";
  }

  // years of experience
  if (/\byears?\b.*\bexperience\b/.test(q)) {
    const years = totalYears(exp);
    return `Total experience: ~${years.toFixed(1)} years.`;
  }

  // contact info
  if (/\b(email|e-mail)\b/.test(q) && resume.contact?.email)
    return `Email: ${resume.contact.email}`;
  if (/\b(phone|mobile|tel)\b/.test(q) && resume.contact?.phone)
    return `Phone: ${resume.contact.phone}`;

  // simple keyword match
  return fallbackSearch(q, resume);
}

module.exports = { answer };
