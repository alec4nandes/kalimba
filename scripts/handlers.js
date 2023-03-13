import Line from "../classes/Line.js";
import Song from "../classes/Song.js";

function displayComposedNotes(song) {
    const composedNotesElem = document.querySelector("#composed-notes");
    composedNotesElem.innerHTML = song.getLinesHTML();
    addReplaceLineButtonHandlers(song);
    addLineBelowButtonHandlers(song);
    addRemoveLineButtonHandlers(song);
}

function getNotesFormData(formElem) {
    const noteLength = formElem["note-length"].value,
        entries = [...new FormData(formElem).entries()]
            .filter(([key]) => key !== "note-length")
            .map(([key]) => [key, noteLength]);
    return new Line(
        new Map(entries.length ? entries : [["3G*", `${noteLength}r`]])
    );
}

function handleAddNotesFormSubmit(e, song) {
    e.preventDefault();
    song.addLine(getNotesFormData(e.target));
    displayComposedNotes(song);
}

function addReplaceLineButtonHandlers(song) {
    document.querySelectorAll(".replace-line").forEach(
        (button) =>
            (button.onclick = (e) => {
                const index = button.getAttribute("data-index"),
                    line = getNotesFormData(
                        document.querySelector("#add-notes")
                    );
                song.replaceLine(line, index);
                displayComposedNotes(song);
            })
    );
}

function addLineBelowButtonHandlers(song) {
    document.querySelectorAll(".add-line-below").forEach(
        (button) =>
            (button.onclick = (e) => {
                const index = button.getAttribute("data-index"),
                    line = getNotesFormData(
                        document.querySelector("#add-notes")
                    );
                song.addLine(line, index);
                displayComposedNotes(song);
            })
    );
}

function addRemoveLineButtonHandlers(song) {
    document.querySelectorAll(".remove-line").forEach(
        (button) =>
            (button.onclick = () => {
                const index = button.getAttribute("data-index");
                song.removeLine(index);
                displayComposedNotes(song);
            })
    );
}

function handleChangeNoteLength(e) {
    const addNotesForm = document.querySelector("#add-notes");
    addNotesForm.className = e.target.value.replace(".", "-dot");
}

function handleClearInputs() {
    document
        .querySelector("#add-notes")
        .querySelectorAll("input[type='checkbox']")
        .forEach((checkbox) => (checkbox.checked = false));
}

function handleNewSong(song) {
    const proceed = confirm("This will erase any composed notes. Continue?");
    if (proceed) {
        handleClearInputs();
        const blankSong = new Song();
        displayComposedNotes(blankSong);
        return blankSong;
    } else {
        return song;
    }
}

function handleUploadSong(e) {
    e.preventDefault();
    return new Promise((resolve, reject) => {
        const reader = new FileReader(),
            file = e.target.upload.files[0];
        reader.onload = () => {
            const uploadedSong = new Song(reader.result);
            displayComposedNotes(uploadedSong);
            resolve(uploadedSong);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

function handleTimeSigFormSubmit(e, song) {
    e.preventDefault();
    const topNum = e.target["num-notes"].value,
        bottomNum = e.target["note-length"].value,
        timeSig = `${topNum}/${bottomNum}`;
    const result = song.setTimeSig(timeSig);
    if (result) {
        displayComposedNotes(song);
        document
            .querySelector("#display-time-sig")
            .querySelector("span").innerText = timeSig;
    }
}

export {
    addReplaceLineButtonHandlers,
    handleTimeSigFormSubmit,
    handleAddNotesFormSubmit,
    handleChangeNoteLength,
    handleClearInputs,
    handleNewSong,
    handleUploadSong,
};
