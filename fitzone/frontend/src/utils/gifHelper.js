/**
 * Helper Script - Recherche et Validation des GIFs d'Exercices
 * 
 * Usage:
 * 1. Sauvegarder ce fichier dans src/utils/
 * 2. Utiliser dans un composant de gestion ou directement en console
 * 
 * Exemples:
 * - findGifUrl('Barbell Curl', 'tenor')
 * - validateUrl('https://media.tenor.com/...')
 * - getAllMissingGifs()
 */

import exercisesDatabase from '../data/exerciseGifs';

/**
 * Valide si une URL d'image est accessible
 */
export const validateUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return response.ok || response.status === 0; // 0 = mode no-cors
  } catch (e) {
    console.warn(`❌ URL invalide: ${url}`);
    return false;
  }
};

/**
 * Obtient tous les exercices sans GIF
 */
export const getMissingGifs = () => {
  const allExercises = Object.values(exercisesDatabase).flat();
  return allExercises.filter(ex => !ex.gif || ex.gif.trim() === '');
};

/**
 * Obtient les URL Tenor par catégorie
 * À remplir manuellement après recherche sur tenor.com
 */
export const tenorSearchGuide = {
  biceps: {
    'Barbell Curl': 'https://tenor.com/search/barbell-biceps-curl-gym',
    'Dumbbell Curl': 'https://tenor.com/search/dumbbell-curl-biceps',
    'Hammer Curl': 'https://tenor.com/search/hammer-curl-dumbbell',
    'Concentration Curl': 'https://tenor.com/search/concentration-curl-biceps'
  },
  triceps: {
    'Dips': 'https://tenor.com/search/dips-triceps-gym',
    'Tricep Extension': 'https://tenor.com/search/triceps-extension-pushdown',
    'Pushdown': 'https://tenor.com/search/triceps-pushdown-cable',
    'Diamond Pushups': 'https://tenor.com/search/diamond-pushups-triceps'
  },
  chest: {
    'Barbell Bench Press': 'https://tenor.com/search/bench-press-chest',
    'Incline Bench Press': 'https://tenor.com/search/incline-bench-press',
    'Dumbbell Flyes': 'https://tenor.com/search/dumbbell-chest-fly',
    'Cable Crossover': 'https://tenor.com/search/cable-crossover-chest'
  },
  back: {
    'Pull-ups': 'https://tenor.com/search/pull-ups-chin-ups',
    'Barbell Rows': 'https://tenor.com/search/barbell-row-bent-over',
    'Lat Pulldown': 'https://tenor.com/search/lat-pulldown',
    'Deadlift': 'https://tenor.com/search/deadlift-form'
  },
  shoulders: {
    'Overhead Press': 'https://tenor.com/search/overhead-press-military',
    'Lateral Raise': 'https://tenor.com/search/lateral-raise-dumbbell',
    'Reverse Fly': 'https://tenor.com/search/reverse-pec-fly-rear-delt',
    'Shrugs': 'https://tenor.com/search/shrugs-dumbbell-traps'
  },
  legs: {
    'Barbell Squat': 'https://tenor.com/search/squat-barbell-gym',
    'Leg Press': 'https://tenor.com/search/leg-press-machine',
    'Lunges': 'https://tenor.com/search/lunges-workout',
    'Leg Extension': 'https://tenor.com/search/leg-extension-quadriceps',
    'Leg Curl': 'https://tenor.com/search/leg-curl-hamstring'
  },
  abs: {
    'Plank': 'https://tenor.com/search/plank-exercise',
    'Cable Crunch': 'https://tenor.com/search/cable-crunch-abs',
    'Leg Raise': 'https://tenor.com/search/leg-raise-abs',
    'Russian Twist': 'https://tenor.com/search/russian-twist-abs'
  },
  calves: {
    'Standing Calf Raise': 'https://tenor.com/search/calf-raise-standing',
    'Seated Calf Raise': 'https://tenor.com/search/calf-raise-seated'
  }
};

/**
 * MuscleWiki - Les URLs directes
 * Format: https://cdn.musclewiki.org/media/uploaded_videos/[exercise]/[exercise]-[variation].gif
 */
