const noteLengths = ["sixteenth", "eighth", "quarter", "half", "whole"],
    redTineIndexes = [0, 4, 5, 8, 11, 13, 16, 19, 21, 24],
    tines = new Map([
        ["back left", ["5F", "5Db", "4Bb", "4Eb", "3Ab"]],
        // asterisk = tine with dot. what does dot mean?
        [
            "front",
            [
                "5F#*",
                "5D*",
                "4B*",
                "4G",
                "4E*",
                "4C",
                "3A*",
                "3G*",
                "3B*",
                "4D*",
                "4F#*",
                "4A*",
                "5C",
                "5E*",
                "5G",
            ],
        ],
        ["back right", ["3Gb", "3Bb", "4Db", "4F", "4Ab", "5Eb"]],
    ]),
    allNotes = [...tines.values()].flat(Infinity);

function getKalimbaFormHTML() {
    return `
            <label>note length: ${getSelectNoteLengthHTML()}</label>
            <div id="finger-sections">
                ${[...tines.entries()]
                    .map(([title, notes]) => getFingerSectionHTML(notes))
                    .join("")}
            </div>
            <button type="submit">write line</button>
        `;
}

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
                <label>
                    <input type="checkbox" name="${note}" />
                    ${
                        note.includes("*")
                            ? note.replace("*", "") + "<br/>&bull;"
                            : note
                    }
                </label>
            `;
}

export { noteLengths, redTineIndexes, tines, allNotes, getKalimbaFormHTML };
