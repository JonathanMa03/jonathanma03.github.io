const stopWords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has',
  'he', 'his', 'how', 'i', 'in', 'is', 'it', 'me', 'of', 'on', 'or',
  'that', 'the', 'this', 'to', 'was', 'what', 'when', 'where', 'which',
  'who', 'why', 'with', 'would', 'you', 'your', 'jonathan',
]);

const aliases = {
  advised: ['advisor', 'mentor', 'faculty', 'education'],
  adviser: ['advisor', 'mentor', 'faculty'],
  ca: ['calibration', 'forecasting'],
  carrn: ['calibration', 'forecasting', 'thesis'],
  certificate: ['certification', 'credential'],
  certifications: ['certification', 'credential'],
  connect: ['contact', 'social', 'email'],
  connet: ['connect', 'contact', 'social', 'email'],
  contact: ['connect', 'social', 'email'],
  cv: ['resume', 'curriculum', 'vitae'],
  faculty: ['professor', 'advisor', 'mentor', 'education'],
  game: ['gaming', 'hobbies'],
  games: ['gaming', 'hobbies', 'genshin', 'honkai'],
  hobby: ['hobbies', 'piano', 'gaming'],
  hobbies: ['hobby', 'piano', 'gaming'],
  job: ['experience', 'role', 'career'],
  hopkins: ['johns', 'graduate'],
  leisure: ['hobbies', 'piano', 'gaming', 'music'],
  mascot: ['tofu', 'cat'],
  outside: ['hobbies', 'piano', 'gaming'],
  publications: ['publication', 'paper', 'manuscript'],
  professor: ['faculty', 'advisor', 'mentor'],
  reach: ['contact', 'connect', 'social', 'email'],
  resume: ['cv', 'curriculum', 'vitae'],
  tofu: ['mascot', 'cat'],
};

let knowledgePromise;

