/**
 * Main Fuzzer Runner
 * Runs all fuzzer tests and reports results
 */

import { fuzzEvaluateAnswer } from './fuzzEvaluateAnswer.js';

const runAllFuzzers = () => {
  console.log('\n========================================');
  console.log('🚀 WaveY Bot Fuzzer Suite Started');
  console.log('========================================\n');

  const results = {};

  // Run each fuzzer
  results.evaluateAnswer = fuzzEvaluateAnswer();

  // Summary
  console.log('========================================');
  console.log('📊 FUZZER SUMMARY');
  console.log('========================================\n');

  let totalPassed = 0;
  let totalFailed = 0;

  Object.entries(results).forEach(([name, result]) => {
    totalPassed += result.passed;
    totalFailed += result.failed;
    const status = result.failed === 0 ? '✅' : '⚠️';
    console.log(
      `${status} ${name}: ${result.passed} passed, ${result.failed} failed`
    );
  });

  console.log('\n----------------------------------------');
  console.log(`Total: ${totalPassed} passed, ${totalFailed} failed`);
  console.log('----------------------------------------\n');

  if (totalFailed > 0) {
    console.log('💡 Found potential issues! Check output above.\n');
  } else {
    console.log('🎉 All fuzz tests passed!\n');
  }
};

runAllFuzzers();
