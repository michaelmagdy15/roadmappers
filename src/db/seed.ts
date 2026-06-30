import { db, users, courses, lessons, quizzes, quizQuestions } from './index';

async function seed() {
  console.log('🌱 Starting database seeding on Turso...');

  try {
    // 1. Create Mentor User
    await db.insert(users).values({
      id: 'dev_mentor_id',
      whopUserId: 'dev_mentor',
      email: 'mentor@dev.local',
      name: 'Sherif Mentor',
      role: 'mentor',
      createdAt: Date.now(),
    }).onConflictDoNothing();

    console.log('✅ Seeded Mentor user');

    // 2. Create Free Course
    await db.insert(courses).values({
      id: 'course_free_id',
      title: 'Foundations of Web Development',
      description: 'Master HTML, CSS, JavaScript basics, DOM manipulation, and build your very first interactive web application.',
      price: 0,
      whopProductId: 'prod_free',
      creatorId: 'dev_mentor_id',
      published: 1,
      createdAt: Date.now(),
    }).onConflictDoNothing();

    console.log('✅ Seeded Foundations of Web Development (Free)');

    // 3. Create Lessons for Free Course
    await db.insert(lessons).values([
      {
        id: 'lesson_free_1',
        courseId: 'course_free_id',
        title: 'Introduction to HTML & CSS',
        description: 'Learn document structure, semantic tags, and basic styling concepts.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        content: 'HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.\n\nCSS (Cascading Style Sheets) is a style sheet language used for describing the presentation of a document written in HTML.',
        sortOrder: 1,
        createdAt: Date.now(),
      },
      {
        id: 'lesson_free_2',
        courseId: 'course_free_id',
        title: 'JavaScript DOM Manipulation',
        description: 'Explore event listeners, selecting elements, and dynamically editing CSS classes.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        content: 'The Document Object Model (DOM) is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content.',
        sortOrder: 2,
        createdAt: Date.now(),
      }
    ]).onConflictDoNothing();

    console.log('✅ Seeded Lessons for Free Course');

    // 4. Create Quiz for Free Course
    await db.insert(quizzes).values({
      id: 'quiz_free_id',
      courseId: 'course_free_id',
      lessonId: 'lesson_free_2',
      title: 'DOM Manipulation Evaluation',
      createdAt: Date.now(),
    }).onConflictDoNothing();

    console.log('✅ Seeded Quiz for Free Course');

    // 5. Create Questions for Free Course Quiz
    await db.insert(quizQuestions).values([
      {
        id: 'q_free_1',
        quizId: 'quiz_free_id',
        questionText: 'Which DOM method is used to select an element by its ID attribute?',
        options: JSON.stringify([
          'document.querySelector(".id")',
          'document.getElementById("id")',
          'document.getElementsByClassName("id")',
          'document.querySelectorAll("#id")'
        ]),
        correctOptionIndex: 1,
      },
      {
        id: 'q_free_2',
        quizId: 'quiz_free_id',
        questionText: 'Which event listener fires when a user clicks on an HTML element?',
        options: JSON.stringify([
          'click',
          'submit',
          'hover',
          'change'
        ]),
        correctOptionIndex: 0,
      }
    ]).onConflictDoNothing();

    console.log('✅ Seeded Questions for Free Course Quiz');

    // ==========================================
    // 6. Create Premium Course
    // ==========================================
    // NOTE: whopProductId should match the Product ID from your Whop Dashboard.
    await db.insert(courses).values({
      id: 'course_premium_id',
      title: 'Fullstack Next.js & Turbopack Masterclass',
      description: 'Build serverless Next.js App Router applications, secure checkouts, and Drizzle ORM schemas on Turso.',
      price: 4500,
      whopProductId: 'prod_Rwdz7NdQhgeQTD', 
      creatorId: 'dev_mentor_id',
      published: 1,
      createdAt: Date.now(),
    }).onConflictDoNothing();

    console.log('✅ Seeded Next.js Masterclass (Premium)');

    // 7. Create Lessons for Premium Course
    await db.insert(lessons).values([
      {
        id: 'lesson_prem_1',
        courseId: 'course_premium_id',
        title: 'Next.js App Router & Server Components',
        description: 'Understand server-side layouts, nested routes, and Client Component boundaries.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        content: 'Next.js App Router introduces support for Shared Layouts, Nested Routing, Colocation, and React Server Components (RSC) to help you build highly optimized fullstack apps.',
        sortOrder: 1,
        createdAt: Date.now(),
      },
      {
        id: 'lesson_prem_2',
        courseId: 'course_premium_id',
        title: 'Server Actions & SQLite Drizzle Integration',
        description: 'Configure connection pooling, run mutations, and handle validation states on Turso.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        content: 'Server Actions are asynchronous functions that are executed on the server. They can be defined in Server Components or in separate files labeled with the "use server" directive.',
        sortOrder: 2,
        createdAt: Date.now(),
      }
    ]).onConflictDoNothing();

    console.log('✅ Seeded Lessons for Premium Course');

    // 8. Create Quiz for Premium Course
    await db.insert(quizzes).values({
      id: 'quiz_prem_id',
      courseId: 'course_premium_id',
      lessonId: 'lesson_prem_2',
      title: 'Server Action Architecture Quiz',
      createdAt: Date.now(),
    }).onConflictDoNothing();

    console.log('✅ Seeded Quiz for Premium Course');

    // 9. Create Questions for Premium Course Quiz
    await db.insert(quizQuestions).values([
      {
        id: 'q_prem_1',
        quizId: 'quiz_prem_id',
        questionText: 'Which directive is required at the top of a Server Action file?',
        options: JSON.stringify([
          '"use server"',
          '"use client"',
          '"use action"',
          '"use api"'
        ]),
        correctOptionIndex: 0,
      },
      {
        id: 'q_prem_2',
        quizId: 'quiz_prem_id',
        questionText: 'Why can\'t Next.js Middleware load Node-native modules (like fs)?',
        options: JSON.stringify([
          'Middleware only runs on local machines',
          'Middleware runs inside the Edge Runtime which blocks Node-native APIs',
          'It is blocked in development mode for security reasons',
          'It can be imported if you configure next.config.ts'
        ]),
        correctOptionIndex: 1,
      }
    ]).onConflictDoNothing();

    console.log('✅ Seeded Questions for Premium Course Quiz');
    console.log('🌱 Database successfully seeded! Ready for live testing.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
