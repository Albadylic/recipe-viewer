"use client";

import { useState } from "react";
import { analyse } from "../api/analyse/actions";
import { generate } from "../api/chat/actions";
import { readStreamableValue } from "ai/rsc";

export const runtime = "edge";

export default function Generate() {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null);

  const [chef, setChef] = useState(
    "an Italian plumber turned chef after being defamed for copyright infringement by a large Japanese Video Game company"
  );
  const [buttonText, setButtonText] = useState("Letsa go!");

  const [prompt, setPrompt] = useState<string>("");

  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const chefs = [
    {
      name: "Mario",
      emoji: "👨🏻‍🍳",
      description:
        "an Italian plumber turned chef after being defamed for copyright infringement by a large Japanese Video Game company",
      buttonText: "Letsa go!",
    },
    {
      name: "Sigma Chad",
      emoji: "🔥",
      description: "a Gen Z chef whos riz makes every recipe hit different.",
      buttonText: "Let him cook!",
    },
  ];

  const handleChefChange = (description: string, buttonText: string) => {
    setChef(description);
    setButtonText(buttonText);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async () => {
    // Call the APIs and retrieve a response
    const { response } = await generate(
      `You are ${chef}. Generate a recipe with cabbage. Take note of the following: ${prompt}.`
    );

    setLoading(true);

    for await (const delta of readStreamableValue(response)) {
      setOutput((currentOutput) => `${currentOutput}${delta}`);
    }

    setLoading(false);
  };

  // const handleUpload = async (event) => {
  //   if (event.target.files) {
  //     const url = URL.createObjectURL(event.target.files[0]);
  //     // setImageURL(url);
  //     const response = await analyse(url);
  //     console.log(response);
  //     // setImageAnalysis(response);
  //   } else {
  //     // Error when no valid files
  //   }
  // };

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  } else if (output !== "") {
    return (
      <div className="container">
        <div className="output_container">
          <p className="output_text">{output}</p>
        </div>
        <div className="restart_container">
          <button className="restart_button" onClick={() => setOutput("")}>
            Reset
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        {/* Container for image upload */}
        <div className="upload_container">
          <label htmlFor="upload_input">Upload an image: </label>
          <input
            id="upload_input"
            type="file"
            accept="image/*"
            // onChange={handleUpload}
          />
        </div>

        {/* Container for chef selection */}
        <div className="chef_container">
          <label htmlFor="chef_radios">Pick a chef</label>
          {chefs.map(({ name, emoji, description, buttonText }, index) => {
            return (
              <div
                key={name}
                className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
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

        <div className="prompt_container">
          <label htmlFor="prompt_input">Prompt</label>
          <input
            type="textarea"
            id="prompt_input"
            placeholder="Enter any additional information here..."
            onChange={handlePromptChange}
          />
        </div>

        {/* Container for generation button */}
        <button className="generate_container" onClick={handleSubmit}>
          {buttonText}
        </button>
      </div>
    );
  }
}
