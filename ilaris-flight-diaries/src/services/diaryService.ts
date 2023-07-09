import diaries from '../../data/diaries';

import { DiaryEntry, NonSensitiveDiaryEntry, NewDairyEntry } from '../types';

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

const addDiary = (entry: NewDairyEntry): DiaryEntry => {
  const newDairyEntry = {
    id: Math.max(...diaries.map((d) => d.id)) + 1,
    ...entry,
  };

  diaries.push(newDairyEntry);
  return newDairyEntry;
};

const findById = (id: number): DiaryEntry | undefined => {
  const entry = diaries.find((d) => d.id === id);
  return entry;
};

export default { getEntries, addDiary, getNonSensitiveEntries, findById };
