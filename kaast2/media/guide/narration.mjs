/** Write the guide narration (all chapters) as tts.py input: node media/guide/narration.mjs > out.json */
import { CHAPTERS } from './chapters.mjs';
const segments = CHAPTERS.flatMap((c) => c.segments.map((s) => ({ id: s.id, text: s.text })));
process.stdout.write(JSON.stringify({ voice: 'af_heart', speed: 1.0, lang: 'en-us', segments }, null, 1));
