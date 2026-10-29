import type { Lesson, Style } from "./lessons";

export const spanishLessons: Record<Style, Lesson[]> = {
  salsa: [
    {
      id: "salsa-rhythm",
      title: "Encuentra tu ritmo",
      subtitle: "Descubre el conteo de ocho tiempos.",
      tag: "Musicalidad",
      learn:
        "La salsa On1 empieza con un ritmo sencillo: tres pasos y una pausa. Repítelo dos veces para completar ocho tiempos. Puedes aprender este ritmo sin desplazarte.",
      steps: [
        "Coloca los pies bajo las caderas y relaja las rodillas.",
        "Marcha suavemente en el sitio en 1, 2 y 3. Mantén el peso en el 4.",
        "Marcha en 5, 6 y 7. Mantén el peso en el 8. Cuenta en voz alta.",
        "Repite con pasos pequeños. Deja que las pausas sean tan naturales como los pasos.",
      ],
      tip: "Las pausas también forman parte del baile. Sigue contando en el 4 y el 8.",
      question: "¿En qué tiempos haces una pausa en salsa On1?",
      answers: ["2 y 6", "4 y 8", "1 y 5"],
      correct: 1,
    },
    {
      id: "salsa-basic",
      title: "Tu primer paso básico",
      subtitle: "Un pequeño paso hacia delante. Una nueva sensación.",
      tag: "Pasos",
      learn:
        "El básico hacia delante y atrás usa el ritmo que ya conoces. Estos pasos en solitario empiezan con el pie izquierdo; en pareja, el otro rol realiza el patrón en espejo.",
      steps: [
        "En el 1, da un paso pequeño hacia delante con el pie izquierdo.",
        "En el 2, vuelve a apoyar el peso en el derecho. En el 3, recoge el izquierdo bajo el cuerpo. Pausa en el 4.",
        "En el 5, lleva el derecho hacia atrás. En el 6, cambia el peso al izquierdo.",
        "En el 7, recoge el derecho bajo el cuerpo. Pausa en el 8 y repite.",
      ],
      tip: "Da pasos pequeños para cambiar el peso sin inclinar el cuerpo.",
      question:
        "Después de avanzar con el izquierdo en el 1, ¿qué haces en el 2?",
      answers: [
        "Otro paso hacia delante",
        "Un toque con el izquierdo",
        "Vuelves a apoyar el peso en el derecho",
      ],
      correct: 2,
    },
    {
      id: "salsa-side",
      title: "Lleva el básico al lateral",
      subtitle: "El mismo ritmo. Una nueva dirección.",
      tag: "Pasos",
      learn:
        "El básico lateral cambia la dirección de tus pasos sin cambiar el conteo. Mantén los pies lo bastante cerca para conservar el equilibrio con comodidad.",
      steps: [
        "En el 1, da un paso a la izquierda con el pie izquierdo.",
        "En el 2, cambia el peso al derecho. En el 3, recoge el izquierdo bajo el cuerpo. Pausa en el 4.",
        "En el 5, da un paso a la derecha con el derecho. En el 6, cambia el peso al izquierdo.",
        "En el 7, recoge el derecho bajo el cuerpo. Pausa en el 8 y repite con suavidad.",
      ],
      tip: "Piensa en cambiar el peso, en lugar de recorrer más espacio.",
      question: "¿Qué cambia entre el básico hacia delante y el lateral?",
      answers: [
        "La dirección de los pasos",
        "Los tiempos de pausa",
        "El número de tiempos",
      ],
      correct: 0,
    },
    {
      id: "salsa-flow",
      title: "Combina lo que sabes",
      subtitle: "Crea tu propio pequeño baile.",
      tag: "Práctica",
      learn:
        "Ya conoces dos básicos. Ahora conéctalos sin perder el ritmo. Termina los ocho tiempos antes de cambiar de patrón. Empieza aquí si ya dominas el conteo y los básicos.",
      steps: [
        "Baila ocho tiempos completos del básico hacia delante y atrás.",
        "En el siguiente 1, empieza ocho tiempos del básico lateral.",
        "Alterna ambos patrones. Mantén las pausas en el 4 y el 8.",
        "Intenta mirar al frente en lugar de a tus pies. Vuelve a empezar cuando lo necesites.",
      ],
      tip: "Si pierdes el ritmo, para, cuenta ocho tiempos y vuelve a entrar en el 1.",
      question: "¿Cuándo es un buen momento para cambiar de patrón básico?",
      answers: [
        "En mitad de cualquier paso",
        "Después de ocho tiempos completos",
        "Solo cuando acaba la canción",
      ],
      correct: 1,
    },
  ],
  bachata: [
    {
      id: "bachata-rhythm",
      title: "Encuentra tu ritmo",
      subtitle: "Tres pequeños pasos. Un toque suave.",
      tag: "Musicalidad",
      learn:
        "La bachata repite un patrón de paso, paso, paso y toque. Cuenta hasta ocho, con un toque ligero en el 4 y el 8. Empieza en el sitio y date tiempo para sentir el ritmo.",
      steps: [
        "Colócate con las rodillas relajadas y el peso en el pie derecho.",
        "Pisa en el sitio con izquierdo, derecho e izquierdo en 1, 2 y 3. Toca con la punta del derecho en el 4.",
        "Pisa con derecho, izquierdo y derecho en 5, 6 y 7. Toca con el izquierdo en el 8.",
        "Repite. El pie que toca queda ligero, listo para dar el siguiente paso.",
      ],
      tip: "En el toque rozas el suelo sin trasladar el peso a ese pie.",
      question: "¿En qué tiempos haces el toque en bachata?",
      answers: ["1 y 5", "3 y 7", "4 y 8"],
      correct: 2,
    },
    {
      id: "bachata-side",
      title: "Tu primer paso lateral",
      subtitle: "Dale un poco de espacio a tu ritmo.",
      tag: "Pasos",
      learn:
        "Deja que el patrón de tres pasos y un toque se desplace hacia los lados. Necesitas poco espacio. Este patrón en solitario empieza hacia la izquierda; en pareja puedes hacerlo en espejo.",
      steps: [
        "En el 1, pisa a la izquierda. En el 2, acerca el derecho al izquierdo y cambia el peso.",
        "En el 3, vuelve a pisar a la izquierda. En el 4, toca con la punta del derecho junto al izquierdo.",
        "En el 5, pisa a la derecha. En el 6, acerca el izquierdo al derecho y cambia el peso.",
        "En el 7, vuelve a pisar a la derecha. En el 8, toca con el izquierdo. Repite.",
      ],
      tip: "Haz pasos compactos y mantén el tronco erguido con comodidad.",
      question:
        "Tras tocar con el derecho en el 4, ¿con qué pie das el siguiente paso?",
      answers: ["Con el derecho", "Con el izquierdo", "Con ambos a la vez"],
      correct: 0,
    },
    {
      id: "bachata-tap",
      title: "Haz que el toque sea natural",
      subtitle: "Menos esfuerzo. Un poco más de fluidez.",
      tag: "Técnica",
      learn:
        "El toque es un contacto ligero, no otro cambio de peso. Relaja las rodillas al trasladar el peso. Deja que la cadera se mueva de forma natural, sin forzarla.",
      steps: [
        "Practica tres pasos lentos hacia la izquierda y cambia el peso en cada uno.",
        "Toca con la punta del derecho sin apoyarte en él. El peso sigue en el izquierdo.",
        "Desplázate a la derecha con tres pasos y toca con el izquierdo.",
        "Relaja los hombros y deja que los cambios de peso guíen el movimiento.",
      ],
      tip: "Si el siguiente paso te cuesta, comprueba que no has apoyado el peso en el pie del toque.",
      question: "¿Dónde debe estar el peso durante el toque?",
      answers: [
        "En el pie que toca",
        "En el pie de apoyo",
        "Repartido por igual entre los dos",
      ],
      correct: 1,
    },
    {
      id: "bachata-flow",
      title: "Encuentra tu fluidez",
      subtitle: "Una pequeña práctica que ya se siente como bailar.",
      tag: "Práctica",
      learn:
        "Une el ritmo, los pasos laterales y los toques suaves. Alterna desplazamientos laterales y pasos en el sitio manteniendo el conteo de ocho tiempos. Empieza aquí si ya conoces los básicos.",
      steps: [
        "Baila ocho tiempos completos del básico lateral.",
        "Baila los siguientes ocho tiempos en el sitio, con toques en el 4 y el 8.",
        "Alterna ambos patrones con hombros relajados y pasos pequeños.",
        "Intenta mirar al frente. Si pierdes el ritmo, cuenta y vuelve a entrar en el 1.",
      ],
      tip: "La constancia se construye volviendo a lo esencial. Un poco cada día es suficiente.",
      question:
        "Al pasar del lateral a los pasos en el sitio, ¿qué se mantiene?",
      answers: [
        "La distancia que recorres",
        "El ritmo y los toques en el 4 y el 8",
        "La dirección del desplazamiento",
      ],
      correct: 1,
    },
  ],
};
