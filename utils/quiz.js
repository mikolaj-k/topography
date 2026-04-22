import { shuffle, pickN, regionLabel } from "./helpers";

const QUESTION_TYPES = [
  "WHERE_IS",
  "WHAT_COUNTY",
  "CAVE_TYPE",
  "IDENTIFY_HINT",
  "WHICH_IN_REG",
];

const MAX_RETRIES = 10;

export function generateQuestion(pool, difficulty, regions, attempt = 0) {
  if (attempt >= MAX_RETRIES) return null;

  const usePool = difficulty === "hard"
    ? pool.filter(l => l.category === "Jaskinie" || l.category === "Skałki")
    : pool;

  if (usePool.length < 4) return null;

  const hasJaskinie = pool.some(l => l.category === "Jaskinie");
  const validTypes = QUESTION_TYPES.filter(t => {
    if (t === "CAVE_TYPE") return hasJaskinie;
    return true;
  });
  const type = validTypes[Math.floor(Math.random() * validTypes.length)];

  if (type === "WHERE_IS") {
    const target = usePool[Math.floor(Math.random() * usePool.length)];
    const correct = regionLabel(target.region, regions);
    const otherRegions = Object.keys(regions).filter(r => r !== target.region);
    const wrongs = shuffle(otherRegions).slice(0, 2).map(r => regionLabel(r, regions));
    return {
      prompt: `Gdzie leży: ${target.name}?`,
      subprompt: target.subcategory,
      options: shuffle([correct, ...wrongs, "poza obszarem"]).slice(0, 4),
      correct,
      target,
    };
  }

  if (type === "WHAT_COUNTY") {
    const target = usePool[Math.floor(Math.random() * usePool.length)];
    const correct = target.county;
    const wrongs = [...new Set(pickN(usePool, 10, target.id).map(l => l.county))]
      .filter(c => c !== correct)
      .slice(0, 3);
    if (wrongs.length < 2) return generateQuestion(pool, difficulty, regions, attempt + 1);
    return {
      prompt: `W jakiej gminie/lokalizacji znajduje się: ${target.name}?`,
      subprompt: target.category,
      options: shuffle([correct, ...wrongs].slice(0, 4)),
      correct,
      target,
    };
  }

  if (type === "CAVE_TYPE") {
    const caves = usePool.filter(l => l.category === "Jaskinie");
    if (caves.length < 4) return generateQuestion(pool, difficulty, regions, attempt + 1);
    const target = caves[Math.floor(Math.random() * caves.length)];
    const correct = target.subcategory;
    const otherSubs = [...new Set(caves.map(c => c.subcategory).filter(s => s !== correct))];
    if (otherSubs.length < 2) return generateQuestion(pool, difficulty, regions, attempt + 1);
    const wrongs = shuffle(otherSubs).slice(0, 3);
    return {
      prompt: `Jaki typ ma jaskinia: ${target.name}?`,
      subprompt: "podtyp operacyjny",
      options: shuffle([correct, ...wrongs].slice(0, 4)),
      correct,
      target,
    };
  }

  if (type === "IDENTIFY_HINT") {
    const target = usePool[Math.floor(Math.random() * usePool.length)];
    const hint = target.quizHints?.[0] || target.description || target.name;
    if (!hint) return generateQuestion(pool, difficulty, regions, attempt + 1);
    const wrongs = pickN(usePool.filter(l => l.category === target.category), 3, target.id);
    return {
      prompt: `Co to: „${hint}"?`,
      subprompt: target.category,
      options: shuffle([target.name, ...wrongs.map(w => w.name)]),
      correct: target.name,
      target,
    };
  }

  if (type === "WHICH_IN_REG") {
    const regionKeys = Object.keys(regions);
    const reg = regionKeys[Math.floor(Math.random() * regionKeys.length)];
    const inReg = usePool.filter(l => l.region === reg);
    const notInReg = usePool.filter(l => l.region !== reg);
    if (inReg.length < 1 || notInReg.length < 3) return generateQuestion(pool, difficulty, regions, attempt + 1);
    const correctObj = inReg[Math.floor(Math.random() * inReg.length)];
    const wrongs = pickN(notInReg, 3);
    return {
      prompt: `Który z tych obiektów leży w: ${regionLabel(reg, regions)}?`,
      subprompt: "rozpoznawanie regionu",
      options: shuffle([correctObj.name, ...wrongs.map(w => w.name)]),
      correct: correctObj.name,
      target: correctObj,
    };
  }

  return generateQuestion(pool, difficulty, regions, attempt + 1);
}
