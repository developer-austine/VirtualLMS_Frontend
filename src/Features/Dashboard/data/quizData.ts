export interface QuizOption {
  key: "a" | "b" | "c" | "d";
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correctAnswer: "a" | "b" | "c" | "d";
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  timeLimit: number; // minutes
  totalMarks: number;
  instructions: string;
  questions: QuizQuestion[];
}

export const quizzes: Quiz[] = [
  {
    id: "q1",
    title: "Quiz 1 — Mobile Gaming Programming",
    courseId: "3",
    timeLimit: 30,
    totalMarks: 20,
    instructions: "Answer all questions. Each question carries 2 marks. No negative marking. Ensure you have a stable internet connection before starting.",
    questions: [
      {
        id: 1,
        question: "Which of the following is the primary programming language used in Unity game engine?",
        options: [
          { key: "a", text: "Java" },
          { key: "b", text: "C#" },
          { key: "c", text: "Python" },
          { key: "d", text: "Kotlin" },
        ],
        correctAnswer: "b",
      },
      {
        id: 2,
        question: "What does GPU stand for in the context of game development?",
        options: [
          { key: "a", text: "General Processing Unit" },
          { key: "b", text: "Graphics Processing Unit" },
          { key: "c", text: "Game Programming Utility" },
          { key: "d", text: "Global Processing Unit" },
        ],
        correctAnswer: "b",
      },
      {
        id: 3,
        question: "Which of the following best describes a 'game loop'?",
        options: [
          { key: "a", text: "A loop that runs only once when the game starts" },
          { key: "b", text: "A function that loads game assets from the internet" },
          { key: "c", text: "A continuous loop that updates game state and renders frames" },
          { key: "d", text: "A loop that handles only user input events" },
        ],
        correctAnswer: "c",
      },
      {
        id: 4,
        question: "In mobile game development, what is the role of a physics engine?",
        options: [
          { key: "a", text: "To render 3D graphics on screen" },
          { key: "b", text: "To simulate real-world physical interactions like gravity and collision" },
          { key: "c", text: "To manage network requests between game clients" },
          { key: "d", text: "To compress game assets for smaller APK size" },
        ],
        correctAnswer: "b",
      },
      {
        id: 5,
        question: "Which coordinate system does Unity use by default?",
        options: [
          { key: "a", text: "Left-handed coordinate system" },
          { key: "b", text: "Polar coordinate system" },
          { key: "c", text: "Right-handed coordinate system" },
          { key: "d", text: "Cylindrical coordinate system" },
        ],
        correctAnswer: "a",
      },
      {
        id: 6,
        question: "What is a 'sprite' in 2D game development?",
        options: [
          { key: "a", text: "A type of game shader" },
          { key: "b", text: "A 2D image or animation used to represent a game object" },
          { key: "c", text: "A background music file" },
          { key: "d", text: "A physics collision layer" },
        ],
        correctAnswer: "b",
      },
      {
        id: 7,
        question: "Which of the following is NOT a common mobile game monetization strategy?",
        options: [
          { key: "a", text: "In-app purchases" },
          { key: "b", text: "Rewarded ads" },
          { key: "c", text: "Subscription model" },
          { key: "d", text: "Hardware overclocking" },
        ],
        correctAnswer: "d",
      },
      {
        id: 8,
        question: "What does FPS stand for in game development?",
        options: [
          { key: "a", text: "First Person Shooter" },
          { key: "b", text: "Frames Per Second" },
          { key: "c", text: "File Processing System" },
          { key: "d", text: "Both A and B" },
        ],
        correctAnswer: "d",
      },
      {
        id: 9,
        question: "Which component in Unity is responsible for detecting collisions between objects?",
        options: [
          { key: "a", text: "Renderer" },
          { key: "b", text: "Animator" },
          { key: "c", text: "Collider" },
          { key: "d", text: "Transform" },
        ],
        correctAnswer: "c",
      },
      {
        id: 10,
        question: "What is the purpose of 'object pooling' in game development?",
        options: [
          { key: "a", text: "To store game save data in a database" },
          { key: "b", text: "To reuse objects instead of creating and destroying them repeatedly for performance" },
          { key: "c", text: "To group players into matchmaking pools" },
          { key: "d", text: "To manage multiplayer server connections" },
        ],
        correctAnswer: "b",
      },
    ],
  },
  {
    id: "q2",
    title: "Quiz 1 — Advanced Java Programming",
    courseId: "1",
    timeLimit: 25,
    totalMarks: 20,
    instructions: "Answer all questions carefully. Each correct answer awards 2 marks. Once started, the timer cannot be paused.",
    questions: [
      {
        id: 1,
        question: "Which keyword is used to prevent a class from being subclassed in Java?",
        options: [
          { key: "a", text: "static" },
          { key: "b", text: "abstract" },
          { key: "c", text: "final" },
          { key: "d", text: "sealed" },
        ],
        correctAnswer: "c",
      },
      {
        id: 2,
        question: "What is the output of: System.out.println(10 / 3); in Java?",
        options: [
          { key: "a", text: "3.33" },
          { key: "b", text: "3" },
          { key: "c", text: "4" },
          { key: "d", text: "Compilation error" },
        ],
        correctAnswer: "b",
      },
      {
        id: 3,
        question: "Which interface must be implemented to make a Java class sortable using Collections.sort()?",
        options: [
          { key: "a", text: "Serializable" },
          { key: "b", text: "Comparable" },
          { key: "c", text: "Cloneable" },
          { key: "d", text: "Runnable" },
        ],
        correctAnswer: "b",
      },
      {
        id: 4,
        question: "In Java, what does the 'volatile' keyword guarantee?",
        options: [
          { key: "a", text: "The variable is immutable" },
          { key: "b", text: "The variable is visible to all threads immediately after a write" },
          { key: "c", text: "The variable is stored in stack memory" },
          { key: "d", text: "The variable cannot be null" },
        ],
        correctAnswer: "b",
      },
      {
        id: 5,
        question: "Which Java collection allows duplicate elements and maintains insertion order?",
        options: [
          { key: "a", text: "HashSet" },
          { key: "b", text: "TreeSet" },
          { key: "c", text: "ArrayList" },
          { key: "d", text: "HashMap" },
        ],
        correctAnswer: "c",
      },
      {
        id: 6,
        question: "What is method overriding in Java?",
        options: [
          { key: "a", text: "Defining multiple methods with the same name but different parameters" },
          { key: "b", text: "Redefining a superclass method in a subclass with the same signature" },
          { key: "c", text: "Calling a method from a different class" },
          { key: "d", text: "Hiding a static method in a subclass" },
        ],
        correctAnswer: "b",
      },
      {
        id: 7,
        question: "Which of the following is true about Java's garbage collector?",
        options: [
          { key: "a", text: "It runs on a fixed schedule every 5 seconds" },
          { key: "b", text: "The programmer controls exactly when it runs" },
          { key: "c", text: "It automatically reclaims memory from unreachable objects" },
          { key: "d", text: "It only works on primitive data types" },
        ],
        correctAnswer: "c",
      },
      {
        id: 8,
        question: "What does the 'transient' keyword do in Java?",
        options: [
          { key: "a", text: "Marks a variable as thread-safe" },
          { key: "b", text: "Prevents a variable from being serialized" },
          { key: "c", text: "Makes a variable accessible across packages" },
          { key: "d", text: "Declares a temporary local variable" },
        ],
        correctAnswer: "b",
      },
      {
        id: 9,
        question: "Which design pattern is used by Java's Iterator?",
        options: [
          { key: "a", text: "Singleton" },
          { key: "b", text: "Factory" },
          { key: "c", text: "Observer" },
          { key: "d", text: "Iterator pattern" },
        ],
        correctAnswer: "d",
      },
      {
        id: 10,
        question: "What is a functional interface in Java?",
        options: [
          { key: "a", text: "An interface with more than five methods" },
          { key: "b", text: "An interface that can only be used with lambda expressions" },
          { key: "c", text: "An interface with exactly one abstract method" },
          { key: "d", text: "An interface that extends Runnable" },
        ],
        correctAnswer: "c",
      },
    ],
  },
];