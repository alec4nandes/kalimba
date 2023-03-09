import { allNotes } from "../scripts/kalimba-data.js";

export default class Line {
    constructor(notes) {
        this.notes = allNotes.reduce(
            (map, note) => map.set(note, notes.get(note) || null),
            new Map()
        );
    }

    getNotesJSON() {
        return JSON.stringify([...this.notes.entries()]);
    }

    getLineHTML() {
        const arr = [...this.notes.values()],
            lastNoteIndex = arr.findLastIndex((item) => item),
            noteLength = arr[lastNoteIndex],
            result = [
                "flags/" +
                    (!noteLength || noteLength === "w"
                        ? "no-flag"
                        : ["q", "h"].includes(noteLength)
                        ? "mast-flag"
                        : `${noteLength}-flag`),
                ...arr.map((item, i) =>
                    item
                        ? (item === "w"
                              ? "whole"
                              : ["s", "e", "q"].includes(item)
                              ? "black"
                              : "white") +
                          (item !== "w" && i === lastNoteIndex ? "-end" : "")
                        : i > lastNoteIndex || noteLength === "w"
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
        return `<div class="line">${result}</div>`;
    }
}