function normalize(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenize(value) {
  const tokens = normalize(value)
    .split(/\s+/)
    .filter((token) => (token.length > 1 || token === 'r') && !stopWords.has(token));
  const expanded = new Set(tokens);

  tokens.forEach((token) => {
    aliases[token]?.forEach((alias) => expanded.add(alias));
  });

  return [...expanded];
}

function detectIntents(query) {
  return {
    certifications: /\b(certificate|certificates|certification|certifications|credential|credentials)\b/.test(query),
    courses: /\b(course|courses|coursework|class|classes|curriculum)\b/.test(query),
    education: /\b(education|graduate school|college|degree|degrees|school|studied|university)\b/.test(query),
    faculty: /\b(faculty|professor|advisor|adviser|advised|mentor|supervisor|supervised|worked with)\b/.test(query),
    hobbies: /\b(game|games|gaming|hobby|hobbies|leisure|outside)\b/.test(query),
    projects: /\b(project|projects|built|build|portfolio|notable work)\b/.test(query),
    research: /\b(research interests?|research areas?|research focus|interested in|researches)\b/.test(query),
    skills: /\b(experience with|experience in|programming|technical skills?|languages?|tools?|worked in|used)\b/.test(query),
    social: /\b(social media|socials|find him|find jonathan|connect|connet|contact|reach him|email|linkedin|github|instagram|reddit|twitter|facebook|orcid)\b/.test(query),
    teaching: /\b(teaching|teacher|taught|teach|instructor|tutor|tutoring)\b/.test(query),
    thesis: /\b(thesis|dissertation|ca rnn|carrn)\b/.test(query),
    workExperience: /\b(work experience|professional experience|employment|career history|jobs?)\b/.test(query),
  };
}

function combinedSocialChunk(chunks) {
  const socialChunks = chunks.filter((chunk) => chunk.source.endsWith('/socialLinks.js'));
  if (!socialChunks.length) return null;

  return {
    id: 'combined-social-profiles',
    source: 'src/data/socialLinks.js',
    sourceType: 'structured-data',
    title: 'Social Profiles and Contact Links',
    section: 'Public profiles',
    url: '/contact',
    content: socialChunks.map((chunk) => chunk.content).join('\n\n'),
  };
}

function combinedCertificationChunk(chunks) {
  const certificationChunks = chunks.filter(
    (chunk) => chunk.source.endsWith('/certifications.js'),
  );
  if (!certificationChunks.length) return null;

  return {
    id: 'combined-certification-overview',
    source: 'src/data/certifications.js',
    sourceType: 'structured-data',
    title: 'Certification Overview',
    section: 'Data Science, Finance, and Healthcare credentials',
    url: '/about',
    content: certificationChunks.map((chunk) => chunk.content).join('\n\n'),
  };
}

function combinedWorkExperienceChunk(chunks) {
  const experienceChunks = chunks.filter((chunk) => chunk.source.endsWith('/experience.js'));
  if (!experienceChunks.length) return null;

  return {
    id: 'combined-work-experience-overview',
    source: 'src/data/experience.js',
    sourceType: 'structured-data',
    title: 'Work and Academic Experience Overview',
    section: 'Roles, organizations, and dates',
    url: '/experience',
    content: experienceChunks
      .map((chunk) => chunk.content.split('\nBullets:')[0])
      .join('\n\n'),
  };
}

function isRoutedChunk(chunk, intents) {
  const section = normalize(chunk.section);
  const routes = [];

  if (intents.social) {
    routes.push(chunk.id === 'combined-social-profiles');
  }
  if (intents.certifications) {
    routes.push(
      chunk.id === 'combined-certification-overview'
      || chunk.source.endsWith('/certDetails.md'),
    );
  }
  if (intents.courses) {
    routes.push(chunk.source.endsWith('/courses.md'));
  }
  if (intents.hobbies) {
    routes.push(chunk.source.endsWith('/hobbies.js'));
  }
  if (intents.projects) {
    routes.push(chunk.source.endsWith('/projects.js'));
  }
  if (intents.research) {
    routes.push(
      chunk.source.endsWith('/research.js')
      || (chunk.source.endsWith('/cvDetails.md') && section.includes('research interests')),
    );
  }
  if (intents.education || intents.faculty) {
    routes.push(
      chunk.source.endsWith('/education.js')
      || (intents.education && chunk.source.endsWith('/courses.md'))
      || (
        chunk.source.endsWith('/cvDetails.md')
        && /johns hopkins|rutgers|education/.test(section)
      ),
    );
  }
  if (intents.skills) {
    routes.push(
      chunk.source.endsWith('/profile.js')
      || chunk.source.endsWith('/projects.js')
      || chunk.source.endsWith('/experience.js')
      || (chunk.source.endsWith('/cvDetails.md') && section.includes('technical skills')),
    );
  }
  if (intents.thesis) {
    routes.push(
      (chunk.source.endsWith('/projects.js') && /ca rnn|calibration aware/.test(section))
      || (
        chunk.source.endsWith('/cvDetails.md')
        && /ca rnn|master s thesis|johns hopkins/.test(section)
      ),
    );
  }
  if (intents.workExperience) {
    routes.push(
      chunk.id === 'combined-work-experience-overview'
      || chunk.source.endsWith('/experience.js')
      || (
        chunk.source.endsWith('/cvDetails.md')
        && /research assistant|affiliate researcher|teaching assistant|tutor|co founder/.test(section)
      ),
    );
  }
  if (intents.teaching) {
    routes.push(
      (
        chunk.source.endsWith('/experience.js')
        && /teaching assistant|tutor/.test(section)
      )
      || (
        chunk.source.endsWith('/cvDetails.md')
        && /teaching assistant|tutor/.test(section)
      ),
    );
  }

  return routes.length === 0 || routes.some(Boolean);
}

function includesToken(text, token) {
  return token.length === 1
    ? text.split(' ').includes(token)
    : text.includes(token);
}

export async function loadKnowledgeBase() {
  if (!knowledgePromise) {
    const baseUrl = import.meta.env?.BASE_URL || '/';
    knowledgePromise = fetch(`${baseUrl}knowledge-base.json`)
      .then((response) => {
        if (!response.ok) throw new Error('The website knowledge base could not be loaded.');
        return response.json();
      })
      .catch((error) => {
        knowledgePromise = undefined;
        throw error;
      });
  }

  return knowledgePromise;
}

export function rankKnowledge(query, knowledgeBase, limit = 6) {
  const queryTokens = tokenize(query);
  const normalizedQuery = normalize(query);
  const intents = detectIntents(normalizedQuery);
  const genericCourseTerms = new Set([
    'class', 'classes', 'course', 'courses', 'coursework', 'curriculum',
    'studied', 'taken', 'used',
  ]);
  const courseTopicTokens = queryTokens.filter((token) => !genericCourseTerms.has(token));
  let candidateChunks = knowledgeBase.chunks;

  if (intents.social) {
    const socialOverview = combinedSocialChunk(knowledgeBase.chunks);
    candidateChunks = knowledgeBase.chunks.filter(
      (chunk) => !chunk.source.endsWith('/socialLinks.js'),
    );
    if (socialOverview) candidateChunks = [...candidateChunks, socialOverview];
  }
  if (intents.certifications) {
    const certificationOverview = combinedCertificationChunk(knowledgeBase.chunks);
    candidateChunks = candidateChunks.filter(
      (chunk) => !chunk.source.endsWith('/certifications.js'),
    );
    if (certificationOverview) {
      candidateChunks = [...candidateChunks, certificationOverview];
    }
  }
  if (intents.workExperience) {
    const workOverview = combinedWorkExperienceChunk(knowledgeBase.chunks);
    if (workOverview) candidateChunks = [...candidateChunks, workOverview];
  }

  candidateChunks = candidateChunks.filter((chunk) => isRoutedChunk(chunk, intents));

  if (queryTokens.length === 0) return [];

  const documentFrequency = new Map();
  candidateChunks.forEach((chunk) => {
    const tokens = new Set(tokenize(`${chunk.title} ${chunk.section} ${chunk.content}`));
    queryTokens.forEach((token) => {
      if (tokens.has(token)) {
        documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
      }
    });
  });

  const scored = candidateChunks.map((chunk) => {
    const title = normalize(chunk.title);
    const section = normalize(chunk.section);
    const content = normalize(chunk.content);
    let score = 0;

    queryTokens.forEach((token) => {
      const frequency = documentFrequency.get(token) || 0;
      const inverseFrequency = Math.log((candidateChunks.length + 1) / (frequency + 1)) + 1;
      if (includesToken(title, token)) score += 5 * inverseFrequency;
      if (includesToken(section, token)) score += 3.5 * inverseFrequency;
      if (includesToken(content, token)) score += 1.25 * inverseFrequency;
    });

    if (
      chunk.source.endsWith('/courses.md')
      && (intents.courses || normalizedQuery.includes('studied'))
    ) {
      const topicMatches = courseTopicTokens.filter(
        (token) => includesToken(title, token)
          || includesToken(section, token)
          || includesToken(content, token),
      ).length;
      score += topicMatches * 20;
    }

    if (normalizedQuery.length > 5) {
      if (title.includes(normalizedQuery)) score += 10;
      if (section.includes(normalizedQuery)) score += 7;
      if (content.includes(normalizedQuery)) score += 4;
    }

    if (intents.hobbies && chunk.source.endsWith('/hobbies.js')) score += 55;
    if (intents.faculty && chunk.source.endsWith('/education.js')) {
      score += 35;
      if (/\b(advised|adviser|advisor|supervised)\b/.test(normalizedQuery) && content.includes('advisor')) {
        score += 70;
      }
      if (normalizedQuery.includes('hopkins') && content.includes('hopkins')) score += 55;
      if (normalizedQuery.includes('rutgers') && content.includes('rutgers')) score += 55;
    }
    if (intents.research && chunk.source.endsWith('/research.js')) score += 85;
    if (
      intents.research
      && chunk.source.endsWith('/cvDetails.md')
      && section.includes('research interests')
    ) score += 65;
    if (intents.skills && chunk.source.endsWith('/profile.js')) score += 75;
    if (
      intents.skills
      && chunk.source.endsWith('/cvDetails.md')
      && section.includes('technical skills')
    ) score += 65;
    if (intents.education && chunk.source.endsWith('/education.js')) score += 80;
    if (
      intents.education
      && normalizedQuery.includes('studied')
      && chunk.source.endsWith('/courses.md')
    ) score += 70;
    if (
      intents.education
      && normalizedQuery.includes('graduate')
      && section.split(' ').includes('graduate')
    ) score += 55;
    if (
      intents.education
      && normalizedQuery.includes('graduate')
      && chunk.source.endsWith('/cvDetails.md')
      && /master|mse|johns hopkins/.test(`${section} ${content}`)
    ) score += 35;
    if (
      intents.education
      && chunk.source.endsWith('/cvDetails.md')
      && /johns hopkins|rutgers|education/.test(section)
    ) score += 50;
    if (intents.projects && chunk.source.endsWith('/projects.js')) score += 75;
    if (intents.social && chunk.id === 'combined-social-profiles') score += 110;
    if (intents.certifications && chunk.id === 'combined-certification-overview') score += 110;
    if (intents.certifications && chunk.source.endsWith('/certDetails.md')) score += 35;
    if (intents.courses && chunk.source.endsWith('/courses.md')) score += 60;
    if (intents.courses && section.includes('coursework overview')) score += 100;
    if (intents.thesis && /ca rnn|calibration aware/.test(`${section} ${content}`)) score += 100;
    if (intents.thesis && chunk.source.endsWith('/projects.js')) score += 75;
    if (intents.thesis && section.includes('master s thesis')) score += 35;
    if (intents.workExperience && chunk.id === 'combined-work-experience-overview') score += 120;
    if (intents.workExperience && chunk.source.endsWith('/experience.js')) score += 45;
    if (intents.teaching && /teaching assistant|tutor/.test(`${section} ${content}`)) score += 90;

    return { ...chunk, score };
  });

  const sourceCounts = new Map();
  const results = [];

  for (const chunk of scored.sort((a, b) => b.score - a.score)) {
    if (chunk.score <= 0) break;
    const count = sourceCounts.get(chunk.source) || 0;
    let sourceLimit = 2;
    if (intents.projects && chunk.source.endsWith('/projects.js')) sourceLimit = limit;
    if (intents.teaching) sourceLimit = 4;
    if (intents.courses && chunk.source.endsWith('/courses.md')) sourceLimit = limit;
    if (count >= sourceLimit) continue;

    results.push(chunk);
    sourceCounts.set(chunk.source, count + 1);
    if (results.length === limit) break;
  }

  return results;
}

export async function retrieveKnowledge(query, limit = 6) {
  const knowledgeBase = await loadKnowledgeBase();
  return rankKnowledge(query, knowledgeBase, limit);
}
