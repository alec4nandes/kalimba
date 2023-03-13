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

    #getMaxBar() {
        const [numberOf, notes] = this.timeSig.split("/").map((str) => +str),
            max = numberOf * (1 / notes);
        return max;
    }

    getLinesHTML() {
        const connectedMeasures = this.connectedMeasures;
        let total = 0,
            measureCount = 0;
        const max = this.#getMaxBar(),
            copy = [...this.lines]
                .map((line, index) => {
                    const noteSize = line.getNoteSize();
                    total += noteSize;
                    const addBar = total === max;
                    if (addBar) {
                        total = 0;
                        ++measureCount;
                    }
                    return [
                        line.getLineHTML(index),
                        addBar ? makeBar(line, measureCount) : [],
                    ];
                })
                .flat();
        copy.reverse();
        return copy.join("");

        function makeBar(line, measureCount) {
            const isConnected = connectedMeasures.includes(measureCount);
            return `
                <div class="line">
                    ${[
                        `<div class="note-container"></div>`,
                        [...line.getNotes().entries()]
                            .map(
                                ([key, val]) => `
                                    <div class="note-container">
                                        <span>
                                            <img src="assets/${
                                                val && isConnected
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
                </div>
            `;
        }
    }

    setTimeSig(timeSig) {
        return this.#addRemoveHelper(timeSig);
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

    #addRemoveHelper(timeSig) {
        const oldTimeSig = this.timeSig,
            // combine with old timeSig
            combined = this.#combineLinkedBars(this.lines);
        if (combined) {
            // split bars with new timeSig and combined lines
            timeSig && (this.timeSig = timeSig);
            const result = this.#findMeasuresRecursive(combined);
            if (result) {
                this.lines = result.lines;
                this.connectedMeasures = result.connectedMeasures;
                return true;
            } else if (timeSig) {
                // revert to old time signature
                this.timeSig = oldTimeSig;
            }
        }
        return false;
    }

    #combineLinkedBars(lines) {
        const max = this.#getMaxBar(),
            combined = [];
        let measure = 0,
            total = 0,
            lastLineWasCombined = false;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i],
                isRest = line.isRest(),
                pushLine = (line) =>
                    lastLineWasCombined
                        ? (lastLineWasCombined = false)
                        : combined.push(line);
            let noteSize = line.getNoteSize();
            total += noteSize;
            if (total === max) {
                // hit end of bar:
                ++measure;
                total = 0;
                if (this.connectedMeasures.includes(measure)) {
                    // connect this line and the next
                    const nextLine = lines[i + 1],
                        nextSize = nextLine.getNoteSize();
                    if (nextLine) {
                        noteSize = lastLineWasCombined
                            ? // get last note size
                              combined.at(-1).getNoteSize()
                            : noteSize;
                        const combinedLength = noteSize + nextSize,
                            newLine = this.#makeNewLine(
                                combinedLength,
                                line,
                                isRest
                            );
                        if (newLine) {
                            lastLineWasCombined &&
                                // update note across multiple measures
                                combined.pop();
                            combined.push(newLine);
                            lastLineWasCombined = true;
                        } else {
                            return false;
                        }
                    }
                } else {
                    pushLine(line);
                }
            } else {
                pushLine(line);
            }
        }
        return combined;
    }

    #findMeasuresRecursive(lines, connectedMeasures = [], measureCount = 0) {
        const max = this.#getMaxBar();
        let total = 0,
            result = lines;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i],
                isRest = line.isRest(),
                isLastIndex = i === lines.length - 1,
                noteSize = line.getNoteSize();
            total += noteSize;
            if (total === max) {
                ++measureCount;
                if (isLastIndex) break;
                total = 0;
            } else if (total < max) {
                if (isLastIndex) break;
            } else if (total > max) {
                const nextNoteSize = total - max,
                    lastNoteLength = noteSize - nextNoteSize,
                    lastLine = this.#makeNewLine(lastNoteLength, line, isRest),
                    nextLine = this.#makeNewLine(nextNoteSize, line, isRest);
                if (lastLine && nextLine) {
                    const newLines = [...lines];
                    newLines.splice(i, 1, lastLine, nextLine);
                    !isRest && connectedMeasures.push(++measureCount);
                    result = this.#findMeasuresRecursive(
                        newLines,
                        connectedMeasures
                    );
                } else {
                    return false;
                }
                break;
            }
        }
        return result
            ? Array.isArray(result)
                ? { lines: result, measureCount, connectedMeasures }
                : result
            : false;
    }

    #makeNewLine(noteLength, line, isRest) {
        try {
            return line.replaceNoteLength(noteLength, isRest);
        } catch (err) {
            alert(
                "A note had to be split accross bars, but one split note has an invalid length of " +
                    noteLength +
                    ". Please choose another note length or time signature."
            );
            return false;
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
