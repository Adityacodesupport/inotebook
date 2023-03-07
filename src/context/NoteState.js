import React, { useState } from "react";
import noteContext from "../context/notes/noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesIntial = [];
  const [notes, setNotes] = useState(notesIntial);
  const getNotes = async () => {
    // TODO API call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  };
  // Add a note
  const addNote = async (title, description, tag) => {
    // TODO API call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
      },

      body: JSON.stringify({ title, description, tag }),
    });
    const note=await response.json();
    setNotes(notes.concat(note));
  };
  // Delete a note
  const deleteNote = async (id) => {
    // TODO API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token')
      },
    });
    const json=await response.json();
    console.log(json);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    //API Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token')
      },

      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);
    // eslint-disable-next-line 
    // Edit note

    let newNote=JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNote.length; index++) {
      const element = newNote[index];
      if (element._id === id) {
        newNote[index].title = title;
        newNote[index].description = description;
        newNote[index].tag = tag;
      }
      break;
    }
    setNotes(newNote);
  };
  return (
    <noteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </noteContext.Provider>
  );
};
export default NoteState;
