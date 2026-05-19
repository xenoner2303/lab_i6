function loadColorPicker() {
    const container = document.querySelector(".color-picker-container");
    if (!container) return;

    container.innerHTML = `
        <h3>Налаштування кольорів виділення:</h3>

        <label>
            Ігри (парні):
            <input type="color" id="gamesColorPicker" value="#ff0000">
        </label><br><br>

        <label>
            Медіа (кожне 3-є з другого):
            <input type="color" id="mediaColorPicker" value="#add8e6">
        </label><br><br>

        <label>
            Предмети (перший і останній):
            <input type="color" id="subjectsColorPicker" value="#90ee90">
        </label>
    `;
}

loadColorPicker();

const gamesPicker = document.getElementById('gamesColorPicker');
const mediaPicker = document.getElementById('mediaColorPicker');
const subjectsPicker = document.getElementById('subjectsColorPicker');

function changeColor(variableName, colorValue) {
  document.documentElement.style.setProperty(variableName, colorValue);
}

gamesPicker.addEventListener('input', (event) => {
  changeColor('--games-color', event.target.value);
});

mediaPicker.addEventListener('input', (event) => {
  changeColor('--media-color', event.target.value);
});

subjectsPicker.addEventListener('input', (event) => {
  changeColor('--subjects-color', event.target.value);
});