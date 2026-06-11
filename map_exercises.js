const fs = require('fs');
const path = require('path');
const exercises = JSON.parse(fs.readFileSync(path.join(__dirname, 'scraped_exercises.json'), 'utf8'));

const mapping = {
  // Biceps
  "barbell-curl": "0031", // Let's check if 0031 exists or find the ID for "barbell curl"
  "dumbbell-curl": "0294", // Let's check dumbbell curl ID
  "hammer-curl": "0313", // Let's check hammer curl ID
  "concentration-curl": "0297",
  
  // Triceps
  "dips": "0814", // triceps dip
  "tricep-extension": "2188", // dumbbell seated triceps extension
  "pushdown": "0201", // cable pushdown
  "diamond-pushups": "0283", // diamond push-up
  
  // Chest
  "barbell-bench-press": "0025",
  "incline-bench-press": "0047",
  "dumbbell-flyes": "0308",
  "cable-crossover": "1269", // cable standing up straight crossovers
  
  // Back
  "pull-ups": "0652",
  "barbell-rows": "0027",
  "lat-pulldown": "2330", // cable lat pulldown full range of motion
  "deadlift": "0032",
  
  // Shoulders
  "overhead-press": "1456", // barbell standing close grip military press
  "lateral-raise": "0334",
  "reverse-fly": "0383",
  "shrugs": "0406", // dumbbell shrug
  
  // Legs
  "barbell-squat": "0043", // barbell full squat
  "leg-press": "0739", // sled 45° leg press
  "lunges": "1460", // walking lunge
  "leg-extension": "0585",
  "leg-curl": "0586",
  
  // Abs
  "plank": "2135", // weighted front plank (we can also use Tenor if we want, let's see what 2135 looks like)
  "cable-crunch": "0175",
  "leg-raise": "0620", // lying leg raise flat bench
  "russian-twist": "0687",
  
  // Calves
  "standing-calf-raise": "1372", // barbell standing calf raise
  "seated-calf-raise": "0594" // lever seated calf raise
};

for (const [key, id] of Object.entries(mapping)) {
  const match = exercises.find(ex => ex.id === id);
  if (match) {
    console.log(`MATCHED: "${key}" -> ID: ${match.id} | Name: ${match.name} | Target: ${match.target} | Gif: ${match.gif_url}`);
  } else {
    console.log(`❌ NOT FOUND: "${key}" with ID: ${id}`);
    // Let's find similar
    const namePart = key.replace('-', ' ');
    const parts = exercises.filter(ex => ex.name.toLowerCase().includes(namePart));
    console.log(`  Partials:`);
    parts.slice(0, 3).forEach(p => console.log(`    - ID: ${p.id} | Name: ${p.name}`));
  }
}
