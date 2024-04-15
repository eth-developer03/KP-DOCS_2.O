import React from 'react';
import ChatBot from 'react-simple-chatbot';
import '../App.css';
import Navbar from './Navbar';
import Footer from './Footer';
function Bot() {
  const steps = [
    {
      id: '1',
      message: 'What is your name?',
      trigger: '2',
    },
    {
      id: '2',
      user: true,
      trigger: '3',
    },
    {
      id: '3',
      message: 'Hi {previousValue}, nice to meet you!, How can I help youu ?',
      trigger: '4',
    },
    {
      id: '4',
      options: [
        { value: 1, label: 'Issue in SignUp/login', trigger: 'op1' },
        { value: 2, label: 'Cannot open your Saved docs?', trigger: 'op2' },
        { value: 3, label: 'Feedback', trigger: 'op3' },
      ],
    },
    {
      id: 'op1',
      message:
        'We will try to resolve the issue as soon as possible ! Thanks for informing Team KP-DOCS 💛',
      end: true,
    },
    {
      id: 'op2',
      message:
        'Please Login In and save your url for further access to your document',
      end: true,
    },
    {
      id: 'op3',
      message: 'Please give us the feedback',
      trigger: 'f1',
    },
    {
      id: 'f1',
      user: true,
      trigger: 'f2',
    },
    {
      id: 'f2',
      message: 'Thanks for providing your valuable Feedback 💛',

      end: true,
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="main2bot">
        <div>
          <div>
            <ChatBot
              headerTitle="Speech Recognition"
              recognitionEnable={true}
              speechSynthesis={{ enable: true, lang: 'en' }}
              steps={steps}
              style={{ height: '530px', width: '600px' }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Bot;
