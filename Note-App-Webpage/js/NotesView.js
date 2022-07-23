export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteComplete, onNoteArchive, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteComplete = onNoteComplete;
        this.onNoteArchive = onNoteArchive;
        this.onNoteDelete = onNoteDelete;

        this.root.innerHTML = `
            <div class="notes__sidebar">
                <button class="notes__add " type="button">Add Note
                <i class="bi bi-pencil-square"></i></button>
                
                <ul class="nav nav-tabs">
                    <li class="nav-item " data-type="all" all-items>
                        <a class="nav-link active " href="#" id="tabAll">All</a>
                    </li>
                    <li class="nav-item" data-type="todo">
                        <a class="nav-link" href="#">To Do</a>
                    </li>
                    <li class="nav-item" data-type="done">
                        <a class="nav-link" href="#">Completed</a>
                    </li>
                    <li class="nav-item" data-type="archived">
                        <a class="nav-link" href="#">Archived</a>
                    </li>
                </ul>

                <div class="notes__list">
                    
                </div>
            </div>
            <div class="notes__preview">
                <input class="notes__title" type="text" placeholder="New Note...">
                <textarea class="notes__body">Take Note...</textarea>
            </div>
        `;

        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });

            // console.log(inpTitle.value.trim())
            // inputField.querySelector('[data-done]').addEventListener('click', function(e) {
            //     console.log(yes)
            // })
        });


        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(note) {

        const id = note.id;
        const title = note.title;
        const body = note.body;
        const updated = new Date(note.updated);
        const doneIcon = note.isDone ? "bi bi-clipboard-check-fill" : "bi bi-clipboard-check";
        const statusword = note.isDone ? "Completed" : "To Do";
        const statusColor = note.isDone ? "bg-success" : "bg-primary";
        const archiveIcon = note.archive ? "bi bi-file-earmark-x-fill" : "bi bi-file-earmark-x";

        const MAX_TITLE_LENGTH = 15;
        const MAX_BODY_LENGTH = 30;


        // return `
        //     <div class="notes__list-item" data-note-id="${id}">
        //         <div class="notes__small-title">${title}</div>
        //         <div class="notes__small-body">
        //             ${body.substring(0, MAX_BODY_LENGTH)}
        //             ${body.length > MAX_BODY_LENGTH ? "..." : ""}
        //         </div>
        //         <div class="notes__small-updated">
        //             ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
        //         </div>
        //     </div>
        // `;

        return `
            <div class="notes__list-item " data-note-id="${id}">

                <div class="notes__small-title d-flex justify-content-between align-items-center">
                    <span>
                        
                        ${title.substring(0, MAX_TITLE_LENGTH)}
                        ${title.length > MAX_TITLE_LENGTH ? "..." : ""}
                    </span>
                    <span>
                        <a href="#" data-done><i class="${doneIcon} green"></i></a>
                        <a href="#" data-archived><i class="${archiveIcon} black"></i></a>
                        <a href="#" data-deleted><i class="bi bi-trash3 red"></i></a>
                        
                    </span>
                </div>


                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notes__small-updated d-flex justify-content-between align-items-center">
                <span class="badge rounded-pill ${statusColor}">${statusword}</span>
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes__list");

        // Empty list
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            // const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));
            const html = this._createListItemHTML(note);

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Add select events for each list item
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
                // console.log("this: " + this)
                // console.log(noteListItem)
            });
            noteListItem.querySelector('[data-done]').addEventListener('click', () => {
                this.onNoteComplete(noteListItem.dataset.noteId);
            });
            noteListItem.querySelector('[data-archived]').addEventListener('click', () => {
                this.onNoteArchive(noteListItem.dataset.noteId);
                // console.log('data archived ' + noteListItem.dataset.noteId);
            });
            noteListItem.querySelector('[data-deleted]').addEventListener('click', () => {
                this.onNoteDelete(noteListItem.dataset.noteId);
                // console.log('data deleted ' + noteListItem.dataset.noteId);
            });

        });
    }

    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }
}