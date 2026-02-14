/**
 * Simple input generator for fuzzing
 * Creates random/edge case inputs to break functions
 */

export const generateRandomStrings = (count = 20) => {
  const inputs = [
    // Edge cases
    '',
    ' ',
    '\n',
    '\t',
    
    // Unicode & special chars
    '你好',
    '🎉🎊',
    
    // Whitespace variations
    '   ANSWER   ',
    '\n\nANSWER\n\n',
    
    // Mixed cases
    'AnSwEr',
    'ANSWER',
    'answer',
    
    // Numbers and symbols
    '123',
    '456',
    '-_+=[]{}|;:,.<>?/',
    'answer123',
    'A1',
    'B2C3',
    
    // Just a few repeated chars
    'aaaa',
    '****',
  ];
  
  return inputs;
};

export const generateRandomAnswers = (count = 20) => {
  return [
    'A',
    'B',
    'C',
    'D',
    'a',
    'b',
    'c',
    'd',
    '',
    ' ',
    'AA',
    'AB',
    '1',
    '2',
    '123',
    '!@#$',
    'invalid',
  ];
};

export const generateTrivaAnswerPairs = () => {
  return [
    { correct: 'A', user: 'A' },
    { correct: 'A', user: 'a' },
    { correct: 'A', user: ' A ' },
    { correct: 'B', user: 'C' },
    { correct: 'C', user: '' },
    { correct: 'D', user: null },
    { correct: '', user: 'A' },
    { correct: '你好', user: '你好' },
    { correct: 'A', user: '🎉' },
  ];
};

