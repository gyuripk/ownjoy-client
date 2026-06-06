import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" }); // Next.js project location

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  transformIgnorePatterns: ["/node_modules/(?!react-leaflet|@react-leaflet)"],
}; // act like browser environment

export default createJestConfig(customJestConfig);
