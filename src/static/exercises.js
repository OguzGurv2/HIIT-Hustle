'use strict'

const urlParams = new URLSearchParams(window.location.search);
const exerciseName = urlParams.get('exercise');
const exerciseHeader = document.querySelector('.exercise-header');
const exerciseGif = document.querySelector('.exercise-gif');
const contentCon = document.querySelector('.exercise-content');

fetch(`exercises/${exerciseName}`)
    .then(response => response.json())
    .then(data => {
        exerciseHeader.textContent = data.name;
        exerciseGif.src = data.url;

        const paragraphs = data.description.split(/\d+\.\s/);

        for (let i = 1; i < paragraphs.length; i++) {
            const newParagraph = document.createElement('p');
            newParagraph.classList.add("exercise-p");
            newParagraph.textContent = `${i}. ${paragraphs[i]}`;
            contentCon.appendChild(newParagraph);
        }
    })
    .catch(error => {
        console.error('Error fetching exercise data:', error);
});
