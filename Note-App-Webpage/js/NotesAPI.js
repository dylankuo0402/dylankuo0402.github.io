export default class NotesAPI {
    //getAllNotes
    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

        return notes.sort((a, b) => { return new Date(a.updated) > new Date(b.updated) ? -1 : 1; });
    }

    static getNotArchNotes() {
        const allNotes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
        const notArchNotes = allNotes.filter(note => !note.archive);

        return notArchNotes.sort((a, b) => { return new Date(a.updated) > new Date(b.updated) ? -1 : 1; });

    }

    static getToDoNotes() {
        const allnotes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
        const toDoNotes = allnotes.filter((note) => (!note.isDone && !note.archive)); //利用filter函式拜訪array的每一個元素，並將其狀態回傳給filterItems
        // console.log("todonotes: " + toDoNotes[1].title);
        toDoNotes.forEach(element => {
            console.log("todo note: " + element.title);
        });
        return toDoNotes.sort((a, b) => { return new Date(a.updated) > new Date(b.updated) ? -1 : 1; });
    }

    static getCompletedNotes() {
        const allnotes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
        const doneNotes = allnotes.filter((note) => (note.isDone && !note.archive)); //利用filter函式拜訪array的每一個元素，並將其狀態回傳給filterItems
        doneNotes.forEach(element => {
            console.log("completed notes: " + element.title);
        })

        // console.log("todonotes: " + toDoNotes[1].title);
        return doneNotes.sort((a, b) => { return new Date(a.updated) > new Date(b.updated) ? -1 : 1; });
    }

    static getArchivedNotes() {
        const allnotes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
        const archivedNotes = allnotes.filter(note => note.archive); //利用filter函式拜訪array的每一個元素，並將其狀態回傳給filterItems
        archivedNotes.forEach(element => {
            console.log("completed notes: " + element.title);
        })

        // console.log("todonotes: " + toDoNotes[1].title);
        return archivedNotes.sort((a, b) => { return new Date(a.updated) > new Date(b.updated) ? -1 : 1; });
    }



    //saveNote  input noteToSave --> store into localStorage
    static saveNote(noteToSave) {
        // 現在 Localstorage 的資料  
        const notes = NotesAPI.getAllNotes();

        //再把新的 noteToSave 加入 存起來
        const existing = notes.find(note => (note.id == noteToSave.id));

        // Add a new Note/ Edit a existing note ??
        if (existing) {
            //update
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        } else {
            //add a new one 
            noteToSave.id = Math.floor(Math.random() * 10000);
            noteToSave.updated = new Date().toISOString();
            //加入新增的資料
            notes.push(noteToSave);
        }

        // save new data + existing data back into localstorage
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }

    static completeNote(noteId) {
        const notes = NotesAPI.getAllNotes();
        const doneNote = notes.find(note => (note.id == noteId));
        const doneIndex = notes.indexOf(doneNote);

        if (doneNote.isDone == false) {
            doneNote.isDone = true;
        } else {
            doneNote.isDone = false;
        }

        notes.splice(doneIndex, 1);
        notes.push(doneNote);

        console.log("complete note id: " + doneNote.id);
        console.log("complete note index: " + doneIndex);
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));

    }

    static archiveNote(noteId) {
        const notes = NotesAPI.getAllNotes();
        const archiveNote = notes.find(note => (note.id == noteId));
        const archiveIndex = notes.indexOf(archiveNote);

        if (archiveNote.archive == false) {
            archiveNote.archive = true;
        } else {
            archiveNote.archive = false;
        }

        notes.splice(archiveIndex, 1);
        notes.push(archiveNote);

        console.log("archive note id: " + archiveNote.id);
        console.log("archive note index: " + archiveIndex);
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));

    }

    static deleteNote(noteId) {
        const notes = NotesAPI.getAllNotes();
        const deletedNote = notes.find(note => (note.id == noteId));
        const deletedIndex = notes.indexOf(deletedNote);

        console.log("delete note id: " + noteId);
        console.log("delete index: " + deletedIndex);

        if (confirm("Are you sure you want to delete this note?")) {
            notes.splice(deletedIndex, 1);
            localStorage.setItem("notesapp-notes", JSON.stringify(notes));
        }

    }


}