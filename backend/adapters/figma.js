// Mock Figma adapter for local dev
const { v4: uuidv4 } = require('uuid');

function createMockFile(designTokens) {
  const fileId = `mock-${uuidv4()}`;
  const url = `https://figma.mock/${fileId}`;
  const nodes = { HeroFrame: '0:1', ButtonPrimary: '0:2' };
  return { fileId, url, nodes };
}

module.exports = { createMockFile };
