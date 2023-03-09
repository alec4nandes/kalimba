import Line from "./Line.js";

export default class Song {
    constructor(fileText) {
        this.lines =
            fileText
                ?.split("\n")
                .map((line) => new Line(new Map(JSON.parse(line)))) || [];
    }

    getLines() {
        return this.lines;
    }

    addLine(line) {
        this.lines.push(line);
    }

    writeFile() {
        this.#download(
            "my-song.txt",
            this.lines.map((line) => line.getNotes()).join("\n")
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
