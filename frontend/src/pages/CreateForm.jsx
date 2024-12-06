import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import CategorizeQuestion from '../components/CategorizeQuestion';
import ClozeQuestion from '../components/ClozeQuestion';
import Comprehension from '../components/Comprehension';

function CreateForm ()  {
  const [formId, setFormId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [header, setHeader] = useState('');

  const addQuestion = (type) => {
    const questionTemplates = {
      Categorize: { categories: [], items: [{ name: '', category: '' }] },
      Cloze: { paragraph: '', options: [] },
      Comprehension: { instructions: '', passage: '', subQuestions: [] },
    };

    const initialData = questionTemplates[type] || {};
    setQuestions((prev) => [
      ...prev,
      { type, points: 10, data: initialData },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionDataChange = (index, data) => {
    setQuestions((prev) =>
      prev.map((question, i) =>
        i === index ? { ...question, data } : question
      )
    );
  };

  const handlePointsChange = (index, points) => {
    setQuestions((prev) =>
      prev.map((question, i) =>
        i === index ? { ...question, points: Number(points) } : question
      )
    );
  };

  const handleSaveForm = async () => {
    if (!header) {
      alert('Please add a form title.');
      return;
    }
    if (questions.length === 0) {
      alert('Please add at least one question.');
      return;
    }

    const randomId = Array.from(
      { length: 7 },
      () =>
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$'[
          Math.floor(Math.random() * 68)
        ]
    ).join('');

    setFormId(randomId);

    const formData = { formId: randomId, header, questions };
    try {
      const response = await fetch('http://localhost:5000/create/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Form created successfully');
      } else {
        console.error('Failed to create form');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    console.log(formData);
  };

  return (
    <div className="w-full max-w-screen-md mx-auto mb-20 border-2 p-5 pb-10 mt-10 bg-gray-100">
      <h2 className="text-3xl font-bold mb-4 p-5 text-center">Custom Form Editor</h2>
      <Header setHeader={setHeader} />
      {questions.map((question, index) => (
        <div key={index} className="border-2 p-4 rounded mb-4">
          <div className="flex justify-between p-2">
            <div>
              <label className="block mb-2 text-gray-700 font-bold text-lg">
                Question {index + 1}:
              </label>
            </div>
            <div className="flex gap-4">
              <label className="block mb-2 text-gray-700 font-bold">
                Points:
              </label>
              <input
                type="number"
                min={1}
                value={question.points}
                onChange={(e) => handlePointsChange(index, e.target.value)}
                className="block w-[70px] rounded-md border-gray-300 py-2 px-3 mb-2 text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              onClick={() => removeQuestion(index)}
              className="text-red-500 font-bold"
            >
              Delete Question
            </button>
          </div>
          {question.type === 'Categorize' && (
            <CategorizeQuestion
              questionIndex={index}
              questionData={question}
              updateQuestionData={handleQuestionDataChange}
            />
          )}
          {question.type === 'Cloze' && (
            <ClozeQuestion
              questionIndex={index}
              questionData={question}
              updateQuestionData={handleQuestionDataChange}
            />
          )}
          {question.type === 'Comprehension' && (
            <Comprehension
              questionIndex={index}
              questionData={question}
              updateQuestionData={handleQuestionDataChange}
            />
          )}
        </div>
      ))}
      <div className="mb-4 text-left">
        <label className="text-xl font-bold mr-6">Question Categories :</label>
        <div className="text-center flex gap-10 justify-center mt-6">
          {['Categorize', 'Cloze', 'Comprehension'].map((type) => (
            <button
              key={type}
              onClick={() => addQuestion(type)}
              className="border-2 p-2 text-blue-900 font-semibold rounded-full"
            >
              + Add {type} Question
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleSaveForm}
          className="bg-blue-500 hover:bg-blue-300 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Form
        </button>
      </div>
      {header && questions.length > 0 && (
        <div className="flex justify-center mt-4">
          <Link to={`/preview/?formId=${formId}`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Preview/Fill
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CreateForm;
