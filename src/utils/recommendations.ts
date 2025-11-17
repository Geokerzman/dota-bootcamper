import * as tf from '@tensorflow/tfjs-node';
import { join } from 'path';

let model: tf.LayersModel | null = null;

// Load model
async function loadModel() {
  if (!model) {
    try {
      model = await tf.loadLayersModel(
        `file://${join(__dirname, '../../models/recommendation_model/model.json')}`,
      );
    } catch (err) {
      console.error('Error loading model:', err);
      // Return a dummy model if file doesn't exist
      model = null;
    }
  }
}

// Generate recommendations
export async function generateRecommendations(matchData: any) {
  await loadModel();

  if (!model) {
    // Return empty recommendations if model is not available
    return [];
  }

  try {
    // Transform match data into format suitable for model
    const inputTensor = tf.tensor([matchData]);

    // Predict
    const predictions = model.predict(inputTensor) as tf.Tensor;

    // Process predictions and return recommendations
    const recommendations = await predictions.array();

    // Clean up tensors
    inputTensor.dispose();
    predictions.dispose();

    return recommendations;
  } catch (err) {
    console.error('Error generating recommendations:', err);
    return [];
  }
}

