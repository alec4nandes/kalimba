import { allNotes } from "../scripts/kalimba-data.js";

export default class Line {
    constructor(notes) {
        this.notes = allNotes.reduce(
            (map, note) => map.set(note, notes.get(note) || null),
            new Map()
        );
    }

    #sizes = {
        s: 1 / 16,
        "s.": (1 / 16) * 1.5,
        e: 1 / 8,
        "e.": (1 / 8) * 1.5,
        q: 1 / 4,
        "q.": (1 / 4) * 1.5,
        h: 1 / 2,
        "h.": (1 / 2) * 1.5,
        w: 1,
        "w.": 1.5,
    };

    getNotes() {
        return this.notes;
    }

    getNote() {
        return [...this.notes.values()].find(Boolean);
    }

    getNoteLength() {
        return this.getNote().replace("r", "");
    }

    getNoteSize() {
        return this.#sizes[this.getNoteLength()];
    }

    isRest() {
        return this.getNote().includes("r");
    }

    replaceNoteLength(noteLength, isRest) {
        const noteLetter =
            Object.entries(this.#sizes).find(
                (entry) => entry[1] === noteLength
            )[0] + (isRest ? "r" : "");
        return new Line(
            new Map(
                [...this.notes.entries()]
                    .filter(([key, val]) => val)
                    .map(([key]) => [key, noteLetter])
            )
        );
    }

    getNotesString() {
        return JSON.stringify(
            [...this.notes.entries()].filter(([key, value]) => value)
        );
    }

    getLineHTML(index) {
        const noteValues = [...this.notes.values()],
            lastNoteIndex = noteValues.findLastIndex(Boolean),
            noteLength = noteValues[lastNoteIndex].replace(".", ""),
            result = [
                getFlagOrSpace(noteLength),
                ...noteValues.map((item, i) => {
                    const isLastNote = i === lastNoteIndex,
                        isRest = noteLength.includes("r"),
                        isPastLastNote = i > lastNoteIndex,
                        isWholeNote = noteLength === "w";
                    return item
                        ? getNoteFileName(item, isLastNote)
                        : isRest || isPastLastNote || isWholeNote
                        ? "space"
                        : "mast";
                }),
            ]
                .map(getNoteContainer)
                .join("");
        return `
            <div class="line">
                ${result}
                <div class="note-container">
                    <button class="replace-line" data-index="${index}">
                        +
                    </button>
                    <button class="add-line-below" data-index="${index}">
                        +v
                    </button>
                    <button class="remove-line" data-index="${index}">
                        x
                    </button>
                </div>
            </div>
        `;

        function getFlagOrSpace(noteLength) {
            return noteLength.includes("r")
                ? "space"
                : "flags/" +
                      (!noteLength || noteLength === "w"
                          ? "no-flag"
                          : ["q", "h"].includes(noteLength)
                          ? "mast-flag"
                          : `${noteLength}-flag`);
        }

        function getNoteFileName(item, isLastNote) {
            const noteLength = noteValues[lastNoteIndex].replace(".", ""),
                hasDot = noteValues[lastNoteIndex].includes("."),
                isWholeNote = item === "w";
            return noteLength.includes("r")
                ? `rests/${noteLength}` + (hasDot ? "-dot" : "")
                : (isWholeNote
                      ? "whole"
                      : ["s", "s.", "e", "e.", "q", "q."].includes(item)
                      ? "black"
                      : "white") +
                      (hasDot ? "-dot" : "") +
                      (!isWholeNote && isLastNote ? "-end" : "");
        }

        function getNoteContainer(item, i) {
            return `
                <div class="note-container ${i ? "" : "flag"}">
                    <img src="/assets/${item}.png" />
                </div>
            `;
        }
    }
}
