from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline

model_name = "deepset/roberta-base-squad2"

app = Flask(__name__)
CORS(app)

@app.route('/api/get_answer', methods=['POST'])
def get_answer():
    question = request.json['question']
    context = request.json['context']
    nlp = pipeline('question-answering', model=model_name, tokenizer=model_name)
    answer = nlp(question=question, context=context)
    return {"answer": answer['answer']}

if __name__ == '__main__':
    app.run(debug=True)
