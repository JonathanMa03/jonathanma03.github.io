import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { buildKnowledgeBase } from './scripts/build-knowledge-base.mjs';

const knowledgeSourcePattern = /src\/(?:content|data)\//;

function knowledgeBasePlugin() {
  let pendingBuild = Promise.resolve();

  const generate = () => {
    pendingBuild = pendingBuild
      .catch(() => undefined)
      .then(() => buildKnowledgeBase());
    return pendingBuild;
  };

  return {
    name: 'website-knowledge-base',
    async buildStart() {
      await generate();
    },
    async handleHotUpdate({ file, server }) {
      if (!knowledgeSourcePattern.test(file)) return;
      await generate();
      server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [knowledgeBasePlugin(), react()],
});
