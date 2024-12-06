// FormPreview.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export function PreviewForm () {
    const location = useLocation();
    const [formId, setFormId] = useState("");
    const [data, setData] = useState({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [response, setResponse] = useState([]);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [dropCategory, setDropCategory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const queryFormId = location.search.replace("?formId=", "");
        setFormId(queryFormId);
        console.log(formId);
        if (queryFormId) {
            fetch(`http://localhost:5000/forms/?formId=${queryFormId}`)
                .then((res) => res.json())
                .then((res) => setData(res))
                .catch((err) => console.error("Error fetching form data:", err));
        }
    }, [location.search]);

    useEffect(() => {
        const initialItems = data?.questions?.map((question) => {
            if (question.type === 'Categorize') {
                return {
                    question,
                    items: question.data.items.map((item, index) => ({
                        id: `item-${index}`,
                        content: item.name,
                        category: null,
                    })),
                };
            }
            return null;
        });
        setItems(initialItems?.filter(Boolean) || []);
    }, [data]);

    useEffect(() => {
        const initialCategories = data?.questions?.map((question) => {
            if (question.type === 'Categorize') {
                return question.data.categories;
            }
            return null;
        });
        setCategories(initialCategories?.filter(Boolean) || []);
    }, [data]);

    const handleSubmit = () => {
        if (!name || !email) {
            alert("Please enter your name and email.");
            return;
        }

        if (!data.header || !data.header.description.trim()) {
            alert("Header description is required.");
            return;
        }

        const submission = { name, email, formId, response };
        fetch(`http://localhost:5000/response/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submission),
        })
            .then((res) => res.json())
            .then(() => {
                alert("Response submitted successfully!");
                navigate("/thankyou");
            })
            .catch((err) => console.error("Error submitting response:", err));
    };

    const replaceWordsWithUnderscores = (paragraph, options) => {
        return paragraph.split(' ').map((word, index) => {
            const isUnderlined = options?.includes(word);
            return isUnderlined ? (
                <span key={index}>
                    {Array.from({ length: word.length }, (_, i) => (
                        <span key={i}>&#95;</span>
                    ))}
                </span>
            ) : (
                <span key={index}>{word} </span>
            );
        });
    };

    const handleAnswerSave = (index, answerData) => {
        const updatedResponse = [...response];
        updatedResponse[index] = { ...answerData };
        setResponse(updatedResponse);
        alert("Answer saved successfully!");
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const sourceQuestionIndex = parseInt(result.source.droppableId.split('-')[1]);
        const destinationCategory = result.destination.droppableId.split('-')[1];

        if (Number.isNaN(sourceQuestionIndex) || !items[sourceQuestionIndex]?.items || !destinationCategory) return;

        const updatedItems = [...items];
        const draggedItem = updatedItems[sourceQuestionIndex].items[sourceIndex];
        const questionCategories = categories[sourceQuestionIndex];

        if (!questionCategories) return;

        const categoryIndex = questionCategories.indexOf(destinationCategory);
        if (categoryIndex === -1) return;

        draggedItem.category = questionCategories[categoryIndex];
        setDropCategory((prev) => [...prev, draggedItem]);

        updatedItems[sourceQuestionIndex].items.splice(sourceIndex, 1);
        setItems(updatedItems);
    };

    return (
        <div className="border-2 p-10 w-[800px] m-auto mb-20 text-left mt-10 bg-gray-100">
            {Object.keys(data).length !== 0 ? (
                <>
                    <div className="border-2 p-5 mb-10">
                        <h1 className="text-2xl font-semibold mb-4">{data?.header?.heading || ''}</h1>
                        <p className="text-gray-600">{data?.header?.description || ''}</p>
                        <h1 className="text-sm italic mt-2">Note: Click "Save Answer" after answering each question.</h1>
                    </div>

                    <div className="border-2 p-4 rounded mb-4">
                        <h1 className="text-xl font-bold mb-4">Enter Your Details:</h1>
                        <div className="flex justify-between w-[400px] pb-5">
                            <div>
                                <label className="text-xl font-bold mb-1">Name:</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex-1 rounded-md border-gray-300 py-2 px-3 shadow-sm sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xl font-bold mb-1">Email:</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 rounded-md border-gray-300 py-2 px-3 shadow-sm sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {data?.questions?.map((question, index) => (
                        <div key={index} className="border-2 p-4 rounded mb-4">
                            <h1 className="text-xl font-bold mb-4 underline">Question No: {index + 1}</h1>
                            <DragDropContext onDragEnd={handleDragEnd}>
                                {question.type === 'Categorize' && (
                                    <div>
                                        <h1 className="text-lg font-bold mb-4">{question.data.questionTitle}:</h1>
                                       {items[index]?.items?.length > 0 && (
                                            <Droppable droppableId={`question-${index}`} direction="horizontal">
                                                {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className="flex mb-5">
                                                    {items[index]?.items.map((el, i) => (
                                                    <Draggable key={el.id} draggableId={el.id} index={i}>
                                                        {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="font-bold ml-5 p-1.5 rounded-full border-2 bg-[#aa82ef]"
                                                        >
                                                            {el.content}
                                                        </div>
                                                        )}
                                                    </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                                )}
                                            </Droppable>
                                            )}


                                        <div className="flex p-5">
                                            {categories[index]?.map((category, i) => (
                                                <div key={i} className="h-[200px] border-2 ml-5 w-[200px] text-center rounded-md">
                                                    <div className="border-2 p-1.5 font-bold bg-red-400">{category}</div>
                                                    <Droppable droppableId={`category-${category}`} direction="vertical">
                                                        {(provided) => (
                                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                                {dropCategory?.map((item, itemIndex) => {
                                                                    if (item.category === category) {
                                                                        return (
                                                                            <div
                                                                                key={item.id}
                                                                                className="bg-transparent p-2 rounded-full border-2 bg-blue-500"
                                                                            >
                                                                                {item.content}
                                                                            </div>
                                                                        );
                                                                    }
                                                                    return null;
                                                                })}
                                                                {provided.placeholder}
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleAnswerSave(index, {
                                                    questionNo: index + 1,
                                                    answer: dropCategory,
                                                })
                                            }
                                            className="bg-blue-600 mt-5 text-white py-2 px-4 rounded"
                                        >
                                            Save Answer
                                        </button>
                                    </div>
                                )}
                            </DragDropContext>
                            {/* Add other question types (Cloze, Comprehension, etc.) */}
                        </div>
                    ))}

                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 text-white py-2 px-4 rounded mt-5"
                    >
                        Submit Form
                    </button>
                </>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};
