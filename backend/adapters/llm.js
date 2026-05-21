const { v4: uuidv4 } = require('uuid');
// Mock LLM adapter: deterministic token generator for local dev
function generateTokens(formData) {
  const id = `XKT-${uuidv4().split('-')[0]}`;
  const vibe = (formData.vibe || 'Minimalista').toLowerCase();
  const palette = (formData.colors && formData.colors.hexes) || ['#000000','#333333','#E5E5E5'];

  const tokens = {
    projectId: id,
    meta: { source: 'web', vibe: formData.vibe || 'Minimalista', createdAt: new Date().toISOString(), llmVersion: 'mock-llm-v1' },
    colors: {
      bg: { hex: palette[2], role: 'background' },
      text: { hex: palette[0], role: 'text', contrastAgainst: 'bg' },
      accent: { hex: palette[1] || '#E11D48', role: 'accent', contrastAgainst: 'bg' }
    },
    type: { baseFont: 'Inter', scale: [{name:'h1',size:48,lineHeight:56,weight:700},{name:'body',size:16,lineHeight:24,weight:400}] },
    spacing: { base: 8, scale: [8,16,24,32] },
    radius: { small:6, medium:12, large:20 },
    elevation: { none: 'none', sm: '0 1px 3px rgba(0,0,0,0.08)' },
    components: [ { name: 'button.primary', role: 'cta', props: { background: 'accent', textColor: '#FFFFFF', padding: [12,24], radius: 'medium' }, variants: ['default','hover','disabled'] } ],
    colorPairs: [{ foreground: '#FFFFFF', background: palette[1] || '#E11D48', contrastRatio: 4.7 }]
  };

  return tokens;
}

module.exports = { generateTokens };
