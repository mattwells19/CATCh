export type Story = {
  name: string;
  topic: string;
  videoId: string;
  /** Short teaser quote shown in the carousel on the class page. */
  quote: string;
  /** Full quote shown on the dedicated stories page. */
  fullQuote: string;
  /** Long-form description paragraphs shown on the dedicated stories page. */
  paragraphs: string[];
};

export const stories: Story[] = [
  {
    name: "Clarissa",
    topic: "Confidence",
    videoId: "JivQSqJrKIw",
    quote: "That first moment is scary, but then it always turns out fun.",
    fullQuote: `“That first moment is scary, but then it always turns out fun. That's one of the things you really learn: whatever you say, that's what the scene is. It really helps you with yourself, with how your mind works, and interacting with other people.”`,
    paragraphs: [
      `"I want to feel more confident" is a goal we hear frequently on Day 1 of Improv Fundamentals class. Your beginning improv class is a safe, supportive, energizing, and hilarious space to find your confidence.`,
      `In each 2.5 hour class, students will learn the foundations of improv such as; saying “yes, and…,” active listening, staying present in the moment, collaboration, and empowering the self. In this class, there are no mistakes and everything is a gift as we reinvigorate our sense of play!`,
      `Join the fun today! In addition to 6 weeks of class, your tuition also gives you FREE tickets to come see our shows. That's right, FREE shows for you to any of our non-sold-out performances while you're a student.`,
    ],
  },
  {
    name: "Hillary",
    topic: "Saying Yes",
    videoId: "hDXuUbfYwSU",
    quote:
      'It’s about saying “yes” to yourself, to shedding your fears and leaving them at the door.',
    fullQuote: `“It's about saying "yes" to yourself, to shedding your fears and leaving them at the door.”`,
    paragraphs: [
      `How often do you find yourself saying "no," or "maybe" instead of saying "Yes"? In today's world, it can be easy to get caught up in social media, the news, and our daily grind. It's important to carve out time to say yes to ourselves and do something that challenges us. The classes at CATCh are all about creating an encouraging environment to students looking to develop the "self," as they express their creativity in a new way.`,
    ],
  },
];
