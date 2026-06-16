/**

 */

export const exercisesDatabase = {
  // BICEPS
  biceps: [
    {
      id: 'barbell-curl',
      frName: 'Curl barre',
      enName: 'Barbell Curl',
      muscle: 'Biceps',
      zone: 'Bras',
      series: '4×10',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0031-25GPyDY.gif',
      source: 'Tenor',
      desc: 'Debout, barre en supination. Fléchir les coudes jusqu\'à la hauteur des épaules sans bouger les coudes.'
    },
    {
      id: 'dumbbell-curl',
      frName: 'Curl haltères',
      enName: 'Dumbbell Curl',
      muscle: 'Biceps',
      zone: 'Bras',
      series: '3×12',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0294-NbVPDMW.gif',
      source: 'Tenor',
      desc: 'Alterner gauche-droite en contrôlant la descente. Tourner le poignet en haut du mouvement.'
    },
    {
      id: 'hammer-curl',
      frName: 'Curl marteau',
      enName: 'Hammer Curl',
      muscle: 'Biceps',
      zone: 'Bras',
      series: '3×12',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0313-slDvUAU.gif',
      source: 'Tenor',
      desc: 'Prise neutre (pouce vers le haut). Cible aussi le brachial et l\'avant-bras.'
    },
    {
      id: 'concentration-curl',
      frName: 'Curl concentré',
      enName: 'Concentration Curl',
      muscle: 'Biceps',
      zone: 'Bras',
      series: '3×15',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0297-gvsWLQw.gif',
      source: 'Tenor',
      desc: 'Assis, coude appuyé sur la cuisse. Excellent pour le pic du biceps.'
    }
  ],

  // TRICEPS
  triceps: [
    {
      id: 'dips',
      frName: 'Dips',
      enName: 'Dips',
      muscle: 'Triceps',
      zone: 'Bras',
      series: '4×12',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0814-X6C6i5Y.gif',
      source: 'Tenor',
      desc: 'Corps vertical, coudes près du corps. Plus efficace avec lest quand maîtrisé.'
    },
    {
      id: 'tricep-extension',
      frName: 'Extension nuque',
      enName: 'Tricep Extension',
      muscle: 'Triceps',
      zone: 'Bras',
      series: '3×12',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/2188-kont8Ut.gif',
      source: 'Tenor',
      desc: 'Haltère ou barre EZ derrière la tête. Cible le chef long du triceps.'
    },
    {
      id: 'pushdown',
      frName: 'Tirage poulie',
      enName: 'Pushdown',
      muscle: 'Triceps',
      zone: 'Bras',
      series: '4×15',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0201-3ZflifB.gif',
      source: 'Tenor',
      desc: 'Câble haute poulie, coudes fixes. Excellent pour la finition et le pump.'
    },
    {
      id: 'diamond-pushups',
      frName: 'Pompes diamant',
      enName: 'Diamond Pushups',
      muscle: 'Triceps',
      zone: 'Bras',
      series: '3×15',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0283-soIB2rj.gif',
      source: 'Tenor',
      desc: 'Mains en triangle sous le sternum. Variante au poids du corps très efficace.'
    }
  ],

  // PECTORAUX
  chest: [
    {
      id: 'barbell-bench-press',
      frName: 'Développé couché',
      enName: 'Barbell Bench Press',
      muscle: 'Pectoraux',
      zone: 'Buste',
      series: '5×8',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0025-EIeI8Vf.gif',
      source: 'Tenor',
      desc: 'Le roi des exercices de poitrine. Descendre la barre jusqu\'à effleurer le sternum.'
    },
    {
      id: 'incline-bench-press',
      frName: 'Développé incliné',
      enName: 'Incline Bench Press',
      muscle: 'Pectoraux',
      zone: 'Buste',
      series: '4×10',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0047-3TZduzM.gif',
      source: 'Tenor',
      desc: 'Banc à 30-45°. Cible le faisceau supérieur pour un pec plus complet.'
    },
    {
      id: 'dumbbell-flyes',
      frName: 'Écartés haltères',
      enName: 'Dumbbell Flyes',
      muscle: 'Pectoraux',
      zone: 'Buste',
      series: '3×12',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0308-yz9nUhF.gif',
      source: 'Tenor',
      desc: 'Légère flexion des coudes. Mouvement d\'isolation, descente lente et contrôlée.'
    },
    {
      id: 'cable-crossover',
      frName: 'Crossover câbles',
      enName: 'Cable Crossover',
      muscle: 'Pectoraux',
      zone: 'Buste',
      series: '3×15',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/1269-UKWTJWR.gif',
      source: 'Tenor',
      desc: 'Croisement des mains en bas. Étirement maximal du grand pectoral.'
    }
  ],

  // DOS
  back: [
    {
      id: 'pull-ups',
      frName: 'Tractions',
      enName: 'Pull-ups',
      muscle: 'Dos',
      zone: 'Dos',
      series: '4×8',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0652-lBDjFxJ.gif',
      source: 'Tenor',
      desc: 'Prise large pronation. Le squat du dos. Ajouter du lest progressivement.'
    },
    {
      id: 'barbell-rows',
      frName: 'Rowing barre',
      enName: 'Barbell Rows',
      muscle: 'Dos',
      zone: 'Dos',
      series: '4×10',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0027-eZyBC3j.gif',
      source: 'Tenor',
      desc: 'Tronc parallèle au sol, tirer vers le nombril. Excellent pour l\'épaisseur.'
    },
    {
      id: 'lat-pulldown',
      frName: 'Tirage poulie haute',
      enName: 'Lat Pulldown',
      muscle: 'Dos',
      zone: 'Dos',
      series: '3×12',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/2330-LEprlgG.gif',
      source: 'Tenor',
      desc: 'Tirer vers le haut du sternum. Alternatif aux tractions pour les débutants.'
    },
    {
      id: 'deadlift',
      frName: 'Soulevé de terre',
      enName: 'Deadlift',
      muscle: 'Dos',
      zone: 'Dos',
      series: '4×6',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0032-ila4NZS.gif',
      source: 'Tenor',
      desc: 'Le mouvement roi. Dos droit, gainage total, poussée des talons dans le sol.'
    }
  ],

  // ÉPAULES
  shoulders: [
    {
      id: 'overhead-press',
      frName: 'Développé militaire',
      enName: 'Overhead Press',
      muscle: 'Épaules',
      zone: 'Épaules',
      series: '4×10',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/1456-wdRZISl.gif',
      source: 'Tenor',
      desc: 'Debout ou assis, barre ou haltères. Cible le faisceau antérieur en priorité.'
    },
    {
      id: 'lateral-raise',
      frName: 'Élévation latérale',
      enName: 'Lateral Raise',
      muscle: 'Épaules',
      zone: 'Épaules',
      series: '4×15',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0334-DsgkuIt.gif',
      source: 'Tenor',
      desc: 'Petits poids, coudes légèrement fléchis. Faisceau latéral = épaules larges.'
    },
    {
      id: 'reverse-fly',
      frName: 'Oiseau (Rear delt)',
      enName: 'Reverse Fly',
      muscle: 'Épaules',
      zone: 'Épaules',
      series: '3×15',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0383-EAs3xL9.gif',
      source: 'Tenor',
      desc: 'Tronc penché, bras en croix. Indispensable pour équilibrer posture et force.'
    },
    {
      id: 'shrugs',
      frName: 'Shrugs',
      enName: 'Shrugs',
      muscle: 'Épaules',
      zone: 'Épaules',
      series: '4×12',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0406-NJzBsGJ.gif',
      source: 'Tenor',
      desc: 'Haussement d\'épaules avec haltères ou barre. Cible les trapèzes supérieurs.'
    }
  ],

  // JAMBES
  legs: [
    {
      id: 'barbell-squat',
      frName: 'Squat',
      enName: 'Barbell Squat',
      muscle: 'Jambes',
      zone: 'Jambes',
      series: '5×8',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0043-qXTaZnJ.gif',
      source: 'Tenor',
      desc: 'Le roi des exercices. Descendre cuisses parallèles, dos droit, genoux dans l\'axe.'
    },
    {
      id: 'leg-press',
      frName: 'Presse à cuisses',
      enName: 'Leg Press',
      muscle: 'Jambes',
      zone: 'Jambes',
      series: '4×12',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0739-10Z2DXU.gif',
      source: 'Tenor',
      desc: 'Pieds hauts = ischios/fessiers. Pieds bas = quadriceps. Contrôler la montée.'
    },
    {
      id: 'lunges',
      frName: 'Fentes marchées',
      enName: 'Lunges',
      muscle: 'Jambes',
      zone: 'Jambes',
      series: '3×10',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/1460-IZVHb27.gif',
      source: 'Tenor',
      desc: 'Chaque jambe. Grand pas, genou avant à 90°. Excellent pour l\'équilibre.'
    },
    {
      id: 'leg-extension',
      frName: 'Leg extension',
      enName: 'Leg Extension',
      muscle: 'Jambes',
      zone: 'Jambes',
      series: '3×15',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0585-my33uHU.gif',
      source: 'Tenor',
      desc: 'Isolation quadriceps. Finition en fin de séance pour le pump.'
    },
    {
      id: 'leg-curl',
      frName: 'Leg curl',
      enName: 'Leg Curl',
      muscle: 'Jambes',
      zone: 'Jambes',
      series: '3×15',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0586-17lJ1kr.gif',
      source: 'Tenor',
      desc: 'Isolation ischios-jambiers. Ne pas négliger les muscles postérieurs.'
    }
  ],

  // ABDOMINAUX
  abs: [
    {
      id: 'plank',
      frName: 'Gainage planche',
      enName: 'Plank',
      muscle: 'Abdominaux',
      zone: 'Core',
      series: '4×60s',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/2135-VBAWRPG.gif',
      source: 'Tenor',
      desc: 'Corps aligné, contractez abdos et fessiers. Base indispensable du gainage.'
    },
    {
      id: 'cable-crunch',
      frName: 'Crunch câble',
      enName: 'Cable Crunch',
      muscle: 'Abdominaux',
      zone: 'Core',
      series: '4×20',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0175-WW95auq.gif',
      source: 'Tenor',
      desc: 'Plus efficace que le crunch classique car résistance constante sur tout le mouvement.'
    },
    {
      id: 'leg-raise',
      frName: 'Relevé de jambes',
      enName: 'Leg Raise',
      muscle: 'Abdominaux',
      zone: 'Core',
      series: '3×15',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0620-WhuFnR7.gif',
      source: 'Tenor',
      desc: 'Suspendu ou allongé. Cible le bas du ventre (droit inférieur).'
    },
    {
      id: 'russian-twist',
      frName: 'Russian twist',
      enName: 'Russian Twist',
      muscle: 'Abdominaux',
      zone: 'Core',
      series: '3×20',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0687-XVDdcoj.gif',
      source: 'Tenor',
      desc: 'Avec médecine-ball ou haltère. Cible les obliques et la rotation du tronc.'
    }
  ],

  // MOLLETS
  calves: [
    {
      id: 'standing-calf-raise',
      frName: 'Extensions mollets debout',
      enName: 'Standing Calf Raise',
      muscle: 'Mollets',
      zone: 'Jambes',
      series: '5×20',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/1372-8ozhUIZ.gif',
      source: 'Tenor',
      desc: 'Amplitude complète, tenir 1s en haut. Les mollets récupèrent vite, volume élevé.'
    },
    {
      id: 'seated-calf-raise',
      frName: 'Extensions mollets assis',
      enName: 'Seated Calf Raise',
      muscle: 'Mollets',
      zone: 'Jambes',
      series: '4×20',
      gif: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0594-bOOdeyc.gif',
      source: 'Tenor',
      desc: 'Cible le soléaire (muscle profond). Indispensable pour des mollets complets.'
    }
  ]
};


export const getExercisesByMuscle = (muscle) => {
  const allExercises = Object.values(exercisesDatabase).flat();
  return allExercises.filter(ex => ex.muscle === muscle);
};

export const getValidExercises = () => {
  const allExercises = Object.values(exercisesDatabase).flat();
  return allExercises.filter(ex => ex.gif && ex.gif.trim() !== '');
};

export default exercisesDatabase;
