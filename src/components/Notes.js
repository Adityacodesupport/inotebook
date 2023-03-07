import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import noteContext from "../context/notes/noteContext";
import AddNote from "./AddNote";
import NoteItem from "./NoteItem";

const Notes = (props) => {
  const context = useContext(noteContext);
  let history=useHistory();
  const { notes, getNotes,editNote } = context;
  useEffect(() => {
    if(localStorage.getItem('token'))
    {
      getNotes();
    }else{
      history.push("/login");
    }
    // eslint-disable-next-line
  }, []);

  const [note, setNote] = useState({
    id:"",
    title: "",
    description: "",
    tag: "",
  });
  const handleclick = (e) => {
      
    e.preventDefault();
    editNote(note.id,note.title,note.description,note.tag);
    refClose.current.click();
    props.showAlert("Updated SuccessFully","success");
  };
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  const ref = useRef(null);
  const refClose=useRef(null);
  const updateNote = (curentNote) => {
    ref.current.click();
    setNote({id:curentNote._id,title:curentNote.title, description:curentNote.description,tag:curentNote.tag});
    
  };

  return (
    <>
      <AddNote showAlert={props.showAlert}/>
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={note.title}
                    aria-describedby="emailHelp"
                    placeholder="Enter title"
                    onChange={onChange}
                    minLength={5} required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    value={note.description}
                    placeholder="description"
                    onChange={onChange}
                    minLength={5} required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="tag">Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tag"
                    name="tag"
                    value={note.tag}
                    placeholder="tag"
                    onChange={onChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
              ref={refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button  disabled={note.title.length<3 || note.description.length<5} onClick={handleclick} type="button" className="btn btn-primary">
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container mx-2">
          {notes.length===0 && 'No notes to display'}
        </div>
        {notes.map((note) => {
          return (
            <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
          );
        })}
      </div>
    </>
  );
};

export default Notes;
