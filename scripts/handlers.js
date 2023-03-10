import Line from "../classes/Line.js";
import Song from "../classes/Song.js";

function displayComposedNotes(song) {
    const composedNotesElem = document.querySelector("#composed-notes");
    composedNotesElem.innerHTML = song.getLinesHTML();
    addRemoveLineButtonHandlers(song);
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

function handleAddNotesFormSubmit(e, song) {
    e.preventDefault();
    const noteLength = e.target["note-length"].value,
        entries = [...new FormData(e.target).entries()]
            .filter(([key]) => key !== "note-length")
            .map(([key]) => [key, noteLength]);
    song.addLine(
        new Line(
            new Map(entries.length ? entries : [["3G*", `${noteLength}r`]])
        )
    );
    displayComposedNotes(song);
}

function handleChangeNoteLength(e) {
    const addNotesForm = document.querySelector("#add-notes");
    addNotesForm.className = e.target.value;
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

export {
    handleAddNotesFormSubmit,
    handleChangeNoteLength,
    handleClearInputs,
    handleNewSong,
    handleUploadSong,
};
