const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

const ajv = new Ajv({ allErrors: true, strict: false });
const schemaPath = path.resolve(__dirname, '..', 'Docs', 'design-tokens.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const validate = ajv.compile(schema);

function validateTokens(tokens) {
  const valid = validate(tokens);
  return { valid, errors: validate.errors };
}

module.exports = { validateTokens };
