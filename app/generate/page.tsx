"use client";

import { use, useState } from "react";
import { generate } from "../api/actions";
import { readStreamableValue } from "ai/rsc";

export default function Generate() {
  const [image, setImage] = useState(null);

  const [chef, setChef] = useState(
    "An Italian plumber turned chef after being defamed for copyright infringement by a large Japanese Video Game company"
  );

  const [buttonText, setButtonText] = useState("Letsa go!");

  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
      description: "A Gen Z chef whos riz makes every recipe hit different.",
      buttonText: "Let him cook!",
    },
  ];

  const handleChefChange = (event) => {
    console.log(event.target.value);
    setChef(event.target.value);
  };

  const handleSubmit = async () => {
    // Call the APIs and retrieve a response
    const { response } = await generate(`Generate a recipe with cabbage`);

    setLoading(true);

    for await (const delta of readStreamableValue(response)) {
      setOutput((currentOutput) => `${currentOutput}${delta}`);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  } else if (output !== "") {
    <div className="container">
      <div className="output_container">
        <p className="output_text">{output}</p>
      </div>
      <div className="restart_container">
        <button className="restart_button" onClick={() => setOutput("")}>
          Reset
        </button>
      </div>
    </div>;
  } else {
    return (
      <div className="container">
        {/* Container for image upload */}
        <div className="upload_container">
          <label htmlFor="upload_input">Upload an image: </label>
          <input id="upload_input" type="file" accept="image/*" />
        </div>

        {/* Container for chef selection */}
        <div className="chef_container">
          <label htmlFor="chef_radios">Pick a chef</label>
          {chefs.map(({ name, emoji, description }, index) => {
            return (
              <div
                key={name}
                className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
              >
                <input
                  id={name}
                  type="radio"
                  value={description}
                  name="genre"
                  onChange={handleChefChange}
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

        {/* Container for image upload */}

        <div className="prompt_container">
          <label htmlFor="prompt_input">Prompt</label>
          <input
            type="textarea"
            id="prompt_input"
            placeholder="Enter any additional information here..."
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
