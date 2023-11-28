export const setStyle = (Properties, position = 'absolute', background) => {
  return {
    position: Properties?.Posn ? 'absolute' : 'relative',
    height: Properties?.Size && Properties?.Size[0],
    width: Properties?.Size && Properties?.Size[1],
    top: Properties?.Posn && Properties?.Posn[0],
    left: Properties?.Posn && Properties?.Posn[1],
  };
};

export const excludeKeys = (obj) => {
  const keysToExclude = ['ID', 'Properties'];
  const result = {};
  for (const key in obj) {
    if (!keysToExclude.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
};

export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const checkPeriod = (ID) => {
  let count = 0;
  for (let i = 0; i < ID.length; i++) {
    if (ID[i] == '.') {
      count++;
    }
  }

  return count;
};

export const extractStringUntilSecondPeriod = (inputString) => {
  const lastPeriodIndex = inputString.lastIndexOf('.');

  if (lastPeriodIndex !== -1) {
    const result = inputString.slice(0, lastPeriodIndex);
    return result;
  }

  return inputString;
};

export const generateHeader = (length) => {
  const result = [];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let current = '';

  while (length > 0) {
    result.push(current);

    // Increment the current string
    let carry = 1;
    for (let i = current.length - 1; i >= 0 && carry; i--) {
      const char = current[i];
      const index = alphabet.indexOf(char);
      if (index === alphabet.length - 1) {
        current = current.substring(0, i) + alphabet[0] + current.substring(i + 1);
      } else {
        current = current.substring(0, i) + alphabet[index + 1] + current.substring(i + 1);
        carry = 0;
      }
    }

    if (carry) {
      current = 'A' + current;
    }

    length--;
  }

  return result;
};

export const getObjectById = (jsonData, targetId) => {
  const data = jsonData;

  function searchObject(node, idToFind) {
    if (typeof node === 'object') {
      if (node.ID === idToFind) {
        return node;
      }
      for (const key in node) {
        const result = searchObject(node[key], idToFind);
        if (result) {
          return result;
        }
      }
    } else if (Array.isArray(node)) {
      for (const item of node) {
        const result = searchObject(item, idToFind);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  const result = searchObject(data, targetId);
  return result ? JSON.stringify(result, null, 2) : null;
};

export const generateAsteriskString = (length) => {
  if (length <= 0) {
    return '*'; // Return an empty string if length is zero or negative.
  }

  let asteriskString = '';
  for (let i = 0; i < length; i++) {
    asteriskString += '*';
  }

  return asteriskString;
};

export const getStringafterPeriod = (ID) => {
  const parts = ID?.split('.');
  if (parts?.length > 1) {
    return parts[1];
  } else {
    return '';
  }
};

//  Find Parent Index from the tree View

export const calculateSumFromString = (inputString) => {
  const numbers = inputString[0].split('-').map(Number);
  if (numbers.length === 2) {
    const sum = numbers[0] + numbers[1];
    return sum;
  } else {
    return null; // Invalid input
  }
};

export const findParentIndex = (depthArray, parentNumber) => {
  let parentCount = 0;
  let parentIndex = -1;

  for (let i = 0; i < depthArray.length; i++) {
    if (depthArray[i] === 0) {
      parentCount++;
      if (parentCount === parentNumber) {
        parentIndex = i;
        break;
      }
    }
  }

  return parentIndex;
};

export const rgbColor = (rgbArray) => {
  if (rgbArray.length !== 3) {
    throw new Error('RGB array must have exactly 3 values.');
  }

  const [r, g, b] = rgbArray;
  return `rgb(${r}, ${g}, ${b})`;
};

export const calculateDateAfterDays = (days) => {
  // Start date: 1900-1-1
  var startDate = new Date(1900, 0, 1);

  // Calculate the target date
  var targetDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

  // Format the date as YYYY-MM-DD
  var formattedDate = targetDate.toISOString().split('T')[0];

  return formattedDate;
};

export const calculateDaysFromDate = (inputDate) => {
  // Parse the input date string in the "YYYY-MM-DD" format
  const [year, month, day] = inputDate.split('-');
  const inputDateObj = new Date(year, month - 1, day); // month is 0-based in JavaScript Dates

  // Start date: 1900-1-1 at midnight
  const startDate = new Date(1900, 0, 1, 0, 0, 0, 0);

  // Calculate the difference in milliseconds
  const timeDifference = inputDateObj.getTime() - startDate.getTime();

  // Calculate the number of days
  const daysDifference = timeDifference / (24 * 60 * 60 * 1000);

  return Math.round(daysDifference);
};

export const replaceDanishToNumber = (number) => {
  const cleanedNumberString = number.replace(/\./g, '').replace(',', '.');
  const originalNumber = parseFloat(cleanedNumberString);
  return originalNumber;
};

// Check for the supported Properties of WG or not

export const checkSupportedProperties = (supportedProperties, array) => {
  const notSupportedProperties = array.filter((item) => !supportedProperties.includes(item));
  if (notSupportedProperties.length > 0) {
    const result = {
      NotSupported: notSupportedProperties,
    };
    return result;
  } else {
    return null; // No unsupported properties found
  }
};

