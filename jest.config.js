// module.exports = {
//   roots: ["__test__"],
//   testEnvironment: "node",
//   transform: {
//     '^.+\\.ts?$': 'ts-jest',
//   },
//   testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
//   moduleDirectories: ["node_modules", "src"],
//   transformIgnorePatterns: ['node_modules'],
//   moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
// };

module.exports = {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
        "\\.(gql|graphql)$": "jest-transform-graphql",
        ".*": "babel-jest"
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ["./jest-setup-file.ts"],
}
