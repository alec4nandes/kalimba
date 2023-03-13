import { noteLengths } from "./kalimba-data.js";

export default function getTimeSigFormHTML() {
    return `
        <div id="display-time-sig">time signature: <span>4/4</span></div>
        <label>
            number:
            <input name="num-notes" type="number" value="4" min="1" />
        </label>
        <label>
            of notes:
            <select name="note-length">
                ${noteLengths
                    .map(
                        (len) => `
                            <option
                                value="${len.timeSig}"
                                ${len.name === "quarter" ? "selected" : ""}
                            ">
                                ${len.name[0].toUpperCase()}
                            </option>
                       `
                    )
                    .join("")}
            </select>
        </label>
        <button type="submit">set time signature</button>
    `;
}
