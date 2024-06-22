import json
from sklearn.svm import SVR
from flask import Flask, Response, request
from flask_restful import Api
import numpy as np

app = Flask(__name__)
api = Api(app)

@app.route('/api/predict', methods=["POST"])
def predict():
    arrs = request.json
    results = []
    for arr in arrs:
        x = [[num] for num in range(len(arr))]
        svr_rbf = SVR(kernel='rbf', C=100, gamma='scale')
        model = svr_rbf.fit(x, arr)
        predictions = model.predict([[len(arr)], [len(arr)+1]])
        results.append(predictions.tolist())
    return json.dumps(results)

if __name__ == '__main__':
    app.run(port=5002, debug=True)