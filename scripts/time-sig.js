import { noteLengths } from "./kalimba-data.js";

export default function getTimeSigFormHTML() {
    const bottomNums = { s: 16, e: 8, q: 4, h: 2, w: 1 };

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
                                value="${bottomNums[len[0]]}"
                                ${len === "quarter" ? "selected" : ""}
                            ">
                                ${len[0].toUpperCase()}
                            </option>
                       `
                    )
                    .join("")}
            </select>
        </label>
        <button type="submit">set time signature</button>
    `;
}
