import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import matter from 'gray-matter';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDirectories = [
  { directory: path.join(rootDir, 'src/content/blog'), type: 'blog' },
  { directory: path.join(rootDir, 'src/content/extras'), type: 'extra' },
];
const dataDirectory = path.join(rootDir, 'src/data');
const outputPath = path.join(rootDir, 'public/knowledge-base.json');
const maxChunkLength = 1_600;

function hash(value) {
  return createHash('sha256').update(value).digest('hex');
}

function humanize(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function cleanValue(value) {
  if (typeof value === 'function' || value === undefined) return undefined;

  if (Array.isArray(value)) {
    return value.map(cleanValue).filter((item) => item !== undefined);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, nestedValue]) => [key, cleanValue(nestedValue)])
        .filter(([, nestedValue]) => nestedValue !== undefined),
    );
  }

  return value;
}

function valueToText(value, depth = 0) {
  const indentation = '  '.repeat(depth);

  if (value === null) return 'None';
  if (typeof value !== 'object') return String(value);

  if (Array.isArray(value)) {
    if (value.every((item) => typeof item !== 'object' || item === null)) {
      return value.map(String).join(', ');
    }

    return value
      .map((item) => {
        const rendered = valueToText(item, depth + 1);
        return `${indentation}- ${rendered.replace(/^\s+/, '').replace(/\n/g, `\n${indentation}  `)}`;
      })
      .join('\n');
  }

  return Object.entries(value)
    .map(([key, nestedValue]) => {
      const label = humanize(key);
      if (nestedValue && typeof nestedValue === 'object') {
        return `${label}:\n${valueToText(nestedValue, depth + 1)}`;
      }
      return `${label}: ${valueToText(nestedValue, depth + 1)}`;
    })
    .join('\n');
}

function splitText(text) {
  const normalized = text.trim();
  if (normalized.length <= maxChunkLength) return [normalized];

  const paragraphs = normalized.split(/\n\s*\n/);
  const chunks = [];
  let current = '';

  const pushCurrent = () => {
    if (current.trim()) chunks.push(current.trim());
    current = '';
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxChunkLength) {
      pushCurrent();
      for (let index = 0; index < paragraph.length; index += maxChunkLength) {
        chunks.push(paragraph.slice(index, index + maxChunkLength).trim());
      }
      continue;
    }

    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length > maxChunkLength) pushCurrent();
    current = current ? `${current}\n\n${paragraph}` : paragraph;
  }

  pushCurrent();
  return chunks;
}

function makeChunks({ source, sourceType, title, section, url, content }) {
  return splitText(content).map((chunkContent, index) => {
    const identity = `${source}|${title}|${section}|${index}|${chunkContent}`;
    return {
      id: hash(identity).slice(0, 16),
      source,
      sourceType,
      title,
      section,
      url: url || null,
      content: chunkContent,
    };
  });
}

function markdownSections(content, fallbackTitle) {
  const sections = [];
  let current = { heading: fallbackTitle, lines: [] };

  for (const line of content.split('\n')) {
    const headingMatch = line.match(/^#{1,4}\s+(.+)$/);
    if (headingMatch) {
      if (current.lines.some((entry) => entry.trim())) sections.push(current);
      current = { heading: headingMatch[1].trim(), lines: [] };
      continue;
    }
    current.lines.push(line);
  }

  if (current.lines.some((entry) => entry.trim())) sections.push(current);
  return sections;
}

async function buildMarkdownChunks() {
  const chunks = [];
  let sourceCount = 0;

  for (const { directory, type } of contentDirectories) {
    const files = (await readdir(directory)).filter((file) => file.endsWith('.md')).sort();

    for (const file of files) {
      const absolutePath = path.join(directory, file);
      const raw = await readFile(absolutePath, 'utf8');
      const parsed = matter(raw);
      if (parsed.data.enabled === false) continue;

      sourceCount += 1;
      const slug = path.basename(file, '.md');
      const source = path.relative(rootDir, absolutePath);
      const title = parsed.data.title || humanize(slug);
      const url = parsed.data.sourceUrl || (type === 'blog' ? `/blog/${slug}` : null);

      for (const section of markdownSections(parsed.content, title)) {
        chunks.push(
          ...makeChunks({
            source,
            sourceType: type,
            title,
            section: section.heading,
            url,
            content: section.lines.join('\n'),
          }),
        );
      }
    }
  }

  return { chunks, sourceCount };
}

function itemTitle(item, fallback) {
  if (!item || typeof item !== 'object') return fallback;
  return item.name || item.title || item.role || item.label || item.level || fallback;
}

function chunksFromDataValue({ value, source, sourceTitle, section, url }) {
  const clean = cleanValue(value);
  if (clean === undefined) return [];

  return makeChunks({
    source,
    sourceType: 'structured-data',
    title: sourceTitle,
    section,
    url,
    content: valueToText(clean),
  });
}

async function buildDataChunks() {
  const chunks = [];
  let sourceCount = 0;
  const files = (await readdir(dataDirectory))
    .filter((file) => file.endsWith('.js') && file !== 'posts.js')
    .sort();

  for (const file of files) {
    const absolutePath = path.join(dataDirectory, file);
    const source = path.relative(rootDir, absolutePath);
    const sourceTitle = humanize(path.basename(file, '.js'));
    const cacheKey = `${pathToFileURL(absolutePath).href}?knowledge=${Date.now()}`;
    const module = await import(cacheKey);
    const value = module.default;
    sourceCount += 1;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const section = itemTitle(item, `${sourceTitle} ${index + 1}`);
        chunks.push(
          ...chunksFromDataValue({ value: item, source, sourceTitle, section }),
        );
      });
      continue;
    }

    if (value && typeof value === 'object') {
      for (const [key, nestedValue] of Object.entries(value)) {
        if (Array.isArray(nestedValue) && nestedValue.some((item) => item && typeof item === 'object')) {
          nestedValue.forEach((item, index) => {
            const fallback = `${humanize(key)} ${index + 1}`;
            chunks.push(
              ...chunksFromDataValue({
                value: item,
                source,
                sourceTitle,
                section: itemTitle(item, fallback),
              }),
            );
          });
        } else {
          chunks.push(
            ...chunksFromDataValue({
              value: nestedValue,
              source,
              sourceTitle,
              section: humanize(key),
            }),
          );
        }
      }
      continue;
    }

    chunks.push(
      ...chunksFromDataValue({
        value,
        source,
        sourceTitle,
        section: sourceTitle,
      }),
    );
  }

  return { chunks, sourceCount };
}

export async function buildKnowledgeBase() {
  const [markdown, data] = await Promise.all([
    buildMarkdownChunks(),
    buildDataChunks(),
  ]);
  const chunks = [...markdown.chunks, ...data.chunks];
  const base = {
    schemaVersion: 1,
    sourceCount: markdown.sourceCount + data.sourceCount,
    chunkCount: chunks.length,
    chunks,
  };
  const payload = {
    ...base,
    contentHash: hash(JSON.stringify(base)),
  };

  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return payload;
}

const invokedDirectly = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  const result = await buildKnowledgeBase();
  console.log(
    `Knowledge base generated: ${result.sourceCount} sources, ${result.chunkCount} chunks.`,
  );
}