export const muscleWikiDirect = {
  biceps: {
    'Barbell Curl': 'https://cdn.musclewiki.org/media/uploaded_videos/barbell%20curl/barbell%20curl-front.gif',
    'Dumbbell Curl': 'https://cdn.musclewiki.org/media/uploaded_videos/dumbbell%20curl/dumbbell%20curl-front.gif',
    'Hammer Curl': 'https://cdn.musclewiki.org/media/uploaded_videos/hammer%20curl/hammer%20curl-front.gif',
    'Concentration Curl': 'https://cdn.musclewiki.org/media/uploaded_videos/concentration%20curl/concentration%20curl-front.gif'
  },
  triceps: {
    'Dips': 'https://cdn.musclewiki.org/media/uploaded_videos/dips/dips-front.gif',
    'Tricep Extension': 'https://cdn.musclewiki.org/media/uploaded_videos/tricep%20extension/tricep%20extension-front.gif',
    'Pushdown': 'https://cdn.musclewiki.org/media/uploaded_videos/triceps%20pushdown/triceps%20pushdown-front.gif',
    'Diamond Pushups': 'https://cdn.musclewiki.org/media/uploaded_videos/diamond%20push%20ups/diamond%20push%20ups-front.gif'
  },
  chest: {
    'Barbell Bench Press': 'https://cdn.musclewiki.org/media/uploaded_videos/barbell%20bench%20press/barbell%20bench%20press-front.gif',
    'Incline Bench Press': 'https://cdn.musclewiki.org/media/uploaded_videos/incline%20barbell%20bench%20press/incline%20barbell%20bench%20press-front.gif',
    'Dumbbell Flyes': 'https://cdn.musclewiki.org/media/uploaded_videos/dumbbell%20fly/dumbbell%20fly-front.gif',
    'Cable Crossover': 'https://cdn.musclewiki.org/media/uploaded_videos/cable%20fly/cable%20fly-front.gif'
  },
  back: {
    'Pull-ups': 'https://cdn.musclewiki.org/media/uploaded_videos/pull%20ups/pull%20ups-front.gif',
    'Barbell Rows': 'https://cdn.musclewiki.org/media/uploaded_videos/bent%20over%20barbell%20row/bent%20over%20barbell%20row-front.gif',
    'Lat Pulldown': 'https://cdn.musclewiki.org/media/uploaded_videos/lat%20pulldown/lat%20pulldown-front.gif',
    'Deadlift': 'https://cdn.musclewiki.org/media/uploaded_videos/deadlift/deadlift-front.gif'
  },
  shoulders: {
    'Overhead Press': 'https://cdn.musclewiki.org/media/uploaded_videos/overhead%20press/overhead%20press-front.gif',
    'Lateral Raise': 'https://cdn.musclewiki.org/media/uploaded_videos/dumbbell%20lateral%20raise/dumbbell%20lateral%20raise-front.gif',
    'Reverse Fly': 'https://cdn.musclewiki.org/media/uploaded_videos/dumbbell%20reverse%20fly/dumbbell%20reverse%20fly-front.gif',
    'Shrugs': 'https://cdn.musclewiki.org/media/uploaded_videos/dumbbell%20shrugs/dumbbell%20shrugs-front.gif'
  },
  legs: {
    'Barbell Squat': 'https://cdn.musclewiki.org/media/uploaded_videos/barbell%20back%20squat/barbell%20back%20squat-front.gif',
    'Leg Press': 'https://cdn.musclewiki.org/media/uploaded_videos/leg%20press/leg%20press-front.gif',
    'Lunges': 'https://cdn.musclewiki.org/media/uploaded_videos/dumbbell%20lunges/dumbbell%20lunges-front.gif',
    'Leg Extension': 'https://cdn.musclewiki.org/media/uploaded_videos/leg%20extension/leg%20extension-front.gif',
    'Leg Curl': 'https://cdn.musclewiki.org/media/uploaded_videos/leg%20curl/leg%20curl-front.gif'
  },
  abs: {
    'Plank': 'https://cdn.musclewiki.org/media/uploaded_videos/plank/plank-front.gif',
    'Cable Crunch': 'https://cdn.musclewiki.org/media/uploaded_videos/cable%20crunch/cable%20crunch-front.gif',
    'Leg Raise': 'https://cdn.musclewiki.org/media/uploaded_videos/leg%20raises/leg%20raises-front.gif',
    'Russian Twist': 'https://cdn.musclewiki.org/media/uploaded_videos/russian%20twist/russian%20twist-front.gif'
  },
  calves: {
    'Standing Calf Raise': 'https://cdn.musclewiki.org/media/uploaded_videos/calf%20raise/calf%20raise-front.gif',
    'Seated Calf Raise': 'https://cdn.musclewiki.org/media/uploaded_videos/seated%20calf%20raise/seated%20calf%20raise-front.gif'
  }
};

