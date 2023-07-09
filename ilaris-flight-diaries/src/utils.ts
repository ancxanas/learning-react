import { NewDairyEntry, Visibility, Weather } from './types';

const toNewDiaryEntry = (object: unknown): NewDairyEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'comment' in object &&
    'date' in object &&
    'weather' in object &&
    'visibility' in object
  ) {
    const newEntry: NewDairyEntry = {
      comment: parseComment(object.comment),
      date: parseDate(object.comment),
      weather: parseWeather(object.weather),
      visibility: parseVisibility(object.visibility),
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};

const parseComment = (comment: unknown) => {
  if (!isString(comment)) {
    throw new Error('Incorrect or missing comment');
  }

  return comment;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }

  return date;
};

const parseWeather = (weather: unknown): Weather => {
  if (!isString(weather) || !isWeather(weather)) {
    throw new Error('Incorrect or missing weather: ' + weather);
  }

  return weather;
};

const isWeather = (param: string): param is Weather => {
  return Object.values(Weather)
    .map((v) => v.toString())
    .includes(param);
};

const parseVisibility = (visibility: unknown): Visibility => {
  if (!isString(visibility) || !isVisibility(visibility)) {
    throw new Error('Incorrect or missing visibility: ' + visibility);
  }
  return visibility;
};

const isVisibility = (param: string): param is Visibility => {
  return Object.values(Visibility)
    .map((v) => v.toString())
    .includes(param);
};

export default toNewDiaryEntry;
