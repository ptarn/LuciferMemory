import { readFileSync } from 'fs';

export default {
  id: 'LuciferMemory',
  name: 'Lucifer Memory Loader',
  description: 'Injects memory from JSON files into system_prompt',

  async onEnable(ctx) {
    console.log('[LuciferMemory] onEnable() triggered.'); // Debug log line

    try {
      const userMemory = JSON.parse(readFileSync('../llm_memory/user_memory.json', 'utf-8'));
      const activeMemory = JSON.parse(readFileSync('../llm_memory/active_memory.json', 'utf-8'));

      const summary = [];

      if (userMemory.name) summary.push(`User name: ${userMemory.name}`);
      if (userMemory.tone) summary.push(`Tone: ${userMemory.tone}`);
      if (userMemory.interaction_style) summary.push(`Interaction style: ${userMemory.interaction_style}`);

      if (userMemory.personality_flags) {
        summary.push(
          `Personality flags:\n${Object.entries(userMemory.personality_flags)
            .map(([k, v]) => `- ${k}: ${v}`)
            .join('\n')}`
        );
      }

      if (userMemory.story_preferences && userMemory.story_preferences.themes) {
        summary.push(`Story themes: ${userMemory.story_preferences.themes.join(', ')}`);
      }

      if (activeMemory.current_truths) {
        summary.push(`Current truths:\n${activeMemory.current_truths.map(t => `- ${t}`).join('\n')}`);
      }

      if (activeMemory.working_goals) {
        for (const [category, goals] of Object.entries(activeMemory.working_goals)) {
          summary.push(`${category}:\n${goals.map(g => `- ${g}`).join('\n')}`);
        }
      }

      if (activeMemory.reflections) {
        summary.push(`Reflections:\n${activeMemory.reflections.map(r => `- ${r}`).join('\n')}`);
      }

      const combinedMemory = summary.join('\n\n');

      ctx.setSystemPrompt(combinedMemory);
      console.log('[LuciferMemory] Memory injected into system_prompt.');
    } catch (err) {
      console.error('[LuciferMemory] Failed to load memory:', err);
    }
  },

  async onDisable(ctx) {
    ctx.setSystemPrompt('');
    console.log('[LuciferMemory] System prompt cleared.');
  },
};
