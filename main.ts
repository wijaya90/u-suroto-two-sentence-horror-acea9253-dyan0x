// u-suroto-two-sentence-horror-acea9253: writes one original two-sentence
// horror story to entry.txt. Deterministic: same bytes on every run.
// Node 22 standard library only. No network, no input, no secrets.
//
// The story: a dying man's "delusion" is reframed by the second sentence
// as something real, aware, and now noticing the nurse herself. The horror
// is implied (what does the chair do with a name?) and the concrete details
// (chart, Tuesday/Thursday, a different pen) carry the turn.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const STORY =
  "My grandfather's hospice nurse wrote in his chart on Tuesday that he talks to the empty chair now. On Thursday she crossed it out and wrote, in a different pen, 'The chair answers, and it knows my name.'";

// Gate contract: UTF-8 text, 1-400 characters, exactly two sentences.
// Returns the two sentences. Fail loudly instead of writing an invalid entry.
function validate(story: string): [string, string] {
  if (story.length < 1 || story.length > 400) {
    throw new Error(`story must be 1-400 chars, got ${story.length}`);
  }
  if (/[\r\n]/.test(story)) {
    throw new Error("story must be a single block of text, no newlines");
  }
  const sentences = story.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
  if (sentences.length !== 2) {
    throw new Error(`story must be exactly two sentences, got ${sentences.length}`);
  }
  // Each sentence must end in terminal punctuation (allowing a trailing
  // closing quote, e.g. ...my name.')
  for (const s of sentences) {
    if (!/[.!?]['"”’]?$/.test(s.trim())) {
      throw new Error(`sentence does not end in terminal punctuation: ${s}`);
    }
  }
  return [sentences[0], sentences[1]];
}

const [firstSentence, secondSentence] = validate(STORY);
void firstSentence;
void secondSentence;

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), STORY, "utf8");
console.log(STORY);
