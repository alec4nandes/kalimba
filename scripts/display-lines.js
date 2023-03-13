import { allNotes, tiedNotes } from "./kalimba-data.js";

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
        // reverse since notes are read bottom to top
        bars = [...song.lines],
        connectedBars = song.connectedBars.map(
            (connIndex) => bars.length - connIndex
        );
    bars.reverse();

    document.querySelector("#composed-notes").innerHTML = bars
        .map((bar, barIndex) => {
            // reverse since notes are read bottom to top
            const b = [...bar];
            b.reverse();
            return `
                ${b
                    .map((line, i) => {
                        const reversedIndex = Math.abs(i - b.length) - 1;
                        return getLineHTML(line, reversedIndex);
                    })
                    .join("")}
                ${getBarHTML(connectedBars.includes(barIndex + 1), bar[0])}
            `;
        })
        .join("");

    function getLineHTML(line, index) {
        // reverse since notes are read bottom to top
        const tiedNote = [...tiedNotes[line.noteLength]];
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
                            .join(line.notes.length ? getFlagImageHTML() : "")}
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
                                  .join(
                                      line.notes.length
                                          ? getTiedImageHTML()
                                          : ""
                                  )
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
                    .join("");
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
                        line.notes?.includes(lineNote) && tiedNote.length > 1
                            ? "tied"
                            : "space"
                    }.png" />
                `;
            }
        }
    }

    function getBarHTML(isConnected, barLine) {
        return `
            <div class="line">
                <div class="note-container"></div>
                <div class="note-container flag"></div>
                ${allNotes
                    .map(
                        (note) => `
                            <div class="note-container">
                                <img src="../assets/bar${
                                    isConnected && barLine.notes.includes(note)
                                        ? "-connected"
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
