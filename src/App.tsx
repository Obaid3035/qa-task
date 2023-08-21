import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Loader from "./component/Loader";

interface IFormInput {
    [key: string]: string;
}

const App: React.FC = () => {
    const [answer, setAnswer] = useState<string>('Your answer');
    const [loader, setLoader] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isResult, setIsResult] = useState<boolean>(false)
    const [formInput, setFormInput] = useState<IFormInput>(
        {
            context: '',
            question: ''
        }
    )

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true)
        setIsResult(false)
        setError('')
        if (!formInput.context || !formInput.question) {
            setError('Fields cannot be empty');
            setLoader(false)
            return null;
        }
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/get_answer', formInput); // Replace with your backend API URL
            const { answer } = response.data;
            setIsResult(true)
            setAnswer(answer);
        } catch (e: any) {
            setError('Something went wrong');
        } finally {
            setLoader(false)
        }
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setError('')
        setFormInput({
            ...formInput,
            [name]: value
        })
    }

    return (
        <div className={'form_container'}>
            <form onSubmit={onSubmitHandler}>
                <h2>QA Task</h2>
                <h5 className={'error_message'}>{ error } </h5>
                <div>
                    <textarea
                        name={'context'}
                        value={formInput.context}
                        onChange={onChangeHandler}
                        placeholder="Enter or paste passage here"
                    />
                </div>
                <div>
                    <input
                        name={'question'}
                        type="text"
                        value={formInput.question}
                        onChange={onChangeHandler}
                        placeholder="Enter question..."
                    />
                </div>
                <button type={'submit'} disabled={loader}>{!loader ? 'Get Answer' : <Loader/>}</button>
                <p className={!isResult ? 'answer_inactive' : 'answer_active'}>{answer}</p>
            </form>
        </div>
    );
};

export default App;
