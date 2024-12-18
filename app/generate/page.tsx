"use client";

import { useState } from "react";
import { analyse } from "../api/analyse/actions";
import { generate } from "../api/chat/actions";
import { readStreamableValue } from "ai/rsc";

export const runtime = "edge";

const chefs = [
  {
    name: "Mario",
    emoji: "👨🏻‍🍳",
    description:
      "An Italian plumber turned chef after being defamed for copyright infringement by a large Japanese Video Game company",
    buttonText: "Letsa go!",
  },
  {
    name: "Sigma Chad",
    emoji: "🔥",
    description: "A Gen Alpha chef whose riz makes every recipe hit different.",
    buttonText: "Let him cook!",
  },
];

export default function Generate() {
  // State to store the file
  const [file, setFile] = useState<File | null>(null);

  // State to store the returned analysis
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(true);

  // States for the chef description and buttonText
  const [chef, setChef] = useState(chefs[0]["description"]);
  const [buttonText, setButtonText] = useState(chefs[0]["buttonText"]);

  // State for user prompt
  const [prompt, setPrompt] = useState<string>("");

  // States for loading and final output
  const [loading, setLoading] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("");

  /* 

    Handle file uploads 
  
    */

  // Convert a file to base64 string
  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    setUploading(true);

    const base64 = await toBase64(file);

    const response = await analyse(base64 as string);

    setImageAnalysis(response);
    setUploading(false);
  };

  /* 
  
    Handle chef choice
  
    */

  const handleChefChange = (description: string, buttonText: string) => {
    setChef(description);
    setButtonText(buttonText);
  };

  /* 
  
    Handle change of prompt
  
    */

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
  };

  /* 
  
    Handle submit, bring back recipe
  
    */

  const handleSubmit = async () => {
    // Call the APIs and retrieve a response
    const { response } = await generate(
      `You are ${chef}. Generate a recipe for ${imageAnalysis}. Take note of the following: ${prompt}.`
    );

    setLoading(true);

    for await (const delta of readStreamableValue(response)) {
      setOutput((currentOutput) => `${currentOutput}${delta}`);
    }

    setLoading(false);
  };

  /* 
  
    Reset states
  
    */

  const handleReset = () => {
    setOutput("");
    setUploading(true);
    setFile(null);
    setImageAnalysis("");
    setPrompt("");
  };

  if (loading) {
    return (
      <div className="container flex flex-col items-center w-full">
        <p className="p-4 m-2 bg-opacity-75 bg-gray-600 rounded-lg animate-pulse">
          Loading...
        </p>
      </div>
    );
  } else if (output !== "") {
    return (
      <div className="container flex flex-col items-center w-full">
        <div className="output_container">
          <p className="output_text">{output}</p>
        </div>
        <div className="restart_container">
          <button
            className="restart_button generate_container text-xl bg-green-700 p-4 rounded m-2"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container flex flex-col items-center w-screen">
        {/* Container for image upload */}
        <div className="upload_container flex flex-col items-center p-4 bg-green-500 bg-opacity-25 rounded m-2">
          <label htmlFor="upload_input" className="text-xl m-2">
            Upload an image 📸
          </label>
          <input
            id="upload_input"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="m-2 p-2 bg-opacity-75 bg-gray-600 rounded-lg"
          />
          <button
            onClick={handleUpload}
            className="bg-slate-700 p-4 rounded m-2"
          >
            Upload
          </button>
        </div>

        {/* Container for chef selection */}
        <div className="chef_container text-center flex flex-col items-center p-4 bg-green-500 bg-opacity-25 rounded m-2">
          <label htmlFor="chef_radios" className="text-xl m-2">
            Pick a chef 🥘
          </label>
          {chefs.map(({ name, emoji, description, buttonText }, index) => {
            return (
              <div
                key={name}
                className="p-4 m-2 bg-opacity-75 bg-gray-600 rounded-lg"
              >
                <input
                  id={name}
                  type="radio"
                  value={description}
                  name="chef"
                  onChange={() => handleChefChange(description, buttonText)}
                  defaultChecked={index == 0 ? true : false}
                />
                <label className="ml-2" htmlFor={name}>
                  {`${emoji} ${name}`}
                </label>
                <p>{description}</p>
              </div>
            );
          })}
        </div>

        {/* Container for further prompting */}

        <div className="prompt_container text-center flex flex-col items-center p-4 w-full bg-green-500 bg-opacity-25 rounded m-2">
          <label htmlFor="prompt_input" className="text-xl m-2">
            Prompt ✍️
          </label>
          <textarea
            id="prompt_input"
            placeholder="Enter any additional information here..."
            onChange={handlePromptChange}
            className="w-full"
          />
        </div>

        {/* Container for generation button */}
        <button
          className="generate_container text-xl bg-green-700 p-4 rounded m-2"
          onClick={handleSubmit}
          disabled={uploading}
        >
          {uploading ? `...` : buttonText}
        </button>
      </div>
    );
  }
}
