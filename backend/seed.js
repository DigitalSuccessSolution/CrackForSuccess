const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Load Models
const JobCategory = require("./models/JobCategory");
const JobQuestion = require("./models/JobQuestion");
const Category = require("./models/Category");
const Question = require("./models/Question");

// ----------------------------------------------------
// Dummy Data Configuration
// ----------------------------------------------------

// 1. Job Preparation Data (Department-wise)
const jobDepartments = [
  {
    name: "CSE",
    categories: [
      { name: "Data Structures", slug: "data-structures" },
      { name: "Algorithms", slug: "algorithms" },
      { name: "Operating Systems", slug: "operating-systems" },
      { name: "DBMS", slug: "dbms" },
      { name: "Computer Networks", slug: "computer-networks" },
    ],
  },
  {
    name: "Mechanical",
    categories: [
      { name: "Thermodynamics", slug: "thermodynamics" },
      { name: "Fluid Mechanics", slug: "fluid-mechanics" },
      { name: "Strength of Materials", slug: "som" },
      { name: "Manufacturing", slug: "manufacturing" },
      { name: "Heat Transfer", slug: "heat-transfer" },
    ],
  },
  {
    name: "ECE",
    categories: [
      { name: "Digital Electrical", slug: "digital-Electrical" },
      { name: "Analog Circuits", slug: "analog-circuits" },
      { name: "Signals & Systems", slug: "signals-systems" },
      { name: "Control Systems", slug: "control-systems" },
      { name: "Microprocessors", slug: "microprocessors" },
    ],
  },
];

// 2. MAANG / Section Data (Track-wise)
// Note: Category names must be unique globally in the Category model
const maangSections = [
  {
    section: "CSE",
    categories: [
      "Arrays & Strings",
      "Linked Lists",
      "Trees & Graphs",
      "Dynamic Programming",
      "System Design",
    ],
  },
  {
    section: "ECE",
    categories: [
      "Circuit Analysis",
      "Digital Logic Design",
      "Embedded Systems",
      "Communication Systems",
      "VLSI Design",
    ],
  },
  {
    section: "ML",
    categories: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Deep Learning",
      "Natural Language Processing",
      "Computer Vision",
    ],
  },
];

const difficulties = ["Easy", "Medium", "Hard"];
const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Tata Motors",
  "ISRO",
  "DRDO",
  "Intel",
  "Samsung",
  "Cisco",
  "Facebook",
  "Netflix",
  "Apple",
];

// ----------------------------------------------------
// Helper Functions
// ----------------------------------------------------

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate questions for JobQuestion model
const generateJobQuestions = (categoryId, categoryName, deptName) => {
  const questions = [];
  for (let i = 1; i <= 10; i++) {
    const randomDiff = getRandomItem(difficulties);
    const randomCompany = getRandomItem(companies);

    questions.push({
      title: `${categoryName} Question ${i} - ${deptName} Concept`,
      description: `### Problem Description \n\nThis is a dummy problem statement for **${categoryName}** in the **${deptName}** department. \n\nCalculate the efficiency / complexity / output based on standard principles. \n\n* Assume ideal conditions.\n* Neglect friction/losses where applicable.`,
      answer: `### Solution \n\nThe answer involves applying the core formula of **${categoryName}**. \n\n1. Step 1: Analyze inputs.\n2. Step 2: Apply formula.\n3. Step 3: Derive result.\n\n**Result:** The verified correct answer is obtained here.`,
      difficulty: randomDiff,
      askedIn: randomCompany,
      categoryId: categoryId,
      status: "Published",
      tags: [
        deptName.toLowerCase(),
        categoryName.toLowerCase().replace(/\s+/g, "-"),
        "prep",
      ],
      isActive: true,
    });
  }
  return questions;
};

// Generate questions for Question model (MAANG tracks)
const generateTrackQuestions = (categoryId, categoryName, sectionName) => {
  const questions = [];
  for (let i = 1; i <= 10; i++) {
    const randomDiff = getRandomItem(difficulties);
    const randomCompany = getRandomItem(companies);

    questions.push({
      title: `${categoryName} Challenge ${i}`,
      problemStatement: `### ${categoryName} Problem ${i}\n\nGiven a set of inputs for **${categoryName}** in the **${sectionName}** domain, determine the optimal output.\n\n**Input:**\nA standard data set or circuit parameter.\n\n**Output:**\nThe calculated result or optimized structure.\n\n**Example 1:**\nInput: [1, 2, 3]\nOutput: 6\nExplanation: Sum of array.\n\n**Constraints:**\n- 1 <= N <= 10^5`,
      difficulty: randomDiff,
      companies: [randomCompany, getRandomItem(companies)],
      category: categoryId,
      leetcodeUrl: "https://leetcode.com/problems/two-sum/",
      isPremium: i > 7, // Make last 3 questions premium for variety
      starterCode: {
        cpp: `// C++ Starter Code for ${categoryName}\n#include <iostream>\nusing namespace std;\n\nvoid solve() {\n    // Your code here\n}`,
        java: `// Java Starter Code for ${categoryName}\npublic class Solution {\n    public void solve() {\n        // Your code here\n    }\n}`,
        python: `# Python Starter Code for ${categoryName}\ndef solve():\n    # Your code here\n    pass`,
      },
      examples: [
        {
          input: "x = 5, y = 10",
          output: "15",
          explanation: "Simple addition",
        },
      ],
      constraints: ["0 <= x <= 1000", "Time Limit: 1s"],
    });
  }
  return questions;
};

// ----------------------------------------------------
// Main Seed Function
// ----------------------------------------------------
const seedData = async () => {
  try {
    // 1. Connect
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/placement-platform",
    );
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);

    // 2. Clear Existing Data
    console.log("Cleaning up old data...");
    await JobCategory.deleteMany({});
    await JobQuestion.deleteMany({});
    await Category.deleteMany({});
    await Question.deleteMany({});
    console.log("Data cleared!");

    let totalCategories = 0;
    let totalQuestions = 0;

    // 3. Populate Job Preparation Data (Dept -> JobCategory -> JobQuestion)
    console.log("--- Seeding Job Preparation Data ---");
    for (const dept of jobDepartments) {
      console.log(`Processing Job Dept: ${dept.name}...`);
      for (const cat of dept.categories) {
        const newCat = await JobCategory.create({
          name: cat.name,
          slug: cat.slug,
          department: dept.name,
          isActive: true,
        });

        const questions = generateJobQuestions(newCat._id, cat.name, dept.name);
        await JobQuestion.insertMany(questions);
        totalCategories++;
        totalQuestions += questions.length;
      }
    }

    // 4. Populate MAANG Track Data (Section -> Category -> Question)
    console.log("--- Seeding MAANG Track Data ---");
    let orderCounter = 1;
    for (const section of maangSections) {
      console.log(`Processing Track Section: ${section.section}...`);
      for (const catName of section.categories) {
        const newCat = await Category.create({
          name: catName,
          section: section.section,
          order: orderCounter++,
        });

        const questions = generateTrackQuestions(
          newCat._id,
          catName,
          section.section,
        );
        await Question.insertMany(questions);
        totalCategories++;
        totalQuestions += questions.length;
      }
    }

    console.log("-----------------------------------------");
    console.log(`Seeding Complete!`);
    console.log(`Total Categories Created: ${totalCategories}`);
    console.log(`Total Questions Created: ${totalQuestions}`);
    console.log("-----------------------------------------");

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run it
seedData();
