import { allNotes, tiedNotes } from "./kalimba-data.js";
import { getNoteHeaderHTML } from "./add-notes.js";

export default function displayLines(song) {
    const fileNames = {
            1: "black",
            2: "black",
            3: "black-dot",
            4: "black",
            6: "black-dot",
            7: "black-2-dot",
            8: "white",
            12: "white-dot",
            14: "white-2-dot",
            15: "white-3-dot",
            16: "whole",
        },
        { lines: bars, tiedBars } = song;
    let indexCount = 0;
    document.querySelector("#composed-notes").innerHTML = [...bars]
        .map(
            (bar, barIndex) => `
                ${[...bar]
                    .map((line, i) => {
                        const result = getLineHTML(line, indexCount),
                            isLast = i === bar.length - 1,
                            isTiedBar =
                                isLast && tiedBars.includes(barIndex + 1);
                        // keep the same index across tied bars
                        // to keep notes together while editing
                        !isTiedBar && ++indexCount;
                        return result;
                    })
                    // reverse since notes are read bottom to top
                    .reverse()
                    .join("")}
                ${getBarHTML(tiedBars.includes(barIndex), bar[0])}
            `
        )
        // reverse since notes are read bottom to top
        .reverse()
        .join("");

    document.querySelector("#bottom-notes").innerHTML = `
            <div class="line">
                <div class="note-container"></div>
                <div class="note-container flag"></div>
                ${allNotes
                    .map((note) => getNoteHeaderHTML(note, true))
                    .join("")}
            </div>
        `;

    function getLineHTML(line, index) {
        const tiedNote = [...tiedNotes[line.noteLength]];
        // reverse since notes are read bottom to top
        tiedNote.reverse();
        return `
            <div class="line">
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
                <div class="note-container flag">
                    <span>
                        ${tiedNote
                            .map((tied) => getFlagImageHTML(line.notes, tied))
                            .join(getFlagImageHTML())}
                    </span>
                </div>
                ${allNotes
                    .map((lineNote, i) =>
                        getNoteContainerHTML(line, tiedNote, lineNote, i)
                    )
                    .join("")}
            </div>
        `;

        function getFlagImageHTML(notes, tied) {
            const flags = {
                1: "s",
                2: "e",
                3: "e",
                4: "mast",
                6: "mast",
                7: "mast",
                8: "mast",
                12: "mast",
                14: "mast",
                15: "mast",
                16: "no",
            };
            return `
                <img src="../assets/flags/${
                    notes?.length ? flags[tied] : "no"
                }-flag.png" />
            `;
        }

        function getNoteContainerHTML(line, tiedNote, lineNote, i) {
            const isWhole = [16, 24].includes(line.noteLength),
                { notes } = line,
                lastIndex = allNotes.lastIndexOf(
                    [...notes].sort(
                        (a, b) => allNotes.indexOf(b) - allNotes.indexOf(a)
                    )[0]
                );
            return `
                <div class="note-container">
                    <span>
                    ${
                        !line.notes.length && lineNote === "3G*"
                            ? getRestImageHTML(tiedNote)
                            : tiedNote
                                  .map((tied) => getNoteImageHTML(tied))
                                  .join(getTiedImageHTML())
                    }
                    </span>
                </div>
            `;

            function getRestImageHTML(tiedNote) {
                const restFileNames = {
                    1: "sr",
                    2: "er",
                    3: "er-dot",
                    4: "qr",
                    6: "qr-dot",
                    7: "qr-2-dot",
                    8: "hr",
                    12: "hr-dot",
                    14: "hr-2-dot",
                    15: "hr-3-dot",
                    16: "wr",
                };
                return tiedNote
                    .map(
                        (tied) =>
                            `<img src="../assets/rests/${restFileNames[tied]}.png" />`
                    )
                    .join(getTiedImageHTML());
            }

            function getNoteImageHTML(tied) {
                return `
                    <img src="../assets/${
                        line.notes?.includes(lineNote)
                            ? fileNames[tied] +
                              (!isWhole && i === lastIndex ? "-end" : "")
                            : isWhole || i > lastIndex
                            ? "space"
                            : "mast"
                    }.png" />
                `;
            }

            function getTiedImageHTML() {
                return `
                    <img src="../assets/${
                        line.notes.includes(lineNote) ||
                        (!line.notes.length && lineNote === "3G*")
                            ? "tied"
                            : "space"
                    }.png" />
                `;
            }
        }
    }

    function getBarHTML(isTied, barLine) {
        return `
            <div class="line">
                <div class="note-container"></div>
                <div class="note-container flag"></div>
                ${allNotes
                    .map(
                        (note) => `
                            <div class="note-container">
                                <img src="../assets/bar${
                                    isTied &&
                                    (barLine.notes.includes(note) ||
                                        (!barLine.notes.length &&
                                            note === "3G*"))
                                        ? "-tied"
                                        : ""
                                }.png" />
                            </div>
                        `
                    )
                    .join("")}
            </div>
        `;
    }
}
