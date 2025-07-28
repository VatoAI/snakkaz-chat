// Simple runner script for system validator
import { validateSystem } from './systemValidator.ts';

// Run the validator and print the results
validateSystem().then(results => {
  console.log('\nDetailed Results:');
  console.log(JSON.stringify(results, null, 2));
});
