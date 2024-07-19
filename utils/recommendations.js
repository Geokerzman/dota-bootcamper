const tf = require('@tensorflow/tfjs');
const path = require('path');

let model;

// Загрузка модели
async function loadModel() {
    if (!model) {
        model = await tf.loadLayersModel(`file://${path.join(__dirname, '../models/recommendation_model/model.json')}`);
    }
}

// Генерация рекомендаций
async function generateRecommendations(matchData) {
    await loadModel();

    // Преобразование данных матча в формат, подходящий для модели
    const inputTensor = tf.tensor([matchData]);

    // Прогнозирование
    const predictions = model.predict(inputTensor);

    // Обработка прогнозов и возвращение рекомендаций
    const recommendations = predictions.arraySync();

    return recommendations;
}

module.exports = { generateRecommendations };
