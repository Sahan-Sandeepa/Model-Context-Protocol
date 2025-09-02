function answer(question, resume) {
  const q = normalize(question);
  const exp = Array.isArray(resume.experience) ? [...resume.experience] : [];
  // Ensure most recent first even if JSON order changes
  exp.sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0));
  const last = exp[0];

  //last role / position / title
  if (
    /\b(last|most recent)\b.*\b(role|position|title)\b/.test(q) ||
    /\b(role|position|title)\b.*\b(last|most recent)\b/.test(q)
  ) {
    if (last?.title) {
      return `Your last role was ${last.title} at ${last.company} (${
        last.startDate
      }–${last.endDate || "Present"}).`;
    }
    return "I couldn't find your last role. Make sure experience[0] includes title/company/dates.";
  }

  //skills
  if (/\bskills?\b/.test(q)) {
    if (Array.isArray(resume.skills) && resume.skills.length) {
      return `Skills: ${resume.skills.join(", ")}.`;
    }
    return "No skills listed in resume.json.";
  }

  //companies worked at
  if (/\bcompan(y|ies)\b/.test(q) || /\bwhere\b.*\bwork(ed)?\b/.test(q)) {
    const companies = [...new Set(exp.map((e) => e.company).filter(Boolean))];
    if (companies.length) return `Companies: ${companies.join(", ")}.`;
    return "No companies found in experience.";
  }

  //education / highest degree
  if (/\beducation|degree|university|college\b/.test(q)) {
    const edu = Array.isArray(resume.education) ? resume.education : [];
    if (edu.length) {
      const highest = edu[0];
      return `${highest.degree} in ${highest.field} from ${highest.institution} (${highest.startDate}–${highest.endDate}).`;
    }
    return "No education entries found.";
  }

  //years of experience
  if (/\byears?\b.*\bexperience\b/.test(q)) {
    const years = totalYears(exp);
    return `Total experience: ~${years.toFixed(1)} years.`;
  }

  //contact info
  if (/\b(email|e-mail)\b/.test(q) && resume.contact?.email)
    return `Email: ${resume.contact.email}`;
  if (/\b(phone|mobile|tel)\b/.test(q) && resume.contact?.phone)
    return `Phone: ${resume.contact.phone}`;

  //simple keyword match
  return fallbackSearch(q, resume);
}

module.exports = { answer };
