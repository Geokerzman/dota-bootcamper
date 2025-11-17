"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecommendations = generateRecommendations;
const tf = __importStar(require("@tensorflow/tfjs-node"));
const path_1 = require("path");
let model = null;
async function loadModel() {
    if (!model) {
        try {
            model = await tf.loadLayersModel(`file://${(0, path_1.join)(__dirname, '../../models/recommendation_model/model.json')}`);
        }
        catch (err) {
            console.error('Error loading model:', err);
            model = null;
        }
    }
}
async function generateRecommendations(matchData) {
    await loadModel();
    if (!model) {
        return [];
    }
    try {
        const inputTensor = tf.tensor([matchData]);
        const predictions = model.predict(inputTensor);
        const recommendations = await predictions.array();
        inputTensor.dispose();
        predictions.dispose();
        return recommendations;
    }
    catch (err) {
        console.error('Error generating recommendations:', err);
        return [];
    }
}
//# sourceMappingURL=recommendations.js.map