/**
 * ExRx.net - Format standard
 */
export const exrxDirect = {
  back: {
    'Deadlift': 'https://exrx.net/Animations/DeadliftStraightBar.gif',
    'Pull-ups': 'https://exrx.net/Animations/PullUpWide.gif',
    'Barbell Rows': 'https://exrx.net/Animations/BentOverBarbell.gif',
    'Lat Pulldown': 'https://exrx.net/Animations/LatPulldownWide.gif'
  },
  chest: {
    'Barbell Bench Press': 'https://exrx.net/Animations/BenchPressBarbell.gif',
    'Dumbbell Flyes': 'https://exrx.net/Animations/Flyes.gif',
  },
  legs: {
    'Barbell Squat': 'https://exrx.net/Animations/BackSquat.gif',
    'Leg Press': 'https://exrx.net/Animations/LegPress.gif',
    'Lunges': 'https://exrx.net/Animations/DumbbellLunge.gif',
  }
};

/**
 * Teste toutes les URLs MuscleWiki
 */
export const testAllMuscleWikiUrls = async () => {
  console.log('🔍 Vérification des URLs MuscleWiki...');
  const results = {};
  
  for (const [category, exercises] of Object.entries(muscleWikiDirect)) {
    results[category] = {};
    for (const [name, url] of Object.entries(exercises)) {
      const isValid = await validateUrl(url);
      results[category][name] = {
        url,
        valid: isValid ? '✅' : '❌'
      };
      console.log(`${isValid ? '✅' : '❌'} ${category} - ${name}`);
    }
  }
  
  return results;
};

/**
 * Génère un rapport des GIFs manquants
 */
export const generateMissingReport = () => {
  const missing = getMissingGifs();
  console.log(`\n📊 RAPPORT DES GIFs MANQUANTS\n`);
  console.log(`Total manquant: ${missing.length}/31\n`);
  
  const byMuscle = {};
  missing.forEach(ex => {
    if (!byMuscle[ex.muscle]) byMuscle[ex.muscle] = [];
    byMuscle[ex.muscle].push(ex.frName);
  });
  
  Object.entries(byMuscle).forEach(([muscle, exercises]) => {
    console.log(`${muscle}: ${exercises.join(', ')}`);
  });
  
  return missing;
};

/**
 * Instructions pour Tenor (le plus fiable actuellement)
 */
export const tenorInstructions = `
⭐ TENOR - MÉTHODE RAPIDE

1. Aller sur https://tenor.com
2. Pour chaque exercice, chercher: "[Exercice] gym form"
3. Sélectionner le GIF le mieux noté
4. Clic droit → "Ouvrir l'image dans un nouvel onglet"
5. Copier l'URL depuis la barre d'adresse
6. Format attendu: https://media.tenor.com/[ID]/[name].gif

Exemples valides:
- https://media.tenor.com/RL3CbJbPvhwAAAAd/standing-barbell-biceps-curl.gif
- https://media.tenor.com/6uinYQq-1TYAAAAM/biceps-curl.gif
- https://media.tenor.com/Pvlmd3Y97goAAAAd/dips-tricep.gif

Ces URLs tendent à être stables longtemps.
`;

export default {
  validateUrl,
  getMissingGifs,
  generateMissingReport,
  testAllMuscleWikiUrls,
  muscleWikiDirect,
  exrxDirect,
  tenorSearchGuide,
  tenorInstructions
};
