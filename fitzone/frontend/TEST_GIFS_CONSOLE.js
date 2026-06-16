/**
 
 */

console.log('🔍 Test des URLs des exercices FitZone...\n');

// URLs à tester (pré-remplies depuis exerciseGifs-POPULATED.js)
const exerciseUrls = {
  biceps: [
    { name: 'Curl barre', url: 'https://media.tenor.com/RL3CbJbPvhwAAAAd/standing-barbell-biceps-curl.gif' },
    { name: 'Curl haltères', url: 'https://media.tenor.com/6uinYQq-1TYAAAAM/biceps-curl.gif' },
    { name: 'Curl marteau', url: 'https://media.tenor.com/kEGK-a7q__AAAAAd/hammar-curl.gif' },
    { name: 'Curl concentré', url: 'https://media.tenor.com/jaX3EUxaQGkAAAAM/rosca-concentrada-no-banco.gif' }
  ],
  triceps: [
    { name: 'Dips', url: 'https://media.tenor.com/Pvlmd3Y97goAAAAd/dips-tricep.gif' },
    { name: 'Extension nuque', url: 'https://media.tenor.com/8T_oLOn1XJwAAAAM/tricep-extension-rope.gif' },
    { name: 'Tirage poulie', url: 'https://media.tenor.com/DJ-GuvjNCwgAAAAM/triceps-pushdown.gif' },
    { name: 'Pompes diamant', url: 'https://media.tenor.com/XJZa937El1cAAAAM/diamond-pushups.gif' }
  ],
  chest: [
    { name: 'Développé couché', url: 'https://media.tenor.com/xQJ4fZr6spUAAAAM/bench-press-chest.gif' },
    { name: 'Développé incliné', url: 'https://media.tenor.com/iO6D-DBFRTcAAAAM/incline-bench-press.gif' },
    { name: 'Écartés haltères', url: 'https://media.tenor.com/QsbI3bt31_4AAAAd/dumbbell-chest-fly.gif' },
    { name: 'Crossover câbles', url: 'https://media.tenor.com/xK_thNxtf8oAAAAM/cable-crossover.gif' }
  ],
  back: [
    { name: 'Tractions', url: 'https://media.tenor.com/bVaaFuFP9poAAAAM/pull-up-fitness.gif' },
    { name: 'Rowing barre', url: 'https://media.tenor.com/TlXWuDo9bAwAAAAM/barbell-row.gif' },
    { name: 'Tirage poulie haute', url: 'https://media.tenor.com/AR6A1jMcnE8AAAAd/lat-pull-down.gif' },
    { name: 'Soulevé de terre', url: 'https://media.tenor.com/VmwTfksln8wAAAAM/deadlift.gif' }
  ],
  shoulders: [
    { name: 'Développé militaire', url: 'https://media.tenor.com/cy46UbnfUrkAAAAM/overhead-press.gif' },
    { name: 'Élévation latérale', url: 'https://media.tenor.com/VdCASDhF7NMAAAAd/lateral-raise.gif' },
    { name: 'Oiseau (Rear delt)', url: 'https://media.tenor.com/rogbjO9DVF8AAAAM/reverse-fly-rear-delt.gif' },
    { name: 'Shrugs', url: 'https://media.tenor.com/Emm_nwKi5jAAAAAM/shrugs-trapeze.gif' }
  ],
  legs: [
    { name: 'Squat', url: 'https://media.tenor.com/pdMmsiutWkcAAAAM/squat-gym.gif' },
    { name: 'Presse à cuisses', url: 'https://media.tenor.com/NTFFAuzj5TgAAAAM/leg-press-gym.gif' },
    { name: 'Fentes marchées', url: 'https://media.tenor.com/iO6D-DBFRTcAAAAM/lunges-workout.gif' },
    { name: 'Leg extension', url: 'https://media.tenor.com/xP8fvT1L8b4AAAAM/leg-extension.gif' },
    { name: 'Leg curl', url: 'https://media.tenor.com/wyaIxbl4pcUAAAAM/leg-curl-hamstring.gif' }
  ],
  abs: [
    { name: 'Gainage planche', url: 'https://media.tenor.com/PVR9ra9tAwcAAAAM/plank-exercise.gif' },
    { name: 'Crunch câble', url: 'https://media.tenor.com/yEnvkPC3jDoAAAAM/cable-crunch.gif' },
    { name: 'Relevé de jambes', url: 'https://media.tenor.com/2pV3gPUg-TEAAAAC/leg-raises.gif' },
    { name: 'Russian twist', url: 'https://media.tenor.com/8T_oLOn1XJwAAAAM/russian-twist.gif' }
  ],
  calves: [
    { name: 'Extensions mollets debout', url: 'https://media.tenor.com/XJZa937El1cAAAAM/calf-raise-standing.gif' },
    { name: 'Extensions mollets assis', url: 'https://media.tenor.com/Emm_nwKi5jAAAAAM/calf-raise-seated.gif' }
  ]
};

