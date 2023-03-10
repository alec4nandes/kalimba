import { allNotes, noteLengths } from "./kalimba-data.js";

export default function getAddNotesFormHTML() {
    return `
        <div class="line">
            <div class="note-container">
                ${getSelectNoteLengthHTML()}
                <button type="submit">+</button>
                <div id="clear">clear</div>
            </div>
            ${allNotes.map(getNoteHeaderHTML).join("")}
            <div class="note-container"></div>
        </div>
    `;
}

function getSelectNoteLengthHTML() {
    return `
        <select id="note-length" name="note-length">
            ${noteLengths
                .map((len) => [
                    `
                        <option
                            value="${len[0]}"
                            ${len === "quarter" ? "selected" : ""}
                        >
                            ${len[0].toUpperCase()}
                        </option>
                    `,
                    `
                        <option value="${len[0]}.">
                            ${len[0].toUpperCase()}&bull;
                        </option>
                    `,
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
