import displayLines from "./display-lines.js";

const sample = [
    { noteLength: 4, notes: ["5F", "4G"] },
    { noteLength: 4, notes: ["5F", "4G"] },
    { noteLength: 4, notes: ["5F", "4G"] },
    { noteLength: 16, notes: ["4Ab", "4G", "3G"] },
    { noteLength: 4, notes: ["3b"] },
    { noteLength: 4, notes: ["5F", "4G"] },
    { noteLength: 4, notes: ["5F", "4G"] },
    { noteLength: 4, notes: ["5F", "4G"] },
    { noteLength: 16, notes: ["4Ab", "4G", "3G"] },
    { noteLength: 8, notes: ["5E"] },
];

async function handleUploadSongSubmit(e) {
    e.preventDefault();
    const [timeSig, ...song] = (await getFile()).split("\n"),
        lines = song.map((line) => JSON.parse(line));
    displayLinesHelper(lines, timeSig);
    return lines;

    function getFile() {
        return new Promise((resolve, reject) => {
            const reader = new FileReader(),
                file = e.target.upload.files[0];
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
}

function handleAddNotesSubmit(e, lines, index, isBelow) {
    e.preventDefault();
    const line = getFormData();
    index === undefined
        ? lines.push(line)
        : lines.splice(index, isBelow ? 0 : 1, line);
    displayLinesHelper(lines);
}

function getFormData() {
    const formElem = document.querySelector("#add-notes"),
        data = Object.fromEntries(new FormData(formElem)),
        noteLength = +data["note-length"],
        notes = Object.entries(data)
            .filter(([key, val]) => key !== "note-length" && val)
            .map(([key]) => key);
    return { noteLength, notes };
}

function displayLinesHelper(lines, timeSig) {
    displayLines(readLines(lines, timeSig || getTimeSig()));
    addReplaceLineButtonHandlers(lines);
    addLineBelowButtonHandlers(lines);
    addRemoveLineButtonHandlers(lines);
}

function readLines(lines, timeSig) {
    let total = 0,
        measureCount = 0,
        bar = [];
    const [topNum, bottomNum] = timeSig.split("/"),
        maxBar = (topNum / bottomNum) * 16,
        connectedBars = [],
        result = [];
    for (const line of lines) {
        for (let i = 0; i < line.noteLength; i++) {
            total += 1;
            const finishesBar = () =>
                    bar.reduce((a, c) => a + c.noteLength, 0) + total ===
                    maxBar,
                isLast = i === line.noteLength - 1;
            if (finishesBar() || isLast) {
                bar.push({ noteLength: total, notes: line.notes });
                total = 0;
            }
            if (finishesBar()) {
                result.push(bar);
                bar = [];
                ++measureCount;
                !isLast && connectedBars.push(measureCount);
            }
        }
    }
    // in case there's an incomplete bar at the end
    bar.length && result.push(bar);
    return { lines: result, connectedBars, timeSig };
}

function getTimeSig() {
    const formElem = document.querySelector("#time-sig"),
        numNotes = +formElem["num-notes"].value,
        noteLength = +formElem["note-length"].value,
        timeSig = `${numNotes}/${noteLength}`;
    return timeSig;
}

function handleClearInputs() {
    document
        .querySelector("#add-notes")
        .querySelectorAll("input[type='checkbox']")
        .forEach((checkbox) => (checkbox.checked = false));
}

function handleSelectNoteLengthChange(e) {
    const classNames = {
        1: "s",
        2: "e",
        3: "e-dot",
        4: "q",
        6: "q-dot",
        8: "h",
        12: "h-dot",
        16: "w",
    };
    document.querySelector("#add-notes").className = classNames[e.target.value];
}

function handleTimeSigFormSubmit(e, lines) {
    e.preventDefault();
    document
        .querySelector("#display-time-sig")
        .querySelector("span").innerHTML = getTimeSig();
    displayLinesHelper(lines);
}

/* MODIFY LINES */

function addReplaceLineButtonHandlers(lines) {
    document.querySelectorAll(".replace-line").forEach(
        (button) =>
            (button.onclick = (e) => {
                const index = button.getAttribute("data-index");
                handleAddNotesSubmit(e, lines, index);
            })
    );
}

function addLineBelowButtonHandlers(lines) {
    document.querySelectorAll(".add-line-below").forEach((button) => {
        const index = button.getAttribute("data-index");
        button.onclick = (e) => handleAddNotesSubmit(e, lines, index, true);
    });
}

function addRemoveLineButtonHandlers(lines) {
    document.querySelectorAll(".remove-line").forEach(
        (button) =>
            (button.onclick = () => {
                const index = button.getAttribute("data-index");
                removeLine(lines, index);
            })
    );
    function removeLine(lines, index) {
        lines.splice(index, 1);
        displayLinesHelper(lines);
    }
}

/* WRITE SONG TO FILE */

function handleSaveSongButtonClick(lines) {
    const text = lines.map((line) => JSON.stringify(line)).join("\n");
    download("my-song.txt", getTimeSig() + "\n" + text);
}

function download(filename, text) {
    const element = document.createElement("a");
    element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

export {
    handleAddNotesSubmit,
    handleClearInputs,
    handleSaveSongButtonClick,
    handleSelectNoteLengthChange,
    handleTimeSigFormSubmit,
    handleUploadSongSubmit,
};