/**
 * Fonction pour tester une URL
 */
async function testUrl(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Tester toutes les URLs
 */
async function runTests() {
  let totalCount = 0;
  let validCount = 0;
  let invalidCount = 0;
  const results = {};

  for (const [category, exercises] of Object.entries(exerciseUrls)) {
    console.log(`\n📋 ${category.toUpperCase()}`);
    results[category] = [];

    for (const exercise of exercises) {
      const isValid = await testUrl(exercise.url);
      totalCount++;
      
      if (isValid) {
        validCount++;
        console.log(`  ✅ ${exercise.name}`);
      } else {
        invalidCount++;
        console.log(`  ❌ ${exercise.name}`);
      }
      
      results[category].push({
        name: exercise.name,
        url: exercise.url,
        valid: isValid
      });
    }
  }

  // Résumé
  console.log('\n' + '='.repeat(50));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(50));
  console.log(`✅ Valides: ${validCount}/${totalCount}`);
  console.log(`❌ Invalides: ${invalidCount}/${totalCount}`);
  console.log(`📈 Taux de réussite: ${Math.round((validCount/totalCount)*100)}%`);
  
  if (invalidCount > 0) {
    console.log('\n⚠️  URLs à remplacer:');
    for (const [category, exercises] of Object.entries(results)) {
      const invalid = exercises.filter(e => !e.valid);
      if (invalid.length > 0) {
        invalid.forEach(ex => {
          console.log(`   - ${category}: ${ex.name}`);
        });
      }
    }
  }
  
  console.log('\n✨ Test terminé!');
  return results;
}

// Lancer les tests
console.log('⏳ Vérification en cours... (cela peut prendre 10-30 secondes)\n');
runTests().then(results => {
  console.log('\nDonnées complètes disponibles dans la variable "results"');
  window.testResults = results;
});

/**
 * Fonction utilitaire pour exporter les résultats
 */
window.exportResults = function() {
  const json = JSON.stringify(window.testResults, null, 2);
  console.log('\n📋 Export JSON:');
  console.log(json);
  // Copy to clipboard
  copy(json);
  console.log('✅ Copié dans le presse-papiers!');
};

/**
 * Fonction utilitaire pour afficher les URLs invalides
 */
window.showInvalid = function() {
  const invalid = [];
  for (const [category, exercises] of Object.entries(window.testResults)) {
    exercises.forEach(ex => {
      if (!ex.valid) {
        invalid.push(`${category}: ${ex.name}\n${ex.url}`);
      }
    });
  }
  console.table(invalid);
};

/**
 * Instructions pour l'utilisateur
 */
console.log('\n' + '='.repeat(50));
console.log('ℹ️  INSTRUCTIONS');
console.log('='.repeat(50));
console.log(`
COMMANDES DISPONIBLES:
  • exportResults()  → Exporter les résultats en JSON
  • showInvalid()    → Afficher les URLs invalides
  • testResults      → Variable avec tous les résultats

NEXT STEPS:
  1. Attendre que le test se termine
  2. Vérifier le résumé et les URLs invalides
  3. Pour chaque URL invalide:
     a. Aller sur https://tenor.com
     b. Chercher l'exercice
     c. Copier la nouvelle URL
     d. Mettre à jour dans exerciseGifs-POPULATED.js
  4. Re-tester après chaque modification
`);
