import { allNotes } from "../scripts/kalimba-data.js";

export default class Line {
    constructor(notes) {
        this.notes = allNotes.reduce(
            (map, note) => map.set(note, notes.get(note) || null),
            new Map()
        );
    }

    getNote() {
        return [...this.notes.values()].find(Boolean);
    }

    getNotes() {
        return this.notes;
    }

    replaceNoteLength(noteLetter) {
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
        const arr = [...this.notes.values()],
            lastNoteIndex = arr.findLastIndex((item) => item),
            noteLength = arr[lastNoteIndex].replace(".", ""),
            hasDot = arr[lastNoteIndex].includes("."),
            result = [
                noteLength.includes("r")
                    ? "space"
                    : "flags/" +
                      (!noteLength || noteLength === "w"
                          ? "no-flag"
                          : ["q", "h"].includes(noteLength)
                          ? "mast-flag"
                          : `${noteLength}-flag`),
                ...arr.map((item, i) =>
                    item
                        ? noteLength.includes("r")
                            ? `rests/${noteLength}` + (hasDot ? "-dot" : "")
                            : (item === "w"
                                  ? "whole"
                                  : ["s", "s.", "e", "e.", "q", "q."].includes(
                                        item
                                    )
                                  ? "black"
                                  : "white") +
                              (hasDot ? "-dot" : "") +
                              (item !== "w" && i === lastNoteIndex
                                  ? "-end"
                                  : "")
                        : noteLength.includes("r") ||
                          i > lastNoteIndex ||
                          noteLength === "w"
                        ? "space"
                        : "mast"
                ),
            ]
                .map(
                    (item, i) => `
                        <div class="note-container ${i ? "" : "flag"}">
                            <img src="/assets/${item}.png" />
                        </div>
                    `
                )
                .join("");
        return `
            <div class="line">
                ${result}
                <div class="note-container">
                    <button class="remove-line" data-index="${index}">
                        x
                    </button>
                </div>
            </div>
        `;
    }
}
