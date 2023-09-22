/** @format */
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { Typography, Container, Button, TextField } from "@mui/material";

function App() {
  //state
  const [notes, setNotes] = useState(null);
  const [createForm, setCreateForm] = useState({
    title: "",
    body: "",
  });
  const [updateForm, setUpdateForm] = useState({
    _id: null,
    title: "",
    body: "",
  });
  //use effect
  useEffect(() => {
    fetchNotes();
  }, []);

  //functions
  const fetchNotes = async () => {
    //fetch the notes
    const res = axios.get("http://localhost:3000/notes");
    // set it on state
    setNotes((await res).data.notes);
  };

  const updateCreateFormField = (e) => {
    const { name, value } = e.target;

    setCreateForm({
      ...createForm,
      [name]: value,
    });

    console.log({ name, value });
  };

  const createNote = async (e) => {
    e.preventDefault();

    //create the note
    const res = await axios.post("http://localhost:3000/notes", createForm);
    //update state
    setNotes([...notes, res.data.note]);

    //clear form state
    setCreateForm({ title: "", body: "" });

    console.log(res);
  };

  const deleteNote = async (_id) => {
    //delete the note
    const res = await axios.delete(`http://localhost:3000/notes/${_id}`);
    // update the state
    const newNotes = [...notes].filter((note) => {
      return note._id !== _id;
    });
    setNotes(newNotes);
  };

  const handleUpdateFieldChange = (e) => {
    const { value, name } = e.target;

    setUpdateForm({
      ...updateForm,
      [name]: value,
    });
  };
  const toggleUpdate = (note) => {
    //get the current note values
    setUpdateForm({ title: note.title, body: note.body, _id: note._id }); //set state on update form
  };

  const updateNote = async (e) => {
    e.preventDefault();
    const { title, body } = updateForm;
    //set state on update form
    const res = await axios.put(
      `http://localhost:3000/notes/${updateForm._id}`,
      {
        title,
        body,
      }
    );
    //update state
    const newNotes = [...notes];
    const noteIndex = notes.findIndex((note) => {
      return note._id === updateForm._id;
    });
    newNotes[noteIndex] = res.data.note;
    setNotes(newNotes);

    //clear update form state
    setUpdateForm({
      _id: null,
      title: "",
      body: "",
    });
  };
  return (
    <>
      <div>
        <Typography variant='h4' sx={{ textAlign: "center" }}>
          Notes App by Naveen
        </Typography>
        {notes &&
          notes.map((note) => {
            return (
              <Container
                maxWidth='sm'
                sx={{ boxShadow: "0px 0px 3px", m: 5, borderRadius: 10, p: 2 }}
                key={note._id}
              >
                <Typography sx={{ textAlign: "center" }} variant='h5'>
                  {note.title}
                </Typography>
                <Typography sx={{ textAlign: "center" }}>
                  {note.body}
                </Typography>
                <Container
                  sx={{
                    display: "flex",
                    flexDirection: "raw",
                    justifyContent: "space-around",
                  }}
                >
                  {" "}
                  <Button
                    variant='contained'
                    sx={{ m: 5 }}
                    onClick={() => deleteNote(note._id)}
                  >
                    delete Note
                  </Button>
                  <Button
                    variant='contained'
                    onClick={() => toggleUpdate(note)}
                    type='Submit'
                    sx={{ m: 5 }}
                  >
                    Update Note
                  </Button>
                </Container>
              </Container>
            );
          })}
      </div>
      {!updateForm._id && (
        <Container maxWidth='sm'>
          <div>
            <Typography variant='h4'>Create Note</Typography>
            <form onSubmit={createNote}>
              <input
                onChange={updateCreateFormField}
                value={createForm.title}
                name='title'
              />
              <textarea
                onChange={updateCreateFormField}
                value={createForm.body}
                name='body'
              />
              <Button type='submit'>create Note</Button>
            </form>
          </div>
        </Container>
      )}

      {/* update section */}
      {updateForm._id && (
        <Container
          sx={{
            m: 5,
            p: 5,
            display: "flex",
            flexDirection: "raw",
            justifyContent: "space-around",
          }}
        >
          <div>
            <Typography variant='h5' sx={{ textAlign: "center", m: 5 }}>
              Note Update
            </Typography>
            <form onSubmit={updateNote}>
              <TextField
                size='small'
                sx={{ m: 5 }}
                onChange={handleUpdateFieldChange}
                value={updateForm.title}
                name='title'
              />
              <TextField
                size='small'
                onChange={handleUpdateFieldChange}
                value={updateForm.body}
                name='body'
              />
              <Button sx={{ m: 5 }} variant='outlined' type='Submit'>
                Update Note
              </Button>
            </form>
          </div>
        </Container>
      )}
    </>
  );
}

export default App;
