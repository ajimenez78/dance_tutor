export type Style = "salsa" | "bachata";
export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  learn: string;
  steps: string[];
  tip: string;
  question: string;
  answers: string[];
  correct: number;
};

export const styles = {
  salsa: {
    name: "Salsa",
    feel: "A little energy. A lot of joy.",
    description:
      "Find the beat, learn the basics, and bring a little more energy to your day.",
    timing: "Step, step, step, hold.",
    source: "https://thedancedojo.com/how-to-salsa-dance-for-beginners/",
  },
  bachata: {
    name: "Bachata",
    feel: "Slow down. Settle into the music.",
    description:
      "Start with a simple side step and discover the beauty of moving with the music.",
    timing: "Step, step, step, tap.",
    source: "https://thedancedojo.com/bachata-basic-step/",
  },
};

export const lessons: Record<Style, Lesson[]> = {
  salsa: [
    {
      id: "salsa-rhythm",
      title: "Find your rhythm",
      subtitle: "Meet the eight-count that starts it all.",
      tag: "Musicality",
      learn:
        "Salsa On1 starts with a simple rhythm: three steps, then a hold. Repeat it twice to make eight counts. You can learn the rhythm without moving anywhere.",
      steps: [
        "Stand with your feet under your hips and soften your knees.",
        "March gently in place on 1, 2, 3. Hold your weight on 4.",
        "March on 5, 6, 7. Hold on 8. Say the numbers out loud.",
        "Repeat with small steps. Let the pauses feel as natural as the steps.",
      ],
      tip: "The holds are part of the dance. Keep counting through 4 and 8.",
      question: "Which counts do you hold in Salsa On1?",
      answers: ["2 and 6", "4 and 8", "1 and 5"],
      correct: 1,
    },
    {
      id: "salsa-basic",
      title: "Your first basic step",
      subtitle: "A small step forward. A whole new feeling.",
      tag: "Footwork",
      learn:
        "The forward-and-back basic uses the rhythm you already know. These solo steps start with your left foot; in partner dancing, the other role mirrors the pattern.",
      steps: [
        "On 1, take a small step forward with your left foot.",
        "On 2, shift your weight back onto your right. On 3, bring your left back underneath you. Hold 4.",
        "On 5, step back with your right. On 6, shift onto your left.",
        "On 7, bring your right back underneath you. Hold 8, then repeat.",
      ],
      tip: "Keep your steps small enough that you can shift your weight without leaning.",
      question:
        "After stepping forward with your left on 1, what happens on 2?",
      answers: [
        "Take another step forward",
        "Tap the left foot",
        "Shift weight back onto the right",
      ],
      correct: 2,
    },
    {
      id: "salsa-side",
      title: "Take it to the side",
      subtitle: "Same rhythm. A different direction.",
      tag: "Footwork",
      learn:
        "The side basic changes the direction of your steps while keeping your familiar timing. Keep your feet close enough to stay comfortably balanced.",
      steps: [
        "Step left with your left foot on 1.",
        "Shift weight onto your right on 2. Close your left under you on 3. Hold 4.",
        "Step right with your right on 5. Shift onto your left on 6.",
        "Close your right under you on 7. Hold 8. Repeat softly.",
      ],
      tip: "Think about changing your weight, rather than covering more floor.",
      question: "What changes between the forward basic and the side basic?",
      answers: [
        "The direction of the steps",
        "The counts you hold",
        "The number of beats",
      ],
      correct: 0,
    },
    {
      id: "salsa-flow",
      title: "Put it all together",
      subtitle: "Make a little dance of your own.",
      tag: "Practice",
      learn:
        "You know two basics. Now connect them, keeping your timing steady. Finish a full eight-count before changing the pattern.",
      steps: [
        "Dance one full eight-count of the forward-and-back basic.",
        "On the next 1, begin one full eight-count of the side basic.",
        "Alternate the patterns. Keep holding on 4 and 8.",
        "Try looking ahead instead of at your feet. Start again whenever you need.",
      ],
      tip: "If you lose the rhythm, pause, count an eight, and rejoin on 1.",
      question: "When is a good moment to change your basic pattern?",
      answers: [
        "In the middle of any step",
        "After a complete eight-count",
        "Only after the song ends",
      ],
      correct: 1,
    },
  ],
  bachata: [
    {
      id: "bachata-rhythm",
      title: "Find your rhythm",
      subtitle: "Three little steps. One gentle tap.",
      tag: "Musicality",
      learn:
        "Bachata has a repeating step-step-step-tap rhythm. Count to eight, with a light tap on 4 and 8. Start in place and give yourself time to settle into it.",
      steps: [
        "Stand comfortably with soft knees and your weight on your right foot.",
        "Step in place left, right, left on 1, 2, 3. Tap your right toe on 4.",
        "Step right, left, right on 5, 6, 7. Tap your left toe on 8.",
        "Repeat. The tapping foot stays light, ready for the next step.",
      ],
      tip: "A tap touches the floor without transferring your weight onto that foot.",
      question: "On which counts do you tap in Bachata?",
      answers: ["1 and 5", "3 and 7", "4 and 8"],
      correct: 2,
    },
    {
      id: "bachata-side",
      title: "Your first side step",
      subtitle: "Give your rhythm a little room.",
      tag: "Footwork",
      learn:
        "Let your step-step-step-tap travel sideways. You only need a little space. This solo pattern begins to the left; you can mirror it when dancing with a partner.",
      steps: [
        "Step left on 1. Bring your right foot toward your left on 2, changing weight.",
        "Step left again on 3. Tap your right toe beside your left on 4.",
        "Step right on 5. Bring your left toward your right on 6, changing weight.",
        "Step right again on 7. Tap your left on 8. Repeat.",
      ],
      tip: "Keep the steps compact and let your upper body stay comfortably upright.",
      question: "After tapping your right foot on 4, which foot steps next?",
      answers: ["Your right foot", "Your left foot", "Both feet together"],
      correct: 0,
    },
    {
      id: "bachata-tap",
      title: "Make the tap feel natural",
      subtitle: "Less effort. A little more flow.",
      tag: "Technique",
      learn:
        "The tap is a light touch rather than another weight change. Let your knees soften as you shift your weight. Your hips can move naturally; there is no need to force them.",
      steps: [
        "Practice three slow steps to your left, changing your weight each time.",
        "Tap your right toe without leaning onto it. Your weight stays on your left.",
        "Travel to your right with three steps, then tap your left.",
        "Relax your shoulders and let the weight changes guide your movement.",
      ],
      tip: "If the next step feels awkward, check that you kept your weight off the tapping foot.",
      question: "Where should your weight be during a tap?",
      answers: [
        "On the tapping foot",
        "On the standing foot",
        "Equally on both feet",
      ],
      correct: 1,
    },
    {
      id: "bachata-flow",
      title: "Find your flow",
      subtitle: "A small practice that feels like dancing.",
      tag: "Practice",
      learn:
        "Bring together your rhythm, side steps and light taps. You can alternate between traveling sideways and stepping in place, always keeping the same eight-count.",
      steps: [
        "Dance one full eight-count of the side basic.",
        "Dance the next eight-count in place, still tapping on 4 and 8.",
        "Alternate the two patterns with relaxed shoulders and small steps.",
        "Try looking ahead. If you lose your place, count and start again on 1.",
      ],
      tip: "Consistency comes from returning to the basics. A little every day is enough.",
      question:
        "When you switch from side steps to stepping in place, what stays the same?",
      answers: [
        "The distance you travel",
        "The rhythm and taps on 4 and 8",
        "The direction you move",
      ],
      correct: 1,
    },
  ],
};
