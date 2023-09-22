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
}

export function getObjectById(jsonData, targetId) {
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
}

