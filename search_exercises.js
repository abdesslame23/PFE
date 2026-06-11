const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'scraped_exercises.json');
if (!fs.existsSync(jsonPath)) {
  console.error("File scraped_exercises.json does not exist yet.");
  process.exit(1);
}

const exercises = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const targets = [
  "barbell curl", "dumbbell curl", "hammer curl", "concentration curl",
  "dips", "tricep extension", "pushdown", "diamond push",
  "bench press", "dumbbell fly", "cable crossover", "cable fly",
  "pull-up", "chin-up", "barbell row", "bent over row", "lat pulldown", "deadlift",
  "overhead press", "military press", "lateral raise", "reverse fly", "rear delt", "shrug",
  "squat", "leg press", "lunge", "leg extension", "leg curl",
  "plank", "cable crunch", "leg raise", "russian twist", "calf raise"
];

console.log(`Searching through ${exercises.length} exercises...`);

targets.forEach(target => {
  console.log(`\n🔍 Searching for: '${target}'`);
  const matches = exercises.filter(ex => ex.name.toLowerCase().includes(target));
  matches.forEach(m => {
    console.log(`  - Name: ${m.name} | ID: ${m.id} | Target: ${m.target} | Gif: ${m.gif_url}`);
  });
});
