document.addEventListener("DOMContentLoaded", function () {
  const wordLetters = document.querySelectorAll(".word-letter");
  const guessInput = document.getElementById("guess-input");
  const checkButton = document.getElementById("check-button");

  const targetWord = "HELLO"; // Replace this with the target word

  checkButton.addEventListener("click", function () {
    const guess = guessInput.value.toUpperCase();

    if (guess.length === 5) {
      for (let i = 0; i < 5; i++) {
        wordLetters[i].textContent = guess[i];
        if (guess[i] === targetWord[i]) {
          wordLetters[i].style.backgroundColor = "green";
        } else if (targetWord.includes(guess[i])) {
          wordLetters[i].style.backgroundColor = "yellow";
        } else {
          wordLetters[i].style.backgroundColor = "white";
        }
      }
    } else {
      alert("Please enter a 5-letter word.");
    }
  });
});
