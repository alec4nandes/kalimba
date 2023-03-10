import Line from "./Line.js";

export default class Song {
    constructor(fileText) {
        const lines = fileText?.split("\n"),
            timeSig = lines?.[0],
            connectedMeasures = lines?.[1];
        this.timeSig = timeSig || "4/4";
        this.connectedMeasures = JSON.parse(connectedMeasures || "[]");
        this.lines =
            lines
                ?.slice(2)
                .map((line) => new Line(new Map(JSON.parse(line)))) || [];
    }

    #noteInfo = {
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

    #getMaxBar() {
        const [numberOf, notes] = this.timeSig.split("/").map((str) => +str),
            max = numberOf * (1 / notes);
        return max;
    }

    getLinesHTML() {
        let total = 0,
            measureCount = 0;
        const max = this.#getMaxBar(),
            copy = [...this.lines]
                .map((line, index) => {
                    const note = line.getNote().replace("r", "");
                    total += this.#noteInfo[note];
                    const addBar = total === max;
                    if (addBar) {
                        total = 0;
                        ++measureCount;
                    }
                    return [
                        line.getLineHTML(index),
                        addBar
                            ? `
                                <div class="line">
                                    ${[
                                        `<div class="note-container"></div>`,
                                        [...line.getNotes().entries()]
                                            .map(
                                                ([key, val]) => `
                                                    <div class="note-container">
                                                        <span>
                                                            <img src="assets/${
                                                                val &&
                                                                this.connectedMeasures.includes(
                                                                    measureCount
                                                                )
                                                                    ? "bar-connected"
                                                                    : "bar"
                                                            }.png" />
                                                        </span>
                                                    </div>
                                                `
                                            )
                                            .join(""),
                                        `<div class="note-container"></div>`,
                                    ].join("")}
                                </div>`
                            : [],
                    ];
                })
                .flat();
        console.log(copy);
        copy.reverse();
        return copy.join("");
    }

    addLine(line, index) {
        if (index !== undefined) {
            this.lines.splice(index, 0, line);
        } else {
            this.lines.push(line);
        }
        this.#addRemoveHelper();
    }

    replaceLine(line, index) {
        this.lines.splice(index, 1, line);
        this.#addRemoveHelper();
    }

    removeLine(index) {
        this.lines.splice(index, 1);
        this.#addRemoveHelper();
    }

    #addRemoveHelper() {
        const result = this.#findMeasuresRecursive(
            this.lines,
            this.connectedMeasures
        );
        this.lines = result.lines;
        this.connectedMeasures = result.connectedMeasures;
    }

    #findMeasuresRecursive(lines, connectedMeasures = [], measureCount = 0) {
        const max = this.#getMaxBar();
        let total = 0,
            result = lines;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i],
                n = line.getNote(),
                note = n.replace("r", ""),
                isRest = n.includes("r"),
                isLastIndex = i === lines.length - 1;
            total += this.#noteInfo[note];
            console.log(total);
            if (total === max) {
                ++measureCount;
                if (isLastIndex) break;
                total = 0;
            } else if (total < max) {
                if (isLastIndex) break;
            } else if (total > max) {
                const nextNoteLength = total - max,
                    lastNoteLength = this.#noteInfo[note] - nextNoteLength,
                    lastLine = this.#makeNewLine(lastNoteLength, line, isRest),
                    nextLine = this.#makeNewLine(nextNoteLength, line, isRest);
                if (lastLine && nextLine) {
                    const newLines = [...lines];
                    newLines.splice(i, 1, lastLine, nextLine);
                    !isRest && connectedMeasures.push(++measureCount);
                    result = this.#findMeasuresRecursive(
                        newLines,
                        connectedMeasures,
                        measureCount
                    );
                } else {
                    lines.pop();
                    result = lines;
                }
                break;
            }
        }
        return Array.isArray(result)
            ? { lines: result, measureCount, connectedMeasures }
            : result;
    }

    #makeNewLine(noteLength, line, isRest) {
        try {
            const noteLetter = Object.entries(this.#noteInfo).find(
                (entry) => entry[1] === noteLength
            )[0];
            return line.replaceNoteLength(noteLetter + (isRest ? "r" : ""));
        } catch (err) {
            alert(
                "The note had to be split accross bars, but one note has an invalid length of " +
                    noteLength +
                    ". Please choose another note length."
            );
        }
    }

    writeFile() {
        const lines = this.lines
            .map((line) => line.getNotesString())
            .join("\n");
        this.#download(
            "my-song.txt",
            this.timeSig +
                "\n" +
                JSON.stringify(this.connectedMeasures) +
                "\n" +
                lines
        );
    }

    #download(filename, text) {
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
}
