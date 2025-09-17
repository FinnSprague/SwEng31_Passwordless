
module.exports = {
   testEnvironment: 'node',
   transform: {
     "^.+\\.(js|jsx)$": "babel-jest",
   },
   transformIgnorePatterns: [
     "/node_modules/" 
   ],
   testPathIgnorePatterns: [
      '/node_modules/',
      '/frontend/'  
   ],
   "testMatch": ["**/tests/**/*.[jt]s?(x)"]
 };
 