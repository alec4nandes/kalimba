const noteLengths = ["sixteenth", "eighth", "quarter", "half", "whole"],
    redTineIndexes = [5, 8, 11, 13, 16, 19],
    tines = {
        "back left": ["F", "C#, Db", "A#, Bb", "D#, Eb", "G#, Ab"],
        // asterisk = tine with dot. what does dot mean?
        front: [
            "F#*",
            "D*",
            "B*",
            "G",
            "E*",
            "C",
            "A*",
            "G*",
            "B*",
            "D*",
            "F#*",
            "A*",
            "C",
            "E*",
            "G",
        ],
        "back right": ["F#, Gb", "A#, Bb", "C#, Db", "F", "G#, Ab", "D#, Eb"],
    },
    allNotes = Object.values(tines).flat(Infinity);

/*** KALIMBA FORM HTML ***/

function getKalimbaFormHTML() {
    let tineIndex = -1;

    return `
        <label>note length: ${getSelectNoteLengthHTML()}</label>
        <div id="finger-sections">
            ${Object.entries(tines)
                .map(([title, notes]) => getFingerSectionHTML(notes))
                .join("")}
        </div>
        <button type="submit">write line</button>
    `;

    function getSelectNoteLengthHTML() {
        const options = noteLengths
            .map(
                (len) => `
                    <option
                        value="${len[0]}"
                        ${len === "quarter" ? "selected" : ""}
                    >
                        ${len}
                    </option>
                `
            )
            .join("");
        return `<select name="note-length">${options}</select>`;
    }

    function getFingerSectionHTML(notes) {
        const tines = notes.map((note) => getTineHTML(note)).join("");
        return `<div>${tines}</div>`;
    }

    function getTineHTML(note) {
        return `
            <label class="${redTineIndexes.includes(++tineIndex) ? "red" : ""}">
                <input type="checkbox" name="${tineIndex}" />
                ${
                    note.includes("*")
                        ? note.replace("*", "") + "<br/>&bull;"
                        : note
                }
            </label>
        `;
    }
}

/*** LINE FROM KALIMBA FORM DATA ***/

function getLineFromKalimbaFormData(formData) {
    let lastNoteReached = false;
    const data = Object.fromEntries(formData),
        tineIndexes = Object.keys(data)
            .filter((key) => key !== "note-length")
            .map((key) => +key)
            .sort((a, b) => a - b),
        line = new Array(allNotes.length)
            .fill("")
            .map((_, i) => {
                const markedIndex = tineIndexes.indexOf(i),
                    isMarked = markedIndex >= 0;
                if (markedIndex === tineIndexes.length - 1) {
                    lastNoteReached = true;
                }
                return isMarked
                    ? data["note-length"]
                    : lastNoteReached
                    ? "_"
                    : "-";
            })
            .join("");
    return line;
}

export { getKalimbaFormHTML, getLineFromKalimbaFormData };
