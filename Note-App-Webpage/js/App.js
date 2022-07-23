import NotesView from "./NotesView.js";
import NotesAPI from "./NotesAPI.js";

export default class App {
    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this._handlers());

        this.filters = document.querySelectorAll(".nav-item");
        this._switchTab();

        this._refreshNotes();
    }


    _switchTab() {
        this.filters.forEach((tab) => { //將所有tab切換的狀態寫入tab變數


            tab.addEventListener('click', () => {
                this.tabType = tab.getAttribute("data-type"); //取得被點擊的tab的datea-type值
                console.log("click");

                document.querySelectorAll(".nav-link").forEach((nav) => { //先選擇所有class含有nav-link的標籤
                    nav.classList.remove("active"); //移除所有nav的active偽元素狀態
                });

                tab.firstElementChild.classList.add("active"); //再將選擇到的tab寫入active屬性

                this._refreshNotes();


            })
        });
    }


    _refreshNotes() {

        // console.log("get type: " + tabType);

        var notes = NotesAPI.getNotArchNotes();

        if (this.tabType == "all") {
            console.log("all");
            notes = NotesAPI.getNotArchNotes();
        } else if (this.tabType == "todo") {
            console.log("todo");
            notes = NotesAPI.getToDoNotes();
        } else if (this.tabType == "done") {
            console.log("done");
            notes = NotesAPI.getCompletedNotes();
        } else if (this.tabType == "archived") {
            console.log("archived");
            notes = NotesAPI.getArchivedNotes();
        }


        this._setNotes(notes);

        if (notes.length > 0) {
            this._setActiveNote(notes[0]);
        }
    }

    _setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }

    _setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    _resetTab() {

        this.tabType = "all";
        const resetTab = document.getElementById("tabAll");

        document.querySelectorAll(".nav-link").forEach((nav) => { //先選擇所有class含有nav-link的標籤
            nav.classList.remove("active"); //移除所有nav的active偽元素狀態
        });

        resetTab.classList.add("active"); //再將選擇到的tab寫入active屬性
        this._refreshNotes();

    }

    _handlers() {
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this._setActiveNote(selectedNote);
            },
            onNoteAdd: () => {
                const newNote = {
                    title: "New Note",
                    body: "Take note...",
                    isDone: false,
                    archive: false

                };

                this._resetTab();
                NotesAPI.saveNote(newNote);
                this._refreshNotes();
            },
            onNoteEdit: (title, body) => {
                NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title,
                    body
                });

                this._refreshNotes();
            },
            onNoteComplete: noteId => {
                NotesAPI.completeNote(noteId);
                this._refreshNotes();
            },
            onNoteArchive: noteId => {
                NotesAPI.archiveNote(noteId);
                this._refreshNotes();
            },
            onNoteDelete: noteId => {
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            }
        };
    }
}