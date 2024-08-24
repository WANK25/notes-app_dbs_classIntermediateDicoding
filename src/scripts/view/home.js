import anime from "animejs/lib/anime.es.js";
import Utils from "../utils.js";
import {
  handleInputValidation,
  customValidationHandler,
} from "../validation.js";
import Swal from "sweetalert2";

const home = () => {
  const notesListElement = document.querySelector("notes-list");
  const baseUrl = `https://notes-api.dicoding.dev/v2`;

  const buttonShowArchive = document.querySelector("#button-arsip");
  const buttonShowNotes = document.querySelector("#button-notes");
  const noInternet = document.querySelector("#no-internet");

  let buttonShow = false;

  //Fetch API mendapatkan data notes unacrhive
  const getNotes = async () => {
    const loadingElement = document.getElementById("loading");
    const notesKosong = document.getElementById("notes-kosong");
    const arsipKosong = document.getElementById("arsip-kosong");

    try {
      loadingElement.style.display = "block";

      const response = await fetch(`${baseUrl}/notes`);

      // Sembunyikan indikator loading setelah mendapat respons
      loadingElement.style.display = "none";

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const dataNotes = await response.json();
      if (dataNotes.error) {
        showResponseMessage(dataNotes.message);
      } else {
        if (dataNotes.data.length == 0) {
          console.log("data kosong");
          notesKosong.style.display = "block";
          arsipKosong.style.display = "none";
        } else {
          notesKosong.style.display = "none";
        }
        arsipKosong.style.display = "none";

        buttonShow = false;
        buttonBackground();
        displayResult(dataNotes.data);
      }
    } catch (error) {
      // Sembunyikan indikator loading jika terjadi kesalahan
      loadingElement.style.display = "none";

      console.error("Error:", error);
      showResponseMessage();
    }
  };

  //Fetch API mendapatkan data notes archive
  const getNotesArchived = async () => {
    const loadingElement = document.getElementById("loading");
    const arsipKosong = document.getElementById("arsip-kosong");
    const notesKosong = document.getElementById("notes-kosong");

    try {
      loadingElement.style.display = "block";

      const response = await fetch(`${baseUrl}/notes/archived`);

      // Sembunyikan indikator loading setelah mendapat respons
      loadingElement.style.display = "none";

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const dataNotes = await response.json();

      if (dataNotes.error) {
        showResponseMessage(dataNotes.message);
      } else {
        if (dataNotes.data.length == 0) {
          console.log("data kosong");
          arsipKosong.style.display = "block";
          notesKosong.style.display = "none";
        } else {
          arsipKosong.style.display = "none";
        }
        notesKosong.style.display = "none";

        displayArchive(dataNotes.data);
      }
    } catch (error) {
      // Sembunyikan indikator loading jika terjadi kesalahan
      loadingElement.style.display = "none";

      console.error("Error:", error);
      showResponseMessage();
    }
  };

  //Fetch API menambahkan data note
  const insertNote = async (note) => {
    try {
      const response = await fetch(`${baseUrl}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": "12345",
        },
        body: JSON.stringify(note),
      });

      const responseJson = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Note Berhasil ditambahkan",
          showConfirmButton: false,
          timer: 1500,
        });
        getNotes();
      } else {
        console.error(`Failed to insert note: ${responseJson.message}`);
      }
    } catch (error) {
      showResponseMessage(
        error.message || "An error occurred while adding the note.",
      );
      console.error("Error:", error);
    }
  };

  //Fetch API delete note
  const removeNote = async (noteId) => {
    try {
      const response = await fetch(`${baseUrl}/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          "X-Auth-Token": "12345",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }
      Swal.fire({
        icon: "success",
        title: "Note Berhasil dihapus",
        showConfirmButton: false,
        timer: 1500,
      });
      await getNotes();
    } catch (error) {
      showResponseMessage(
        error.message || "An error occurred while deleting the note.",
      );
      console.error("Error:", error);
    }
  };

  //Fetch API Archive note
  const archiveNote = async (noteId) => {
    try {
      const response = await fetch(`${baseUrl}/notes/${noteId}/archive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": "12345",
        },
        // Tidak ada body yang dikirim
      });

      const responseJson = await response.json();

      if (response.ok) {
        console.log("Note archived successfully:", responseJson.message);
        buttonShow = true;
        buttonBackground();
        getNotesArchived();
      } else {
        console.error(`Failed to archive note: ${responseJson.message}`);
      }
    } catch (error) {
      showResponseMessage(
        error.message || "An error occurred while archiving the note.",
      );
      console.error("Error:", error);
    }
  };

  //Fetch API Unachive note
  const unarchiveNote = async (noteId) => {
    try {
      const response = await fetch(`${baseUrl}/notes/${noteId}/unarchive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": "12345",
        },
        // Tidak ada body yang dikirim
      });

      const responseJson = await response.json();

      if (response.ok) {
        console.log("Note archived successfully:", responseJson.message);
        buttonShow = true;
        buttonBackground();
        getNotesArchived();
      } else {
        console.error(`Failed to archive note: ${responseJson.message}`);
      }
    } catch (error) {
      showResponseMessage(
        error.message || "An error occurred while archiving the note.",
      );
      console.error("Error:", error);
    }
  };

  // Fungsi untuk menampilkan catatan
  const displayResult = (notes) => {
    Utils.emptyElement(notesListElement);

    notes.forEach((note, index) => {
      const notesItemElement = document.createElement("notes-item");

      notesItemElement.notes = {
        id: note.id,
        title: note.title,
        body: note.body,
      };

      // Tambahkan elemen ke DOM terlebih dahulu
      notesListElement.appendChild(notesItemElement);

      //animejs.com jalan dijalankan pada note-item
      anime({
        targets: notesItemElement,
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 2000,
        easing: "easeOutExpo",
      });
    });

    // Pastikan hanya menambahkan event listener sekali ke notesListElement
    notesListElement.removeEventListener("delete-note", handleDeleteNote);
    notesListElement.addEventListener("delete-note", handleDeleteNote);

    notesListElement.removeEventListener("arsip-note", handleArsipNote);
    notesListElement.addEventListener("arsip-note", handleArsipNote);

    Utils.showElement(notesListElement);
  };

  // Fungsi untuk menampilkan catatan arsip

  const displayArchive = (notes) => {
    Utils.emptyElement(notesListElement);

    notes.forEach((note, index) => {
      const notesItemElement = document.createElement("notes-archive");

      notesItemElement.notes = {
        id: note.id,
        title: note.title,
        body: note.body,
      };

      // Tambahkan elemen ke DOM terlebih dahulu
      notesListElement.appendChild(notesItemElement);

      //animejs.com jalan dijalankan pada note-item
      anime({
        targets: notesItemElement,
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 2000,
        easing: "easeOutExpo",
      });
    });

    // Pastikan hanya menambahkan event listener sekali ke notesListElement
    notesListElement.removeEventListener("pulih-note", handlePulihNote);
    notesListElement.addEventListener("pulih-note", handlePulihNote);

    Utils.showElement(notesListElement);
  };

  //fungsi mengubah backgroud button
  const buttonBackground = () => {
    if (buttonShow === true) {
      buttonShowArchive.style.backgroundColor = "#bec6a0";
      buttonShowNotes.style.backgroundColor = "transparent";
    } else {
      buttonShowArchive.style.backgroundColor = "transparent";
      buttonShowNotes.style.backgroundColor = "#bec6a0";
    }
  };

  // Fungsi untuk penghapusan
  const handleDeleteNote = (event) => {
    const noteId = event.detail.id;
    console.log("ID note untuk dihapus:", noteId);

    removeNote(noteId);
  };

  //Fungsi untuk memulihkan note

  const handlePulihNote = (event) => {
    const noteId = event.detail.id;
    console.log("ID note untuk dihapus:", noteId);

    unarchiveNote(noteId);
  };

  //Fungsi untuk melakukan Arsip

  const handleArsipNote = (event) => {
    const noteId = event.detail.id;
    archiveNote(noteId);
  };

  // Fungsi untuk menampilkan pesan respons
  const showResponseMessage = (message = "Check your internet connection") => {
    noInternet.style.display = "block";
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const inputNoteTitle = document.querySelector("#title");
    const inputNoteNote = document.querySelector("#note");
    const formContainer = document.querySelector(".form");

    buttonShowArchive.addEventListener("click", eventGetArchive);
    buttonShowNotes.addEventListener("click", eventGetNotes);

    anime({
      targets: formContainer,
      translateX: ["100%", "0%"],
      opacity: [0, 1],
      duration: 2000,
      easing: "easeOutExpo",
    });

    // Jalankan fungsi validasi pada load
    inputNoteTitle.addEventListener("change", customValidationHandler);
    inputNoteTitle.addEventListener("invalid", customValidationHandler);

    inputNoteNote.addEventListener("change", customValidationHandler);
    inputNoteNote.addEventListener("invalid", customValidationHandler);

    inputNoteTitle.addEventListener("blur", handleInputValidation);
    inputNoteNote.addEventListener("blur", handleInputValidation);

    form.addEventListener("submit", function (event) {
      // Validasi input
      const isFormValid = form.checkValidity();

      if (!isFormValid) {
        form.reportValidity(); // Menampilkan pesan kesalahan pada elemen yang tidak valid
        event.preventDefault(); // Mencegah pengiriman jika form tidak valid
        return;
      }

      const note = {
        title: inputNoteTitle.value,
        body: inputNoteNote.value,
      };

      insertNote(note).then(() => {
        // Reset form setelah insert
        form.reset();
      });

      event.preventDefault(); // Mencegah pengiriman form default
    });

    getNotes();
  });

  const eventGetNotes = () => {
    if (buttonShow === true) {
      buttonShow = false;

      getNotes();
      buttonBackground();
    }
  };

  const eventGetArchive = () => {
    if (buttonShow === false) {
      buttonShow = true;
      getNotesArchived();
      buttonBackground();
    }
  };
};

export default home;
