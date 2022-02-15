function generateRandomSeedData() {
  const itemCalPairs = {
    "test item 1": 200,
    "test item 2": 300,
    "test item 3": 400,
    "test item 4": 500,
    "test item 5": 600,
    "test item 6": 700,
    "test item 7": 800,
    "test item 8": 900,
    "test item 9": 1000,
    "test item 10": 1100,
    "test item 11": 1200,
    "test item 12": 1400,
    "test item 13": 1600,
    "test item 14": 1800,
    "test item 15": 2200,
    "test item 16": 2600,
  };

  const COUNT = 20;
  const USER_ID = 1;
  const today = new Date();
  const items = Object.keys(itemCalPairs);

  let res = "";

  for (let i = 0; i < COUNT; ++i) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const idx = Math.floor(Math.random() * (items.length - 1));
    const name = items[idx];
    const calories = itemCalPairs[name];

    res += `(${USER_ID}, "${name}", ${calories}, "${d.toISOString()}"),`;
  }

  // Convert last ',' to ';'
  return `${res.substring(0, res.length - 1)};`;
}

module.exports = generateRandomSeedData();
