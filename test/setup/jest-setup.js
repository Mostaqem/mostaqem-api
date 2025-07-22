// Global mock for fs and path modules
const mockQuranData = [
  {
    id: 1,
    name: 'الفاتحة',
    transliteration: 'Al-Fatiha',
    total_verses: 7,
    type: 'Meccan',
    verses: [
      {
        id: 1,
        text: 'In the name of Allah, the Most Merciful, the Most Compassionate.',
      },
      {
        id: 2,
        text: 'Praise be to Allah, the Lord of all the worlds.',
      },
    ],
  },
  {
    id: 2,
    name: 'البقرة',
    transliteration: 'Al-Baqarah',
    total_verses: 286,
    type: 'Medinan',
    verses: [],
  },
];

// Create a global mock for fs.readFileSync that can be used by all tests
const fs = jest.createMockFromModule('fs');
fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(mockQuranData));
jest.mock('fs', () => fs);

// Create a global mock for path.resolve
const path = jest.createMockFromModule('path');
path.resolve = jest.fn().mockReturnValue('/mock/path/quran.json');
jest.mock('path', () => path);
