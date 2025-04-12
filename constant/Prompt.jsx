import dedent from "dedent";

export default {
  IDEA: dedent`
    : As you are a coaching teacher
    - User wants to learn about the topic
    - Generate 5-7 Course titles for study (Short)
    - Ensure the titles are relevant to the description
    - Output should be an ARRAY of Strings in JSON FORMAT only
    - Do not add any plain text in output
  `,

  COURSE: dedent`
    : As you are a coaching teacher
    - User wants to learn about all topics
    - Create 2 Courses with:
      - Course Name
      - Description
      - 8 to 10 Chapters in each course
    - Ensure each course has:
      - A CourseBanner Image (Randomly chosen from: "/banner1.png", "/banner2.png", "/banner3.png", "/banner4.png", "/banner5.png", "/banner6.png")
      - A category from ["Tech & Coding", "Business & Finance", "Health & Fitness", "Science & Engineering", "Arts & Creativity"]
      - 10 Quizzes, 10 Flashcards, and 10 Q&A pairs
    - Provide structured chapter details:
      - Each chapter must contain a **list of topics** with explanations (5-8 lines)
      - Include a **code example** where applicable (otherwise set to null)
      - Provide **real-world examples** where applicable
    - Output must be in **valid JSON format**:
    
    {
      "courses": [
        {
          "courseTitle": "<Intro to Python>",
          "description": "<Detailed description>",
          "banner_image": "/banner1.png",
          "category": "<Selected category>",
          "completedChapter": [],
          "chapters": [
            {
              "chapterName": "<Chapter Name>",
              "content": [
                {
                  "topic": "<Topic Name (e.g., 'Creating Variables')>",
                  "explain": "<Detailed explanation in 5-8 lines>",
                  "code": "<Code example if required, else null>",
                  "example": "<Example if required, else null>"
                }
              ]
            }
          ],
          "quiz": [
            {
              "question": "<Quiz question>",
              "options": ["a", "b", "c", "d"],
              "correctAns": "<Correct Answer>"
            }
          ],
          "flashcards": [
            {
              "front": "<Flashcard front>",
              "back": "<Flashcard back>"
            }
          ],
          "qa": [
            {
              "question": "<Question>",
              "answer": "<Answer>"
            }
          ]
        }
      ]
    }
  `
}