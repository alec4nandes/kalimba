import { allNotes, noteLengths } from "./kalimba-data.js";

export default function getAddNotesFormHTML() {
    return `
        <div class="line">
            <div class="note-container"></div>
            <div class="note-container specs">
                ${getSelectNoteLengthHTML()}
                <button type="submit">+</button>
                <div id="clear">clear</div>
            </div>
            ${allNotes.map(getNoteHeaderHTML).join("")}
        </div>
    `;
}

function getSelectNoteLengthHTML() {
    return `
        <select id="note-length" name="note-length">
            ${noteLengths
                .map((len, i) => [
                    `
                        <option
                            value="${len.size}"
                            ${len.name === "quarter" ? "selected" : ""}
                        >
                            ${len.name[0].toUpperCase()}
                        </option>
                    `,
                    // no dotted sixteenth note or dotted whole note
                    // (16th = smallest and whole = largest notes)
                    ...(i && i !== noteLengths.length - 1
                        ? [
                              `
                                <option value="${len.size * 1.5}">
                                    ${len.name[0].toUpperCase()}&bull;
                                </option>
                            `,
                          ]
                        : []),
                ])
                .flat()
                .join("")}
        </select>
    `;
}

function getNoteHeaderHTML(note) {
    return `
        <div class="note-container">
            <label>
                ${note[0]}
                <br/>
                ${note?.slice(1).replace("*", "")}
                <br/>
                ${note.includes("*") ? "&bull;" : "&nbsp;"}
                <br />
                <input type="checkbox" name="${note}" />
            </label>
        </div>
    `;
}
