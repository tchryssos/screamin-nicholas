// Modified from https://github.com/matzar/time-to-seconds/blob/master/index.js

export const durationToSeconds = (duration: string | null) => {
  let seconds = 1;
  if (duration) {
    const units = duration.split(':');
    switch (units.length) {
      case 3:
        seconds = +units[0] * 3600 + +units[1] * 60 + +units[2];
        break;
      case 2:
        seconds = +units[0] * 60 + +units[1];
        break;
      case 1:
        seconds = +units[0];
        break;
      default:
        break;
    }
  }
  return String(seconds);
};
