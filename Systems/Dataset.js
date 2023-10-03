var dataset = [
  { input: "how are you?", output: [0] },
  { input: "hi", output: [1] },
  { input: "what's your name?", output: [2] },
  { input: "what can you do?", output: [3] },
  { input: "Who created you", output: [4] },
];

var responseMap = {
  [0]: [
    "I am fine, What do you need help with",
    "I am good, How can I assist you?",
  ],
  [1]: ["Hello there!", "Hey there!"],
  [2]: ["My name is Chatbot.", "I am called Chatbot"],
  [3]: [
    "I can answer questions, give information, and even tell a joke or two.",
    "I can help you with many things",
  ],
  [4]: ["I am created by Technologypower#3174", "I am created by my creator"],
};

module.exports = { dataset, responseMap };
