const EventEmitter = require('events');
const fs = require('fs');

// Створення нового об'єкту подій
const temperatureEmitter = new EventEmitter();

// Подія для збереження даних про температуру повітря у файл формату json
temperatureEmitter.on('saveTemperature', (date, temperature) => {
  // Створення об'єкту з даними
  const data = {
    date,
    temperature,
  };

  // Конвертування об'єкту в рядок JSON
  const jsonData = JSON.stringify(data);

  // Збереження даних у файл
  fs.appendFile('temperature.json', jsonData + '\n', (err) => {
    if (err) throw err;
    console.log('Temperature data has been saved to temperature.json');
  });

  // Виклик події про перевищення температури
  if (temperature > 30) {
    temperatureEmitter.emit('highTemperature', date, temperature);
  }
});

// Подія для обчислення середнього значення температури повітря за певну дату
temperatureEmitter.on('calculateAvgTemperature', (date) => {
  // Читання даних з файлу temperature.json
  fs.readFile('temperature.json', 'utf8', (err, data) => {
    if (err) throw err;
    const lines = data.trim().split('\n');

    // Фільтрація даних за вказаною датою
    const filteredData = lines
      .map((line) => JSON.parse(line))
      .filter((line) => line.date === date);

    // Обчислення середнього значення температури
    const sum = filteredData.reduce((acc, line) => acc + line.temperature, 0);
    const avg = sum / filteredData.length;

    // Виведення результату у консоль
    console.log(`Average temperature on ${date}: ${avg}`);
  });
});

// Подія для інформування про те, що температура повітря вища 30 градусів
temperatureEmitter.on('highTemperature', (date, temperature) => {
  console.log(`High temperature on ${date}: ${temperature}`);
});

// Виклик подій
temperatureEmitter.emit('saveTemperature', '2022-05-01', 25);
temperatureEmitter.emit('saveTemperature', '2022-05-01', 32);
temperatureEmitter.emit('calculateAvgTemperature', '2022-05-01');
